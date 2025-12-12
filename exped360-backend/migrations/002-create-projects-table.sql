-- Migration 002: Create projects table
-- This is safe to run on live site as it doesn't modify existing tables

CREATE TABLE IF NOT EXISTS `projects` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NULL UNIQUE,
  `description` text NULL,
  `imageUrl` varchar(500) NULL,
  `coverImage` varchar(500) NULL,
  `images` text NULL COMMENT 'JSON array of image URLs',
  `address` text NULL,
  `wilaya` varchar(100) NULL,
  `daira` varchar(100) NULL,
  `latitude` float NULL,
  `longitude` float NULL,
  `startDate` date NULL,
  `expectedCompletionDate` date NULL,
  `status` enum('planning','construction','completed') NOT NULL DEFAULT 'planning',
  `totalUnits` int NOT NULL DEFAULT 0,
  `availableUnits` int NOT NULL DEFAULT 0,
  `propertyOwnerId` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_projects_name` (`name`),
  UNIQUE KEY `IDX_projects_slug` (`slug`),
  KEY `IDX_projects_status` (`status`),
  KEY `IDX_projects_wilaya` (`wilaya`),
  KEY `FK_projects_propertyOwner` (`propertyOwnerId`),
  CONSTRAINT `FK_projects_propertyOwner` FOREIGN KEY (`propertyOwnerId`) REFERENCES `property_owners` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
