# PowerShell script to fix MySQL startup issues
# MUST RUN AS ADMINISTRATOR

Write-Host "MySQL Service Fix Script" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[WARNING] This script must be run as Administrator!" -ForegroundColor Yellow
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

# Step 1: Stop the service if it's in a bad state
Write-Host "Step 1: Checking service state..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq 'Running') {
        Write-Host "   [INFO] Service is already running" -ForegroundColor Green
    } else {
        Write-Host "   [INFO] Service is stopped" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [FAIL] MySQL80 service not found" -ForegroundColor Red
    exit 1
}

# Step 2: Try to start using net command (sometimes more reliable)
Write-Host ""
Write-Host "Step 2: Attempting to start MySQL using net command..." -ForegroundColor Yellow
$netStart = net start MySQL80 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   [OK] MySQL started successfully!" -ForegroundColor Green
    Start-Sleep -Seconds 2
    $status = (Get-Service -Name "MySQL80").Status
    Write-Host "   Service Status: $status" -ForegroundColor $(if ($status -eq 'Running') { 'Green' } else { 'Red' })
} else {
    Write-Host "   [FAIL] Failed to start MySQL" -ForegroundColor Red
    Write-Host "   Error: $netStart" -ForegroundColor Red
    
    # Step 3: Check error log
    Write-Host ""
    Write-Host "Step 3: Checking MySQL error log..." -ForegroundColor Yellow
    $logPaths = @(
        "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err",
        "$env:ProgramData\MySQL\MySQL Server 8.0\Data\*.err"
    )
    
    $logFound = $false
    foreach ($logPath in $logPaths) {
        $logFiles = Get-ChildItem -Path $logPath -ErrorAction SilentlyContinue
        if ($logFiles) {
            $latestLog = $logFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            Write-Host "   [OK] Found error log: $($latestLog.FullName)" -ForegroundColor Green
            Write-Host ""
            Write-Host "   Last 15 error lines:" -ForegroundColor Yellow
            Write-Host "   " + ("-" * 60) -ForegroundColor Gray
            Get-Content $latestLog.FullName -Tail 15 | ForEach-Object {
                Write-Host "   $_" -ForegroundColor White
            }
            Write-Host "   " + ("-" * 60) -ForegroundColor Gray
            $logFound = $true
            break
        }
    }
    
    if (-not $logFound) {
        Write-Host "   [INFO] Could not find error log automatically" -ForegroundColor Yellow
        Write-Host "   [TIP] Check manually: C:\ProgramData\MySQL\MySQL Server 8.0\Data\" -ForegroundColor White
    }
    
    # Step 4: Try to repair MySQL
    Write-Host ""
    Write-Host "Step 4: Common fixes to try:" -ForegroundColor Yellow
    Write-Host "   1. Check if MySQL data directory exists and is accessible" -ForegroundColor White
    Write-Host "   2. Verify MySQL configuration file (my.ini) is valid" -ForegroundColor White
    Write-Host "   3. Check Windows Event Viewer for detailed errors" -ForegroundColor White
    Write-Host "   4. Try repairing MySQL installation" -ForegroundColor White
    Write-Host ""
    Write-Host "   To repair MySQL:" -ForegroundColor Yellow
    Write-Host "   - Open 'Apps & Features' in Windows Settings" -ForegroundColor White
    Write-Host "   - Find MySQL Server 8.0" -ForegroundColor White
    Write-Host "   - Click 'Modify' and choose 'Repair'" -ForegroundColor White
    Write-Host ""
    Write-Host "   Or reinstall MySQL from:" -ForegroundColor Yellow
    Write-Host "   https://dev.mysql.com/downloads/mysql/" -ForegroundColor White
}

# Step 5: Verify connection
Write-Host ""
Write-Host "Step 5: Verifying MySQL connection..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
$status = (Get-Service -Name "MySQL80").Status
if ($status -eq 'Running') {
    $portTest = Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($portTest) {
        Write-Host "   [OK] MySQL is running and accessible on port 3306!" -ForegroundColor Green
        Write-Host ""
        Write-Host "[SUCCESS] MySQL is ready to use!" -ForegroundColor Green
        Write-Host "You can now start your NestJS application." -ForegroundColor White
    } else {
        Write-Host "   [WARNING] Service is running but port 3306 is not accessible" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [FAIL] MySQL service is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "[FAIL] Could not start MySQL automatically" -ForegroundColor Red
    Write-Host "Please check the error log above for specific issues." -ForegroundColor Yellow
}

