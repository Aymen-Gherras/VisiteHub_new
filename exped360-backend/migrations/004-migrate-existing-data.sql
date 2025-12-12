-- Migration 004: Migrate existing property owner data
-- This populates the new tables with data from existing properties

-- Step 1: Create property owners from existing propertyOwnerName data
INSERT INTO `property_owners` (`id`, `name`, `slug`, `ownerType`, `createdAt`, `updatedAt`)
SELECT 
  UUID() as id,
  `propertyOwnerName` as name,
  LOWER(REPLACE(REPLACE(REPLACE(REPLACE(`propertyOwnerName`, ' ', '-'), 'é', 'e'), 'è', 'e'), 'à', 'a')) as slug,
  `propertyOwnerType` as ownerType,
  NOW() as createdAt,
  NOW() as updatedAt
FROM `properties` 
WHERE `propertyOwnerName` IS NOT NULL 
  AND `propertyOwnerName` != '' 
  AND `propertyOwnerType` IN ('Agence immobilière', 'Promotion immobilière')
GROUP BY `propertyOwnerName`, `propertyOwnerType`
ON DUPLICATE KEY UPDATE 
  `updatedAt` = NOW();

-- Step 2: Link existing properties to their property owners
UPDATE `properties` p
INNER JOIN `property_owners` po ON p.`propertyOwnerName` = po.`name` AND p.`propertyOwnerType` = po.`ownerType`
SET p.`propertyOwnerId` = po.`id`
WHERE p.`propertyOwnerName` IS NOT NULL 
  AND p.`propertyOwnerName` != ''
  AND p.`propertyOwnerType` IN ('Agence immobilière', 'Promotion immobilière');

-- Step 3: Update property owner statistics (optional, for reference)
-- This will be handled by the application logic, but we can set initial counts
UPDATE `property_owners` po
SET po.`updatedAt` = NOW()
WHERE po.`id` IN (
  SELECT DISTINCT `propertyOwnerId` 
  FROM `properties` 
  WHERE `propertyOwnerId` IS NOT NULL
);
