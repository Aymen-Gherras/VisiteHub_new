# 🚨 Quick Fix for MySQL Tablespace Conflict

## The Problem
Your MySQL has **corrupted data dictionary** - multiple tablespaces share the same ID. MySQL cannot start.

## ⚠️ CRITICAL WARNING
**Fixing this will DELETE ALL YOUR DATABASES!** Make sure you have backups!

## Quick Fix (3 Steps)

### Step 1: Backup (IMPORTANT!)
```powershell
# Run as Administrator
$backup = "C:\MySQL_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backup
Copy-Item -Path "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*" -Destination $backup -Recurse
Write-Host "Backup created at: $backup"
```

### Step 2: Fix MySQL
```powershell
# Stop MySQL
Stop-Service -Name "MySQL80" -Force

# Remove corrupted files
Remove-Item "C:\ProgramData\MySQL\MySQL Server 8.0\Data\ibdata1" -Force -ErrorAction SilentlyContinue
Remove-Item "C:\ProgramData\MySQL\MySQL Server 8.0\Data\ib_logfile*" -Force -ErrorAction SilentlyContinue

# Reinitialize
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysqld.exe --initialize-insecure --console

# Start MySQL
Start-Service -Name "MySQL80"
```

### Step 3: Recreate Database
```sql
mysql -u root
CREATE DATABASE exped360_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Then restart your NestJS app - it will create the tables automatically.

## Or Use the Automated Script
```powershell
# Run as Administrator
.\fix-tablespace-conflict.ps1
```

