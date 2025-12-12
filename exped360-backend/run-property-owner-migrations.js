const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration - update with your credentials
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || process.env.DB_NAME || 'exped360_db',
  multipleStatements: true
};

async function runMigrations() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // List of migration files in order
    const migrations = [
      '001-create-property-owners-table.sql',
      '002-create-projects-table.sql', 
      '003-add-property-relationships.sql',
      '004-migrate-existing-data.sql'
    ];

    console.log('\n🚀 Starting Property Owner & Project Migrations...\n');

    for (const migrationFile of migrations) {
      const migrationPath = path.join(__dirname, 'migrations', migrationFile);
      
      try {
        console.log(`📄 Running migration: ${migrationFile}`);
        
        // Read migration file
        const migrationSQL = await fs.readFile(migrationPath, 'utf8');
        
        // Execute migration
        await connection.execute(migrationSQL);
        
        console.log(`✅ Migration ${migrationFile} completed successfully`);
        
      } catch (error) {
        console.error(`❌ Error running migration ${migrationFile}:`, error.message);
        throw error;
      }
    }

    // Verify the migrations
    console.log('\n🔍 Verifying migrations...');
    
    // Check if tables were created
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('property_owners', 'projects')
    `, [dbConfig.database]);
    
    console.log('📊 Created tables:', tables.map(t => t.TABLE_NAME));
    
    // Check if property owners were migrated
    const [ownerCount] = await connection.execute('SELECT COUNT(*) as count FROM property_owners');
    console.log(`👥 Property owners migrated: ${ownerCount[0].count}`);
    
    // Check if properties were linked
    const [linkedCount] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE propertyOwnerId IS NOT NULL
    `);
    console.log(`🔗 Properties linked to owners: ${linkedCount[0].count}`);
    
    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test the new API endpoints');
    console.log('3. Update your admin interface');
    console.log('4. Create property owner profiles with logos');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check database credentials');
    console.error('2. Ensure database exists');
    console.error('3. Check for existing table conflicts');
    console.error('4. Verify MySQL permissions');
    process.exit(1);
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run migrations
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
