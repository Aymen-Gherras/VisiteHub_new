@echo off
echo ========================================
echo   REAL BACKEND SETUP SCRIPT
echo ========================================
echo.
echo This script will help you set up the real NestJS backend with database.
echo.

REM Check if .env file exists
if exist .env (
    echo ✅ .env file found
) else (
    echo ❌ .env file not found
    echo Creating .env file from template...
    copy env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file with your database credentials:
    echo    - DB_USERNAME (your MySQL username)
    echo    - DB_PASSWORD (your MySQL password) 
    echo    - DB_DATABASE (your database name)
    echo    - JWT_SECRET (a secure random string)
    echo.
    echo After editing .env, run this script again.
    pause
    exit /b 1
)

echo Checking database connection...
echo.

REM Try to start the server
echo Starting NestJS backend server...
echo This may take a moment to compile TypeScript...
echo.
npm run start:dev

pause
