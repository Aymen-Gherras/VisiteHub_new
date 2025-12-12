@echo off
echo ========================================
echo   End-to-End Cloudinary Test Runner
echo ========================================
echo.

echo Checking dependencies...
npm list form-data >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing form-data dependency...
    npm install form-data
    if %errorlevel% neq 0 (
        echo Failed to install form-data
        pause
        exit /b 1
    )
) else (
    echo form-data is already installed
)

echo.
echo Running end-to-end test...
echo.

node test-end-to-end.js

echo.
echo Test completed. Press any key to exit...
pause >nul
