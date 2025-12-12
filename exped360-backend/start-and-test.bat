@echo off
echo ========================================
echo   Backend Startup and Test Script
echo ========================================
echo.

echo 1. Checking environment...
if not exist .env (
    echo ❌ .env file not found! Please create it from env.example
    pause
    exit /b 1
) else (
    echo ✅ .env file found
)

echo.
echo 2. Installing dependencies...
call npm install

echo.
echo 3. Starting backend server...
echo    Press Ctrl+C to stop the server when done testing
echo.

start "Backend Server" cmd /k "npm run start:dev"

echo.
echo 4. Waiting for server to start...
timeout /t 10 /nobreak > nul

echo.
echo 5. Testing endpoints...

echo Testing health endpoint...
curl -s http://localhost:3000/api/health > nul
if %errorlevel% equ 0 (
    echo ✅ Health endpoint working
) else (
    echo ❌ Health endpoint failed
)

echo.
echo Testing upload endpoint...
echo This will test with a small generated image...
node test-upload-simple.js

echo.
echo ========================================
echo Backend is running in separate window
echo Close that window when you're done testing
echo ========================================
echo.
echo Next steps:
echo 1. Start your frontend: cd ../exped360-main-work && npm run dev
echo 2. Login to admin area
echo 3. Test property creation with images
echo 4. Use debug-auth.html for detailed debugging
echo.
pause
