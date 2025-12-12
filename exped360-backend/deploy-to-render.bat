@echo off
echo 🚀 Exped360 Backend Deployment to Render
echo ========================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ No remote origin found. Please add your GitHub repository:
    echo    git remote add origin https://github.com/yourusername/your-repo.git
    pause
    exit /b 1
)

echo ✅ Git repository configured

REM Check if all dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Build the project
echo 🔨 Building the project...
npm run build

if errorlevel 1 (
    echo ❌ Build failed. Please fix the errors and try again.
    pause
    exit /b 1
) else (
    echo ✅ Build successful
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  No .env file found. Please create one based on env.example
    echo    copy env.example .env
    echo    Then edit .env with your local development values
)

echo.
echo 🎉 Ready for Render deployment!
echo.
echo Next steps:
echo 1. Push your code to GitHub:
echo    git add .
echo    git commit -m "Prepare for Render deployment"
echo    git push origin main
echo.
echo 2. Follow the deployment guide in RENDER_DEPLOYMENT.md
echo.
echo 3. Don't forget to set up your Cloudinary account for image uploads
echo.
echo Good luck! 🚀
pause
