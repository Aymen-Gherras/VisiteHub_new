-- Add phone number column to properties table
-- Run this script if you prefer manual database migrations

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS "phoneNumber" VARCHAR;

-- Add comment to document the column
COMMENT ON COLUMN properties."phoneNumber" IS 'Property owner contact phone number';
