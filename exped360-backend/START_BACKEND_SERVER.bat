@echo off
title Backend Server for Promoteurs and Agences
color 0A
echo.
echo ========================================
echo   STARTING BACKEND SERVER
echo ========================================
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Starting server on http://localhost:3002
echo.
echo Available endpoints:
echo   - GET  /health
echo   - GET  /admin/promoteurs
echo   - POST /admin/promoteurs  
echo   - GET  /admin/agences
echo   - POST /admin/agences
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
node complete-backend-solution.js
echo.
echo Server stopped.
pause
