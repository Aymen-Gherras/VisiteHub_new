/**
 * Simple test script to verify the Promoteurs/Agences system is working
 * Run with: node test-promoteurs-system.js
 */

const mysql = require('mysql2/promise');

async function testSystem() {
  console.log('🧪 Testing Promoteurs/Agences System...\n');

  try {
    // Connect to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Update with your MySQL password
      database: 'exped360_db'
    });

    console.log('✅ Database connection successful');

    // Test 1: Check if tables exist
    console.log('\n📋 Test 1: Checking if tables exist...');
    
    const tables = ['promoteurs', 'agences', 'projects'];
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          console.log(`  ✅ Table '${table}' exists`);
        } else {
          console.log(`  ❌ Table '${table}' does not exist`);
        }
      } catch (error) {
        console.log(`  ❌ Error checking table '${table}':`, error.message);
      }
    }

    // Test 2: Check if properties table has new columns
    console.log('\n📋 Test 2: Checking properties table columns...');
    
    const newColumns = ['agenceId', 'promoteurId', 'projectId'];
    for (const column of newColumns) {
      try {
        const [rows] = await connection.execute(`SHOW COLUMNS FROM properties LIKE '${column}'`);
        if (rows.length > 0) {
          console.log(`  ✅ Column '${column}' exists in properties table`);
        } else {
          console.log(`  ❌ Column '${column}' does not exist in properties table`);
        }
      } catch (error) {
        console.log(`  ❌ Error checking column '${column}':`, error.message);
      }
    }

    // Test 3: Count existing data
    console.log('\n📋 Test 3: Counting existing data...');
    
    try {
      const [promoteurs] = await connection.execute('SELECT COUNT(*) as count FROM promoteurs');
      console.log(`  📊 Promoteurs: ${promoteurs[0].count}`);
      
      const [agences] = await connection.execute('SELECT COUNT(*) as count FROM agences');
      console.log(`  📊 Agences: ${agences[0].count}`);
      
      const [projects] = await connection.execute('SELECT COUNT(*) as count FROM projects');
      console.log(`  📊 Projects: ${projects[0].count}`);
      
      const [properties] = await connection.execute('SELECT COUNT(*) as count FROM properties');
      console.log(`  📊 Properties: ${properties[0].count}`);
    } catch (error) {
      console.log(`  ❌ Error counting data:`, error.message);
    }

    // Test 4: Check property owner types
    console.log('\n📋 Test 4: Analyzing property owner types...');
    
    try {
      const [ownerTypes] = await connection.execute(`
        SELECT propertyOwnerType, COUNT(*) as count 
        FROM properties 
        GROUP BY propertyOwnerType
      `);
      
      ownerTypes.forEach(row => {
        console.log(`  📊 ${row.propertyOwnerType}: ${row.count} properties`);
      });
    } catch (error) {
      console.log(`  ❌ Error analyzing owner types:`, error.message);
    }

    // Test 5: Check relationships
    console.log('\n📋 Test 5: Checking relationships...');
    
    try {
      const [linkedToAgences] = await connection.execute(`
        SELECT COUNT(*) as count FROM properties WHERE agenceId IS NOT NULL
      `);
      console.log(`  📊 Properties linked to agences: ${linkedToAgences[0].count}`);
      
      const [linkedToPromoteurs] = await connection.execute(`
        SELECT COUNT(*) as count FROM properties WHERE promoteurId IS NOT NULL
      `);
      console.log(`  📊 Properties linked to promoteurs: ${linkedToPromoteurs[0].count}`);
      
      const [linkedToProjects] = await connection.execute(`
        SELECT COUNT(*) as count FROM properties WHERE projectId IS NOT NULL
      `);
      console.log(`  📊 Properties linked to projects: ${linkedToProjects[0].count}`);
    } catch (error) {
      console.log(`  ❌ Error checking relationships:`, error.message);
    }

    await connection.end();
    
    console.log('\n🎉 System test completed!');
    console.log('\n📝 Next steps:');
    console.log('  1. If tables don\'t exist, run the migration scripts:');
    console.log('     mysql -u root -p exped360_db < migrations/001-create-promoteurs-agences-projects.sql');
    console.log('     mysql -u root -p exped360_db < migrations/002-add-property-relationships.sql');
    console.log('     mysql -u root -p exped360_db < migrations/003-migrate-existing-data.sql');
    console.log('  2. Start the backend: npm run start:dev');
    console.log('  3. Test the admin pages: /admin/promoteurs and /admin/agences');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('  - MySQL is running');
    console.log('  - Database "exped360_db" exists');
    console.log('  - Update the database credentials in this script');
  }
}

// Run the test
testSystem();
