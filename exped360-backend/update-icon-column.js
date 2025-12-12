const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateIconColumn() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'exped360_local',
    });

    const dbName = process.env.DB_DATABASE || 'exped360_local';
    
    console.log('🔧 Updating nearby_places.icon column to VARCHAR(255)...');
    
    // Check current column type
    const [columnInfo] = await connection.execute(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'nearby_places' 
        AND COLUMN_NAME = 'icon'
    `, [dbName]);

    if (!columnInfo || columnInfo.length === 0) {
      console.log('⚠️  nearby_places.icon column not found. Table might not exist yet.');
      console.log('   This is normal if you haven\'t created any nearby places yet.');
      await connection.end();
      return;
    }

    const currentType = columnInfo[0].COLUMN_TYPE;
    console.log(`   Current column type: ${currentType}`);

    // Check if update is needed
    if (currentType.includes('varchar(255)') || currentType.includes('varchar(256)')) {
      console.log('✅ Icon column is already VARCHAR(255) or larger. No update needed.');
      await connection.end();
      return;
    }

    // Update column
    console.log('   Altering column to VARCHAR(255)...');
    await connection.execute(`
      ALTER TABLE nearby_places 
      MODIFY COLUMN icon VARCHAR(255) NOT NULL DEFAULT '📍'
    `);

    console.log('✅ Successfully updated nearby_places.icon column to VARCHAR(255)!');
    console.log('   The column now supports both emoji icons and SVG filenames.');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error updating icon column:', error.message);
    if (connection) { 
      await connection.end(); 
    }
    process.exit(1);
  }
}

updateIconColumn();

