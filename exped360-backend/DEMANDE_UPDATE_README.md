# Demande System Update

## Overview
The contact request system has been updated to become a "demande" (request) system with enhanced features including image uploads, property intention (sell/rent), and improved location handling.

## Changes Made

### 1. Entity Updates
- **Table renamed**: `contact_requests` → `demandes`
- **New fields added**:
  - `property_intention`: ENUM ('sell', 'rent') - required field
  - `images`: TEXT[] - array of Cloudinary image URLs
- **Field updates**:
  - `property_location`: Now required (was optional)
  - All existing fields maintained

### 2. API Endpoints
- **Base path changed**: `/contact` → `/demandes`
- **New endpoints**:
  - `POST /demandes` - Create demande without images
  - `POST /demandes/with-images` - Create demande with image uploads
- **Existing endpoints maintained** (with updated naming)

### 3. Image Handling
- **Cloudinary integration**: Images are uploaded to Cloudinary in 'exped360-demandes' folder
- **Multiple images**: Support for up to 10 images per demande
- **Automatic cleanup**: Images are deleted from Cloudinary when demande is deleted
- **Image transformations**: Automatic resizing and optimization

### 4. Database Migration
Run the migration script in `src/contact/migration.sql` to update your existing database.

## Frontend Updates Required

### 1. API Calls
Update all API calls from `/contact` to `/demandes`

### 2. Form Updates
- Add property intention selector (sell/rent)
- Add image upload functionality
- Make property location required

### 3. Admin Panel
- Update all references from "Contact Requests" to "Demandes"
- Add image display capabilities
- Update status management

## Example Usage

### Create Demande with Images
```typescript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('propertyType', 'apartment');
formData.append('propertyLocation', 'Alger');
formData.append('propertyIntention', 'sell');
formData.append('message', 'Looking to sell my apartment');

// Add images
files.forEach(file => {
  formData.append('images', file);
});

const response = await fetch('/api/demandes/with-images', {
  method: 'POST',
  body: formData
});
```

### Create Demande without Images
```typescript
const demande = {
  name: 'John Doe',
  email: 'john@example.com',
  propertyType: 'apartment',
  propertyLocation: 'Alger',
  propertyIntention: 'sell',
  message: 'Looking to sell my apartment'
};

const response = await fetch('/api/demandes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(demande)
});
```

## Environment Variables
Ensure these are configured for image uploads:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_NOTIFICATION_URL` (optional)

## Testing
Test the new endpoints:
1. Create demande without images
2. Create demande with images
3. Verify image uploads to Cloudinary
4. Test admin panel functionality
5. Verify email notifications include new fields

## Rollback
If needed, you can rollback by:
1. Reverting the database migration
2. Restoring the old entity files
3. Updating the module imports
