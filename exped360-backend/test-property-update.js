const axios = require('axios');

// Test property update without viewCount
async function testPropertyUpdate() {
  try {
    const baseURL = 'http://localhost:3000/api';
    
    // First, get a property to update
    console.log('🔍 Fetching properties...');
    const propertiesResponse = await axios.get(`${baseURL}/properties`);
    const properties = propertiesResponse.data;
    
    if (properties.length === 0) {
      console.log('❌ No properties found to test with');
      return;
    }
    
    const propertyToUpdate = properties[0];
    console.log(`✅ Found property: ${propertyToUpdate.title}`);
    
    // Test update data (without viewCount)
    const updateData = {
      title: `${propertyToUpdate.title} (Updated)`,
      description: propertyToUpdate.description,
      price: propertyToUpdate.price,
      type: propertyToUpdate.type,
      transactionType: propertyToUpdate.transactionType,
      bedrooms: propertyToUpdate.bedrooms,
      bathrooms: propertyToUpdate.bathrooms,
      surface: propertyToUpdate.surface,
      wilaya: propertyToUpdate.wilaya,
      city: propertyToUpdate.city,
      address: propertyToUpdate.address,
      // Note: viewCount is intentionally NOT included
    };
    
    console.log('🔄 Testing property update...');
    console.log('📤 Update data:', JSON.stringify(updateData, null, 2));
    
    // This should work now without the viewCount error
    const updateResponse = await axios.patch(`${baseURL}/properties/${propertyToUpdate.id}`, updateData);
    
    console.log('✅ Property update successful!');
    console.log('📥 Updated property:', JSON.stringify(updateResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing property update:', error.response?.data || error.message);
  }
}

// Test property update WITH viewCount (should also work now)
async function testPropertyUpdateWithViewCount() {
  try {
    const baseURL = 'http://localhost:3000/api';
    
    console.log('\n🔍 Fetching properties for viewCount test...');
    const propertiesResponse = await axios.get(`${baseURL}/properties`);
    const properties = propertiesResponse.data;
    
    if (properties.length === 0) {
      console.log('❌ No properties found to test with');
      return;
    }
    
    const propertyToUpdate = properties[0];
    
    // Test update data WITH viewCount
    const updateDataWithViewCount = {
      title: `${propertyToUpdate.title} (ViewCount Test)`,
      description: propertyToUpdate.description,
      price: propertyToUpdate.price,
      type: propertyToUpdate.type,
      transactionType: propertyToUpdate.transactionType,
      bedrooms: propertyToUpdate.bedrooms,
      bathrooms: propertyToUpdate.bathrooms,
      surface: propertyToUpdate.surface,
      wilaya: propertyToUpdate.wilaya,
      city: propertyToUpdate.city,
      address: propertyToUpdate.address,
      viewCount: 999, // This should now be accepted
    };
    
    console.log('🔄 Testing property update with viewCount...');
    console.log('📤 Update data with viewCount:', JSON.stringify(updateDataWithViewCount, null, 2));
    
    const updateResponse = await axios.patch(`${baseURL}/properties/${propertyToUpdate.id}`, updateDataWithViewCount);
    
    console.log('✅ Property update with viewCount successful!');
    console.log('📥 Updated property:', JSON.stringify(updateResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing property update with viewCount:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Testing Property Update Fix');
  console.log('================================');
  
  await testPropertyUpdate();
  await testPropertyUpdateWithViewCount();
  
  console.log('\n🎉 Tests completed!');
}

runTests();
