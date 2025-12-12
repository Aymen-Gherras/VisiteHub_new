-- Migration: Migrate existing property owner data to new entities
-- This script safely migrates existing propertyOwnerName data to the new entities
-- Run this AFTER the first two migrations

-- Step 1: Create Promoteurs from existing properties
INSERT INTO `promoteurs` (`id`, `name`, `slug`, `createdAt`, `updatedAt`)
SELECT 
    UUID() as id,
    `propertyOwnerName` as name,
    LOWER(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(
                                            REPLACE(`propertyOwnerName`, 'é', 'e'),
                                            'è', 'e'
                                        ),
                                        'à', 'a'
                                    ),
                                    'ç', 'c'
                                ),
                                ' ', '-'
                            ),
                            '&', 'et'
                        ),
                        '.', ''
                    ),
                    '--', '-'
                ),
                '/', '-'
            ),
            '(', ''
        ),
        ')', ''
    ) as slug,
    NOW() as createdAt,
    NOW() as updatedAt
FROM `properties` 
WHERE `propertyOwnerType` = 'Promotion immobilière' 
    AND `propertyOwnerName` IS NOT NULL 
    AND `propertyOwnerName` != ''
    AND `propertyOwnerName` NOT IN (SELECT `name` FROM `promoteurs`)
GROUP BY `propertyOwnerName`;

-- Step 2: Create Agences from existing properties
INSERT INTO `agences` (`id`, `name`, `slug`, `createdAt`, `updatedAt`)
SELECT 
    UUID() as id,
    `propertyOwnerName` as name,
    LOWER(
        REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(
                                REPLACE(
                                    REPLACE(
                                        REPLACE(
                                            REPLACE(`propertyOwnerName`, 'é', 'e'),
                                            'è', 'e'
                                        ),
                                        'à', 'a'
                                    ),
                                    'ç', 'c'
                                ),
                                ' ', '-'
                            ),
                            '&', 'et'
                        ),
                        '.', ''
                    ),
                    '--', '-'
                ),
                '/', '-'
            ),
            '(', ''
        ),
        ')', ''
    ) as slug,
    NOW() as createdAt,
    NOW() as updatedAt
FROM `properties` 
WHERE `propertyOwnerType` = 'Agence immobilière' 
    AND `propertyOwnerName` IS NOT NULL 
    AND `propertyOwnerName` != ''
    AND `propertyOwnerName` NOT IN (SELECT `name` FROM `agences`)
GROUP BY `propertyOwnerName`;

-- Step 3: Link properties to promoteurs
UPDATE `properties` p
JOIN `promoteurs` pr ON p.`propertyOwnerName` = pr.`name`
SET p.`promoteurId` = pr.`id`
WHERE p.`propertyOwnerType` = 'Promotion immobilière'
    AND p.`propertyOwnerName` IS NOT NULL
    AND p.`propertyOwnerName` != '';

-- Step 4: Link properties to agences
UPDATE `properties` p
JOIN `agences` a ON p.`propertyOwnerName` = a.`name`
SET p.`agenceId` = a.`id`
WHERE p.`propertyOwnerType` = 'Agence immobilière'
    AND p.`propertyOwnerName` IS NOT NULL
    AND p.`propertyOwnerName` != '';

-- Step 5: Create projects from promoteur properties (group by location)
-- This creates projects for promoteurs that have 3+ properties in the same location
INSERT INTO `projects` (`id`, `name`, `slug`, `description`, `location`, `wilaya`, `daira`, `status`, `promoteurId`, `createdAt`, `updatedAt`)
SELECT 
    UUID() as id,
    CONCAT(pr.name, ' - ', p.daira) as name,
    CONCAT(pr.slug, '-', LOWER(REPLACE(p.daira, ' ', '-'))) as slug,
    CONCAT('Projet immobilier à ', p.daira, ', ', p.wilaya) as description,
    CONCAT(p.daira, ', ', p.wilaya) as location,
    p.wilaya,
    p.daira,
    'construction' as status,
    pr.id as promoteurId,
    NOW() as createdAt,
    NOW() as updatedAt
FROM `properties` p
JOIN `promoteurs` pr ON p.promoteurId = pr.id
WHERE p.promoteurId IS NOT NULL
GROUP BY pr.id, p.wilaya, p.daira
HAVING COUNT(*) >= 3;

-- Step 6: Link properties to projects (based on location matching)
UPDATE `properties` p
JOIN `projects` proj ON p.promoteurId = proj.promoteurId 
    AND p.wilaya = proj.wilaya 
    AND p.daira = proj.daira
SET p.projectId = proj.id
WHERE p.promoteurId IS NOT NULL;

-- Step 7: Update project statistics
UPDATE `projects` p SET 
    `totalUnits` = (
        SELECT COUNT(*) 
        FROM `properties` prop 
        WHERE prop.projectId = p.id
    ),
    `availableUnits` = (
        SELECT COUNT(*) 
        FROM `properties` prop 
        WHERE prop.projectId = p.id 
        AND prop.transactionType = 'vendre'
    ),
    `minPrice` = (
        SELECT MIN(CAST(REPLACE(REPLACE(prop.price, ' ', ''), 'DA', '') AS DECIMAL(15,2)))
        FROM `properties` prop 
        WHERE prop.projectId = p.id 
        AND prop.price REGEXP '^[0-9 ]+DA?$'
    ),
    `maxPrice` = (
        SELECT MAX(CAST(REPLACE(REPLACE(prop.price, ' ', ''), 'DA', '') AS DECIMAL(15,2)))
        FROM `properties` prop 
        WHERE prop.projectId = p.id 
        AND prop.price REGEXP '^[0-9 ]+DA?$'
    );

-- Verification queries (uncomment to run)
-- SELECT 'Promoteurs created:' as info, COUNT(*) as count FROM promoteurs;
-- SELECT 'Agences created:' as info, COUNT(*) as count FROM agences;
-- SELECT 'Projects created:' as info, COUNT(*) as count FROM projects;
-- SELECT 'Properties linked to promoteurs:' as info, COUNT(*) as count FROM properties WHERE promoteurId IS NOT NULL;
-- SELECT 'Properties linked to agences:' as info, COUNT(*) as count FROM properties WHERE agenceId IS NOT NULL;
-- SELECT 'Properties linked to projects:' as info, COUNT(*) as count FROM properties WHERE projectId IS NOT NULL;
