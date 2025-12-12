-- MySQL Database Setup for Exped360
-- Run this script to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS exped360_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (replace 'your_secure_password' with actual password)
CREATE USER IF NOT EXISTS 'exped360_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON exped360_db.* TO 'exped360_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show created database
SHOW DATABASES;

-- Show user privileges
SHOW GRANTS FOR 'exped360_user'@'localhost';
