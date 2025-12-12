#!/bin/bash

# VPS Deployment Script for Exped360 Frontend
# This script sets up and deploys the Next.js frontend to your Contabo VPS

set -e  # Exit on any error

echo "🚀 Starting VPS deployment for Exped360 Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (if not already installed)
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally for process management (if not already installed)
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 process manager..."
    sudo npm install -g pm2
fi

# Create application directory
APP_DIR="/var/www/exped360-frontend"
print_status "Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files
print_status "Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

# Install dependencies
print_status "Installing Node.js dependencies..."
npm install

# Create environment file
print_status "Creating production environment file..."
if [ ! -f .env.local ]; then
    cp vps.env.example .env.local
    print_warning "Please edit .env.local file with your actual configuration values!"
    print_warning "Run: nano .env.local"
fi

# Build the application
print_status "Building the application..."
npm run build

# Create PM2 ecosystem file
print_status "Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'exped360-frontend',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Setup Nginx
print_status "Setting up Nginx reverse proxy..."
sudo apt install -y nginx

# Create Nginx configuration for frontend
sudo tee /etc/nginx/sites-available/exped360-frontend << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Serve static files directly
    location /_next/static/ {
        alias $APP_DIR/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /static/ {
        alias $APP_DIR/public/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Proxy all other requests to Next.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/exped360-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt (optional)
print_status "Setting up SSL with Let's Encrypt..."
sudo apt install -y certbot python3-certbot-nginx

print_warning "To setup SSL, run:"
echo "sudo certbot --nginx -d your-domain.com -d www.your-domain.com"

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_status "✅ Frontend deployment completed successfully!"
print_warning "Next steps:"
echo "1. Edit .env.local file with your actual configuration"
echo "2. Update your domain name in Nginx configuration"
echo "3. Setup SSL certificate"
echo "4. Test the application: curl http://localhost:3001"

print_status "Frontend will be available at: http://your-domain.com"
print_status "PM2 status: pm2 status"
print_status "View logs: pm2 logs exped360-frontend"
