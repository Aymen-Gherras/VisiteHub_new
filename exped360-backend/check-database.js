const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  console.log('🔍 Checking Database Configuration...\n');
  
  // Check environment variables
  const requiredEnvVars = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n💡 Please check your .env file');
    return;
  }
  
  console.log('✅ Environment variables found:');
  console.log(`   - DB_HOST: ${process.env.DB_HOST}`);
  console.log(`   - DB_USERNAME: ${process.env.DB_USERNAME}`);
  console.log(`   - DB_DATABASE: ${process.env.DB_DATABASE}`);
  console.log(`   - DB_PASSWORD: ${'*'.repeat(process.env.DB_PASSWORD.length)}`);
  console.log('');
  
  // Test database connection
  try {
    console.log('🔌 Testing database connection...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    
    console.log('✅ Database connection successful!');
    
    // Check if properties table exists
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'properties'",
      [process.env.DB_DATABASE]
    );
    
    if (tables.length > 0) {
      console.log('✅ Properties table found');
      
      // Count existing properties
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM properties');
      console.log(`📊 Existing properties: ${rows[0].count}`);
    } else {
      console.log('⚠️  Properties table not found - will be created on first run');
    }
    
    // Check for new tables
    const newTables = ['promoteurs', 'agences', 'projects'];
    for (const tableName of newTables) {
      const [tableExists] = await connection.execute(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
        [process.env.DB_DATABASE, tableName]
      );
      
      if (tableExists.length > 0) {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`✅ ${tableName} table exists with ${count[0].count} records`);
      } else {
        console.log(`⚠️  ${tableName} table will be created on first run`);
      }
    }
    
    await connection.end();
    
    console.log('\n🚀 Database is ready! You can now start the backend server.');
    console.log('   Run: npm run start:dev');
    
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log(`   Error: ${error.message}`);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if MySQL is running');
    console.log('   2. Verify credentials in .env file');
    console.log('   3. Ensure database exists');
    console.log('   4. Check network connectivity');
  }
}

checkDatabase().catch(console.error);
