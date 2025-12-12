# 🔧 MySQL Tablespace ID Conflict - Fix Guide

## Problem Identified

Your MySQL error log shows **InnoDB tablespace ID conflicts**:

```
[ERROR] [MY-012202] [InnoDB] Tablespace ID: 20 = ['lab_db\analysis_results.ibd', 'sakila\fts_0000000000000431_00000000000000b6_index_4.ibd']
[ERROR] [MY-012202] [InnoDB] Tablespace ID: 38 = ['exped360_local\users.ibd', 'lab_db\category_analyse.ibd']
```

**What this means:**
- Multiple database tables are sharing the same tablespace ID
- This is a **serious data dictionary corruption**
- MySQL cannot start because it can't resolve these conflicts
- This typically happens when databases are copied/moved incorrectly

## ⚠️ IMPORTANT WARNING

**Fixing this will likely require reinitializing MySQL, which will DELETE ALL YOUR DATABASES!**

Make sure you:
1. ✅ Have backups of important data
2. ✅ Understand that all databases will be lost
3. ✅ Are prepared to recreate databases and restore data

## Solution Options

### Option 1: Automated Fix Script (Recommended)

Run the automated fix script:

```powershell
# Run as Administrator
cd exped360-backend
.\fix-tablespace-conflict.ps1
```

This script will:
1. Stop MySQL service
2. Create a backup of your data directory
3. Reinitialize MySQL data directory
4. Start MySQL service
5. Guide you through next steps

### Option 2: Manual Fix (Advanced)

If you prefer to do it manually:

#### Step 1: Backup Data Directory
```powershell
# Run as Administrator
$backupDir = "C:\MySQL_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir
Copy-Item -Path "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*" -Destination $backupDir -Recurse
```

#### Step 2: Stop MySQL
```powershell
Stop-Service -Name "MySQL80" -Force
```

#### Step 3: Remove Corrupted InnoDB Files
```powershell
Remove-Item "C:\ProgramData\MySQL\MySQL Server 8.0\Data\ibdata1" -Force
Remove-Item "C:\ProgramData\MySQL\MySQL Server 8.0\Data\ib_logfile0" -Force
Remove-Item "C:\ProgramData\MySQL\MySQL Server 8.0\Data\ib_logfile1" -Force
```

#### Step 4: Reinitialize MySQL
```cmd
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --initialize-insecure --console
```

#### Step 5: Start MySQL
```powershell
Start-Service -Name "MySQL80"
```

#### Step 6: Recreate Database
```sql
mysql -u root
CREATE DATABASE exped360_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## After Fixing

### 1. Recreate Your Database

```sql
mysql -u root
CREATE DATABASE exped360_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Restore Data (if you have backups)

If you have SQL dumps or backups:
```bash
mysql -u root exped360_local < your_backup.sql
```

### 3. Run Your Application Migrations

Your NestJS app should have migrations or auto-migration:
```powershell
npm run start:dev
```

The app should automatically create tables if you have `DbAutoMigrateService` configured.

### 4. Restore from Backup Directory (if needed)

If you need to recover specific data from the backup:
1. The backup is at: `C:\MySQL_Backup_YYYYMMDD_HHMMSS\`
2. You can manually copy specific `.ibd` files (advanced, risky)
3. Or use `mysqlfrm` and `mysql` to extract table structures

## Prevention

To prevent this in the future:

1. **Never copy/move database files directly** - Use `mysqldump` instead
2. **Always backup before major operations**
3. **Use proper MySQL tools** for database operations
4. **Avoid manual file manipulation** in the data directory

## Alternative: Try Recovery Mode (Advanced)

If you want to try recovering data first (may not work with this level of corruption):

```cmd
# Start MySQL in recovery mode
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --innodb-force-recovery=1 --console
```

Then try:
```cmd
mysql_upgrade -u root
```

**Note:** This rarely works with tablespace ID conflicts, but worth trying if you have critical data.

## Quick Reference

```powershell
# Check service
Get-Service MySQL80

# Stop service
Stop-Service -Name "MySQL80" -Force

# Start service
Start-Service -Name "MySQL80"

# Test connection
Test-NetConnection -ComputerName localhost -Port 3306

# Connect to MySQL
mysql -u root
```

## Need Help?

If you're unsure:
1. **Backup first** - Always backup before making changes
2. **Run the automated script** - It's safer and guides you through the process
3. **Check backups** - Make sure you have recent backups before proceeding

