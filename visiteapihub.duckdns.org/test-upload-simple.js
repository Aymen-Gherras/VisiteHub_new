const FormData = require('form-data');
const fs = require('fs');

// Create a simple test image
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

async function testUpload() {
  console.log('Testing image upload endpoint...');
  
  try {
    const testImage = createTestImage();
    const formData = new FormData();
    formData.append('image', testImage, { filename: 'test.png', contentType: 'image/png' });
    
    console.log('Uploading to: http://localhost:3000/api/upload/image');
    
    const response = await fetch('http://localhost:3000/api/upload/image', {
      method: 'POST',
      body: formData
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful!');
      console.log('Result:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Upload failed:');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Check if running directly
if (require.main === module) {
  testUpload();
}
