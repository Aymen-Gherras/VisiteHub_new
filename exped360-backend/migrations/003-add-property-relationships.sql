-- Migration 003: Add foreign key columns to properties table
-- This is safe to run on live site as we're only adding nullable columns

-- Add new columns to properties table (nullable, so existing data is safe)
ALTER TABLE `properties` 
ADD COLUMN `propertyOwnerId` varchar(36) NULL AFTER `propertyOwnerName`,
ADD COLUMN `projectId` varchar(36) NULL AFTER `propertyOwnerId`;

-- Add indexes for better performance
CREATE INDEX `IDX_properties_propertyOwnerId` ON `properties` (`propertyOwnerId`);
CREATE INDEX `IDX_properties_projectId` ON `properties` (`projectId`);

-- Add foreign key constraints (will not affect existing data since columns are nullable)
ALTER TABLE `properties`
ADD CONSTRAINT `FK_properties_propertyOwner` 
FOREIGN KEY (`propertyOwnerId`) REFERENCES `property_owners` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `properties`
ADD CONSTRAINT `FK_properties_project` 
FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
