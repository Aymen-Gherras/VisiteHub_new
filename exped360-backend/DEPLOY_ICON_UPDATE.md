# 🎨 Nearby Places Icon System Update - Deployment Guide

## 📋 Overview

This update adds support for SVG icons in addition to emoji icons for nearby places. The system maintains **full backward compatibility** with existing emoji icons.

## ✅ What Changed

### Backend
- **Entity**: `nearby-place.entity.ts` - Icon column updated from `VARCHAR(10)` to `VARCHAR(255)`
- **Migration Script**: `update-icon-column.js` - Safe script to update database column
- **SQL Migration**: `migrations/update-nearby-places-icon-column.sql` - Manual SQL option

### Frontend
- **Icon Utils**: `src/app/utils/iconUtils.ts` - Helper functions to detect and render SVG vs emoji
- **Components Updated**:
  - `NearbyPlacesList.tsx` - Displays both emoji and SVG icons
  - `PropertyDetails.tsx` - Displays both emoji and SVG icons
  - `NearbyPlacesSection.tsx` - Icon picker with both emoji and SVG options

### Assets
- **SVG Icons**: Already in `public/icons/nearby-places/` (12 SVG files)

## 🚀 Deployment Steps

### Step 1: Update Database Column (Backend)

**Option A: Using Node.js Script (Recommended)**
```bash
cd exped360-backend
npm run update-icon-column
```

**Option B: Using SQL Script**
```bash
# Connect to your MySQL database
mysql -u your_username -p your_database < migrations/update-nearby-places-icon-column.sql
```

**Option C: Manual SQL**
```sql
ALTER TABLE nearby_places 
MODIFY COLUMN icon VARCHAR(255) NOT NULL DEFAULT '📍';
```

### Step 2: Deploy Frontend Files

1. **Copy updated files to VPS:**
   ```bash
   # Frontend files to update:
   - src/app/utils/iconUtils.ts (NEW)
   - src/app/components/properties/NearbyPlacesList.tsx
   - src/app/components/properties/PropertyDetails.tsx
   - src/app/admin/components/properties/sections/NearbyPlacesSection.tsx
   ```

2. **Ensure SVG icons are in place:**
   ```bash
   # Verify these files exist on VPS:
   public/icons/nearby-places/
     - 008-bus-2.svg
     - 013-fuel pump.svg
     - 019-supermarket.svg
     - 020-gasoline station.svg
     - 023-pharmacy.svg
     - Bank.svg
     - Dumbbell. weight. fitness. exercise. strength.svg
     - esps.svg
     - mosque.svg
     - Restaurant-01.svg
     - -_pizza. Italian food. slice of pizza. oven-baked. fast food.svg
     - school building.school building. educational institution. campus. schoolhouse.svg
   ```

3. **Rebuild Next.js frontend:**
   ```bash
   cd exped360-main-work
   npm run build
   # Or if using PM2:
   pm2 restart nextjs-app
   ```

### Step 3: Deploy Backend Files

1. **Copy updated files to VPS:**
   ```bash
   # Backend files to update:
   - src/properties/entities/nearby-place.entity.ts
   - update-icon-column.js (NEW)
   - migrations/update-nearby-places-icon-column.sql (NEW)
   - package.json (updated script)
   ```

2. **Run database migration:**
   ```bash
   cd exped360-backend
   npm run update-icon-column
   ```

3. **Restart backend:**
   ```bash
   pm2 restart backend-app
   # Or:
   npm run start:prod
   ```

## ✅ Verification

1. **Check database column:**
   ```sql
   DESCRIBE nearby_places;
   -- icon column should be VARCHAR(255)
   ```

2. **Test in admin panel:**
   - Go to property creation/edit
   - Navigate to "Lieux à proximité" section
   - Click icon picker
   - Verify both "Emoji" and "Icônes SVG" sections appear
   - Select an SVG icon and save

3. **Test on property page:**
   - View a property with nearby places
   - Verify SVG icons display correctly (colored blue/green)
   - Verify emoji icons still work

## 🔄 Backward Compatibility

- ✅ All existing emoji icons continue to work
- ✅ No data migration needed
- ✅ Existing nearby places with emoji icons display correctly
- ✅ New nearby places can use either emoji or SVG icons

## 📝 Notes

- SVG icons are automatically colored to match the blue theme using CSS filters
- Icon picker shows emoji icons first, then SVG icons
- Database column change is safe and non-destructive
- Scripts are idempotent (safe to run multiple times)

## 🐛 Troubleshooting

**Issue: SVG icons not displaying**
- Check that files exist in `public/icons/nearby-places/`
- Verify Next.js build completed successfully
- Check browser console for 404 errors

**Issue: Database column not updated**
- Verify script ran successfully: `npm run update-icon-column`
- Check database permissions
- Run SQL manually if needed

**Issue: Icon picker not showing SVG section**
- Clear browser cache
- Verify `NearbyPlacesSection.tsx` was updated
- Check browser console for errors

## 📞 Support

If you encounter any issues during deployment, check:
1. Database connection in backend `.env`
2. File permissions on VPS
3. Next.js build logs
4. Backend server logs

