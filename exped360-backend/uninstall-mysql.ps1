# PowerShell script to uninstall MySQL and clean up
# MUST RUN AS ADMINISTRATOR
# This prepares for a clean MySQL reinstallation

Write-Host "MySQL Uninstall and Cleanup Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[WARNING] This will uninstall MySQL and remove all data!" -ForegroundColor Red
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[FAIL] This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "[TIP] Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Running as Administrator" -ForegroundColor Green
Write-Host ""

# Step 1: Backup
Write-Host "Step 1: Creating backup..." -ForegroundColor Yellow
$backup = "C:\MySQL_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"

if (Test-Path $dataDir) {
    Write-Host "   Creating backup at: $backup" -ForegroundColor White
    try {
        New-Item -ItemType Directory -Path $backup -Force | Out-Null
        Copy-Item -Path "$dataDir\*" -Destination $backup -Recurse -Force -ErrorAction Stop
        Write-Host "   [OK] Backup created successfully" -ForegroundColor Green
    } catch {
        Write-Host "   [WARNING] Backup failed: $_" -ForegroundColor Yellow
        Write-Host "   [INFO] Continuing anyway..." -ForegroundColor White
    }
} else {
    Write-Host "   [INFO] Data directory not found, skipping backup" -ForegroundColor Yellow
}

# Step 2: Stop MySQL
Write-Host ""
Write-Host "Step 2: Stopping MySQL service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq 'Running') {
        Write-Host "   Stopping MySQL80..." -ForegroundColor White
        Stop-Service -Name "MySQL80" -Force
        Start-Sleep -Seconds 3
        Write-Host "   [OK] MySQL stopped" -ForegroundColor Green
    } else {
        Write-Host "   [OK] MySQL is already stopped" -ForegroundColor Green
    }
} else {
    Write-Host "   [INFO] MySQL service not found" -ForegroundColor Yellow
}

# Step 3: Uninstall MySQL
Write-Host ""
Write-Host "Step 3: Uninstalling MySQL..." -ForegroundColor Yellow
Write-Host "   [INFO] This will open Windows Settings or Control Panel" -ForegroundColor White
Write-Host "   [INFO] Please complete the uninstallation manually" -ForegroundColor White
Write-Host ""
Write-Host "   Options:" -ForegroundColor Yellow
Write-Host "   1. Open Windows Settings (Apps)" -ForegroundColor White
Write-Host "   2. Open Control Panel (Programs and Features)" -ForegroundColor White
Write-Host "   3. Skip and clean up files only" -ForegroundColor White
Write-Host ""
$choice = Read-Host "   Enter choice (1/2/3)"

if ($choice -eq '1') {
    Write-Host "   Opening Windows Settings..." -ForegroundColor Yellow
    Start-Process "ms-settings:appsfeatures"
    Write-Host "   [INFO] Find 'MySQL Server 8.0' and click Uninstall" -ForegroundColor White
    Write-Host "   [INFO] Press Enter after uninstallation is complete..." -ForegroundColor Yellow
    Read-Host
} elseif ($choice -eq '2') {
    Write-Host "   Opening Control Panel..." -ForegroundColor Yellow
    Start-Process "appwiz.cpl"
    Write-Host "   [INFO] Find 'MySQL Server 8.0' and click Uninstall" -ForegroundColor White
    Write-Host "   [INFO] Press Enter after uninstallation is complete..." -ForegroundColor Yellow
    Read-Host
} else {
    Write-Host "   [INFO] Skipping uninstall, will only clean up files" -ForegroundColor Yellow
}

# Step 4: Clean up files
Write-Host ""
Write-Host "Step 4: Cleaning up MySQL files..." -ForegroundColor Yellow

$pathsToRemove = @(
    "C:\ProgramData\MySQL",
    "$env:ProgramData\MySQL",
    "C:\Program Files\MySQL",
    "$env:ProgramFiles\MySQL",
    "${env:ProgramFiles(x86)}\MySQL"
)

foreach ($path in $pathsToRemove) {
    if (Test-Path $path) {
        Write-Host "   Removing: $path" -ForegroundColor White
        try {
            Remove-Item -Path $path -Recurse -Force -ErrorAction Stop
            Write-Host "   [OK] Removed" -ForegroundColor Green
        } catch {
            Write-Host "   [WARNING] Could not remove: $_" -ForegroundColor Yellow
            Write-Host "   [TIP] You may need to remove this manually" -ForegroundColor White
        }
    }
}

# Step 5: Verify cleanup
Write-Host ""
Write-Host "Step 5: Verifying cleanup..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService) {
    Write-Host "   [WARNING] MySQL service still exists" -ForegroundColor Yellow
    Write-Host "   [TIP] MySQL may not be fully uninstalled" -ForegroundColor White
} else {
    Write-Host "   [OK] MySQL service removed" -ForegroundColor Green
}

$dataDirExists = Test-Path $dataDir
if ($dataDirExists) {
    Write-Host "   [WARNING] Data directory still exists: $dataDir" -ForegroundColor Yellow
    Write-Host "   [TIP] You may want to remove this manually" -ForegroundColor White
} else {
    Write-Host "   [OK] Data directory removed" -ForegroundColor Green
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Download MySQL from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor White
Write-Host "2. Install MySQL Server 8.0" -ForegroundColor White
Write-Host "3. Set a root password during installation" -ForegroundColor White
Write-Host "4. Create your database: CREATE DATABASE exped360_local;" -ForegroundColor White
Write-Host "5. Update your .env file with the new root password" -ForegroundColor White
Write-Host ""
if ($backup -and (Test-Path $backup)) {
    Write-Host "Your backup is at: $backup" -ForegroundColor Cyan
}

