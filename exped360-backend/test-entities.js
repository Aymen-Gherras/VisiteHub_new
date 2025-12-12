/**
 * Test script to verify TypeORM entities are properly configured
 * Run with: node test-entities.js
 */

const { DataSource } = require('typeorm');
const path = require('path');

// Simple test configuration
const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '', // Update with your MySQL password
  database: 'exped360_db',
  entities: [
    path.join(__dirname, 'dist/**/*.entity.js')
  ],
  synchronize: false, // Don't auto-sync, just test metadata
  logging: false,
});

async function testEntities() {
  console.log('🧪 Testing TypeORM Entity Configuration...\n');

  try {
    console.log('📋 Initializing DataSource...');
    await AppDataSource.initialize();
    
    console.log('✅ DataSource initialized successfully!');
    console.log('✅ All entity metadata is valid');
    console.log('✅ No index/column mismatches found');
    
    // Get entity metadata
    const entities = AppDataSource.entityMetadatas;
    console.log(`\n📊 Found ${entities.length} entities:`);
    
    entities.forEach(entity => {
      console.log(`  - ${entity.name} (table: ${entity.tableName})`);
      
      // Show indexes
      if (entity.indices.length > 0) {
        entity.indices.forEach(index => {
          console.log(`    📌 Index: [${index.columnNames.join(', ')}]`);
        });
      }
    });
    
    await AppDataSource.destroy();
    
    console.log('\n🎉 Entity test completed successfully!');
    console.log('✅ Server should start without TypeORM errors');
    
  } catch (error) {
    console.error('❌ Entity test failed:', error.message);
    
    if (error.message.includes('Index contains column that is missing')) {
      console.log('\n💡 Fix needed:');
      console.log('  - Add missing foreign key columns to entities');
      console.log('  - Ensure @Column definitions match @Index declarations');
    }
    
    if (error.message.includes('connect')) {
      console.log('\n💡 Database connection issue:');
      console.log('  - Make sure MySQL is running');
      console.log('  - Update database credentials in this script');
      console.log('  - Ensure database "exped360_db" exists');
    }
  }
}

// Run the test
testEntities();
