@echo off
REM Batch script to create exped360_local database
REM This reads credentials from .env file

echo ========================================
echo Creating exped360_local Database
echo ========================================
echo.

REM Check if MySQL is in PATH or use full path
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
if not exist "%MYSQL_PATH%" (
    set MYSQL_PATH=mysql.exe
)

echo Step 1: Reading credentials from .env file...
for /f "tokens=2 delims==" %%a in ('findstr /b "DB_USERNAME=" .env') do set DB_USER=%%a
for /f "tokens=2 delims==" %%a in ('findstr /b "DB_PASSWORD=" .env') do set DB_PASS=%%a
for /f "tokens=2 delims==" %%a in ('findstr /b "DB_DATABASE=" .env') do set DB_NAME=%%a

if "%DB_USER%"=="" set DB_USER=root
if "%DB_NAME%"=="" set DB_NAME=exped360_local

echo    Username: %DB_USER%
echo    Database: %DB_NAME%
echo.

if "%DB_PASS%"=="" (
    echo [FAIL] DB_PASSWORD not found in .env file
    echo [TIP] Please set DB_PASSWORD in your .env file
    pause
    exit /b 1
)

echo Step 2: Creating database...
"%MYSQL_PATH%" -u %DB_USER% -p%DB_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% EQU 0 (
    echo [OK] Database created successfully!
    echo.
    echo Step 3: Verifying database...
    "%MYSQL_PATH%" -u %DB_USER% -p%DB_PASS% -e "SHOW DATABASES LIKE '%DB_NAME%';"
    echo.
    echo ========================================
    echo Database creation complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Restart your NestJS application: npm run start:dev
    echo 2. The app will automatically create tables
) else (
    echo [FAIL] Failed to create database
    echo.
    echo Please run manually:
    echo   mysql -u %DB_USER% -p
    echo   Then: CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
)

echo.
pause

