-- Migration: Create nearby_places table
-- Date: 2025-01-27
-- Description: Creates table to store nearby places (Lieux à proximité) for properties
--              Replaces the complex property_amenities boolean system with simple name + distance

CREATE TABLE IF NOT EXISTS `nearby_places` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `property_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL COMMENT 'Name of the nearby place (e.g., "Place Taksim")',
  `distance` VARCHAR(50) NOT NULL COMMENT 'Distance from property (e.g., "300 m", "1.5 km")',
  `display_order` INT DEFAULT 0 COMMENT 'Order for display sorting',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE,
  INDEX `idx_property_id` (`property_id`),
  INDEX `idx_property_display_order` (`property_id`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: Old property_amenities table is kept for rollback safety
-- It will be removed in a future migration after verification

