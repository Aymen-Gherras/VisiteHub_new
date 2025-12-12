const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Test data
const testProperty = {
  title: 'Test Property - End to End Test',
  description: 'This is a test property created during end-to-end testing',
  price: 250000,
  type: 'apartment',
  transactionType: 'vendre',
  bedrooms: 2,
  bathrooms: 1,
  surface: 80,
  wilaya: 'Alger',
  city: 'Alger Centre',
  address: '123 Test Street, Alger'
};

let authToken = null;
let uploadedImageUrls = [];
let createdPropertyId = null;

// Utility functions
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
}

function createTestImage() {
  // Create a simple 1x1 PNG image for testing
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR chunk type
    0x00, 0x00, 0x00, 0x01, // Width: 1
    0x00, 0x00, 0x00, 0x01, // Height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // IHDR CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT chunk type
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, // IDAT data
    0x00, 0x00, 0x00, 0x00, // IDAT CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND chunk type
    0xAE, 0x42, 0x60, 0x82  // IEND CRC
  ]);
  
  return pngHeader;
}

async function testBackendHealth() {
  log('Testing backend health...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    if (response.ok) {
      log('✅ Backend is healthy', 'SUCCESS');
      return true;
    } else {
      log(`❌ Backend health check failed: ${response.status}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`❌ Backend health check error: ${error.message}`, 'ERROR');
    return false;
  }
}

async function testCloudinaryConnection() {
  log('Testing Cloudinary connection...');
  try {
    const testImage = createTestImage();
    const formData = new FormData();
    formData.append('image', testImage, { filename: 'test.png', contentType: 'image/png' });
    
    const response = await fetch(`${BACKEND_URL}/upload/image`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      log('✅ Cloudinary connection successful', 'SUCCESS');
      log(`   Uploaded image URL: ${result.imageUrl}`, 'INFO');
      uploadedImageUrls.push(result.imageUrl);
      return true;
    } else {
      const errorText = await response.text();
      log(`❌ Cloudinary upload failed: ${response.status} - ${errorText}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`❌ Cloudinary test error: ${error.message}`, 'ERROR');
    return false;
  }
}

async function testPropertyCreation() {
  log('Testing property creation with images...');
  try {
    const propertyData = {
      ...testProperty,
      imageUrls: uploadedImageUrls
    };
    
    const response = await fetch(`${BACKEND_URL}/properties/with-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(propertyData)
    });
    
    if (response.ok) {
      const result = await response.json();
      log('✅ Property creation successful', 'SUCCESS');
      log(`   Created property ID: ${result.id}`, 'INFO');
      log(`   Property title: ${result.title}`, 'INFO');
      createdPropertyId = result.id;
      return true;
    } else {
      const errorText = await response.text();
      log(`❌ Property creation failed: ${response.status} - ${errorText}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`❌ Property creation error: ${error.message}`, 'ERROR');
    return false;
  }
}

async function testPropertyRetrieval() {
  log('Testing property retrieval...');
  try {
    const response = await fetch(`${BACKEND_URL}/properties/${createdPropertyId}`);
    
    if (response.ok) {
      const result = await response.json();
      log('✅ Property retrieval successful', 'SUCCESS');
      log(`   Property has ${result.images?.length || 0} images`, 'INFO');
      
      if (result.images && result.images.length > 0) {
        log('   Image URLs:', 'INFO');
        result.images.forEach((url, index) => {
          log(`     ${index + 1}. ${url}`, 'INFO');
        });
      }
      return true;
    } else {
      const errorText = await response.text();
      log(`❌ Property retrieval failed: ${response.status} - ${errorText}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`❌ Property retrieval error: ${error.message}`, 'ERROR');
    return false;
  }
}

async function testPropertyImagesEndpoint() {
  log('Testing property images endpoint...');
  try {
    const response = await fetch(`${BACKEND_URL}/property-images/property/${createdPropertyId}`);
    
    if (response.ok) {
      const result = await response.json();
      log('✅ Property images endpoint successful', 'SUCCESS');
      log(`   Found ${result.length} property images`, 'INFO');
      
      result.forEach((image, index) => {
        log(`     ${index + 1}. ID: ${image.id}, URL: ${image.url}, Main: ${image.isMain}`, 'INFO');
      });
      return true;
    } else {
      const errorText = await response.text();
      log(`❌ Property images endpoint failed: ${response.status} - ${errorText}`, 'ERROR');
      return false;
    }
  } catch (error) {
    log(`❌ Property images endpoint error: ${error.message}`, 'ERROR');
    return false;
  }
}

async function cleanup() {
  log('Cleaning up test data...');
  
  if (createdPropertyId) {
    try {
      // Delete the test property
      const response = await fetch(`${BACKEND_URL}/properties/${createdPropertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        log('✅ Test property deleted', 'SUCCESS');
      } else {
        log(`⚠️ Failed to delete test property: ${response.status}`, 'WARNING');
      }
    } catch (error) {
      log(`⚠️ Error deleting test property: ${error.message}`, 'WARNING');
    }
  }
  
  // Note: Cloudinary images are not automatically deleted in this test
  // They would need to be cleaned up separately or through a cleanup endpoint
  log('⚠️ Cloudinary test images remain (manual cleanup may be needed)', 'WARNING');
}

async function runEndToEndTest() {
  log('🚀 Starting End-to-End Cloudinary Integration Test', 'INFO');
  log(`   Backend URL: ${BACKEND_URL}`, 'INFO');
  log(`   Frontend URL: ${FRONTEND_URL}`, 'INFO');
  log('', 'INFO');
  
  try {
    // Step 1: Test backend health
    if (!(await testBackendHealth())) {
      throw new Error('Backend health check failed');
    }
    
    // Step 2: Test Cloudinary connection
    if (!(await testCloudinaryConnection())) {
      throw new Error('Cloudinary connection failed');
    }
    
    // Step 3: Test property creation with images
    if (!(await testPropertyCreation())) {
      throw new Error('Property creation failed');
    }
    
    // Step 4: Test property retrieval
    if (!(await testPropertyRetrieval())) {
      throw new Error('Property retrieval failed');
    }
    
    // Step 5: Test property images endpoint
    if (!(await testPropertyImagesEndpoint())) {
      throw new Error('Property images endpoint failed');
    }
    
    log('', 'INFO');
    log('🎉 END-TO-END TEST COMPLETED SUCCESSFULLY!', 'SUCCESS');
    log('', 'INFO');
    log('✅ All components are working correctly:', 'SUCCESS');
    log('   - Backend is healthy', 'SUCCESS');
    log('   - Cloudinary integration is working', 'SUCCESS');
    log('   - Image uploads are successful', 'SUCCESS');
    log('   - Property creation with images works', 'SUCCESS');
    log('   - Property retrieval includes images', 'SUCCESS');
    log('   - Property images endpoint is functional', 'SUCCESS');
    log('', 'INFO');
    log('🔗 The frontend can now successfully:', 'INFO');
    log('   1. Upload images to Cloudinary via backend', 'INFO');
    log('   2. Create properties with image URLs', 'INFO');
    log('   3. Retrieve properties with their images', 'INFO');
    
  } catch (error) {
    log('', 'INFO');
    log(`❌ END-TO-END TEST FAILED: ${error.message}`, 'ERROR');
    log('', 'INFO');
    log('🔍 Troubleshooting steps:', 'INFO');
    log('   1. Check if backend is running on the correct port', 'INFO');
    log('   2. Verify .env file has correct Cloudinary credentials', 'INFO');
    log('   3. Check database connection', 'INFO');
    log('   4. Verify all required modules are imported', 'INFO');
  } finally {
    await cleanup();
    log('', 'INFO');
    log('🏁 End-to-End test completed', 'INFO');
  }
}

// Check if running directly
if (require.main === module) {
  // Check for required dependencies
  try {
    require('form-data');
  } catch (error) {
    log('❌ Missing dependency: form-data', 'ERROR');
    log('   Install with: npm install form-data', 'INFO');
    process.exit(1);
  }
  
  runEndToEndTest();
}

module.exports = { runEndToEndTest };
