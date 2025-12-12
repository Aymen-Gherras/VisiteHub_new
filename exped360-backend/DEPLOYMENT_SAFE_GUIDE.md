# Safe Production Deployment Guide

## ⚠️ IMPORTANT: This guide ensures ZERO DATA LOSS

This deployment adds the `propertyOwnerName` field to existing properties. Your 31 properties will remain intact.

## Pre-Deployment Checklist

- [ ] **BACKUP YOUR DATABASE** (Critical!)
- [ ] Test changes locally first
- [ ] Verify auto-migration service will handle the new column
- [ ] Have rollback plan ready

---

## Step 1: Database Backup (CRITICAL - DO THIS FIRST!)

### Option A: Using MySQL Command Line (Recommended)

```bash
# SSH into your production server
ssh user@your-vps-ip

# Create backup directory
mkdir -p ~/backups
cd ~/backups

# Backup the entire database
mysqldump -u YOUR_DB_USER -p YOUR_DB_NAME > properties_backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh properties_backup_*.sql
```

### Option B: Using phpMyAdmin or MySQL Workbench

1. Connect to your production database
2. Select your database
3. Export → SQL
4. Save the file locally

### Verify Backup Contains Your 31 Properties

```bash
# Check backup contains properties
grep -c "INSERT INTO.*properties" properties_backup_*.sql
# Should show your 31 properties
```

---

## Step 2: Backend Deployment (SFTP)

### 2.1 Prepare Files Locally

On your local machine:

```bash
cd exped360-backend

# Build the application
npm install
npm run build

# Verify dist folder was created
ls -la dist/
```

### 2.2 Upload Files via SFTP

**Files to upload:**
- `dist/` folder (entire folder)
- `src/` folder (entire folder - needed for auto-migration)
- `package.json`
- `package-lock.json`
- `node_modules/` (or run `npm install` on server)
- `ecosystem.config.js`
- `.env` (keep your existing one, don't overwrite!)

**SFTP Upload Steps:**

1. Connect via SFTP client (FileZilla, WinSCP, etc.)
2. Navigate to your backend directory (usually `/var/www/exped360-backend` or similar)
3. Upload the files listed above
4. **DO NOT overwrite your existing `.env` file**

### 2.3 On Production Server (SSH)

```bash
# SSH into production server
ssh user@your-vps-ip

# Navigate to backend directory
cd /var/www/exped360-backend  # or your actual path

# Install/update dependencies
npm install --production

# The auto-migration will run automatically on next restart
# But let's verify the code is ready first
```

### 2.4 Restart Backend (Auto-Migration Will Run)

```bash
# Restart PM2 process (auto-migration runs on startup)
pm2 restart exped360-backend

# Watch logs to see migration
pm2 logs exped360-backend --lines 50

# You should see:
# ✅ Added propertyOwnerName column
# (or)
# ✅ propertyOwnerName column already exists
```

### 2.5 Verify Migration Success

```bash
# Check if column was added
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "DESCRIBE properties;" | grep propertyOwnerName

# Should show:
# propertyOwnerName | varchar(255) | YES | NULL
```

---

## Step 3: Frontend Deployment (SFTP)

### 3.1 Build Frontend Locally

```bash
cd exped360-main-work

# Install dependencies
npm install

# Build for production
npm run build

# Verify .next folder was created
ls -la .next/
```

### 3.2 Upload Files via SFTP

**Files to upload:**
- `.next/` folder (entire folder)
- `src/` folder (entire folder)
- `public/` folder (entire folder)
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `.env.local` or `.env.production` (keep existing, don't overwrite!)

**SFTP Upload Steps:**

1. Connect via SFTP
2. Navigate to your frontend directory (usually `/var/www/exped360-main-work` or similar)
3. Upload the files
4. **DO NOT overwrite your existing `.env` files**

### 3.3 On Production Server (SSH)

```bash
# Navigate to frontend directory
cd /var/www/exped360-main-work  # or your actual path

# Install/update dependencies
npm install --production

# Restart Next.js (if using PM2)
pm2 restart exped360-frontend

# Or if using systemd/other
sudo systemctl restart nextjs
```

---

## Step 4: Verification

### 4.1 Verify Backend

```bash
# Test API endpoint
curl https://visiteapihub.duckdns.org/api

# Check if properties endpoint works
curl https://visiteapihub.duckdns.org/api/properties | jq '.properties | length'
# Should return 31

# Check logs for errors
pm2 logs exped360-backend --lines 100
```

### 4.2 Verify Frontend

1. Visit `https://visitehub.com`
2. Check if properties load correctly
3. Test creating/editing a property
4. Verify property owner name field appears for agencies/promotions

### 4.3 Verify Database

```bash
# Check all 31 properties still exist
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "SELECT COUNT(*) FROM properties;"
# Should return 31

# Check propertyOwnerName column exists
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "SELECT id, title, propertyOwnerType, propertyOwnerName FROM properties LIMIT 5;"
```

---

## How Auto-Migration Protects Your Data

The `db-auto-migrate.service.ts` will:

1. ✅ **Check if column exists** before adding it
2. ✅ **Add column as NULLABLE** - won't break existing properties
3. ✅ **No data loss** - all 31 properties remain intact
4. ✅ **Runs automatically** on backend startup
5. ✅ **Logs everything** so you can see what happened

**What happens:**
- Existing properties: `propertyOwnerName` will be `NULL` (which is fine)
- New properties: Can optionally set `propertyOwnerName` when creating
- No existing data is modified or deleted

---

## Rollback Plan (If Something Goes Wrong)

### If Backend Fails:

```bash
# Restore from backup
mysql -u YOUR_DB_USER -p YOUR_DB_NAME < ~/backups/properties_backup_YYYYMMDD_HHMMSS.sql

# Restart with previous code
cd /var/www/exped360-backend
git checkout previous-commit  # if using git
# OR restore from your backup
pm2 restart exped360-backend
```

### If Frontend Fails:

```bash
# Restore previous build
cd /var/www/exped360-main-work
# Restore from backup or git
pm2 restart exped360-frontend
```

---

## Quick Deployment Commands Summary

### Backend:
```bash
# 1. Backup DB
mysqldump -u DB_USER -p DB_NAME > backup.sql

# 2. Upload files via SFTP

# 3. On server:
cd /var/www/exped360-backend
npm install --production
pm2 restart exped360-backend
pm2 logs exped360-backend  # Watch for migration success
```

### Frontend:
```bash
# 1. Build locally
cd exped360-main-work
npm run build

# 2. Upload .next/ and src/ via SFTP

# 3. On server:
cd /var/www/exped360-main-work
npm install --production
pm2 restart exped360-frontend
```

---

## Troubleshooting

### Migration didn't run?
- Check PM2 logs: `pm2 logs exped360-backend`
- Check if `src/config/db-auto-migrate.service.ts` was uploaded
- Manually add column: `ALTER TABLE properties ADD COLUMN propertyOwnerName VARCHAR(255) NULL;`

### Properties not showing?
- Check backend logs: `pm2 logs exped360-backend`
- Verify API is accessible: `curl https://visiteapihub.duckdns.org/api/properties`
- Check frontend logs: `pm2 logs exped360-frontend`

### Database connection issues?
- Verify `.env` file has correct database credentials
- Check MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u DB_USER -p DB_NAME`

---

## ✅ Success Checklist

After deployment, verify:

- [ ] All 31 properties still visible
- [ ] Can create new property with owner name
- [ ] Can edit existing property
- [ ] Property details page shows owner info correctly
- [ ] No errors in PM2 logs
- [ ] API responds correctly
- [ ] Frontend loads without errors

---

## Need Help?

If something goes wrong:
1. **STOP** - Don't panic
2. Check PM2 logs: `pm2 logs`
3. Check database: `mysql -u DB_USER -p DB_NAME -e "SELECT COUNT(*) FROM properties;"`
4. Restore from backup if needed
5. Contact support if issues persist

