-- SQL script to create the exped360_local database
-- Run this after MySQL reinstallation

-- Create the database
CREATE DATABASE IF NOT EXISTS `exped360_local` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify it was created
SHOW DATABASES LIKE 'exped360_local';

-- Use the database
USE exped360_local;

-- Show current database
SELECT DATABASE();

