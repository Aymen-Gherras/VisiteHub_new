# 🔧 Database Connection Troubleshooting Guide

## Problem: `ECONNREFUSED` Errors

You're getting connection errors because **MySQL is not running** on your system.

## ✅ Solution Steps

### 1. Check if MySQL is Installed

**Option A: Check via Services**
```powershell
Get-Service -Name "*mysql*"
```

**Option B: Check if MySQL is in PATH**
```powershell
mysql --version
```

### 2. Install MySQL (if not installed)

**Download MySQL:**
1. Go to https://dev.mysql.com/downloads/mysql/
2. Download MySQL Installer for Windows
3. Run the installer and follow the setup wizard
4. **Remember the root password you set during installation!**

**Or use Chocolatey (if installed):**
```powershell
choco install mysql
```

### 3. Start MySQL Service

**Option A: Via Services GUI**
1. Press `Win + R`, type `services.msc`, press Enter
2. Find "MySQL" or "MySQL80" service
3. Right-click → Start

**Option B: Via PowerShell (Run as Administrator)**
```powershell
# Start MySQL service
Start-Service -Name "MySQL80"  # or "MySQL" depending on your installation

# Check status
Get-Service -Name "*mysql*"
```

**Option C: Via Command Line**
```cmd
net start MySQL80
```

### 4. Verify MySQL is Running

```powershell
# Check if port 3306 is listening
Test-NetConnection -ComputerName localhost -Port 3306

# Or try connecting
mysql -u root -p
```

### 5. Create Database and User (if needed)

If you haven't created the database yet, run:

```sql
-- Connect to MySQL
mysql -u root -p

-- Then run:
CREATE DATABASE IF NOT EXISTS exped360_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'Mansour31dzROOT';
GRANT ALL PRIVILEGES ON exped360_local.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

Or use the provided SQL script:
```powershell
mysql -u root -p < setup-mysql.sql
```

### 6. Redis (Optional but Recommended)

Redis is optional - the app will work with in-memory cache if Redis is not available.

**Install Redis on Windows:**

**Option A: Using WSL (Windows Subsystem for Linux)**
```powershell
wsl --install
# Then in WSL:
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start
```

**Option B: Using Memurai (Redis for Windows)**
1. Download from https://www.memurai.com/
2. Install and start the service

**Option C: Using Docker**
```powershell
docker run -d -p 6379:6379 redis:latest
```

**Start Redis:**
```powershell
# If using Memurai
Start-Service -Name "Memurai"

# If using WSL
wsl sudo service redis-server start
```

## 🚀 Quick Start Script

After MySQL is running, restart your NestJS application:

```powershell
cd exped360-backend
npm run start:dev
```

## ✅ Verification Checklist

- [ ] MySQL service is running
- [ ] Port 3306 is accessible
- [ ] Database `exped360_local` exists
- [ ] User `root` has access to the database
- [ ] `.env` file has correct credentials
- [ ] Redis is running (optional)

## 🔍 Common Issues

### Issue: "Access denied for user"
**Solution:** Check your `.env` file - the password might be incorrect.

### Issue: "Unknown database"
**Solution:** Create the database:
```sql
CREATE DATABASE exped360_local;
```

### Issue: MySQL service won't start
**Solution:** 
1. Check MySQL error logs (usually in `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`)
2. Make sure no other application is using port 3306
3. Try restarting your computer

### Issue: Port 3306 is in use
**Solution:** 
```powershell
# Find what's using port 3306
netstat -ano | findstr :3306

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## 📞 Still Having Issues?

1. Check MySQL error logs
2. Verify your `.env` file matches your MySQL credentials
3. Make sure MySQL is configured to accept connections from localhost
4. Check Windows Firewall isn't blocking port 3306

