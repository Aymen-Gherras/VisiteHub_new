#!/bin/bash

# VPS Deployment Script for Exped360 Backend
# This script sets up and deploys the NestJS backend to your Contabo VPS

set -e  # Exit on any error

echo "🚀 Starting VPS deployment for Exped360 Backend..."

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

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally for process management
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Install MySQL client (if not already installed)
print_status "Installing MySQL client..."
sudo apt install -y mysql-client

# Create application directory
APP_DIR="/var/www/exped360-backend"
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

# Build the application
print_status "Building the application..."
npm run build

# Create environment file
print_status "Creating production environment file..."
if [ ! -f .env ]; then
    cp vps.env.example .env
    print_warning "Please edit .env file with your actual configuration values!"
    print_warning "Run: nano .env"
fi

# Create PM2 ecosystem file
print_status "Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'exped360-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
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

# Setup MySQL database
print_status "Setting up MySQL database..."
print_warning "You need to manually create the MySQL database and user."
print_warning "Run the following MySQL commands:"
echo ""
echo "CREATE DATABASE exped360_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo "CREATE USER 'exped360_user'@'localhost' IDENTIFIED BY 'your_secure_mysql_password';"
echo "GRANT ALL PRIVILEGES ON exped360_db.* TO 'exped360_user'@'localhost';"
echo "FLUSH PRIVILEGES;"
echo ""

# Setup Nginx (optional)
print_status "Setting up Nginx reverse proxy..."
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/exped360-backend << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
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
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/exped360-backend /etc/nginx/sites-enabled/
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

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

print_status "✅ Deployment completed successfully!"
print_warning "Next steps:"
echo "1. Edit .env file with your actual configuration"
echo "2. Create MySQL database and user"
echo "3. Update your domain name in Nginx configuration"
echo "4. Setup SSL certificate"
echo "5. Test the application: curl http://localhost:3000"

print_status "Application will be available at: http://your-domain.com"
print_status "PM2 status: pm2 status"
print_status "View logs: pm2 logs exped360-backend"
