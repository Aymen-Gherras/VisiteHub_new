import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DbAutoMigrateService implements OnModuleInit {
  private readonly logger = new Logger(DbAutoMigrateService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.ensurePropertiesTableColumnsAndIndexes();
      await this.migratePriceColumnToString();
      await this.backfillMissingPropertySlugs();
      await this.ensureSiteSettingsTables();
      await this.ensureFeaturedPropertiesTable();
      await this.ensureHotelsTable();
      await this.ensureRestaurantsTable();
      await this.ensureNearbyPlacesTable();
      await this.ensureBlogPostsTableUtf8mb4();
      // Legacy cleanup (previously removed promotions/projects). Disabled by default.
      if (process.env.AUTO_REMOVE_PROMOTION_PROJECT_COLUMNS === 'true') {
        await this.removePromotionProjectColumns();
      } else {
        this.logger.log('Skipping legacy promotion/project cleanup (AUTO_REMOVE_PROMOTION_PROJECT_COLUMNS != true)');
      }
    } catch (err) {
      this.logger.error('Auto-migration failed', err as any);
      // Do not crash the app; continue running without the new features
    }
  }

  private async ensurePropertiesTableColumnsAndIndexes(): Promise<void> {
    // Ensure slug column exists
    const slugCol = await this.columnExists('properties', 'slug');
    if (!slugCol) {
      this.logger.log('Adding properties.slug column');
      await this.dataSource.query(`ALTER TABLE properties ADD COLUMN slug VARCHAR(255) NULL`);
    }

    // Ensure isFeatured column exists
    const featuredCol = await this.columnExists('properties', 'isFeatured');
    if (!featuredCol) {
      this.logger.log('Adding properties.isFeatured column');
      await this.dataSource.query(`ALTER TABLE properties ADD COLUMN isFeatured BOOLEAN DEFAULT FALSE`);
    }

    // Ensure unique index on slug
    const slugIdx = await this.indexExists('properties', 'idx_properties_slug');
    if (!slugIdx) {
      this.logger.log('Creating unique index idx_properties_slug');
      await this.dataSource.query(`CREATE UNIQUE INDEX idx_properties_slug ON properties(slug)`);
    }

    // Ensure index on isFeatured
    const featuredIdx = await this.indexExists('properties', 'idx_properties_is_featured');
    if (!featuredIdx) {
      this.logger.log('Creating index idx_properties_is_featured');
      await this.dataSource.query(`CREATE INDEX idx_properties_is_featured ON properties(isFeatured)`);
    }

    // Ensure rentPeriod column exists
    const rentPeriodCol = await this.columnExists('properties', 'rentPeriod');
    if (!rentPeriodCol) {
      this.logger.log('Adding properties.rentPeriod column');
      await this.dataSource.query(`ALTER TABLE properties ADD COLUMN rentPeriod ENUM('month', 'day') DEFAULT 'month' COMMENT 'Rent period for rental properties (month or day)'`);
    }

    // Ensure index on rentPeriod
    const rentPeriodIdx = await this.indexExists('properties', 'idx_properties_rent_period');
    if (!rentPeriodIdx) {
      this.logger.log('Creating index idx_properties_rent_period');
      await this.dataSource.query(`CREATE INDEX idx_properties_rent_period ON properties(rentPeriod)`);
    }

    // Update existing rental properties to have default 'month' period
    const existingRentals = await this.dataSource.query(`SELECT COUNT(*) as count FROM properties WHERE transactionType = 'location' AND rentPeriod IS NULL`);
    if (existingRentals[0]?.count > 0) {
      this.logger.log(`Updating ${existingRentals[0].count} existing rental properties to have 'month' period`);
      await this.dataSource.query(`UPDATE properties SET rentPeriod = 'month' WHERE transactionType = 'location' AND rentPeriod IS NULL`);
    }

    // Ensure propertyOwnerType column exists
    const ownerTypeCol = await this.columnExists('properties', 'propertyOwnerType');
    if (!ownerTypeCol) {
      this.logger.log('Adding properties.propertyOwnerType column');
      try {
        await this.dataSource.query(
          `ALTER TABLE properties ADD COLUMN propertyOwnerType VARCHAR(255) NOT NULL DEFAULT 'Particulier'`
        );
        await this.dataSource.query(`UPDATE properties SET propertyOwnerType = 'Particulier' WHERE propertyOwnerType IS NULL OR propertyOwnerType = ''`);
        this.logger.log('✅ Added propertyOwnerType column');
      } catch (alterError: any) {
        this.logger.error(`❌ Error adding propertyOwnerType column: ${alterError.message}`);
      }
    }

    // Ensure index on propertyOwnerType for filtering
    const ownerTypeIdx = await this.indexExists('properties', 'idx_properties_owner_type');
    if (!ownerTypeIdx) {
      this.logger.log('Creating index idx_properties_owner_type');
      try {
        await this.dataSource.query(`CREATE INDEX idx_properties_owner_type ON properties(propertyOwnerType)`);
      } catch (idxError: any) {
        this.logger.warn(`⚠️  Could not create index on propertyOwnerType: ${idxError.message}`);
      }
    }

    // Ensure propertyOwnerName column exists
    const ownerNameCol = await this.columnExists('properties', 'propertyOwnerName');
    if (!ownerNameCol) {
      this.logger.log('Adding properties.propertyOwnerName column');
      try {
        await this.dataSource.query(
          `ALTER TABLE properties ADD COLUMN propertyOwnerName VARCHAR(255) NULL COMMENT 'Name of agency or promotion company (only for Agence immobilière or Promotion immobilière)'`
        );
        this.logger.log('✅ Added propertyOwnerName column');
      } catch (alterError: any) {
        this.logger.error(`❌ Error adding propertyOwnerName column: ${alterError.message}`);
      }
    }

  }

  private async ensureNearbyPlacesTable(): Promise<void> {
    try {
      const nearbyPlacesTable = await this.tableExists('nearby_places');
      if (!nearbyPlacesTable) {
        this.logger.log('Creating table nearby_places');
        try {
          // Get the exact column definition of properties.id to match it
          const propertyIdInfo = await this.dataSource.query(`
            SELECT 
              COLUMN_TYPE,
              CHARACTER_SET_NAME,
              COLLATION_NAME,
              IS_NULLABLE
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'properties' 
              AND COLUMN_NAME = 'id'
          `);

          if (!propertyIdInfo || propertyIdInfo.length === 0) {
            this.logger.error('❌ Could not find properties.id column definition');
            throw new Error('Could not find properties.id column definition');
          }

          const propertyIdType = propertyIdInfo[0].COLUMN_TYPE; // e.g., 'varchar(36)', 'char(36)', etc.
          const propertyIdCharset = propertyIdInfo[0].CHARACTER_SET_NAME;
          const propertyIdCollation = propertyIdInfo[0].COLLATION_NAME;

          this.logger.log(`Properties.id column type: ${propertyIdType}, charset: ${propertyIdCharset || 'default'}, collation: ${propertyIdCollation || 'default'}`);

          // Use the exact same type as properties.id for both id and property_id
          // MySQL will use the table's default charset/collation unless explicitly specified
          // For foreign keys to work, we need to match the exact column type
          // If properties.id has explicit charset/collation, we need to match it
          let idColumnDef = propertyIdType;
          let propertyIdColumnDef = propertyIdType;
          
          // If the properties.id column has explicit charset/collation, we must match it exactly
          if (propertyIdCharset && propertyIdCollation) {
            idColumnDef = `${propertyIdType} CHARACTER SET ${propertyIdCharset} COLLATE ${propertyIdCollation}`;
            propertyIdColumnDef = `${propertyIdType} CHARACTER SET ${propertyIdCharset} COLLATE ${propertyIdCollation}`;
          }

          await this.dataSource.query(`
            CREATE TABLE nearby_places (
              id ${idColumnDef} NOT NULL PRIMARY KEY,
              property_id ${propertyIdColumnDef} NOT NULL,
              name VARCHAR(255) NOT NULL,
              distance VARCHAR(50) NOT NULL,
              icon VARCHAR(255) DEFAULT '📍' COMMENT 'Icon emoji or SVG filename (e.g., ''📍'' or ''bus.svg'')',
              display_order INT DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
              INDEX idx_nearby_places_display_order (property_id, display_order)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `);
          this.logger.log('✅ Table nearby_places created successfully');
        } catch (createError: any) {
          this.logger.error('❌ Failed to create nearby_places table:', createError.message);
          this.logger.error('Error details:', createError);
          // Don't throw - let the app continue, but log the error
        }
      } else {
        this.logger.log('Table nearby_places already exists');
        // Table exists, ensure icon column exists (for older tables that might not have it)
        const iconCol = await this.columnExists('nearby_places', 'icon');
        if (!iconCol) {
          this.logger.log('Adding nearby_places.icon column');
          try {
            // NOTE: nearby_places may be utf8mb3 in older schemas; emoji defaults require utf8mb4.
            await this.dataSource.query(
              `ALTER TABLE nearby_places ADD COLUMN icon VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '📍' COMMENT 'Icon emoji or SVG filename (e.g., ''📍'' or ''bus.svg'')'`,
            );
            
            // Set default icon for existing records
            await this.dataSource.query(`UPDATE nearby_places SET icon = '📍' WHERE icon IS NULL`);
            this.logger.log('✅ Added icon column to nearby_places table');
          } catch (alterError: any) {
            this.logger.error('❌ Failed to add icon column to nearby_places table:', alterError.message);
            // Don't throw - this is not critical
          }
        }
        
        // Ensure display_order column exists (for older tables that might not have it)
        const displayOrderCol = await this.columnExists('nearby_places', 'display_order');
        if (!displayOrderCol) {
          this.logger.log('Adding nearby_places.display_order column');
          try {
            await this.dataSource.query(`ALTER TABLE nearby_places ADD COLUMN display_order INT DEFAULT 0`);
            this.logger.log('✅ Added display_order column to nearby_places table');
          } catch (alterError: any) {
            this.logger.error('❌ Failed to add display_order column to nearby_places table:', alterError.message);
            // Don't throw - this is not critical
          }
        }
        
        // Update icon column from VARCHAR(10) to VARCHAR(255) to support SVG filenames
        await this.updateIconColumnSize();
        
        // Fix index issue: Check if the problematic TypeORM-generated index exists
        await this.fixNearbyPlacesIndexIssue();
      }
    } catch (error: any) {
      this.logger.error('❌ Error in ensureNearbyPlacesTable:', error.message);
      this.logger.error('Error stack:', error.stack);
      // Don't throw - let the app continue, but log the error
    }
  }

  /**
   * Updates the icon column from VARCHAR(10) to VARCHAR(255) to support both emoji and SVG filenames.
   * This is safe and non-destructive - it only increases the column size.
   */
  private async updateIconColumnSize(): Promise<void> {
    try {
      // Check current column type
      const columnInfo = await this.dataSource.query(`
        SELECT COLUMN_TYPE, CHARACTER_MAXIMUM_LENGTH 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'nearby_places' 
          AND COLUMN_NAME = 'icon'
      `);

      if (!columnInfo || columnInfo.length === 0) {
        // Column doesn't exist yet, it will be created with VARCHAR(255) by TypeORM
        this.logger.log('ℹ️  Icon column does not exist yet, will be created with VARCHAR(255)');
        return;
      }

      const currentType = columnInfo[0].COLUMN_TYPE;
      const currentMaxLength = columnInfo[0].CHARACTER_MAXIMUM_LENGTH;

      // Check if update is needed (if it's VARCHAR(10) or smaller)
      if (currentType.includes('varchar(255)') || currentType.includes('varchar(256)')) {
        this.logger.log('✅ Icon column is already VARCHAR(255) or larger, no update needed');
        return;
      }

      // If it's VARCHAR(10) or smaller, update it
      if (currentType.includes('varchar') && currentMaxLength && currentMaxLength < 255) {
        this.logger.log(`🔄 Updating icon column from ${currentType} to VARCHAR(255) to support SVG filenames...`);
        this.logger.log('   ⚠️  PRODUCTION SAFE: This only increases column size, no data will be lost');
        
        try {
          // Get current column definition to preserve NOT NULL and DEFAULT
          const fullColumnInfo = await this.dataSource.query(`
            SELECT COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'nearby_places' 
              AND COLUMN_NAME = 'icon'
          `);

          const isNullable = fullColumnInfo[0].IS_NULLABLE === 'YES';
          const defaultValue = fullColumnInfo[0].COLUMN_DEFAULT || "'📍'";
          const nullableStr = isNullable ? 'NULL' : 'NOT NULL';
          const defaultStr = defaultValue ? `DEFAULT ${defaultValue}` : '';

          // Update column size
          await this.dataSource.query(`
            ALTER TABLE nearby_places 
            MODIFY COLUMN icon VARCHAR(255) ${nullableStr} ${defaultStr} 
            COMMENT 'Icon emoji or SVG filename (e.g., ''📍'' or ''bus.svg'')'
          `);

          this.logger.log('✅ Successfully updated icon column to VARCHAR(255)');
          this.logger.log('   The column now supports both emoji icons and SVG filenames');
        } catch (alterError: any) {
          this.logger.error(`❌ Error updating icon column size: ${alterError.message}`);
          // Don't throw - allow app to continue, but log the error
        }
      } else {
        this.logger.log(`ℹ️  Icon column has unexpected type: ${currentType}, skipping size update`);
      }
    } catch (error: any) {
      this.logger.warn(`⚠️  Could not update icon column size: ${error.message}`);
      // Don't throw - this is not critical, app can continue
    }
  }

  /**
   * Fixes the index issue where TypeORM tries to drop an index that's needed by a foreign key.
   * This method drops the old TypeORM-generated index and recreates the foreign key properly.
   */
  private async fixNearbyPlacesIndexIssue(): Promise<void> {
    try {
      // Check if the problematic index exists
      const indexCheck = await this.dataSource.query(`
        SELECT INDEX_NAME 
        FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'nearby_places' 
          AND INDEX_NAME = 'IDX_4d8271c278b9fd53057ee76956'
      `);

      if (indexCheck && indexCheck.length > 0) {
        this.logger.log('🔧 Fixing nearby_places index issue...');
        
        // Find the foreign key constraint name
        const fkInfo = await this.dataSource.query(`
          SELECT CONSTRAINT_NAME 
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
          WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'nearby_places' 
            AND COLUMN_NAME = 'property_id' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
          LIMIT 1
        `);

        if (fkInfo && fkInfo.length > 0) {
          const fkName = fkInfo[0].CONSTRAINT_NAME;
          
          // Step 1: Drop the foreign key constraint
          this.logger.log(`   Dropping foreign key constraint: ${fkName}`);
          await this.dataSource.query(`ALTER TABLE nearby_places DROP FOREIGN KEY \`${fkName}\``);
          
          // Step 2: Drop the old TypeORM-generated index
          this.logger.log('   Dropping old TypeORM-generated index...');
          await this.dataSource.query(`DROP INDEX \`IDX_4d8271c278b9fd53057ee76956\` ON nearby_places`);
          
          // Step 3: Recreate the foreign key constraint (MySQL will auto-create the index)
          this.logger.log('   Recreating foreign key constraint...');
          await this.dataSource.query(`
            ALTER TABLE nearby_places 
            ADD CONSTRAINT fk_nearby_places_property 
            FOREIGN KEY (property_id) 
            REFERENCES properties(id) 
            ON DELETE CASCADE
          `);
          
          // Step 4: Ensure the composite index exists
          const compositeIndexCheck = await this.dataSource.query(`
            SELECT INDEX_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'nearby_places' 
              AND INDEX_NAME = 'idx_nearby_places_display_order'
          `);
          
          if (!compositeIndexCheck || compositeIndexCheck.length === 0) {
            this.logger.log('   Creating composite index...');
            await this.dataSource.query(`
              CREATE INDEX idx_nearby_places_display_order 
              ON nearby_places (property_id, display_order)
            `);
          }
          
          this.logger.log('✅ Fixed nearby_places index issue');
        }
      }
    } catch (error: any) {
      // Don't throw - this is a fix attempt, not critical
      this.logger.warn(`⚠️  Could not fix nearby_places index issue: ${error.message}`);
      this.logger.warn('   You may need to run the SQL script manually: migrations/fix-nearby-places-index.sql');
    }
  }

  private async ensureSiteSettingsTables(): Promise<void> {
    // homepage_settings
    const settingsTable = await this.tableExists('homepage_settings');
    if (!settingsTable) {
      this.logger.log('Creating table homepage_settings');
      await this.dataSource.query(`
        CREATE TABLE homepage_settings (
          id CHAR(36) NOT NULL PRIMARY KEY,
          maxSlides INT NOT NULL DEFAULT 3,
          maxFeatured INT NOT NULL DEFAULT 6,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      // seed single row
      await this.dataSource.query(`INSERT INTO homepage_settings (id, maxSlides, maxFeatured) VALUES (UUID(), 3, 6)`);
    }
    // ensure maxFeatured column exists if table already existed
    const hasMaxFeatured = await this.columnExists('homepage_settings', 'maxFeatured');
    if (settingsTable && !hasMaxFeatured) {
      this.logger.log('Adding homepage_settings.maxFeatured column');
      await this.dataSource.query(`ALTER TABLE homepage_settings ADD COLUMN maxFeatured INT NOT NULL DEFAULT 6`);
      // no destructive updates; keep default 6
    }

    // homepage_carousel_images
    const imagesTable = await this.tableExists('homepage_carousel_images');
    if (!imagesTable) {
      this.logger.log('Creating table homepage_carousel_images');
      await this.dataSource.query(`
        CREATE TABLE homepage_carousel_images (
          id CHAR(36) NOT NULL PRIMARY KEY,
          imageUrl TEXT NOT NULL,
          altText TEXT NULL,
          linkUrl TEXT NULL,
          mediaType ENUM('image', 'video') NOT NULL DEFAULT 'image',
          ` + '`order`' + ` INT NOT NULL DEFAULT 0,
          isActive BOOLEAN NOT NULL DEFAULT FALSE,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      await this.dataSource.query(`CREATE INDEX idx_homepage_carousel_order ON homepage_carousel_images(` + '`order`' + `)`);
      await this.dataSource.query(`CREATE INDEX idx_homepage_carousel_is_active ON homepage_carousel_images(isActive)`);
    } else {
      // Ensure mediaType column exists (for older tables)
      const hasMediaType = await this.columnExists('homepage_carousel_images', 'mediaType');
      if (!hasMediaType) {
        this.logger.log('Adding homepage_carousel_images.mediaType column');
        try {
          await this.dataSource.query(`
            ALTER TABLE homepage_carousel_images 
            ADD COLUMN mediaType ENUM('image', 'video') NOT NULL DEFAULT 'image'
          `);
          // Set all existing records to 'image' (they were images before)
          await this.dataSource.query(`UPDATE homepage_carousel_images SET mediaType = 'image' WHERE mediaType IS NULL`);
          this.logger.log('✅ Added mediaType column to homepage_carousel_images table');
        } catch (alterError: any) {
          this.logger.error('❌ Failed to add mediaType column to homepage_carousel_images table:', alterError.message);
        }
      }
    }
  }

  private async ensureFeaturedPropertiesTable(): Promise<void> {
    const tableExists = await this.tableExists('featured_properties');
    if (!tableExists) {
      this.logger.log('Creating table featured_properties');
      await this.dataSource.query(`
        CREATE TABLE featured_properties (
          id CHAR(36) NOT NULL PRIMARY KEY,
          propertyId CHAR(36) NOT NULL,
          position INT NOT NULL DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uq_featured_property (propertyId)
        )
      `);
      await this.dataSource.query('CREATE INDEX idx_featured_properties_position ON featured_properties(position)');
      await this.dataSource.query('CREATE INDEX idx_featured_properties_propertyId ON featured_properties(propertyId)');
    }
  }

  private async ensureHotelsTable(): Promise<void> {
    const hotelsTable = await this.tableExists('hotels');
    if (!hotelsTable) {
      this.logger.log('Creating table hotels');
      await this.dataSource.query(`
        CREATE TABLE hotels (
          id VARCHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
          name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          slug VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          wilaya VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          daira VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          iframeUrl TEXT COLLATE utf8mb4_unicode_ci NULL,
          roomsNumber INT DEFAULT NULL,
          starsNumber INT DEFAULT NULL,
          coverImage VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          UNIQUE KEY uq_hotels_name (name),
          UNIQUE KEY uq_hotels_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      return;
    }

    // Ensure columns exist (safe, additive-only)
    if (!(await this.columnExists('hotels', 'wilaya'))) {
      await this.dataSource.query(`ALTER TABLE hotels ADD COLUMN wilaya VARCHAR(255) NULL`);
    }
    if (!(await this.columnExists('hotels', 'daira'))) {
      await this.dataSource.query(`ALTER TABLE hotels ADD COLUMN daira VARCHAR(255) NULL`);
    }
    if (!(await this.columnExists('hotels', 'iframeUrl'))) {
      await this.dataSource.query(`ALTER TABLE hotels ADD COLUMN iframeUrl TEXT NULL`);
    }
    if (!(await this.columnExists('hotels', 'roomsNumber'))) {
      await this.dataSource.query(`ALTER TABLE hotels ADD COLUMN roomsNumber INT NULL`);
    }
    if (!(await this.columnExists('hotels', 'starsNumber'))) {
      await this.dataSource.query(`ALTER TABLE hotels ADD COLUMN starsNumber INT NULL`);
    }
    if (!(await this.columnExists('hotels', 'coverImage'))) {
      await this.dataSource.query(`ALTER TABLE hotels ADD COLUMN coverImage VARCHAR(255) NULL`);
    }

    // Ensure unique indexes (ignore if already present under a different name)
    try {
      if (!(await this.indexExists('hotels', 'uq_hotels_name'))) {
        await this.dataSource.query(`CREATE UNIQUE INDEX uq_hotels_name ON hotels(name)`);
      }
    } catch {
      // ignore
    }
    try {
      if (!(await this.indexExists('hotels', 'uq_hotels_slug'))) {
        await this.dataSource.query(`CREATE UNIQUE INDEX uq_hotels_slug ON hotels(slug)`);
      }
    } catch {
      // ignore
    }
  }

  private async ensureRestaurantsTable(): Promise<void> {
    const restaurantsTable = await this.tableExists('restaurants');
    if (!restaurantsTable) {
      this.logger.log('Creating table restaurants');
      await this.dataSource.query(`
        CREATE TABLE restaurants (
          id VARCHAR(36) COLLATE utf8mb4_unicode_ci NOT NULL,
          name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          slug VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          wilaya VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          daira VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          type VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          iframeUrl TEXT COLLATE utf8mb4_unicode_ci NULL,
          coverImage VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
          createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          UNIQUE KEY uq_restaurants_name (name),
          UNIQUE KEY uq_restaurants_slug (slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      return;
    }

    // Ensure columns exist (safe, additive-only)
    if (!(await this.columnExists('restaurants', 'wilaya'))) {
      await this.dataSource.query(`ALTER TABLE restaurants ADD COLUMN wilaya VARCHAR(255) NULL`);
    }
    if (!(await this.columnExists('restaurants', 'daira'))) {
      await this.dataSource.query(`ALTER TABLE restaurants ADD COLUMN daira VARCHAR(255) NULL`);
    }
    if (!(await this.columnExists('restaurants', 'type'))) {
      await this.dataSource.query(`ALTER TABLE restaurants ADD COLUMN type VARCHAR(255) NULL`);
    }
    if (!(await this.columnExists('restaurants', 'iframeUrl'))) {
      await this.dataSource.query(`ALTER TABLE restaurants ADD COLUMN iframeUrl TEXT NULL`);
    }
    if (!(await this.columnExists('restaurants', 'coverImage'))) {
      await this.dataSource.query(`ALTER TABLE restaurants ADD COLUMN coverImage VARCHAR(255) NULL`);
    }

    // Ensure unique indexes (ignore if already present under a different name)
    try {
      if (!(await this.indexExists('restaurants', 'uq_restaurants_name'))) {
        await this.dataSource.query(`CREATE UNIQUE INDEX uq_restaurants_name ON restaurants(name)`);
      }
    } catch {
      // ignore
    }
    try {
      if (!(await this.indexExists('restaurants', 'uq_restaurants_slug'))) {
        await this.dataSource.query(`CREATE UNIQUE INDEX uq_restaurants_slug ON restaurants(slug)`);
      }
    } catch {
      // ignore
    }
  }

  private slugify(input: string): string {
    const normalized = input
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    return normalized;
  }

  private async migratePriceColumnToString(): Promise<void> {
    try {
      // Check current column type
      const columnInfo = await this.dataSource.query(
        `SELECT COLUMN_TYPE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE 
         FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
           AND TABLE_NAME = 'properties' 
           AND COLUMN_NAME = 'price'`
      );

      if (columnInfo.length === 0) {
        this.logger.warn('Price column not found, skipping migration');
        return;
      }

      const currentType = columnInfo[0].DATA_TYPE;
      const currentColumnType = columnInfo[0].COLUMN_TYPE;
      const currentMaxLength = columnInfo[0].CHARACTER_MAXIMUM_LENGTH;
      const isNullable = columnInfo[0].IS_NULLABLE === 'YES';

      // If already varchar/text/char, check if it needs to be updated (e.g., length too short)
      if (currentType === 'varchar' || currentType === 'text' || currentType === 'char') {
        // Check if VARCHAR length is sufficient (need at least 255 for "1 milliards" type strings)
        if (currentType === 'varchar' && currentMaxLength && currentMaxLength < 255) {
          this.logger.log(`⚠️  Price column is VARCHAR(${currentMaxLength}), but needs to be VARCHAR(255) for full string support`);
          this.logger.log('   Updating column length to VARCHAR(255)...');
          
          try {
            // Update the column length without losing data
            await this.dataSource.query(
              `ALTER TABLE properties MODIFY COLUMN price VARCHAR(255) ${isNullable ? 'NULL' : 'NOT NULL'}`
            );
            this.logger.log('✅ Price column length updated to VARCHAR(255)');
          } catch (alterError: any) {
            this.logger.error(`❌ Error updating column length: ${alterError.message}`);
            // Don't throw - allow app to continue
          }
        } else {
          this.logger.log(`✅ Price column is already a string type (${currentColumnType}), skipping migration`);
        }
        return;
      }

      // If it's a number type (float, double, decimal, int), convert it
      if (currentType === 'float' || currentType === 'double' || currentType === 'decimal' || currentType === 'int' || currentType === 'bigint') {
        this.logger.log('🔄 Migrating price column from number to string...');
        this.logger.log(`   Current column type: ${currentColumnType}`);
        this.logger.log('   ⚠️  PRODUCTION SAFE: This migration preserves all existing data');
        
        // Get count of properties to migrate and sample data for verification
        const countResult = await this.dataSource.query(
          `SELECT COUNT(*) as count FROM properties WHERE price IS NOT NULL`
        );
        const propertyCount = countResult[0]?.count || 0;
        this.logger.log(`   Found ${propertyCount} properties to migrate`);
        
        // Get sample data for verification
        const sampleData = await this.dataSource.query(
          `SELECT id, price FROM properties WHERE price IS NOT NULL LIMIT 5`
        );
        this.logger.log(`   Sample prices before migration: ${JSON.stringify(sampleData.map((r: any) => ({ id: r.id, price: r.price })))}`);
        
        if (propertyCount === 0) {
          this.logger.log('   ⚠️  No properties found with prices, converting column type only...');
          // Still need to convert the column type even if no data
          try {
            await this.dataSource.query(
              `ALTER TABLE properties MODIFY COLUMN price VARCHAR(255) NOT NULL DEFAULT '0'`
            );
            this.logger.log('   ✅ Column type converted to VARCHAR(255)');
          } catch (alterError: any) {
            this.logger.error(`   ❌ Error converting column type: ${alterError.message}`);
            throw alterError;
          }
        } else {
          // Step 1: Check for existing indexes on price column (to preserve them)
          const indexes = await this.dataSource.query(
            `SELECT INDEX_NAME FROM information_schema.STATISTICS 
             WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'properties' 
               AND COLUMN_NAME = 'price'`
          );
          const indexNames = indexes.map((idx: any) => idx.INDEX_NAME);
          this.logger.log(`   Found ${indexNames.length} index(es) on price column: ${indexNames.join(', ')}`);
          
          // Step 2: Create temporary column and copy data as strings
          this.logger.log('   Step 1: Creating temporary column and copying prices as strings...');
          
          try {
            // Check if temp column already exists (from a previous failed migration)
            const tempColExists = await this.columnExists('properties', 'price_temp');
            if (tempColExists) {
              this.logger.log('   ℹ️  Temporary column already exists, cleaning up...');
              await this.dataSource.query(`ALTER TABLE properties DROP COLUMN price_temp`);
            }
            
            // Add temporary VARCHAR column
            await this.dataSource.query(
              `ALTER TABLE properties ADD COLUMN price_temp VARCHAR(255) NULL`
            );
            
            // Copy all prices as strings to temp column using MySQL CAST
            // This preserves the numeric value as a string (e.g., 25000000 -> "25000000")
            await this.dataSource.query(
              `UPDATE properties SET price_temp = CAST(price AS CHAR(255)) WHERE price IS NOT NULL`
            );
            
            // Verify the copy worked by comparing counts and sample data
            const verifyResult = await this.dataSource.query(
              `SELECT COUNT(*) as count FROM properties WHERE price_temp IS NOT NULL`
            );
            const copiedCount = verifyResult[0]?.count || 0;
            this.logger.log(`   ✅ Copied ${copiedCount} prices to temporary column`);
            
            // Verify sample data integrity
            const sampleVerification = await this.dataSource.query(
              `SELECT id, price, price_temp FROM properties WHERE price IS NOT NULL LIMIT 5`
            );
            const allMatch = sampleVerification.every((row: any) => {
              const original = String(row.price);
              const copied = String(row.price_temp);
              return original === copied;
            });
            
            if (allMatch) {
              this.logger.log(`   ✅ Sample data verification passed: ${sampleVerification.length} records match`);
            } else {
              this.logger.warn(`   ⚠️  Sample data verification failed - some values don't match`);
              sampleVerification.forEach((row: any) => {
                this.logger.warn(`      ID ${row.id}: original=${row.price}, copied=${row.price_temp}`);
              });
            }
            
            if (copiedCount !== propertyCount) {
              this.logger.warn(`   ⚠️  Mismatch: expected ${propertyCount} but copied ${copiedCount}`);
            }
          } catch (tempError: any) {
            this.logger.error(`   ❌ Error creating temporary column: ${tempError.message}`);
            throw tempError;
          }
          
          // Step 3: Drop old price column and rename temp column
          this.logger.log('   Step 2: Replacing old column with new VARCHAR column...');
          
          try {
            // Drop indexes on price column first (they'll be recreated if needed)
            for (const indexName of indexNames) {
              if (indexName !== 'PRIMARY') {
                try {
                  this.logger.log(`   Dropping index ${indexName} on price column...`);
                  await this.dataSource.query(`ALTER TABLE properties DROP INDEX ${indexName}`);
                } catch (idxError: any) {
                  this.logger.warn(`   ⚠️  Could not drop index ${indexName}: ${idxError.message}`);
                }
              }
            }
            
            // Drop the old numeric column
            await this.dataSource.query(`ALTER TABLE properties DROP COLUMN price`);
            this.logger.log('   ✅ Dropped old price column');
            
            // Rename temp column to price and make it NOT NULL
            await this.dataSource.query(
              `ALTER TABLE properties CHANGE price_temp price VARCHAR(255) NOT NULL`
            );
            this.logger.log('   ✅ Renamed temporary column to price');
            
            // Set default for any NULL values (shouldn't happen, but just in case)
            await this.dataSource.query(
              `UPDATE properties SET price = '0' WHERE price IS NULL OR price = ''`
            );
            
            // Make sure it's NOT NULL
            await this.dataSource.query(
              `ALTER TABLE properties MODIFY COLUMN price VARCHAR(255) NOT NULL`
            );
            
            // Recreate indexes if they existed (TypeORM will handle the main index)
            // The @Index decorator in the entity will recreate the index automatically
            this.logger.log('   ✅ Column replacement complete');
            
          } catch (alterError: any) {
            this.logger.error(`   ❌ Error replacing column: ${alterError.message}`);
            // Try to restore from temp column if possible
            try {
              const tempColExists = await this.columnExists('properties', 'price_temp');
              if (tempColExists) {
                this.logger.log('   Attempting to restore from temporary column...');
                // Check if price column still exists
                const priceColExists = await this.columnExists('properties', 'price');
                if (!priceColExists) {
                  // Price column was dropped, restore from temp
                  await this.dataSource.query(
                    `ALTER TABLE properties CHANGE price_temp price ${currentColumnType} ${isNullable ? 'NULL' : 'NOT NULL'}`
                  );
                  this.logger.log('   ✅ Restored price column from temporary column');
                }
              }
            } catch (restoreError: any) {
              this.logger.error(`   ❌ Failed to restore: ${restoreError.message}`);
              // Try to clean up temp column if it exists
              try {
                const tempColExists = await this.columnExists('properties', 'price_temp');
                if (tempColExists) {
                  await this.dataSource.query(`ALTER TABLE properties DROP COLUMN price_temp`);
                }
              } catch (cleanupError: any) {
                this.logger.error(`   ⚠️  Failed to clean up temp column: ${cleanupError.message}`);
              }
            }
            throw alterError;
          }
        }

        // Step 4: Verify migration
        this.logger.log('   Step 3: Verifying migration...');
        const verifyColumnInfo = await this.dataSource.query(
          `SELECT COLUMN_TYPE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
           FROM information_schema.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() 
             AND TABLE_NAME = 'properties' 
             AND COLUMN_NAME = 'price'`
        );
        
        if (verifyColumnInfo.length > 0) {
          const newType = verifyColumnInfo[0].DATA_TYPE;
          const newColumnType = verifyColumnInfo[0].COLUMN_TYPE;
          const newMaxLength = verifyColumnInfo[0].CHARACTER_MAXIMUM_LENGTH;
          
          if (newType === 'varchar' || newType === 'text' || newType === 'char') {
            this.logger.log('✅ Price column migration completed successfully!');
            this.logger.log(`   Column type is now: ${newColumnType}`);
            
            // Verify data integrity by checking sample records
            if (propertyCount > 0) {
              const finalSample = await this.dataSource.query(
                `SELECT id, price FROM properties WHERE price IS NOT NULL LIMIT 5`
              );
              this.logger.log(`   Sample prices after migration: ${JSON.stringify(finalSample.map((r: any) => ({ id: r.id, price: r.price, type: typeof r.price })))}`);
              
              // Verify all prices are strings
              const allStrings = finalSample.every((row: any) => typeof row.price === 'string' || row.price === null);
              if (allStrings) {
                this.logger.log(`   ✅ All sample prices are strings`);
              } else {
                this.logger.warn(`   ⚠️  Some prices are not strings: ${JSON.stringify(finalSample.filter((r: any) => typeof r.price !== 'string'))}`);
              }
            }
            
            this.logger.log(`   ✅ All ${propertyCount} property prices have been converted from numbers to strings.`);
            this.logger.log(`   ✅ Column is ready to store full string values like "1 milliards", "600 million", etc.`);
          } else {
            this.logger.error(`❌ Migration verification failed: column type is still ${newType}`);
          }
        } else {
          this.logger.error('❌ Migration verification failed: price column not found');
        }
      } else {
        this.logger.log(`ℹ️  Price column has unexpected type: ${currentType}, skipping migration`);
      }
    } catch (error: any) {
      this.logger.error('❌ Error migrating price column:', error.message);
      this.logger.error('Error stack:', error.stack);
      // Don't throw - allow app to continue, but log the error for debugging
    }
  }

  private async backfillMissingPropertySlugs(): Promise<void> {
    try {
      // Find properties with NULL or empty slug
      const rows: Array<{ id: string; title: string | null }> = await this.dataSource.query(
        `SELECT id, title FROM properties WHERE slug IS NULL OR slug = ''`
      );
      if (!rows || rows.length === 0) return;

      this.logger.log(`Backfilling slugs for ${rows.length} properties`);

      // Build a set of existing slugs to ensure uniqueness
      const existing: Array<{ slug: string }> = await this.dataSource.query(`SELECT slug FROM properties WHERE slug IS NOT NULL AND slug != ''`);
      const used = new Set<string>(existing.map(r => r.slug));

      for (const row of rows) {
        const base = this.slugify(row.title || 'property');
        if (!base) continue;
        let candidate = base;
        let counter = 1;
        while (used.has(candidate)) {
          counter++;
          candidate = `${base}-${counter}`;
        }
        try {
          await this.dataSource.query(`UPDATE properties SET slug = ? WHERE id = ?`, [candidate, row.id]);
          used.add(candidate);
        } catch (e) {
          // Ignore individual failures to avoid blocking startup
        }
      }
    } catch (e) {
      // Non-fatal
      this.logger.warn('Failed to backfill property slugs');
    }
  }

  private async tableExists(table: string): Promise<boolean> {
    const rows = await this.dataSource.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
      [table],
    );
    const cnt = Number(rows?.[0]?.cnt ?? 0);
    return cnt > 0;
  }

  private async columnExists(table: string, column: string): Promise<boolean> {
    const rows = await this.dataSource.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column],
    );
    const cnt = Number(rows?.[0]?.cnt ?? 0);
    return cnt > 0;
  }

  private async indexExists(table: string, indexName: string): Promise<boolean> {
    const rows = await this.dataSource.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
      [table, indexName],
    );
    const cnt = Number(rows?.[0]?.cnt ?? 0);
    return cnt > 0;
  }

  private async ensureBlogPostsTableUtf8mb4(): Promise<void> {
    try {
      const blogTableExists = await this.tableExists('blog_posts');
      if (!blogTableExists) {
        this.logger.log('blog_posts table does not exist yet, skipping charset migration');
        return;
      }

      // Columns that need utf8mb4 for emoji support
      const textColumns = ['title', 'excerpt', 'content', 'author', 'seoTitle', 'seoDescription'];
      
      for (const columnName of textColumns) {
        try {
          // Check current charset
          const columnInfo = await this.dataSource.query(
            `SELECT CHARACTER_SET_NAME, COLLATION_NAME 
             FROM information_schema.COLUMNS 
             WHERE TABLE_SCHEMA = DATABASE() 
               AND TABLE_NAME = 'blog_posts' 
               AND COLUMN_NAME = ?`,
            [columnName]
          );

          if (columnInfo && columnInfo.length > 0) {
            const currentCharset = columnInfo[0].CHARACTER_SET_NAME;
            const currentCollation = columnInfo[0].COLLATION_NAME;

            // If not utf8mb4, convert it
            if (currentCharset !== 'utf8mb4' || !currentCollation?.includes('utf8mb4')) {
              this.logger.log(`Converting blog_posts.${columnName} to utf8mb4 (current: ${currentCharset})`);
              
              // Get column type
              const typeInfo = await this.dataSource.query(
                `SELECT COLUMN_TYPE, IS_NULLABLE 
                 FROM information_schema.COLUMNS 
                 WHERE TABLE_SCHEMA = DATABASE() 
                   AND TABLE_NAME = 'blog_posts' 
                   AND COLUMN_NAME = ?`,
                [columnName]
              );

              if (typeInfo && typeInfo.length > 0) {
                const columnType = typeInfo[0].COLUMN_TYPE;
                const isNullable = typeInfo[0].IS_NULLABLE === 'YES';
                const nullableStr = isNullable ? 'NULL' : 'NOT NULL';

                // Convert to utf8mb4
                await this.dataSource.query(
                  `ALTER TABLE blog_posts MODIFY COLUMN ${columnName} ${columnType} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ${nullableStr}`
                );
                this.logger.log(`✅ Converted blog_posts.${columnName} to utf8mb4`);
              }
            } else {
              this.logger.log(`✅ blog_posts.${columnName} already uses utf8mb4`);
            }
          }
        } catch (colError: any) {
          this.logger.error(`❌ Error converting blog_posts.${columnName} to utf8mb4: ${colError.message}`);
          // Continue with other columns
        }
      }

      // Also ensure the table itself uses utf8mb4
      try {
        const tableInfo = await this.dataSource.query(
          `SELECT TABLE_COLLATION 
           FROM information_schema.TABLES 
           WHERE TABLE_SCHEMA = DATABASE() 
             AND TABLE_NAME = 'blog_posts'`
        );

        if (tableInfo && tableInfo.length > 0) {
          const tableCollation = tableInfo[0].TABLE_COLLATION;
          if (!tableCollation?.includes('utf8mb4')) {
            this.logger.log(`Converting blog_posts table to utf8mb4 (current: ${tableCollation})`);
            await this.dataSource.query(
              `ALTER TABLE blog_posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
            );
            this.logger.log('✅ Converted blog_posts table to utf8mb4');
          } else {
            this.logger.log('✅ blog_posts table already uses utf8mb4');
          }
        }
      } catch (tableError: any) {
        this.logger.error(`❌ Error converting blog_posts table to utf8mb4: ${tableError.message}`);
      }
    } catch (error: any) {
      this.logger.error(`❌ Error in ensureBlogPostsTableUtf8mb4: ${error.message}`);
      // Don't throw - allow app to continue
    }
  }

  /**
   * Removes promotion and project related columns and tables from the database.
   * This method safely drops foreign keys, indexes, columns, and tables.
   */
  private async removePromotionProjectColumns(): Promise<void> {
    try {
      // Step 1: Remove foreign key constraints and columns from properties table
      const promotionIdCol = await this.columnExists('properties', 'promotionId');
      if (promotionIdCol) {
        this.logger.log('Removing promotionId column from properties table...');
        try {
          // Drop foreign key constraint if it exists
          const fkInfo = await this.dataSource.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'properties' 
              AND COLUMN_NAME = 'promotionId' 
              AND REFERENCED_TABLE_NAME IS NOT NULL
            LIMIT 1
          `);
          
          if (fkInfo && fkInfo.length > 0) {
            const fkName = fkInfo[0].CONSTRAINT_NAME;
            await this.dataSource.query(`ALTER TABLE properties DROP FOREIGN KEY \`${fkName}\``);
            this.logger.log(`✅ Dropped foreign key constraint: ${fkName}`);
          }
          
          // Drop the column
          await this.dataSource.query(`ALTER TABLE properties DROP COLUMN promotionId`);
          this.logger.log('✅ Removed promotionId column from properties table');
        } catch (error: any) {
          this.logger.error(`❌ Error removing promotionId column: ${error.message}`);
        }
      }

      const projectIdCol = await this.columnExists('properties', 'projectId');
      if (projectIdCol) {
        this.logger.log('Removing projectId column from properties table...');
        try {
          // Drop foreign key constraint if it exists
          const fkInfo = await this.dataSource.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'properties' 
              AND COLUMN_NAME = 'projectId' 
              AND REFERENCED_TABLE_NAME IS NOT NULL
            LIMIT 1
          `);
          
          if (fkInfo && fkInfo.length > 0) {
            const fkName = fkInfo[0].CONSTRAINT_NAME;
            await this.dataSource.query(`ALTER TABLE properties DROP FOREIGN KEY \`${fkName}\``);
            this.logger.log(`✅ Dropped foreign key constraint: ${fkName}`);
          }
          
          // Drop the column
          await this.dataSource.query(`ALTER TABLE properties DROP COLUMN projectId`);
          this.logger.log('✅ Removed projectId column from properties table');
        } catch (error: any) {
          this.logger.error(`❌ Error removing projectId column: ${error.message}`);
        }
      }



      // Step 2: Drop projects table
      const projectsTableExists = await this.tableExists('projects');
      if (projectsTableExists) {
        this.logger.log('Dropping projects table...');
        try {
          await this.dataSource.query(`DROP TABLE IF EXISTS projects`);
          this.logger.log('✅ Dropped projects table');
        } catch (error: any) {
          this.logger.error(`❌ Error dropping projects table: ${error.message}`);
        }
      }

      // Step 3: Drop promotions table
      const promotionsTableExists = await this.tableExists('promotions');
      if (promotionsTableExists) {
        this.logger.log('Dropping promotions table...');
        try {
          await this.dataSource.query(`DROP TABLE IF EXISTS promotions`);
          this.logger.log('✅ Dropped promotions table');
        } catch (error: any) {
          this.logger.error(`❌ Error dropping promotions table: ${error.message}`);
        }
      }

      this.logger.log('✅ Completed removal of promotion and project related database objects');
    } catch (error: any) {
      this.logger.error(`❌ Error in removePromotionProjectColumns: ${error.message}`);
      // Don't throw - allow app to continue
    }
  }
}


