# PowerShell script to diagnose MySQL startup issues
# Run this script as Administrator

Write-Host "MySQL Service Diagnostics" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check service status
Write-Host "1. Service Status:" -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService) {
    Write-Host "   Service Name: $($mysqlService.Name)" -ForegroundColor White
    Write-Host "   Display Name: $($mysqlService.DisplayName)" -ForegroundColor White
    Write-Host "   Status: $($mysqlService.Status)" -ForegroundColor $(if ($mysqlService.Status -eq 'Running') { 'Green' } else { 'Red' })
    Write-Host "   Start Type: $((Get-WmiObject Win32_Service -Filter "Name='MySQL80'").StartMode)" -ForegroundColor White
} else {
    Write-Host "   [FAIL] MySQL80 service not found" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "2. Checking if port 3306 is in use:" -ForegroundColor Yellow
$port3306 = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($port3306) {
    Write-Host "   [WARNING] Port 3306 is in use by:" -ForegroundColor Red
    $port3306 | ForEach-Object {
        $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        Write-Host "      Process ID: $($_.OwningProcess) - $($process.ProcessName)" -ForegroundColor White
    }
} else {
    Write-Host "   [OK] Port 3306 is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "3. Checking MySQL error logs:" -ForegroundColor Yellow
$possibleLogPaths = @(
    "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err",
    "$env:ProgramData\MySQL\MySQL Server 8.0\Data\*.err",
    "C:\Program Files\MySQL\MySQL Server 8.0\Data\*.err",
    "$env:ProgramFiles\MySQL\MySQL Server 8.0\Data\*.err"
)

$logFound = $false
foreach ($logPath in $possibleLogPaths) {
    $logFiles = Get-ChildItem -Path $logPath -ErrorAction SilentlyContinue
    if ($logFiles) {
        $logFound = $true
        $latestLog = $logFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        Write-Host "   [OK] Found error log: $($latestLog.FullName)" -ForegroundColor Green
        Write-Host "   Last 20 lines of error log:" -ForegroundColor Yellow
        Write-Host "   ----------------------------------------" -ForegroundColor Gray
        Get-Content $latestLog.FullName -Tail 20 | ForEach-Object {
            Write-Host "   $_" -ForegroundColor White
        }
        Write-Host "   ----------------------------------------" -ForegroundColor Gray
        break
    }
}

if (-not $logFound) {
    Write-Host "   [INFO] Could not find MySQL error log automatically" -ForegroundColor Yellow
    Write-Host "   [TIP] Check: C:\ProgramData\MySQL\MySQL Server 8.0\Data\" -ForegroundColor White
}

Write-Host ""
Write-Host "4. Checking MySQL installation:" -ForegroundColor Yellow
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe",
    "$env:ProgramFiles\MySQL\MySQL Server 8.0\bin\mysqld.exe"
)

$mysqlFound = $false
foreach ($mysqlPath in $mysqlPaths) {
    if (Test-Path $mysqlPath) {
        $mysqlFound = $true
        Write-Host "   [OK] MySQL found at: $mysqlPath" -ForegroundColor Green
        $version = & "$mysqlPath" --version 2>&1
        Write-Host "   Version: $version" -ForegroundColor White
        break
    }
}

if (-not $mysqlFound) {
    Write-Host "   [FAIL] MySQL executable not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Checking Windows Event Log for MySQL errors:" -ForegroundColor Yellow
try {
    $events = Get-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='MySQL'} -MaxEvents 5 -ErrorAction SilentlyContinue
    if ($events) {
        Write-Host "   [OK] Found recent MySQL events:" -ForegroundColor Green
        $events | ForEach-Object {
            Write-Host "   Time: $($_.TimeCreated) - Level: $($_.LevelDisplayName)" -ForegroundColor White
            Write-Host "   Message: $($_.Message)" -ForegroundColor Gray
            Write-Host ""
        }
    } else {
        Write-Host "   [INFO] No recent MySQL events found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   [INFO] Could not read event log: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "6. Attempting to start MySQL service:" -ForegroundColor Yellow
try {
    Start-Service -Name "MySQL80" -ErrorAction Stop
    Start-Sleep -Seconds 3
    $status = (Get-Service -Name "MySQL80").Status
    if ($status -eq 'Running') {
        Write-Host "   [OK] MySQL started successfully!" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] MySQL failed to start. Status: $status" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] Error starting MySQL: $_" -ForegroundColor Red
    Write-Host "   Error Details: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Diagnostics complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Common Solutions:" -ForegroundColor Yellow
Write-Host "1. Run PowerShell as Administrator" -ForegroundColor White
Write-Host "2. Check MySQL error log for specific errors" -ForegroundColor White
Write-Host "3. Verify MySQL data directory is accessible" -ForegroundColor White
Write-Host "4. Try: net start MySQL80 (in Command Prompt as Admin)" -ForegroundColor White
Write-Host "5. Reinstall MySQL if corruption is suspected" -ForegroundColor White

