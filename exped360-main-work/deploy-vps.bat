@echo off
REM VPS Deployment Script for Exped360 Frontend (Windows)
REM This script helps you prepare files for VPS deployment

echo 🚀 Preparing Exped360 Frontend for VPS deployment...

REM Create deployment package
echo Creating deployment package...
if exist deploy-package rmdir /s /q deploy-package
mkdir deploy-package

REM Copy necessary files
echo Copying application files...
xcopy /E /I /Y src deploy-package\src
xcopy /E /I /Y public deploy-package\public
xcopy /E /I /Y .next deploy-package\.next 2>nul
copy package.json deploy-package\
copy package-lock.json deploy-package\
copy next.config.ts deploy-package\
copy tsconfig.json deploy-package\
copy postcss.config.mjs deploy-package\
copy tailwind.config.ts deploy-package 2>nul
copy vps.env.example deploy-package\
copy deploy-vps.sh deploy-package\
copy ecosystem.config.js deploy-package 2>nul

REM Create ecosystem.config.js if it doesn't exist
if not exist deploy-package\ecosystem.config.js (
    echo Creating PM2 ecosystem configuration...
    (
        echo module.exports = {
        echo   apps: [{
        echo     name: 'exped360-frontend',
        echo     script: 'npm',
        echo     args: 'start',
        echo     instances: 'max',
        echo     exec_mode: 'cluster',
        echo     env: {
        echo       NODE_ENV: 'production',
        echo       PORT: 3001
        echo     },
        echo     error_file: './logs/err.log',
        echo     out_file: './logs/out.log',
        echo     log_file: './logs/combined.log',
        echo     time: true,
        echo     max_memory_restart: '1G',
        echo     node_args: '--max-old-space-size=1024'
        echo   }]
        echo };
    ) > deploy-package\ecosystem.config.js
)

echo.
echo ✅ Deployment package created in 'deploy-package' folder
echo.
echo Next steps:
echo 1. Upload the 'deploy-package' folder to your VPS
echo 2. SSH into your VPS
echo 3. Run: chmod +x deploy-vps.sh
echo 4. Run: ./deploy-vps.sh
echo.
echo Don't forget to:
echo - Edit .env.local file with your actual configuration
echo - Update domain name in Nginx configuration
echo - Make sure backend is running on port 3000
echo.
pause
mysql -u exped360-db_usr -p -e "USE exped360-db; SHOW TABLES;"

