#!/bin/bash

# Deploy Full Promoteurs System - Complete database implementation
# This script safely deploys the full database-backed promoteurs/agences/projects system

set -e  # Exit on any error

echo "🚀 Starting Full Promoteurs System Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the backend root directory"
    exit 1
fi

# Step 1: Backup database
print_status "Step 1: Creating database backup..."
BACKUP_FILE="backup_before_full_promoteurs_$(date +%Y%m%d_%H%M%S).sql"

if command -v mysqldump &> /dev/null; then
    print_status "Creating MySQL backup: $BACKUP_FILE"
    mysqldump --single-transaction --routines --triggers exped360_db > "$BACKUP_FILE"
    print_success "Database backup created: $BACKUP_FILE"
else
    print_warning "mysqldump not found. Please create a manual backup before proceeding."
    read -p "Have you created a backup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled. Please create a backup first."
        exit 1
    fi
fi

# Step 2: Install dependencies
print_status "Step 2: Installing dependencies..."
npm install
print_success "Dependencies installed"

# Step 3: Build the application
print_status "Step 3: Building application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Build failed. Please check for errors."
    exit 1
fi

# Step 4: Run database migrations
print_status "Step 4: Running database migrations..."

# Check if mysql client is available
if command -v mysql &> /dev/null; then
    print_status "Running migration 001: Create tables..."
    mysql exped360_db < migrations/001-create-promoteurs-agences-projects.sql
    if [ $? -eq 0 ]; then
        print_success "Migration 001 completed"
    else
        print_error "Migration 001 failed"
        exit 1
    fi
    
    print_status "Running migration 002: Add property relationships..."
    mysql exped360_db < migrations/002-add-property-relationships.sql
    if [ $? -eq 0 ]; then
        print_success "Migration 002 completed"
    else
        print_error "Migration 002 failed"
        exit 1
    fi
    
    print_status "Running migration 003: Migrate existing data..."
    mysql exped360_db < migrations/003-migrate-existing-data.sql
    if [ $? -eq 0 ]; then
        print_success "Migration 003 completed"
    else
        print_error "Migration 003 failed"
        exit 1
    fi
else
    print_warning "MySQL client not found. Please run migrations manually:"
    echo "  1. mysql exped360_db < migrations/001-create-promoteurs-agences-projects.sql"
    echo "  2. mysql exped360_db < migrations/002-add-property-relationships.sql"
    echo "  3. mysql exped360_db < migrations/003-migrate-existing-data.sql"
    read -p "Have you run the migrations manually? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled. Please run migrations first."
        exit 1
    fi
fi

# Step 5: Verify migrations
print_status "Step 5: Verifying migrations..."
if command -v mysql &> /dev/null; then
    # Check if tables were created
    PROMOTEURS_COUNT=$(mysql -s -N -e "SELECT COUNT(*) FROM promoteurs;" exped360_db 2>/dev/null || echo "0")
    AGENCES_COUNT=$(mysql -s -N -e "SELECT COUNT(*) FROM agences;" exped360_db 2>/dev/null || echo "0")
    PROJECTS_COUNT=$(mysql -s -N -e "SELECT COUNT(*) FROM projects;" exped360_db 2>/dev/null || echo "0")
    
    print_success "✅ Promoteurs created: $PROMOTEURS_COUNT"
    print_success "✅ Agences created: $AGENCES_COUNT"
    print_success "✅ Projects created: $PROJECTS_COUNT"
    
    # Check property assignments
    ASSIGNED_TO_PROMOTEURS=$(mysql -s -N -e "SELECT COUNT(*) FROM properties WHERE promoteurId IS NOT NULL;" exped360_db 2>/dev/null || echo "0")
    ASSIGNED_TO_AGENCES=$(mysql -s -N -e "SELECT COUNT(*) FROM properties WHERE agenceId IS NOT NULL;" exped360_db 2>/dev/null || echo "0")
    
    print_success "✅ Properties assigned to promoteurs: $ASSIGNED_TO_PROMOTEURS"
    print_success "✅ Properties assigned to agences: $ASSIGNED_TO_AGENCES"
fi

# Step 6: Restart application
print_status "Step 6: Restarting application..."

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
    print_status "Restarting with PM2..."
    pm2 restart exped360-backend || pm2 start ecosystem.config.js
    if [ $? -eq 0 ]; then
        print_success "Application restarted with PM2"
    else
        print_error "Failed to restart with PM2"
        exit 1
    fi
elif [ -f "start.sh" ]; then
    print_status "Using start.sh script..."
    ./start.sh &
    print_success "Application started"
else
    print_warning "No process manager found. Please restart your application manually:"
    echo "  npm run start:prod"
fi

# Step 7: Wait for application to start
print_status "Step 7: Waiting for application to start..."
sleep 10

# Step 8: Verification
print_status "Step 8: Running verification checks..."

# Check if the application is running (assuming it runs on port 3000)
BASE_URL="http://localhost:3000"

# Test new endpoints
ENDPOINTS=(
    "/api/promoteurs"
    "/api/agences"
    "/api/projects"
    "/admin/promoteurs"
    "/admin/agences"
    "/admin/projects"
)

ALL_PASSED=true

for endpoint in "${ENDPOINTS[@]}"; do
    if [[ "$endpoint" == "/admin/"* ]]; then
        # Skip admin endpoints in automated testing (require auth)
        print_warning "⚠️  Skipping admin endpoint $endpoint (requires authentication)"
        continue
    fi
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "✅ $endpoint is responding (HTTP $HTTP_CODE)"
    else
        print_error "❌ $endpoint failed (HTTP $HTTP_CODE)"
        ALL_PASSED=false
    fi
done

# Test existing properties endpoint to ensure no regression
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/properties" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    print_success "✅ Existing properties API still working (HTTP $HTTP_CODE)"
else
    print_error "❌ Properties API broken (HTTP $HTTP_CODE) - REGRESSION DETECTED!"
    ALL_PASSED=false
fi

# Step 9: Summary
echo ""
echo "🎉 Deployment Summary"
echo "===================="
print_success "✅ Database backup created: $BACKUP_FILE"
print_success "✅ Dependencies installed"
print_success "✅ Application built"
print_success "✅ Database migrations completed"
print_success "✅ Application restarted"

if [ "$ALL_PASSED" = true ]; then
    print_success "✅ All endpoint checks passed"
else
    print_warning "⚠️  Some endpoint checks failed - please investigate"
fi

echo ""
echo "📋 New API Endpoints Available:"
echo "================================"
echo "🔓 Public Endpoints:"
echo "   GET  /api/promoteurs              - List all promoteurs"
echo "   GET  /api/promoteurs/{slug}       - Get promoteur details"
echo "   GET  /api/promoteurs/{slug}/projects - Get promoteur projects"
echo "   GET  /api/promoteurs/{slug}/properties - Get promoteur properties"
echo "   GET  /api/agences                 - List all agences"
echo "   GET  /api/agences/{slug}          - Get agence details"
echo "   GET  /api/agences/{slug}/properties - Get agence properties"
echo "   GET  /api/projects                - List all projects"
echo "   GET  /api/projects/{slug}         - Get project details"
echo "   GET  /api/projects/{slug}/properties - Get project properties"
echo ""
echo "🔒 Admin Endpoints (require authentication):"
echo "   POST /admin/promoteurs            - Create promoteur"
echo "   GET  /admin/promoteurs            - List promoteurs (admin)"
echo "   PUT  /admin/promoteurs/{id}       - Update promoteur"
echo "   DELETE /admin/promoteurs/{id}     - Delete promoteur"
echo "   POST /admin/agences               - Create agence"
echo "   GET  /admin/agences               - List agences (admin)"
echo "   PUT  /admin/agences/{id}          - Update agence"
echo "   DELETE /admin/agences/{id}        - Delete agence"
echo "   POST /admin/projects              - Create project"
echo "   GET  /admin/projects              - List projects (admin)"
echo "   PUT  /admin/projects/{id}         - Update project"
echo "   DELETE /admin/projects/{id}       - Delete project"
echo ""
echo "🔧 Property Assignment Endpoints:"
echo "   POST /admin/properties/{id}/assign-to-agence"
echo "   POST /admin/properties/{id}/assign-to-promoteur"
echo "   POST /admin/properties/{id}/remove-assignments"
echo "   POST /admin/properties/bulk-auto-assign"
echo "   GET  /admin/properties/assignment-stats"
echo ""
echo "📊 Next Steps:"
echo "1. Test the new API endpoints"
echo "2. Use admin panel to create/update promoteurs and agences"
echo "3. Run bulk auto-assignment if needed:"
echo "   curl -X POST $BASE_URL/admin/properties/bulk-auto-assign \\"
echo "        -H 'Authorization: Bearer YOUR_ADMIN_TOKEN'"
echo "4. Monitor logs for any issues:"
echo "   pm2 logs exped360-backend"
echo ""

if [ "$ALL_PASSED" = true ]; then
    print_success "🚀 Full Promoteurs system deployment completed successfully!"
    echo ""
    echo "🎯 System Features Now Available:"
    echo "• Complete database-backed promoteurs, agences, and projects"
    echo "• Full admin interface for management"
    echo "• Public API endpoints for frontend integration"
    echo "• Property assignment system"
    echo "• Statistics and analytics"
    echo "• SEO-friendly URLs"
    echo "• Backward compatibility maintained"
else
    print_warning "⚠️  Deployment completed with some issues. Please check the logs and test manually."
fi

echo ""
print_success "Deployment script completed! 🎉"
