-- Migration script to update contact_requests table to demandes
-- Run this in your database to update the existing structure

-- 1. Rename the table
ALTER TABLE contact_requests RENAME TO demandes;

-- 2. Add new columns
ALTER TABLE demandes 
ADD COLUMN property_intention VARCHAR(10) NOT NULL DEFAULT 'sell',
ADD COLUMN images TEXT[];

-- 3. Update the status enum values if needed (they should be the same)
-- The enum values are already compatible

-- 4. Make property_location required (if it was nullable before)
ALTER TABLE demandes ALTER COLUMN property_location SET NOT NULL;

-- 5. Add constraint for property_intention enum
ALTER TABLE demandes 
ADD CONSTRAINT check_property_intention 
CHECK (property_intention IN ('sell', 'rent'));

-- 6. Update existing records to have a default property_intention
UPDATE demandes SET property_intention = 'sell' WHERE property_intention IS NULL;

-- 7. Update existing records to have empty images array if null
UPDATE demandes SET images = '{}' WHERE images IS NULL;
