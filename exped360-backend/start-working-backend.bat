@echo off
echo Starting Working Backend Server with Real Data...
cd /d "%~dp0"
echo.
echo Server will run on http://localhost:3002
echo Press Ctrl+C to stop the server
echo.
node working-backend.js
pause
