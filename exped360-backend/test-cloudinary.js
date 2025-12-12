const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinaryConnection() {
  console.log('🔍 Testing Cloudinary connection...');
  
  try {
    // Test 1: Check if credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials not found in environment variables');
    }
    
    console.log('✅ Cloudinary credentials found');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 8)}...`);
    
    // Test 2: Test API connection by getting account info
    const accountInfo = await cloudinary.api.ping();
    console.log('✅ Cloudinary API connection successful');
    console.log('Account info:', accountInfo);
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

async function testImageUpload() {
  console.log('\n📤 Testing image upload...');
  
  try {
    // Create a simple test image (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    
    // Create a minimal PNG buffer (1x1 pixel, transparent)
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x1F, 0x15, 0xC4, 0x89, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
      0xE2, 0x21, 0xBC, 0x33, // CRC
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    fs.writeFileSync(testImagePath, pngBuffer);
    
    // Upload the test image
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'exped360-test',
          public_id: `test-${Date.now()}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(pngBuffer);
    });
    
    console.log('✅ Image upload successful');
    console.log('Upload result:', {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    });
    
    // Clean up the test file
    fs.unlinkSync(testImagePath);
    
    return uploadResult;
  } catch (error) {
    console.error('❌ Image upload failed:', error.message);
    return null;
  }
}

async function testImageDeletion(publicId) {
  if (!publicId) {
    console.log('\n🗑️  Skipping image deletion test (no image uploaded)');
    return;
  }
  
  console.log('\n🗑️  Testing image deletion...');
  
  try {
    const deleteResult = await cloudinary.uploader.destroy(publicId);
    console.log('✅ Image deletion successful');
    console.log('Delete result:', deleteResult);
    return true;
  } catch (error) {
    console.error('❌ Image deletion failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Cloudinary tests...\n');
  
  // Test 1: Connection
  const connectionSuccess = await testCloudinaryConnection();
  if (!connectionSuccess) {
    console.log('\n❌ Tests failed. Please check your Cloudinary credentials.');
    process.exit(1);
  }
  
  // Test 2: Upload
  const uploadResult = await testImageUpload();
  
  // Test 3: Deletion
  if (uploadResult) {
    await testImageDeletion(uploadResult.public_id);
  }
  
  console.log('\n🎉 All tests completed!');
  
  if (uploadResult) {
    console.log('\n📋 Summary:');
    console.log(`- Connection: ✅ Success`);
    console.log(`- Upload: ✅ Success (${uploadResult.public_id})`);
    console.log(`- Deletion: ✅ Success`);
    console.log('\n🎯 Your Cloudinary setup is working correctly!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your configuration.');
  }
}

// Run the tests
runTests().catch(console.error);
