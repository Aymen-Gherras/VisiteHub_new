# 🔄 Reinstall MySQL - Complete Guide

## Will This Fix the Errors?

**YES!** Uninstalling and reinstalling MySQL will fix the tablespace ID conflicts because:
- ✅ Fresh installation = clean data directory
- ✅ No corrupted InnoDB files
- ✅ No tablespace ID conflicts
- ✅ MySQL will start normally

**However:** All your databases will be deleted, just like with reinitialization.

## ⚠️ Before You Start

1. **Backup Important Data** (if you have any)
2. **Note your MySQL root password** (you'll need to set a new one)
3. **Close all applications** using MySQL

## Step-by-Step Reinstallation

### Step 1: Backup Data Directory (Optional but Recommended)

```powershell
# Run as Administrator
$backup = "C:\MySQL_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backup
Copy-Item -Path "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*" -Destination $backup -Recurse -ErrorAction SilentlyContinue
Write-Host "Backup created at: $backup"
```

### Step 2: Stop MySQL Service

```powershell
# Run as Administrator
Stop-Service -Name "MySQL80" -Force
```

### Step 3: Uninstall MySQL

**Option A: Via Windows Settings (Easiest)**
1. Press `Win + I` to open Settings
2. Go to **Apps** → **Installed apps**
3. Search for "MySQL"
4. Click on **MySQL Server 8.0**
5. Click **Uninstall**
6. Follow the uninstall wizard
7. **Important:** When asked, choose to remove all data

**Option B: Via Control Panel**
1. Open **Control Panel** → **Programs and Features**
2. Find **MySQL Server 8.0**
3. Right-click → **Uninstall**
4. Follow the wizard

**Option C: Via Command Line**
```powershell
# Find MySQL installer
Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like "*MySQL*" } | ForEach-Object { $_.Uninstall() }
```

### Step 4: Clean Up Remaining Files

After uninstalling, manually remove these directories:

```powershell
# Run as Administrator
# Remove data directory
Remove-Item "C:\ProgramData\MySQL" -Recurse -Force -ErrorAction SilentlyContinue

# Remove program files (if not removed automatically)
Remove-Item "C:\Program Files\MySQL" -Recurse -Force -ErrorAction SilentlyContinue

# Remove from Program Files (x86) if exists
Remove-Item "${env:ProgramFiles(x86)}\MySQL" -Recurse -Force -ErrorAction SilentlyContinue

# Clean registry (optional, advanced)
# Only do this if you're comfortable with registry editing
```

### Step 5: Download and Install MySQL

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/mysql/
   - Download **MySQL Installer for Windows**
   - Choose the **Full** or **Developer Default** setup type

2. **Run the Installer:**
   - Run the downloaded `.msi` file
   - Choose **Developer Default** or **Server only**
   - Follow the installation wizard

3. **Configure MySQL:**
   - **Server Configuration:** Choose "Standalone MySQL Server"
   - **Type and Networking:** Use default port 3306
   - **Authentication Method:** Use **"Use Strong Password Encryption"** (recommended)
   - **Accounts and Roles:** 
     - Set a **root password** (remember this!)
     - You can add a user later if needed
   - **Windows Service:** 
     - Service name: **MySQL80** (default)
     - Start MySQL at System Startup: **Yes**
   - **Apply Configuration:** Click Execute

### Step 6: Verify Installation

```powershell
# Check service status
Get-Service MySQL80

# Should show: Running

# Test connection
Test-NetConnection -ComputerName localhost -Port 3306

# Should show: TcpTestSucceeded : True
```

### Step 7: Recreate Your Database

```sql
# Connect to MySQL
mysql -u root -p
# Enter the root password you set during installation

# Create your database
CREATE DATABASE exped360_local CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify it was created
SHOW DATABASES;

# Exit
EXIT;
```

### Step 8: Update Your .env File

Make sure your `.env` file has the correct password:

```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_new_root_password  # ← Update this!
DB_DATABASE=exped360_local
```

### Step 9: Test Your Application

```powershell
cd exped360-backend
npm run start:dev
```

Your NestJS app should:
- ✅ Connect to MySQL successfully
- ✅ Automatically create tables (if you have auto-migration)
- ✅ Start without errors

## Automated Reinstall Script

I can create a script to automate steps 1-4 (backup, stop, uninstall, cleanup). Would you like me to create that?

## Comparison: Reinstall vs Reinitialize

| Method | Pros | Cons |
|--------|------|------|
| **Reinstall** | • Completely clean state<br>• Fixes any installation issues<br>• Ensures latest version | • Takes longer<br>• Requires download<br>• More steps |
| **Reinitialize** | • Faster<br>• No download needed<br>• Keeps installation | • May not fix all issues<br>• Requires manual cleanup |

**Recommendation:** If you're comfortable with reinstalling, it's the **safest and most thorough** approach.

## Troubleshooting

### MySQL Service Won't Start After Reinstall
- Check Windows Event Viewer for errors
- Verify port 3306 is not in use
- Try: `net start MySQL80` in Command Prompt (as Admin)

### Can't Connect After Reinstall
- Verify root password in `.env` file
- Check MySQL is running: `Get-Service MySQL80`
- Test connection: `mysql -u root -p`

### Forgot Root Password
```sql
# Stop MySQL service first
# Then start MySQL in safe mode:
mysqld --skip-grant-tables

# In another terminal:
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;

# Restart MySQL service normally
```

## Next Steps After Reinstall

1. ✅ MySQL is running
2. ✅ Database `exped360_local` is created
3. ✅ `.env` file has correct credentials
4. ✅ Start your NestJS application
5. ✅ Tables will be created automatically (if auto-migration is enabled)

## Summary

**Yes, reinstalling MySQL will fix the errors!** It's actually the cleanest solution. Just remember:
- Back up any important data first
- Set a new root password during installation
- Update your `.env` file with the new password
- Recreate your database after installation

