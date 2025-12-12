const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testDemandeUpload() {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', 'Test User');
    formData.append('email', 'test@example.com');
    formData.append('phone', '+213123456789');
    formData.append('propertyType', 'apartment');
    formData.append('propertyLocation', 'Alger');
    formData.append('propertyIntention', 'sell');
    formData.append('message', 'Test demande with images');
    formData.append('whatsappContact', 'true');
    formData.append('emailContact', 'true');
    
    // Create a test image file (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    if (!fs.existsSync(testImagePath)) {
      // Create a minimal PNG file if it doesn't exist
      const pngData = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x01, // width: 1
        0x00, 0x00, 0x00, 0x01, // height: 1
        0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
        0x90, 0x77, 0x53, 0xDE, // CRC
        0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
        0xE2, 0x21, 0xBC, 0x33, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
      ]);
      fs.writeFileSync(testImagePath, pngData);
    }
    
    // Add image file
    formData.append('images', fs.createReadStream(testImagePath));
    
    console.log('Testing demande creation with images...');
    console.log('Form data fields:', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+213123456789',
      propertyType: 'apartment',
      propertyLocation: 'Alger',
      propertyIntention: 'sell',
      message: 'Test demande with images',
      whatsappContact: 'true',
      emailContact: 'true'
    });
    console.log('Image file:', testImagePath);
    
    // Make the request
    const response = await fetch('http://localhost:3000/api/demandes/with-images', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders(),
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success! Response:', result);
    } else {
      const error = await response.text();
      console.error('❌ Error:', response.status, response.statusText);
      console.error('Error details:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Make sure the backend server is running on port 3000');
    }
  }
}

// Run the test
testDemandeUpload();
