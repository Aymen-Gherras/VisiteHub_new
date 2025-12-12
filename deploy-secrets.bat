@echo off
set VPS_USER=root
set VPS_IP=213.199.58.144
set PROJECT_DIR=/root/VisiteHub_New
set LOCAL_ENV_FILE=.env

if not exist "%LOCAL_ENV_FILE%" (
    echo Error: %LOCAL_ENV_FILE% not found!
    echo Please create a .env file with your production secrets first.
    echo You can copy .env.example to .env and fill in the values.
    exit /b 1
)

echo Deploying secrets to VPS...

ssh -o StrictHostKeyChecking=no %VPS_USER%@%VPS_IP% "mkdir -p %PROJECT_DIR%"
scp -o StrictHostKeyChecking=no %LOCAL_ENV_FILE% %VPS_USER%@%VPS_IP%:%PROJECT_DIR%/.env

echo Secrets deployed successfully!
pause
