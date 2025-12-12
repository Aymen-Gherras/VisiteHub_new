-- Migration 001: Create property_owners table
-- This is safe to run on live site as it doesn't modify existing tables

CREATE TABLE IF NOT EXISTS `property_owners` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NULL UNIQUE,
  `ownerType` enum('Agence immobilière','Promotion immobilière') NOT NULL,
  `description` text NULL,
  `imageUrl` varchar(500) NULL,
  `coverImage` varchar(500) NULL,
  `phoneNumber` varchar(50) NULL,
  `email` varchar(255) NULL,
  `website` varchar(500) NULL,
  `address` text NULL,
  `wilaya` varchar(100) NULL,
  `daira` varchar(100) NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_property_owners_name` (`name`),
  UNIQUE KEY `IDX_property_owners_slug` (`slug`),
  KEY `IDX_property_owners_ownerType` (`ownerType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX `IDX_property_owners_wilaya` ON `property_owners` (`wilaya`);
CREATE INDEX `IDX_property_owners_daira` ON `property_owners` (`daira`);
