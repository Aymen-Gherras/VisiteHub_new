-- Migration: Create PropertyOwners and Projects tables
-- This migration is safe for live websites - it only adds new tables and columns

-- Create property_owners table
CREATE TABLE IF NOT EXISTS `property_owners` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `type` enum('agence','promoteur') NOT NULL,
  `imageUrl` varchar(500) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `description` text,
  `coverImage` varchar(500) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_property_owners_name` (`name`),
  UNIQUE KEY `IDX_property_owners_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create projects table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(500) DEFAULT NULL,
  `description` text,
  `address` varchar(500) DEFAULT NULL,
  `wilaya` varchar(100) DEFAULT NULL,
  `daira` varchar(100) DEFAULT NULL,
  `propertyOwnerId` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_projects_name` (`name`),
  UNIQUE KEY `IDX_projects_slug` (`slug`),
  KEY `FK_projects_propertyOwner` (`propertyOwnerId`),
  CONSTRAINT `FK_projects_propertyOwner` FOREIGN KEY (`propertyOwnerId`) REFERENCES `property_owners` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add new columns to properties table (nullable for backward compatibility)
ALTER TABLE `properties` 
ADD COLUMN IF NOT EXISTS `propertyOwnerId` varchar(36) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `projectId` varchar(36) DEFAULT NULL;

-- Add foreign key constraints
ALTER TABLE `properties` 
ADD CONSTRAINT `FK_properties_propertyOwner` FOREIGN KEY (`propertyOwnerId`) REFERENCES `property_owners` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `FK_properties_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `IDX_properties_propertyOwner` ON `properties` (`propertyOwnerId`);
CREATE INDEX IF NOT EXISTS `IDX_properties_project` ON `properties` (`projectId`);

-- Migration completed successfully
-- Next step: Run the migration endpoint to populate data from existing properties
