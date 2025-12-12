# Fix for nearby_places Index Issue

## Problem

TypeORM's synchronize feature is trying to drop an index (`IDX_4d8271c278b9fd53057ee76956`) on the `nearby_places` table that is required by a foreign key constraint. This causes the error:

```
Cannot drop index 'IDX_4d8271c278b9fd53057ee76956': needed in a foreign key constraint
```

## Why It Works on Production but Not Locally

- **Production**: Has `synchronize: false` (because `NODE_ENV=production`), so TypeORM doesn't try to modify the schema
- **Local**: Has `synchronize: true` (because `NODE_ENV=development`), so TypeORM tries to "fix" the schema and encounters the index conflict

## Solution

### Option 1: Automatic Fix (Recommended)

The `DbAutoMigrateService` now includes an automatic fix that runs on startup. However, since TypeORM synchronize runs before the fix, you may need to:

1. **First, run the SQL script manually** (see Option 2 below) to fix the immediate issue
2. **Then restart the application** - the automatic fix will prevent it from happening again

### Option 2: Manual SQL Fix

Run the SQL script to fix the index issue:

```bash
mysql -u your_username -p exped360_local < migrations/fix-nearby-places-index.sql
```

Or run it manually in your MySQL client:

```sql
USE exped360_local;

-- Find and drop the foreign key constraint
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

-- Drop the old TypeORM-generated index
DROP INDEX IF EXISTS `IDX_4d8271c278b9fd53057ee76956` ON `nearby_places`;

-- Recreate the foreign key constraint (MySQL will auto-create the index)
ALTER TABLE `nearby_places` 
ADD CONSTRAINT `fk_nearby_places_property` 
FOREIGN KEY (`property_id`) 
REFERENCES `properties`(`id`) 
ON DELETE CASCADE;

-- Ensure the composite index exists
CREATE INDEX IF NOT EXISTS `idx_nearby_places_display_order` 
ON `nearby_places` (`property_id`, `display_order`);
```

### Option 3: Disable Synchronize (Alternative)

If you prefer to use migrations instead of synchronize, you can disable it:

1. Set `NODE_ENV=production` in your `.env` file (this disables synchronize)
2. Or modify `src/config/database.config.ts` to set `synchronize: false`

**Note**: If you disable synchronize, you'll need to use migrations for all schema changes.

## What Was Changed

1. **Entity Update**: Removed explicit index on `property_id` since MySQL automatically creates one for foreign keys. Kept only the composite index on `(property_id, display_order)`.

2. **Auto-Fix Method**: Added `fixNearbyPlacesIndexIssue()` method in `DbAutoMigrateService` that automatically fixes the index issue on startup.

3. **SQL Script**: Created `migrations/fix-nearby-places-index.sql` for manual fixes.

## Prevention

The automatic fix will prevent this issue from happening again. The entity now correctly declares only the composite index, and MySQL will handle the foreign key index automatically.

