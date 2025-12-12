# 🚀 Safe Deployment Guide - Promoteurs & Agences System

## 📋 Pre-Deployment Checklist

### ✅ Prerequisites
- [ ] Backup of current database created
- [ ] Code tested in development environment
- [ ] All dependencies installed
- [ ] Configuration files prepared
- [ ] Deployment window scheduled (low traffic time)
- [ ] Rollback plan ready

### ✅ Environment Verification
- [ ] Node.js version compatible (check `package.json`)
- [ ] MySQL/Database accessible
- [ ] PM2 or process manager available
- [ ] Sufficient disk space for backups
- [ ] Network connectivity to external services

---

## 🎯 Deployment Strategy Options

### Option A: Zero-Risk Virtual Deployment (Recommended)
**Time**: 30-60 minutes  
**Risk**: Minimal  
**Downtime**: None  

### Option B: Full Database Migration
**Time**: 2-4 hours  
**Risk**: Medium  
**Downtime**: 5-10 minutes  

---

## 🚀 Option A: Zero-Risk Virtual Deployment

### Step 1: Preparation (5 minutes)

```bash
# Navigate to backend directory
cd /path/to/exped360-backend

# Create backup
echo "📦 Creating backup..."
mysqldump exped360_db > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Verify backup
ls -la backup_*.sql
```

### Step 2: Install Dependencies (5 minutes)

```bash
# Install any new dependencies
npm install

# Verify no vulnerabilities
npm audit
```

### Step 3: Create Configuration Files (10 minutes)

Create `src/config/promoteurs-config.json`:
```json
{
  "example-promoteur": {
    "name": "Example Promoteur",
    "description": "Leading real estate developer",
    "logo": null,
    "website": "https://example.com",
    "phone": "+213 XX XX XX XX",
    "email": "contact@example.com",
    "address": "Address here",
    "wilaya": "Alger",
    "daira": "Alger Centre"
  }
}
```

Create `src/config/agences-config.json`:
```json
{
  "example-agence": {
    "name": "Example Agence",
    "description": "Professional real estate agency",
    "logo": null,
    "website": "https://agence.com",
    "phone": "+213 XX XX XX XX",
    "email": "info@agence.com",
    "address": "Agency address",
    "wilaya": "Alger",
    "daira": "Alger Centre"
  }
}
```

### Step 4: Implement Code (15 minutes)

Follow the implementation guide to create:
- [ ] `src/promoteurs/interfaces/promoteur.interface.ts`
- [ ] `src/promoteurs/services/promoteurs.service.ts`
- [ ] `src/promoteurs/services/agences.service.ts`
- [ ] `src/promoteurs/controllers/promoteurs.controller.ts`
- [ ] `src/promoteurs/controllers/agences.controller.ts`
- [ ] `src/promoteurs/promoteurs.module.ts`
- [ ] Update `src/app.module.ts`

### Step 5: Build and Test (10 minutes)

```bash
# Build the application
npm run build

# Check for build errors
echo $?  # Should be 0

# Start in development mode for testing
npm run start:dev &
DEV_PID=$!

# Wait for startup
sleep 10

# Test endpoints
echo "🧪 Testing endpoints..."
curl -s http://localhost:3000/api/promoteurs | jq '.' > /dev/null && echo "✅ Promoteurs API working" || echo "❌ Promoteurs API failed"
curl -s http://localhost:3000/api/agences | jq '.' > /dev/null && echo "✅ Agences API working" || echo "❌ Agences API failed"

# Stop development server
kill $DEV_PID
```

### Step 6: Deploy to Production (10 minutes)

```bash
# Method 1: Using PM2 (Recommended)
if command -v pm2 &> /dev/null; then
    echo "🔄 Deploying with PM2..."
    pm2 restart exped360-backend
    
    # Verify deployment
    sleep 5
    pm2 status exped360-backend
    
# Method 2: Using your existing deployment script
elif [ -f "deploy-vps.sh" ]; then
    echo "🔄 Using existing deployment script..."
    ./deploy-vps.sh
    
# Method 3: Manual restart
else
    echo "🔄 Manual restart..."
    # Stop existing process (adjust as needed)
    pkill -f "node.*exped360"
    
    # Start new process
    nohup npm run start:prod > logs/app.log 2>&1 &
fi
```

### Step 7: Verification (5 minutes)

```bash
# Wait for application to start
sleep 10

# Test production endpoints
BASE_URL="http://localhost:3000"  # Adjust as needed

echo "🧪 Testing production endpoints..."

# Test promoteurs endpoint
PROMOTEURS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/promoteurs")
if [ "$PROMOTEURS_RESPONSE" = "200" ]; then
    echo "✅ Promoteurs API: Working"
else
    echo "❌ Promoteurs API: Failed (HTTP $PROMOTEURS_RESPONSE)"
fi

# Test agences endpoint
AGENCES_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/agences")
if [ "$AGENCES_RESPONSE" = "200" ]; then
    echo "✅ Agences API: Working"
else
    echo "❌ Agences API: Failed (HTTP $AGENCES_RESPONSE)"
fi

# Test existing properties endpoint (ensure no regression)
PROPERTIES_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/properties")
if [ "$PROPERTIES_RESPONSE" = "200" ]; then
    echo "✅ Properties API: Still working"
else
    echo "❌ Properties API: Broken (HTTP $PROPERTIES_RESPONSE)"
fi
```

---

## 🛡️ Rollback Procedure

If something goes wrong:

### Quick Rollback (2 minutes)

```bash
# Method 1: Git rollback
git checkout HEAD~1  # Go back one commit
npm run build
pm2 restart exped360-backend

# Method 2: File restoration
# Remove new files
rm -rf src/promoteurs/
# Restore app.module.ts from backup
git checkout HEAD~1 -- src/app.module.ts
npm run build
pm2 restart exped360-backend

# Method 3: Database restoration (if database was modified)
mysql exped360_db < backup_YYYYMMDD_HHMMSS.sql
```

### Verification After Rollback

```bash
# Test that original functionality works
curl -s http://localhost:3000/api/properties | jq '.length'
```

---

## 📊 Monitoring and Health Checks

### Application Logs

```bash
# PM2 logs
pm2 logs exped360-backend --lines 50

# Manual logs (if not using PM2)
tail -f logs/app.log

# Check for errors
grep -i error logs/app.log | tail -10
```

### Performance Monitoring

```bash
# Check memory usage
pm2 monit

# Check response times
time curl -s http://localhost:3000/api/promoteurs > /dev/null

# Check database connections
mysql -e "SHOW PROCESSLIST;" exped360_db
```

### Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

BASE_URL="http://localhost:3000"
ENDPOINTS=("/api/properties" "/api/promoteurs" "/api/agences")

echo "🏥 Health Check - $(date)"
echo "=========================="

for endpoint in "${ENDPOINTS[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}:%{time_total}" "$BASE_URL$endpoint")
    http_code=$(echo $response | cut -d: -f1)
    time_total=$(echo $response | cut -d: -f2)
    
    if [ "$http_code" = "200" ]; then
        echo "✅ $endpoint: OK (${time_total}s)"
    else
        echo "❌ $endpoint: FAILED (HTTP $http_code)"
    fi
done
```

---

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: "Cannot find module" errors
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Issue 2: Configuration files not found
```bash
# Solution: Check file paths and permissions
ls -la src/config/
chmod 644 src/config/*.json
```

#### Issue 3: API returns empty arrays
```bash
# Solution: Check database connection and data
mysql -e "SELECT COUNT(*) FROM properties WHERE propertyOwnerType = 'Promotion immobilière';" exped360_db
```

#### Issue 4: High memory usage
```bash
# Solution: Restart application
pm2 restart exped360-backend
pm2 monit  # Monitor memory usage
```

#### Issue 5: Slow response times
```bash
# Solution: Check database performance
mysql -e "SHOW PROCESSLIST;" exped360_db
# Consider adding database indexes if needed
```

---

## 📈 Post-Deployment Tasks

### 1. Update Documentation

- [ ] Update API documentation
- [ ] Inform frontend team of new endpoints
- [ ] Update deployment notes

### 2. Monitor for 24 Hours

- [ ] Check logs every few hours
- [ ] Monitor response times
- [ ] Watch for error patterns
- [ ] Verify user experience

### 3. Gradual Enhancement

- [ ] Add more promoteurs/agences to config
- [ ] Upload logos to Cloudinary
- [ ] Enhance descriptions
- [ ] Consider Phase 2 features

### 4. SEO Optimization

- [ ] Submit new URLs to search engines
- [ ] Update sitemap.xml
- [ ] Add structured data markup
- [ ] Monitor search console

---

## 📞 Emergency Contacts

### If Issues Arise:

1. **Check logs first**: `pm2 logs exped360-backend`
2. **Try quick restart**: `pm2 restart exped360-backend`
3. **Rollback if critical**: Follow rollback procedure above
4. **Document the issue**: For future reference

### Escalation Path:

1. **Level 1**: Restart application
2. **Level 2**: Rollback to previous version
3. **Level 3**: Restore database backup
4. **Level 4**: Contact development team

---

## 🎯 Success Metrics

After deployment, you should see:

- ✅ New API endpoints responding (200 status)
- ✅ Existing functionality unchanged
- ✅ No increase in error rates
- ✅ Response times within acceptable range
- ✅ Memory usage stable
- ✅ Database performance unchanged

### Sample Success Output:

```
🧪 Testing production endpoints...
✅ Promoteurs API: Working
✅ Agences API: Working  
✅ Properties API: Still working

🏥 Health Check - 2024-01-15 14:30:00
==========================
✅ /api/properties: OK (0.245s)
✅ /api/promoteurs: OK (0.189s)
✅ /api/agences: OK (0.156s)
```

---

## 📋 Deployment Checklist Summary

### Pre-Deployment
- [ ] Database backup created
- [ ] Code tested locally
- [ ] Configuration files ready
- [ ] Dependencies installed

### During Deployment
- [ ] Build successful
- [ ] Tests passing
- [ ] Application restarted
- [ ] Health checks passing

### Post-Deployment
- [ ] All endpoints working
- [ ] No regressions detected
- [ ] Logs clean
- [ ] Performance acceptable

### 24-Hour Follow-up
- [ ] System stable
- [ ] No user complaints
- [ ] Metrics normal
- [ ] Ready for next phase

This deployment guide ensures a safe, monitored rollout of your Promoteurs & Agences system with minimal risk to your live website.
