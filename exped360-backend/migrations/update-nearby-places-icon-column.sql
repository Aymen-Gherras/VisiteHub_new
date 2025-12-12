-- Migration to update nearby_places.icon column from VARCHAR(10) to VARCHAR(255)
-- This allows storing both emoji icons and SVG filenames
-- Safe to run multiple times (idempotent)

SET @db_name = DATABASE();

-- Check current column definition
SELECT 
  COLUMN_TYPE INTO @current_type
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @db_name
  AND TABLE_NAME = 'nearby_places'
  AND COLUMN_NAME = 'icon';

-- Only alter if column is VARCHAR(10) or smaller
SET @alter_sql = IF(
  @current_type IS NOT NULL AND (
    @current_type LIKE 'varchar(10)%' OR 
    @current_type LIKE 'varchar(5)%' OR
    @current_type LIKE 'char(10)%' OR
    @current_type LIKE 'char(5)%'
  ),
  'ALTER TABLE `nearby_places` MODIFY COLUMN `icon` VARCHAR(255) NOT NULL DEFAULT \'📍\'',
  'SELECT "Icon column already updated or does not exist, skipping." AS Result'
);

PREPARE stmt FROM @alter_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Nearby places icon column updated successfully.' AS Result;

