# PowerShell script to start MySQL service on Windows
# Run this script as Administrator

Write-Host "Checking MySQL service..." -ForegroundColor Cyan

# Try to find MySQL service
$mysqlServices = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue

if ($mysqlServices) {
    Write-Host "[OK] Found MySQL service(s):" -ForegroundColor Green
    $mysqlServices | ForEach-Object {
        Write-Host "   - $($_.Name): $($_.Status)" -ForegroundColor Yellow
    }
    
    # Try to start MySQL service
    $mysqlService = $mysqlServices | Select-Object -First 1
    
    if ($mysqlService.Status -eq 'Running') {
        Write-Host "[OK] MySQL is already running!" -ForegroundColor Green
    } else {
        Write-Host "Starting MySQL service..." -ForegroundColor Yellow
        try {
            Start-Service -Name $mysqlService.Name
            Start-Sleep -Seconds 3
            
            $status = (Get-Service -Name $mysqlService.Name).Status
            if ($status -eq 'Running') {
                Write-Host "[OK] MySQL started successfully!" -ForegroundColor Green
            } else {
                Write-Host "[FAIL] Failed to start MySQL. Status: $status" -ForegroundColor Red
                Write-Host "[TIP] Try running this script as Administrator" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "[FAIL] Error starting MySQL: $_" -ForegroundColor Red
            Write-Host "[TIP] Try running this script as Administrator" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "[FAIL] MySQL service not found!" -ForegroundColor Red
    Write-Host "[TIP] Please install MySQL first:" -ForegroundColor Yellow
    Write-Host "   1. Download from https://dev.mysql.com/downloads/mysql/" -ForegroundColor White
    Write-Host "   2. Or use: choco install mysql" -ForegroundColor White
}

Write-Host ""
Write-Host "Testing MySQL connection on port 3306..." -ForegroundColor Cyan
$testConnection = Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($testConnection) {
    Write-Host "[OK] MySQL is accessible on port 3306!" -ForegroundColor Green
} else {
    Write-Host "[FAIL] Cannot connect to MySQL on port 3306" -ForegroundColor Red
    Write-Host "[TIP] Make sure MySQL is running and configured correctly" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Verify your .env file has correct MySQL credentials" -ForegroundColor White
Write-Host "   2. Make sure the database exists: CREATE DATABASE exped360_local;" -ForegroundColor White
Write-Host "   3. Restart your NestJS application: npm run start:dev" -ForegroundColor White
