/**
 * Script to fix the nearby_places index issue before starting the application
 * 
 * This script fixes the index conflict that prevents TypeORM from starting.
 * Run this script once before starting your application.
 * 
 * Usage: node fix-index-issue.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixIndexIssue() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'exped360_local',
    });

    console.log('🔧 Fixing nearby_places index issue...');

    const dbName = process.env.DB_DATABASE || 'exped360_local';
    
    // Step 1: Find the foreign key constraint name
    const [fkInfo] = await connection.execute(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'nearby_places' 
        AND COLUMN_NAME = 'property_id' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
      LIMIT 1
    `, [dbName]);

    if (fkInfo && fkInfo.length > 0) {
      const fkName = fkInfo[0].CONSTRAINT_NAME;
      console.log(`   Found foreign key: ${fkName}`);

      // Step 2: Check if the problematic index exists
      const [indexCheck] = await connection.execute(`
        SELECT INDEX_NAME 
        FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = ? 
          AND TABLE_NAME = 'nearby_places' 
          AND INDEX_NAME = 'IDX_4d8271c278b9fd53057ee76956'
      `, [dbName]);

      if (indexCheck && indexCheck.length > 0) {
        console.log('   Dropping foreign key constraint...');
        await connection.execute(`ALTER TABLE nearby_places DROP FOREIGN KEY \`${fkName}\``);

        console.log('   Dropping old TypeORM-generated index...');
        await connection.execute(`DROP INDEX \`IDX_4d8271c278b9fd53057ee76956\` ON nearby_places`);

        console.log('   Recreating foreign key constraint...');
        await connection.execute(`
          ALTER TABLE nearby_places 
          ADD CONSTRAINT fk_nearby_places_property 
          FOREIGN KEY (property_id) 
          REFERENCES properties(id) 
          ON DELETE CASCADE
        `);

        // Step 3: Ensure the composite index exists
        const [compositeIndexCheck] = await connection.execute(`
          SELECT INDEX_NAME 
          FROM INFORMATION_SCHEMA.STATISTICS 
          WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'nearby_places' 
            AND INDEX_NAME = 'idx_nearby_places_display_order'
        `, [dbName]);

        if (!compositeIndexCheck || compositeIndexCheck.length === 0) {
          console.log('   Creating composite index...');
          await connection.execute(`
            CREATE INDEX idx_nearby_places_display_order 
            ON nearby_places (property_id, display_order)
          `);
        }

        console.log('✅ Fixed nearby_places index issue successfully!');
        console.log('   You can now start your application.');
      } else {
        console.log('✅ Index issue not found - database is already fixed.');
      }
    } else {
      console.log('⚠️  No foreign key constraint found. The table might not exist yet.');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error fixing index issue:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Run the fix
fixIndexIssue();

