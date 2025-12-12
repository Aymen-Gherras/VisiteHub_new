@echo off
echo 🚀 Cloudinary Setup Testing Script
echo ==================================

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found!
    echo Please create a .env file with your Cloudinary credentials:
    echo CLOUDINARY_CLOUD_NAME=your_cloud_name
    echo CLOUDINARY_API_KEY=your_api_key
    echo CLOUDINARY_API_SECRET=your_api_secret
    echo CLOUDINARY_NOTIFICATION_URL=https://your-domain.com/api/cloudinary/webhook
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
)

echo.
echo 1️⃣  Running unit tests...
npm test -- --testPathPattern=cloudinary --passWithNoTests

echo.
echo 2️⃣  Running integration tests...
npm run test:e2e -- --testPathPattern=cloudinary --passWithNoTests

echo.
echo 3️⃣  Running manual Cloudinary test...
node test-cloudinary.js

echo.
echo ✅ Testing completed!
echo.
echo 📋 Next steps:
echo 1. Start your application: npm run start:dev
echo 2. Open test-upload.html in your browser
echo 3. Test the upload functionality manually
echo.
echo 📖 For more information, see CLOUDINARY_TESTING.md
pause
