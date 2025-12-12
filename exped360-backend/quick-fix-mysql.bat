@echo off
REM Quick fix script for MySQL startup issues
REM Run this as Administrator

echo ========================================
echo MySQL Service Quick Fix
echo ========================================
echo.

echo Checking MySQL service status...
sc query MySQL80
echo.

echo Attempting to start MySQL using net command...
net start MySQL80
echo.

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] MySQL started successfully!
    echo.
    echo Waiting 3 seconds to verify...
    timeout /t 3 /nobreak >nul
    echo.
    sc query MySQL80
) else (
    echo [FAILED] Could not start MySQL
    echo.
    echo Common solutions:
    echo 1. Check MySQL error log: C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err
    echo 2. Verify MySQL data directory exists
    echo 3. Check Windows Event Viewer for detailed errors
    echo 4. Try repairing MySQL installation from Windows Settings
    echo.
    echo To view error log, run:
    echo   type "C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err" ^| more
)

echo.
echo ========================================
pause

