# PowerShell script to create the exped360_local database
# This script creates the database after MySQL reinstallation

Write-Host "Creating exped360_local Database" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is running
Write-Host "Step 1: Checking MySQL service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService -and $mysqlService.Status -eq 'Running') {
    Write-Host "   [OK] MySQL is running" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] MySQL is not running" -ForegroundColor Red
    Write-Host "   [TIP] Start MySQL service first: Start-Service MySQL80" -ForegroundColor Yellow
    exit 1
}

# Test connection
Write-Host ""
Write-Host "Step 2: Testing MySQL connection..." -ForegroundColor Yellow
$portTest = Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($portTest) {
    Write-Host "   [OK] Port 3306 is accessible" -ForegroundColor Green
} else {
    Write-Host "   [FAIL] Cannot connect to MySQL on port 3306" -ForegroundColor Red
    exit 1
}

# Get MySQL credentials from .env file
Write-Host ""
Write-Host "Step 3: Reading database credentials from .env file..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "   [FAIL] .env file not found at: $envPath" -ForegroundColor Red
    Write-Host "   [TIP] Make sure you have a .env file with DB_USERNAME and DB_PASSWORD" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content $envPath
$dbUsername = ($envContent | Where-Object { $_ -match "^DB_USERNAME=" }) -replace "DB_USERNAME=", "" -replace '"', ''
$dbPassword = ($envContent | Where-Object { $_ -match "^DB_PASSWORD=" }) -replace "DB_PASSWORD=", "" -replace '"', ''
$dbName = ($envContent | Where-Object { $_ -match "^DB_DATABASE=" }) -replace "DB_DATABASE=", "" -replace '"', ''

if (-not $dbUsername) {
    $dbUsername = "root"
    Write-Host "   [INFO] Using default username: root" -ForegroundColor Yellow
}

if (-not $dbPassword) {
    Write-Host "   [FAIL] DB_PASSWORD not found in .env file" -ForegroundColor Red
    Write-Host "   [TIP] Please set DB_PASSWORD in your .env file" -ForegroundColor Yellow
    exit 1
}

if (-not $dbName) {
    $dbName = "exped360_local"
    Write-Host "   [INFO] Using default database name: exped360_local" -ForegroundColor Yellow
}

Write-Host "   Username: $dbUsername" -ForegroundColor White
Write-Host "   Database: $dbName" -ForegroundColor White

# Create SQL script
Write-Host ""
Write-Host "Step 4: Creating database..." -ForegroundColor Yellow
$sqlScript = @"
CREATE DATABASE IF NOT EXISTS \`$dbName\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES LIKE '$dbName';
"@

$tempSqlFile = Join-Path $env:TEMP "create_db_$(Get-Date -Format 'yyyyMMddHHmmss').sql"
$sqlScript | Out-File -FilePath $tempSqlFile -Encoding UTF8

# Execute SQL using mysql command
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $mysqlPath)) {
    # Try alternative paths
    $mysqlPath = "mysql.exe"
}

Write-Host "   Executing SQL script..." -ForegroundColor White
try {
    $mysqlArgs = "-u", $dbUsername, "-p$dbPassword", "-e", "CREATE DATABASE IF NOT EXISTS \`$dbName\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    $process = Start-Process -FilePath $mysqlPath -ArgumentList $mysqlArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$env:TEMP\mysql_output.txt" -RedirectStandardError "$env:TEMP\mysql_error.txt"
    
    if ($process.ExitCode -eq 0) {
        Write-Host "   [OK] Database '$dbName' created successfully!" -ForegroundColor Green
        
        # Verify database exists
        Write-Host ""
        Write-Host "Step 5: Verifying database..." -ForegroundColor Yellow
        $verifyArgs = "-u", $dbUsername, "-p$dbPassword", "-e", "SHOW DATABASES LIKE '$dbName';"
        $verifyProcess = Start-Process -FilePath $mysqlPath -ArgumentList $verifyArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$env:TEMP\mysql_verify.txt"
        
        if ($verifyProcess.ExitCode -eq 0) {
            $verifyOutput = Get-Content "$env:TEMP\mysql_verify.txt" -ErrorAction SilentlyContinue
            if ($verifyOutput -match $dbName) {
                Write-Host "   [OK] Database verified and exists!" -ForegroundColor Green
            }
        }
    } else {
        $errorOutput = Get-Content "$env:TEMP\mysql_error.txt" -ErrorAction SilentlyContinue
        Write-Host "   [FAIL] Failed to create database" -ForegroundColor Red
        Write-Host "   Error: $errorOutput" -ForegroundColor Red
        
        # Try alternative method
        Write-Host ""
        Write-Host "   Trying alternative method..." -ForegroundColor Yellow
        Write-Host "   Please run this command manually:" -ForegroundColor White
        Write-Host "   mysql -u $dbUsername -p" -ForegroundColor Gray
        Write-Host "   Then run: CREATE DATABASE $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [FAIL] Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Manual steps:" -ForegroundColor Yellow
    Write-Host "   1. Open Command Prompt or PowerShell" -ForegroundColor White
    Write-Host "   2. Run: mysql -u $dbUsername -p" -ForegroundColor Gray
    Write-Host "   3. Enter your password: $dbPassword" -ForegroundColor Gray
    Write-Host "   4. Run: CREATE DATABASE $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor Gray
    Write-Host "   5. Run: EXIT;" -ForegroundColor Gray
}

# Cleanup
Remove-Item $tempSqlFile -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\mysql_*.txt" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "===============================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your NestJS application: npm run start:dev" -ForegroundColor White
Write-Host "2. The app will automatically create tables if auto-migration is enabled" -ForegroundColor White

