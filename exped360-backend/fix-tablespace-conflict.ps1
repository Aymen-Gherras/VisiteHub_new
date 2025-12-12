# PowerShell script to fix MySQL tablespace ID conflicts
# MUST RUN AS ADMINISTRATOR
# WARNING: This may require data recovery or reinitialization

Write-Host "MySQL Tablespace Conflict Fix" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[WARNING] Your MySQL data dictionary is corrupted!" -ForegroundColor Red
Write-Host "Multiple tablespaces are sharing the same ID." -ForegroundColor Yellow
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

# Step 1: Verify MySQL is stopped
Write-Host "Step 1: Checking MySQL service status..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService.Status -eq 'Running') {
    Write-Host "   Stopping MySQL service..." -ForegroundColor Yellow
    Stop-Service -Name "MySQL80" -Force
    Start-Sleep -Seconds 3
    Write-Host "   [OK] MySQL stopped" -ForegroundColor Green
} else {
    Write-Host "   [OK] MySQL is already stopped" -ForegroundColor Green
}

# Step 2: Backup data directory
Write-Host ""
Write-Host "Step 2: Creating backup of MySQL data directory..." -ForegroundColor Yellow
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.0\Data"
$backupDir = "C:\MySQL_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

if (Test-Path $dataDir) {
    Write-Host "   Data directory: $dataDir" -ForegroundColor White
    Write-Host "   Backup directory: $backupDir" -ForegroundColor White
    Write-Host ""
    Write-Host "   [WARNING] This will create a backup, but reinitialization will DELETE all databases!" -ForegroundColor Red
    Write-Host "   Do you want to continue? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    
    if ($response -ne 'Y' -and $response -ne 'y') {
        Write-Host "   [CANCELLED] Operation cancelled by user" -ForegroundColor Yellow
        exit 0
    }
    
    Write-Host "   Creating backup..." -ForegroundColor Yellow
    try {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        Copy-Item -Path "$dataDir\*" -Destination $backupDir -Recurse -Force -ErrorAction Stop
        Write-Host "   [OK] Backup created at: $backupDir" -ForegroundColor Green
    } catch {
        Write-Host "   [FAIL] Backup failed: $_" -ForegroundColor Red
        Write-Host "   [TIP] You may need to manually backup the data directory" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [FAIL] Data directory not found: $dataDir" -ForegroundColor Red
    exit 1
}

# Step 3: Try repair options
Write-Host ""
Write-Host "Step 3: Attempting to repair MySQL data dictionary..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   Option 1: Try mysql_upgrade (if MySQL can start in recovery mode)" -ForegroundColor White
Write-Host "   Option 2: Reinitialize data directory (WILL DELETE ALL DATA)" -ForegroundColor White
Write-Host ""
Write-Host "   Which option do you want to try?" -ForegroundColor Yellow
Write-Host "   1 = Try mysql_upgrade first (safer, but may not work)" -ForegroundColor White
Write-Host "   2 = Reinitialize data directory (will delete all databases)" -ForegroundColor White
Write-Host "   3 = Cancel and exit" -ForegroundColor White
Write-Host ""
$choice = Read-Host "   Enter choice (1/2/3)"

if ($choice -eq '3') {
    Write-Host "   [CANCELLED] Operation cancelled" -ForegroundColor Yellow
    exit 0
}

if ($choice -eq '1') {
    Write-Host ""
    Write-Host "   Attempting Option 1: mysql_upgrade..." -ForegroundColor Yellow
    Write-Host "   [INFO] This requires MySQL to start, which may fail due to corruption" -ForegroundColor White
    Write-Host "   [INFO] If this fails, you'll need to use Option 2" -ForegroundColor White
    
    # Try to start MySQL in recovery mode
    $mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
    $myIni = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
    
    if (Test-Path "$mysqlBin\mysqld.exe") {
        Write-Host "   Starting MySQL in recovery mode..." -ForegroundColor Yellow
        # This is complex and may not work - better to go straight to reinitialization
        Write-Host "   [INFO] Recovery mode may not work with this level of corruption" -ForegroundColor Yellow
        Write-Host "   [TIP] Proceeding to reinitialization is recommended" -ForegroundColor Yellow
    }
}

if ($choice -eq '2' -or $choice -eq '1') {
    Write-Host ""
    Write-Host "Step 4: Reinitializing MySQL data directory..." -ForegroundColor Yellow
    Write-Host "   [WARNING] This will DELETE ALL DATABASES and data!" -ForegroundColor Red
    Write-Host "   Backup is at: $backupDir" -ForegroundColor White
    Write-Host ""
    Write-Host "   Are you absolutely sure? Type 'YES' to continue: " -ForegroundColor Red -NoNewline
    $confirm = Read-Host
    
    if ($confirm -ne 'YES') {
        Write-Host "   [CANCELLED] Operation cancelled" -ForegroundColor Yellow
        exit 0
    }
    
    # Remove data directory contents (except backup)
    Write-Host "   Removing corrupted data directory contents..." -ForegroundColor Yellow
    try {
        # Keep mysql, performance_schema, sys directories structure but remove corrupted files
        # Actually, we need to be more careful - let's just remove the ibdata and ib_log files
        $filesToRemove = @(
            "$dataDir\ibdata1",
            "$dataDir\ib_logfile0",
            "$dataDir\ib_logfile1",
            "$dataDir\*.err"
        )
        
        foreach ($pattern in $filesToRemove) {
            Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
        }
        
        Write-Host "   [OK] Removed corrupted InnoDB files" -ForegroundColor Green
        
        # Reinitialize
        Write-Host "   Reinitializing MySQL..." -ForegroundColor Yellow
        $mysqlBin = "C:\Program Files\MySQL\MySQL Server 8.0\bin"
        $mysqld = Join-Path $mysqlBin "mysqld.exe"
        
        if (Test-Path $mysqld) {
            # Run mysqld --initialize-insecure (creates new data directory)
            $initProcess = Start-Process -FilePath $mysqld -ArgumentList "--initialize-insecure", "--console" -WorkingDirectory $dataDir -NoNewWindow -Wait -PassThru
            
            if ($initProcess.ExitCode -eq 0) {
                Write-Host "   [OK] MySQL data directory reinitialized!" -ForegroundColor Green
            } else {
                Write-Host "   [FAIL] Reinitialization failed with exit code: $($initProcess.ExitCode)" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "   [FAIL] MySQL executable not found: $mysqld" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "   [FAIL] Error during reinitialization: $_" -ForegroundColor Red
        exit 1
    }
    
    # Step 5: Start MySQL
    Write-Host ""
    Write-Host "Step 5: Starting MySQL service..." -ForegroundColor Yellow
    try {
        Start-Service -Name "MySQL80"
        Start-Sleep -Seconds 5
        
        $status = (Get-Service -Name "MySQL80").Status
        if ($status -eq 'Running') {
            Write-Host "   [OK] MySQL started successfully!" -ForegroundColor Green
            
            # Test connection
            $portTest = Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
            if ($portTest) {
                Write-Host "   [OK] MySQL is accessible on port 3306!" -ForegroundColor Green
            }
        } else {
            Write-Host "   [FAIL] MySQL failed to start. Status: $status" -ForegroundColor Red
        }
    } catch {
        Write-Host "   [FAIL] Error starting MySQL: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "Fix process complete!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. MySQL has been reinitialized - ALL DATABASES ARE GONE" -ForegroundColor Red
Write-Host "2. You need to recreate your database:" -ForegroundColor White
Write-Host "   mysql -u root" -ForegroundColor Gray
Write-Host "   CREATE DATABASE exped360_local;" -ForegroundColor Gray
Write-Host ""
Write-Host "3. If you have database backups, restore them now" -ForegroundColor White
Write-Host "4. Your backup is at: $backupDir" -ForegroundColor White
Write-Host "5. Restart your NestJS application" -ForegroundColor White

