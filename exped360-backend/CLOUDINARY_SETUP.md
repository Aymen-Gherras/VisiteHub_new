# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image storage in the Exped360 project.

## 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Configure Environment Variables

Create a `.env` file in the `exped360-backend` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=exped360_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_NOTIFICATION_URL=https://your-domain.com/api/cloudinary/webhook
```

Replace the Cloudinary values with your actual credentials.

## 4. Features Included

### ✅ Automatic Image Optimization
- Images are automatically resized to 1200x800px for optimal display
- Quality is automatically optimized
- Multiple formats are generated (WebP, JPEG, PNG)

### ✅ Multiple Image Sizes
- **Large**: 1200x800px (main display)
- **Medium**: 600x400px (thumbnails)
- **Small**: 300x200px (previews)

### ✅ CDN Delivery
- Images are served through Cloudinary's global CDN
- Faster loading times worldwide
- Automatic format selection based on browser support

### ✅ Free Tier Benefits
- **25 credits/month** (~25,000 images)
- **10 GB storage**
- **20 GB bandwidth/month**

## 5. Usage

### Frontend Integration
The frontend automatically uploads images to Cloudinary when:
1. Users drag and drop images in the property creation form
2. Users select images using the file input
3. Images are uploaded with progress indicators

### Backend Integration
The backend:
1. Accepts image uploads via `/api/upload/image`
2. Stores Cloudinary URLs in the database
3. Associates images with properties
4. Handles image updates and deletions

## 6. Security

- Only authenticated users can upload images
- File size limit: 5MB per image
- Only image files are allowed
- Images are stored in a dedicated folder: `exped360-properties`

## 7. Testing

To test the integration:

1. Start the backend: `npm run start:dev`
2. Start the frontend: `npm run dev`
3. Log in to the admin panel
4. Create a new property and upload images
5. Verify images are displayed correctly

## 8. Troubleshooting

### Common Issues:

1. **Upload fails**: Check your Cloudinary credentials
2. **Images not displaying**: Verify the URLs are accessible
3. **Authentication errors**: Ensure you're logged in as admin

### Support:
- Cloudinary Documentation: https://cloudinary.com/documentation
- Cloudinary Support: https://support.cloudinary.com/


