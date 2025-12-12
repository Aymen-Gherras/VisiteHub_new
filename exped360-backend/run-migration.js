const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'exped360_db',
    multipleStatements: true
  });

  try {
    console.log('🔄 Running migration: create-property-owners-and-projects.sql');
    
    const migrationPath = path.join(__dirname, 'migrations', 'create-property-owners-and-projects.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await connection.execute(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Start your NestJS application');
    console.log('2. Call POST /api/property-owners/migrate to populate data');
    console.log('3. Verify the migration worked correctly');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Load environment variables
require('dotenv').config();

runMigration();
