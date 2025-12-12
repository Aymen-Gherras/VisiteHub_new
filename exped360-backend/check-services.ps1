# PowerShell script to check database services status
# This script checks if MySQL and Redis are running

Write-Host "Checking Database Services Status" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check MySQL
Write-Host "MySQL Status:" -ForegroundColor Yellow
$mysqlServices = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue

if ($mysqlServices) {
    $mysqlServices | ForEach-Object {
        $status = $_.Status
        $color = if ($status -eq 'Running') { 'Green' } else { 'Red' }
        Write-Host "   Service: $($_.Name)" -ForegroundColor White
        Write-Host "   Status:  $status" -ForegroundColor $color
    }
    
    # Test port 3306
    Write-Host ""
    Write-Host "   Testing port 3306..." -ForegroundColor Yellow
    $mysqlPort = Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($mysqlPort) {
        Write-Host "   [OK] Port 3306 is accessible" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] Port 3306 is not accessible" -ForegroundColor Red
    }
} else {
    Write-Host "   [FAIL] MySQL service not found" -ForegroundColor Red
    Write-Host "   [TIP] Install MySQL from https://dev.mysql.com/downloads/mysql/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Redis Status:" -ForegroundColor Yellow
$redisServices = Get-Service -Name "*redis*", "*memurai*" -ErrorAction SilentlyContinue

if ($redisServices) {
    $redisServices | ForEach-Object {
        $status = $_.Status
        $color = if ($status -eq 'Running') { 'Green' } else { 'Red' }
        Write-Host "   Service: $($_.Name)" -ForegroundColor White
        Write-Host "   Status:  $status" -ForegroundColor $color
    }
    
    # Test port 6379
    Write-Host ""
    Write-Host "   Testing port 6379..." -ForegroundColor Yellow
    $redisPort = Test-NetConnection -ComputerName localhost -Port 6379 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($redisPort) {
        Write-Host "   [OK] Port 6379 is accessible" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] Port 6379 is not accessible" -ForegroundColor Red
        Write-Host "   [INFO] App will use in-memory cache (this is OK)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   [INFO] Redis service not found (optional)" -ForegroundColor Yellow
    Write-Host "   [TIP] App will use in-memory cache instead" -ForegroundColor White
}

Write-Host ""
Write-Host "Environment File:" -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    Write-Host "   [OK] .env file exists" -ForegroundColor Green
    
    # Check for required variables
    $envContent = Get-Content $envPath
    $requiredVars = @("DB_HOST", "DB_PORT", "DB_USERNAME", "DB_PASSWORD", "DB_DATABASE", "JWT_SECRET")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        $found = $envContent | Where-Object { $_ -match "^$var=" }
        if (-not $found) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "   [OK] All required variables are set" -ForegroundColor Green
    } else {
        Write-Host "   [FAIL] Missing variables: $($missingVars -join ', ')" -ForegroundColor Red
    }
} else {
    Write-Host "   [FAIL] .env file not found" -ForegroundColor Red
    Write-Host "   [TIP] Copy env.example to .env and configure it" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Check complete!" -ForegroundColor Green
