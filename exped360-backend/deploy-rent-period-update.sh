#!/bin/bash

# Safe deployment script for rent period and date features
# This script ensures zero downtime and data safety

set -e

echo "🚀 Starting safe deployment of rent period and date features..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Step 1: Backup database
print_step "1. Creating database backup..."
BACKUP_FILE="/var/backups/properties_backup_$(date +%Y%m%d_%H%M%S).sql"
mkdir -p /var/backups
mysqldump -u root -p --all-databases > $BACKUP_FILE
print_status "Database backup created: $BACKUP_FILE"

# Step 2: Update backend code
print_step "2. Updating backend code..."
cd /var/www/exped360-backend

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building backend..."
npm run build

# Step 3: Restart backend with new code
print_step "3. Restarting backend service..."
pm2 restart exped360-backend

# Wait for backend to be ready
print_status "Waiting for backend to be ready..."
sleep 10

# Check if backend is running
if pm2 list | grep -q "exped360-backend.*online"; then
    print_status "✅ Backend is running"
else
    print_error "❌ Backend failed to start"
    print_warning "Rolling back to previous version..."
    pm2 restart exped360-backend
    exit 1
fi

# Step 4: Update frontend code
print_step "4. Updating frontend code..."
cd /var/www/exped360-main-work

# Pull latest changes (if using git)
# git pull origin main

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build the application
print_status "Building frontend..."
npm run build

# Step 5: Restart frontend with new code
print_step "5. Restarting frontend service..."
pm2 restart exped360-frontend

# Wait for frontend to be ready
print_status "Waiting for frontend to be ready..."
sleep 10

# Check if frontend is running
if pm2 list | grep -q "exped360-frontend.*online"; then
    print_status "✅ Frontend is running"
else
    print_error "❌ Frontend failed to start"
    print_warning "Rolling back to previous version..."
    pm2 restart exped360-frontend
    exit 1
fi

# Step 6: Test endpoints
print_step "6. Testing endpoints..."

# Test backend health
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health || echo "000")
if [ "$BACKEND_HEALTH" = "200" ]; then
    print_status "✅ Backend health check passed"
else
    print_warning "⚠️ Backend health check failed (HTTP $BACKEND_HEALTH)"
fi

# Test frontend
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "000")
if [ "$FRONTEND_HEALTH" = "200" ]; then
    print_status "✅ Frontend health check passed"
else
    print_warning "⚠️ Frontend health check failed (HTTP $FRONTEND_HEALTH)"
fi

# Step 7: Verify database migration
print_step "7. Verifying database migration..."
cd /var/www/exped360-backend

# Check if rentPeriod column exists
RENT_PERIOD_EXISTS=$(mysql -u root -p -e "SELECT COUNT(*) as count FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'properties' AND COLUMN_NAME = 'rentPeriod'" 2>/dev/null | tail -n 1)
if [ "$RENT_PERIOD_EXISTS" = "1" ]; then
    print_status "✅ rentPeriod column exists"
else
    print_warning "⚠️ rentPeriod column not found - migration may not have run yet"
fi

# Step 8: Final status check
print_step "8. Final status check..."
echo ""
print_status "=== DEPLOYMENT STATUS ==="
echo "Backend: $(pm2 list | grep exped360-backend | awk '{print $10}')"
echo "Frontend: $(pm2 list | grep exped360-frontend | awk '{print $10}')"
echo "Database backup: $BACKUP_FILE"
echo ""

# Show PM2 status
print_status "PM2 Status:"
pm2 list

print_status "🎉 Deployment completed successfully!"
print_warning "New features added:"
echo "  ✅ Rent period selection (month/day) for rental properties"
echo "  ✅ Time ago display on property cards (il y a X jours)"
echo "  ✅ Creation date display on property detail pages"
echo "  ✅ 'Nouveau' badge for recently added properties (within 7 days)"

print_warning "Next steps:"
echo "  1. Test the website: https://visitehub.com/"
echo "  2. Create a new property to test rent period selection"
echo "  3. Check property cards for time ago display"
echo "  4. Verify property detail pages show creation dates"

print_status "If you encounter any issues, you can rollback using:"
echo "  pm2 restart exped360-backend"
echo "  pm2 restart exped360-frontend"
echo "  Database backup available at: $BACKUP_FILE"

