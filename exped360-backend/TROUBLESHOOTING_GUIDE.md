# 🔧 Troubleshooting Guide: Cloudinary Integration Issues

## 🚨 Current Issue Analysis

Based on your error messages, here are the main issues and solutions:

### Issue 1: `{"message":"Cannot POST /api/upload/image","error":"Not Found","statusCode":404}`

**Cause**: Backend server endpoints are not being registered properly.

**Solutions**:

1. **Check if backend server is running properly:**
   ```bash
   # Stop any existing server
   # Then start fresh
   npm run start:dev
   ```

2. **Verify modules are imported in `app.module.ts`:**
   ```typescript
   // Make sure UploadModule is imported
   imports: [
     // ... other modules
     UploadModule,  // ← This should be present
   ],
   ```

3. **Check if the server logs show any errors:**
   Look for compilation errors or missing dependencies in the console.

### Issue 2: `"property imageUrls should not exist"`

**Cause**: Frontend is sending blob URLs instead of Cloudinary URLs.

**Root Cause**: Image upload fails → Frontend keeps blob URLs → Backend validation fails.

**Solution**: Fix the image upload flow first, then property creation will work.

### Issue 3: Blob URLs in Frontend

**Cause**: Images aren't being uploaded to Cloudinary successfully.

**Solutions**:

1. **Check authentication:**
   - Open browser console in frontend
   - Check if user is logged in: `localStorage.getItem('auth_token')`

2. **Test upload manually:**
   - Open `debug-auth.html` in browser
   - Check auth status
   - Test image upload directly

## 🛠️ Quick Fix Steps

### Step 1: Restart Backend Properly

```bash
# 1. Stop any running backend
# Ctrl+C or close terminal

# 2. Install dependencies (if needed)
npm install

# 3. Check .env file has Cloudinary credentials
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key  
# CLOUDINARY_API_SECRET=your_api_secret

# 4. Start fresh
npm run start:dev

# 5. Verify server starts without errors
# You should see: "Application is running on: http://localhost:3000"
```

### Step 2: Test Backend Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":...}

# Test upload endpoint with a small file
curl -X POST http://localhost:3000/api/upload/image \
  -F "image=@path/to/test-image.jpg"
```

### Step 3: Test Frontend Authentication

1. **Open browser and go to your frontend**
2. **Login to admin area if not already logged in**
3. **Open browser console and check:**
   ```javascript
   // Check if auth token exists
   console.log('Auth token:', localStorage.getItem('auth_token'));
   
   // If no token, you need to login first
   ```

### Step 4: Debug Upload Flow

1. **Open `debug-auth.html` in browser:**
   ```
   http://localhost:3001/debug-auth.html
   ```

2. **Check each step:**
   - ✅ Auth token exists
   - ✅ Upload endpoint works
   - ✅ Property creation works

## 🔍 Detailed Debugging

### Debug Backend Server

```bash
# Check if server is running
netstat -ano | findstr :3000

# Check server logs for errors
npm run start:dev
# Look for any red error messages

# Test specific endpoints
curl http://localhost:3000
curl http://localhost:3000/api
curl http://localhost:3000/api/health
```

### Debug Frontend Upload

1. **Open browser developer tools**
2. **Go to Network tab**
3. **Try uploading an image in property creation**
4. **Look for failed requests**

Common issues:
- **401 Unauthorized**: Need to login first
- **404 Not Found**: Backend not running or wrong URL
- **413 Payload Too Large**: Image too big (max 5MB)
- **400 Bad Request**: Wrong file type or missing file

### Debug Property Creation

1. **Upload images successfully first**
2. **Check that blob URLs are replaced with Cloudinary URLs**
3. **Then try creating property**

## 🎯 Expected Flow

1. **User uploads image** → Frontend calls `/api/upload/image`
2. **Backend uploads to Cloudinary** → Returns Cloudinary URL
3. **Frontend replaces blob URL** → With Cloudinary URL
4. **User creates property** → Frontend sends property data with Cloudinary URLs
5. **Backend saves property** → With image URLs in database

## 🚀 Quick Test Commands

### Test Backend Health:
```bash
curl http://localhost:3000/api/health
```

### Test Image Upload:
```bash
# Create test image file first, then:
curl -X POST http://localhost:3000/api/upload/image \
  -F "image=@test-image.jpg"
```

### Test Property Creation:
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Property",
    "price": 100000,
    "type": "apartment",
    "transactionType": "vendre",
    "surface": 70,
    "wilaya": "Alger",
    "city": "Alger",
    "address": "Test Address",
    "imageUrls": ["https://res.cloudinary.com/your-cloud/image/upload/v123/test.jpg"]
  }'
```

## 🆘 Still Having Issues?

1. **Check the complete logs** in your terminal
2. **Look for specific error messages** (not just 404)
3. **Verify all environment variables** are set correctly
4. **Make sure database is running** and accessible
5. **Check if all npm dependencies** are installed

## 📝 Next Steps After Fixing

1. **Run the comprehensive test:**
   ```bash
   # Windows
   run-end-to-end-test.bat
   
   # Unix/Linux/Mac
   ./run-end-to-end-test.sh
   ```

2. **Test the frontend flow:**
   - Login to admin
   - Go to property creation
   - Upload images
   - Create property
   - Verify images are stored and displayed

---

**The key is to fix the backend server startup first, then test each component step by step!** 🎯
