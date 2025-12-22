-- Create a NEW empty database for VisiteHub/Exped360 (utf8mb4)
--
-- Use this when you want to start fresh (do NOT touch the old DB).
-- Replace values in <>.
--
-- Example:
--   <DB_NAME> = exped360_db_new
--   <DB_USER> = exped360_user
--   <DB_PASSWORD> = a-very-strong-password
--   <DB_HOST> = '%'   (use '%' for Docker/VPS; use 'localhost' for local-only)

SET @db_name := '<DB_NAME>';
SET @db_user := '<DB_USER>';
SET @db_pass := '<DB_PASSWORD>';
SET @db_host := '<DB_HOST>';

-- 1) Create database
SET @sql := CONCAT(
  'CREATE DATABASE IF NOT EXISTS `', @db_name, '` ',
  'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) Create user
SET @sql := CONCAT(
  'CREATE USER IF NOT EXISTS \'', @db_user, '\'@\'', @db_host, '\' IDENTIFIED BY \'', @db_pass, '\';'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3) Grant privileges
SET @sql := CONCAT(
  'GRANT ALL PRIVILEGES ON `', @db_name, '`.* TO \'', @db_user, '\'@\'', @db_host, '\';'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

FLUSH PRIVILEGES;

-- 4) Verify
SET @sql := CONCAT('SHOW GRANTS FOR \'', @db_user, '\'@\'', @db_host, '\';');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
