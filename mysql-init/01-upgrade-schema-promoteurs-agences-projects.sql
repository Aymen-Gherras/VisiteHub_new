-- Upgrade script for an existing exped360_db schema
-- Adds missing promoteurs/agences/projects tables and missing properties columns
-- Safe to run multiple times (uses information_schema checks)

USE `exped360_db`;

-- 1) Core new tables
CREATE TABLE IF NOT EXISTS `agences` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `wilaya` varchar(255) DEFAULT NULL,
  `daira` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_agences_name` (`name`),
  UNIQUE KEY `IDX_agences_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `promoteurs` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `wilaya` varchar(255) DEFAULT NULL,
  `daira` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_promoteurs_name` (`name`),
  UNIQUE KEY `IDX_promoteurs_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` varchar(36) NOT NULL,
  `promoteurId` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `wilaya` varchar(255) NOT NULL DEFAULT '',
  `daira` varchar(255) NOT NULL DEFAULT '',
  `address` varchar(255) DEFAULT NULL,
  `status` enum('completed','construction','planning','suspended') NOT NULL DEFAULT 'planning',
  `coverImage` text,
  `totalUnits` int DEFAULT NULL,
  `availableUnits` int DEFAULT NULL,
  `deliveryDate` varchar(255) DEFAULT NULL,
  `floorsCount` int DEFAULT NULL,
  `unitsPerFloor` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_projects_promoteurId` (`promoteurId`),
  CONSTRAINT `FK_projects_promoteurId` FOREIGN KEY (`promoteurId`) REFERENCES `promoteurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics table used by /api/analytics/contact-click
CREATE TABLE IF NOT EXISTS `contact_click_events` (
  `id` varchar(36) NOT NULL,
  `type` enum('PHONE','WHATSAPP') NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `propertyId` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contact_click_type` (`type`),
  KEY `idx_contact_click_property` (`propertyId`),
  CONSTRAINT `FK_contact_click_property` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 2) Add missing properties columns expected by the current backend entity
SET @db := DATABASE();

SET @add_main_image := (
  SELECT IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='properties' AND COLUMN_NAME='mainImage') = 0,
    'ALTER TABLE properties ADD COLUMN mainImage VARCHAR(500) NULL',
    'SELECT 1'
  )
);
PREPARE stmt FROM @add_main_image; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_images := (
  SELECT IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='properties' AND COLUMN_NAME='images') = 0,
    'ALTER TABLE properties ADD COLUMN images JSON NULL',
    'SELECT 1'
  )
);
PREPARE stmt FROM @add_images; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_papers := (
  SELECT IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='properties' AND COLUMN_NAME='papers') = 0,
    'ALTER TABLE properties ADD COLUMN papers JSON NULL',
    'SELECT 1'
  )
);
PREPARE stmt FROM @add_papers; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_project_id := (
  SELECT IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME='properties' AND COLUMN_NAME='projectId') = 0,
    'ALTER TABLE properties ADD COLUMN projectId VARCHAR(36) NULL',
    'SELECT 1'
  )
);
PREPARE stmt FROM @add_project_id; EXECUTE stmt; DEALLOCATE PREPARE stmt;
