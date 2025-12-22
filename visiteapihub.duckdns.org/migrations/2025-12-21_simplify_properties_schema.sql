-- Simplify properties schema (local uploads + JSON fields)
-- Date: 2025-12-21
--
-- What this does:
-- 1) Adds to `properties`: mainImage (VARCHAR), images (JSON), papers (JSON)
-- 2) OPTIONAL: Backfills images from old `property_images` if it exists
-- 3) OPTIONAL: Backfills papers from old `property_papers` if it exists
-- 4) Drops obsolete tables: property_images, property_amenities, property_papers, favorite_properties
--
-- Safe/Idempotent:
-- - Uses INFORMATION_SCHEMA checks + dynamic SQL so it can be re-run.
-- - Disables FK checks during drops.
--
-- IMPORTANT:
-- - Run this on the correct DB (it uses DATABASE()).
-- - Always take a backup first.

SET @db := DATABASE();

-- -----------------------------
-- 1) Add new columns to properties
-- -----------------------------

-- mainImage
SET @col_main := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = @db AND table_name = 'properties' AND column_name = 'mainImage'
);
SET @sql := IF(
  @col_main = 0,
  'ALTER TABLE properties ADD COLUMN mainImage VARCHAR(500) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- images (JSON)
SET @col_images := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = @db AND table_name = 'properties' AND column_name = 'images'
);
SET @sql := IF(
  @col_images = 0,
  'ALTER TABLE properties ADD COLUMN images JSON NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- papers (JSON)
SET @col_papers := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = @db AND table_name = 'properties' AND column_name = 'papers'
);
SET @sql := IF(
  @col_papers = 0,
  'ALTER TABLE properties ADD COLUMN papers JSON NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- -----------------------------
-- 2) OPTIONAL: Backfill images from property_images
-- -----------------------------

SET @pi_exists := (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = @db AND table_name = 'property_images'
);

-- detect possible column names
SET @pi_propId := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_images' AND column_name='propertyId'
);
SET @pi_prop_id := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_images' AND column_name='property_id'
);
SET @pi_url := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_images' AND column_name='imageUrl'
);
SET @pi_url_snake := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_images' AND column_name='image_url'
);
SET @pi_createdAt := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_images' AND column_name='createdAt'
);
SET @pi_created_at := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_images' AND column_name='created_at'
);

SET @pi_prop_col := IF(@pi_propId>0, 'propertyId', IF(@pi_prop_id>0, 'property_id', ''));
SET @pi_url_col := IF(@pi_url>0, 'imageUrl', IF(@pi_url_snake>0, 'image_url', ''));
SET @pi_order_col := IF(@pi_createdAt>0, 'createdAt', IF(@pi_created_at>0, 'created_at', ''));

-- Backfill only when we can detect required columns
SET @sql := IF(
  @pi_exists=1 AND @pi_prop_col<>'' AND @pi_url_col<>'',
  CONCAT(
    'UPDATE properties p ',
    'JOIN (',
      'SELECT `', @pi_prop_col, '` AS pid, ',
      'JSON_ARRAYAGG(`', @pi_url_col, '`',
        IF(@pi_order_col<>'', CONCAT(' ORDER BY `', @pi_order_col, '` ASC'), ''),
      ') AS j ',
      'FROM property_images ',
      'GROUP BY `', @pi_prop_col, '`',
    ') x ON x.pid = p.id ',
    'SET p.images = COALESCE(p.images, x.j)'
  ),
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Set mainImage from first images[] if missing
UPDATE properties
SET mainImage = JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]'))
WHERE (mainImage IS NULL OR mainImage = '')
  AND images IS NOT NULL
  AND JSON_LENGTH(images) > 0;

-- -----------------------------
-- 3) OPTIONAL: Backfill papers from property_papers (join table)
-- -----------------------------

SET @pp_exists := (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = @db AND table_name = 'property_papers'
);

SET @pp_propId := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_papers' AND column_name='propertyId'
);
SET @pp_prop_id := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_papers' AND column_name='property_id'
);
SET @pp_paperId := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_papers' AND column_name='paperId'
);
SET @pp_paper_id := (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema=@db AND table_name='property_papers' AND column_name='paper_id'
);

SET @pp_prop_col := IF(@pp_propId>0, 'propertyId', IF(@pp_prop_id>0, 'property_id', ''));
SET @pp_paper_col := IF(@pp_paperId>0, 'paperId', IF(@pp_paper_id>0, 'paper_id', ''));

SET @sql := IF(
  @pp_exists=1 AND @pp_prop_col<>'' AND @pp_paper_col<>'' AND (
    SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=@db AND table_name='papers'
  )=1,
  CONCAT(
    'UPDATE properties p ',
    'JOIN (',
      'SELECT pp.`', @pp_prop_col, '` AS pid, JSON_ARRAYAGG(pa.name) AS j ',
      'FROM property_papers pp ',
      'JOIN papers pa ON pa.id = pp.`', @pp_paper_col, '` ',
      'GROUP BY pp.`', @pp_prop_col, '`',
    ') x ON x.pid = p.id ',
    'SET p.papers = COALESCE(p.papers, x.j)'
  ),
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- -----------------------------
-- 4) Drop obsolete tables
-- -----------------------------

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS property_papers;
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS property_amenities;
DROP TABLE IF EXISTS favorite_properties;
SET FOREIGN_KEY_CHECKS = 1;

-- Done.
