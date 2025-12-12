-- Migration: Add foreign key relationships to properties table
-- This migration adds nullable foreign keys for backward compatibility

-- Add new foreign key columns to properties table (nullable for backward compatibility)
ALTER TABLE `properties` 
ADD COLUMN `agenceId` varchar(36) NULL,
ADD COLUMN `promoteurId` varchar(36) NULL,
ADD COLUMN `projectId` varchar(36) NULL;

-- Add indexes for the new foreign keys for better query performance
ALTER TABLE `properties` 
ADD INDEX `IDX_properties_agenceId` (`agenceId`),
ADD INDEX `IDX_properties_promoteurId` (`promoteurId`),
ADD INDEX `IDX_properties_projectId` (`projectId`);

-- Add foreign key constraints
ALTER TABLE `properties` 
ADD CONSTRAINT `FK_properties_agence` FOREIGN KEY (`agenceId`) REFERENCES `agences` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `FK_properties_promoteur` FOREIGN KEY (`promoteurId`) REFERENCES `promoteurs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `FK_properties_project` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
