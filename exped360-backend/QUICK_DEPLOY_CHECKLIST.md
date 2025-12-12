# Quick Deployment Checklist - Property Owner Name Feature

## 🛡️ DATA SAFETY: Your 31 properties will NOT be lost!

The auto-migration adds a new **nullable** column. Existing properties will have `NULL` for `propertyOwnerName`, which is perfectly fine.

---

## ⚡ Quick Steps

### 1. BACKUP DATABASE (2 minutes)
```bash
# On production server
mysqldump -u YOUR_DB_USER -p YOUR_DB_NAME > ~/backup_$(date +%Y%m%d).sql
```

### 2. BACKEND DEPLOYMENT

**Local (Windows):**
```powershell
cd exped360-backend
npm install
npm run build
# Now upload dist/, src/, package.json, package-lock.json via SFTP
```

**On Production Server (via SSH):**
```bash
cd /var/www/exped360-backend  # or your path
npm install --production
pm2 restart exped360-backend
pm2 logs exped360-backend  # Watch for "✅ Added propertyOwnerName column"
```

### 3. FRONTEND DEPLOYMENT

**Local (Windows):**
```powershell
cd exped360-main-work
npm install
npm run build
# Now upload .next/, src/, package.json via SFTP
```

**On Production Server (via SSH):**
```bash
cd /var/www/exped360-main-work  # or your path
npm install --production
pm2 restart exped360-frontend  # or your process name
```

### 4. VERIFY (1 minute)
```bash
# Check all 31 properties still exist
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "SELECT COUNT(*) FROM properties;"

# Check new column exists
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "DESCRIBE properties;" | grep propertyOwnerName
```

---

## ✅ What Auto-Migration Does

When backend restarts, `db-auto-migrate.service.ts` will:
1. Check if `propertyOwnerName` column exists
2. If not, add it as `VARCHAR(255) NULL` (nullable = safe!)
3. Log success: `✅ Added propertyOwnerName column`
4. **Your 31 properties remain untouched!**

---

## 🚨 If Something Goes Wrong

```bash
# Restore database from backup
mysql -u YOUR_DB_USER -p YOUR_DB_NAME < ~/backup_YYYYMMDD.sql

# Restart with previous code
pm2 restart exped360-backend
```

---

## Files to Upload via SFTP

### Backend:
- ✅ `dist/` (entire folder)
- ✅ `src/` (entire folder - needed for auto-migration)
- ✅ `package.json`
- ✅ `package-lock.json`
- ❌ `.env` (DON'T overwrite - keep existing!)

### Frontend:
- ✅ `.next/` (entire folder)
- ✅ `src/` (entire folder)
- ✅ `public/` (entire folder)
- ✅ `package.json`
- ✅ `next.config.ts`
- ❌ `.env.local` (DON'T overwrite - keep existing!)

---

## Expected Log Output

After restarting backend, you should see in logs:
```
[INFO] Adding properties.propertyOwnerName column
✅ Added propertyOwnerName column
```

Or if column already exists:
```
✅ propertyOwnerName column already exists
```

---

## Test After Deployment

1. Visit `https://visitehub.com`
2. Check properties page - should show all 31 properties
3. Try creating a new property
4. Select "Agence immobilière" - should show "Agency Name" field
5. Check property details page - owner info should be in contact section

---

**Total deployment time: ~10-15 minutes**
**Downtime: ~30 seconds (PM2 restart)**

