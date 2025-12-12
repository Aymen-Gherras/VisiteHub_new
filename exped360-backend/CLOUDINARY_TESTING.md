# Cloudinary Testing Guide

This guide will help you test your Cloudinary integration to ensure everything is working correctly.

## Prerequisites

1. **Environment Variables**: Make sure you have the following environment variables set in your `.env` file:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_NOTIFICATION_URL=https://your-domain.com/api/cloudinary/webhook
   ```

2. **Dependencies**: Ensure all dependencies are installed:
   ```bash
   npm install
   ```

## Testing Methods

### 1. Unit Tests (Recommended)

Run the unit tests to verify the CloudinaryService functionality:

```bash
# Run all tests
npm test

# Run only Cloudinary tests
npm test -- --testPathPattern=cloudinary

# Run tests in watch mode
npm run test:watch
```

### 2. Integration Tests

Run the end-to-end tests to verify the API endpoints:

```bash
# Run e2e tests
npm run test:e2e

# Run only Cloudinary e2e tests
npm run test:e2e -- --testPathPattern=cloudinary
```

### 3. Manual Testing Script

Use the provided test script to manually test Cloudinary functionality:

```bash
# Run the manual test script
node test-cloudinary.js
```

This script will:
- ✅ Test Cloudinary connection
- ✅ Upload a test image
- ✅ Delete the test image
- ✅ Provide detailed feedback

### 4. Browser Testing

1. Start your NestJS application:
   ```bash
   npm run start:dev
   ```

2. Open the test HTML file in your browser:
   - Navigate to `exped360-backend/test-upload.html`
   - Or serve it through your application

3. Test the upload functionality:
   - Drag and drop an image or click "Choose File"
   - Verify the upload succeeds
   - Check the returned image URL

## Test Scenarios

### ✅ Success Cases

1. **Valid Image Upload**
   - Upload a JPG, PNG, GIF, or WebP file
   - File size < 5MB
   - Should return a Cloudinary URL

2. **Image Transformation**
   - Images should be automatically resized to 1200x800
   - Multiple versions should be generated (600x400, 300x200)
   - Images should be optimized for web

3. **Image Deletion**
   - Should successfully delete images by public ID
   - Should handle URLs with folder structure

### ❌ Error Cases

1. **Invalid File Type**
   - Upload a non-image file (e.g., .txt, .pdf)
   - Should return 400 error

2. **File Too Large**
   - Upload a file > 5MB
   - Should return 413 error

3. **Missing File**
   - Submit form without file
   - Should return 400 error

4. **Invalid Credentials**
   - Test with wrong Cloudinary credentials
   - Should return appropriate error

## Expected Results

### Successful Upload Response
```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v123/exped360-properties/image.jpg",
  "message": "Image uploaded successfully"
}
```

### Error Response
```json
{
  "message": "Only image files are allowed"
}
```

## Troubleshooting

### Common Issues

1. **"Cloudinary credentials not found"**
   - Check your `.env` file
   - Ensure variables are properly named
   - Restart your application after changing environment variables

2. **"Upload failed"**
   - Verify your Cloudinary account is active
   - Check your API key and secret
   - Ensure you have sufficient upload credits

3. **"Connection timeout"**
   - Check your internet connection
   - Verify Cloudinary service status
   - Check firewall settings

4. **"File size too large"**
   - Reduce image size before upload
   - Check the 5MB limit in the configuration

### Debug Mode

To enable debug logging, add this to your `.env` file:
```env
DEBUG=cloudinary:*
```

## Performance Testing

### Upload Speed
- Test with different image sizes (1MB, 3MB, 5MB)
- Monitor upload times
- Check for timeout issues

### Concurrent Uploads
- Test multiple simultaneous uploads
- Verify no conflicts or errors
- Check resource usage

## Security Testing

1. **File Type Validation**
   - Test with various file extensions
   - Verify only images are accepted

2. **File Content Validation**
   - Test with files that have image extensions but aren't images
   - Verify proper MIME type checking

3. **Size Limits**
   - Test boundary conditions (4.9MB, 5MB, 5.1MB)
   - Verify proper error handling

## Monitoring

After testing, monitor your Cloudinary dashboard for:
- Upload success rates
- Storage usage
- Bandwidth consumption
- Transformation usage

## Next Steps

Once testing is complete:

1. **Production Setup**
   - Update environment variables for production
   - Configure proper error logging
   - Set up monitoring

2. **Integration**
   - Integrate with your frontend application
   - Test the complete user flow
   - Verify image display and management

3. **Optimization**
   - Review transformation settings
   - Optimize for your use case
   - Consider CDN configuration

## Support

If you encounter issues:

1. Check the [Cloudinary documentation](https://cloudinary.com/documentation)
2. Review the [NestJS documentation](https://docs.nestjs.com/)
3. Check the test logs for detailed error messages
4. Verify your Cloudinary account status and limits
