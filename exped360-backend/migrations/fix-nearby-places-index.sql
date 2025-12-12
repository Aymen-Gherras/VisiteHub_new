-- Migration: Fix nearby_places index issue
-- Date: 2025-11-17
-- Description: Fixes the index conflict where TypeORM tries to drop an index
--              that's needed by a foreign key constraint
-- 
-- This script:
-- 1. Drops the foreign key constraint
-- 2. Drops the old TypeORM-generated index
-- 3. Recreates the foreign key (MySQL will auto-create the index)

USE exped360_local;

-- Step 1: Find and drop the foreign key constraint
SET @fk_name = (
  SELECT CONSTRAINT_NAME 
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = 'exped360_local' 
    AND TABLE_NAME = 'nearby_places' 
    AND COLUMN_NAME = 'property_id' 
    AND REFERENCED_TABLE_NAME IS NOT NULL
  LIMIT 1
);

SET @sql = CONCAT('ALTER TABLE nearby_places DROP FOREIGN KEY ', @fk_name);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Drop the old TypeORM-generated index if it exists
DROP INDEX IF EXISTS `IDX_4d8271c278b9fd53057ee76956` ON `nearby_places`;

-- Step 3: Recreate the foreign key constraint (MySQL will auto-create the index)
ALTER TABLE `nearby_places` 
ADD CONSTRAINT `fk_nearby_places_property` 
FOREIGN KEY (`property_id`) 
REFERENCES `properties`(`id`) 
ON DELETE CASCADE;

-- Step 4: Ensure the composite index exists (if it doesn't already)
CREATE INDEX IF NOT EXISTS `idx_nearby_places_display_order` 
ON `nearby_places` (`property_id`, `display_order`);

