# 🔧 MySQL Service Won't Start - Fix Guide

## Problem
MySQL service exists but fails to start with error: `Failed to start service 'MySQL80'`

## Quick Fix Steps

### 1. Run Diagnostic Script
```powershell
# Run as Administrator
cd exped360-backend
.\diagnose-mysql.ps1
```

This will show you:
- Service status
- Port availability
- Error logs
- Installation details

### 2. Try Fix Script
```powershell
# Run as Administrator
.\fix-mysql.ps1
```

### 3. Manual Fixes

#### Option A: Start via Command Prompt (as Admin)
Sometimes CMD works better than PowerShell:
```cmd
net start MySQL80
```

#### Option B: Check MySQL Error Log
The error log usually contains the exact reason MySQL won't start:

1. Navigate to: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`
2. Open the `.err` file (usually named like `DESKTOP-XXXXX.err`)
3. Look for the most recent errors at the bottom

Common errors and fixes:

**Error: "Can't create/write to file"**
- **Fix**: Check file permissions on MySQL data directory
- Run: `icacls "C:\ProgramData\MySQL\MySQL Server 8.0\Data" /grant "NT SERVICE\MySQL80":(OI)(CI)F`

**Error: "Port 3306 already in use"**
- **Fix**: Find and stop the process using port 3306:
```powershell
# Find process
Get-NetTCPConnection -LocalPort 3306 | Select-Object OwningProcess

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Error: "InnoDB: Operating system error number 2"**
- **Fix**: MySQL data directory might be missing or corrupted
- Check if `C:\ProgramData\MySQL\MySQL Server 8.0\Data\` exists

**Error: "Table 'mysql.user' doesn't exist"**
- **Fix**: MySQL data directory is corrupted, needs reinitialization

#### Option C: Check Windows Event Viewer
1. Press `Win + X` → Event Viewer
2. Go to: Windows Logs → Application
3. Filter by Source: "MySQL"
4. Look for recent errors

#### Option D: Repair MySQL Installation
1. Open Windows Settings → Apps
2. Search for "MySQL"
3. Click on "MySQL Server 8.0"
4. Click "Modify"
5. Choose "Repair"

#### Option E: Reinitialize MySQL Data Directory
⚠️ **WARNING**: This will delete all your databases!

```cmd
# Stop MySQL service first
net stop MySQL80

# Backup data directory (optional but recommended)
xcopy "C:\ProgramData\MySQL\MySQL Server 8.0\Data" "C:\MySQL_Backup" /E /I

# Remove data directory
rmdir /s "C:\ProgramData\MySQL\MySQL Server 8.0\Data"

# Reinitialize
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysqld --initialize-insecure --console

# Start service
net start MySQL80
```

#### Option F: Reinstall MySQL
If nothing else works:

1. Uninstall MySQL from Windows Settings
2. Delete `C:\ProgramData\MySQL` (backup first!)
3. Download fresh installer from https://dev.mysql.com/downloads/mysql/
4. Install and configure

## Verify MySQL is Working

After fixing, verify:

```powershell
# Check service status
Get-Service MySQL80

# Test port
Test-NetConnection -ComputerName localhost -Port 3306

# Try connecting
mysql -u root -p
```

## Still Having Issues?

1. **Check MySQL Configuration File**
   - Location: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
   - Verify paths are correct
   - Check for syntax errors

2. **Check Disk Space**
   - MySQL needs free disk space
   - Run: `Get-PSDrive C`

3. **Check Antivirus**
   - Some antivirus software blocks MySQL
   - Add MySQL to exceptions

4. **Check Windows Firewall**
   - Ensure port 3306 is allowed

5. **Check for Multiple MySQL Installations**
   - Multiple versions can conflict
   - Uninstall all and reinstall one version

## Quick Reference Commands

```powershell
# Check service
Get-Service MySQL80

# Start service (as Admin)
Start-Service MySQL80
# OR
net start MySQL80

# Stop service (as Admin)
Stop-Service MySQL80
# OR
net stop MySQL80

# Check port
Test-NetConnection -ComputerName localhost -Port 3306

# Find what's using port 3306
Get-NetTCPConnection -LocalPort 3306

# View error log
Get-Content "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err" -Tail 20
```

