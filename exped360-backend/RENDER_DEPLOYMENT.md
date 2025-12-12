# Render Deployment Guide for Exped360 Backend

## Prerequisites
- A Render account (free tier available)
- Your Exped360 frontend already deployed on Vercel
- Cloudinary account for image uploads

## Step 1: Deploy Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "PostgreSQL"
3. Configure the database:
   - **Name**: `exped360-db`
   - **Database**: `exped360_db`
   - **User**: `exped360_user`
   - **Plan**: Free
4. Click "Create Database"
5. Wait for the database to be provisioned
6. Copy the **Internal Database URL** (you'll need this for the backend service)

## Step 2: Deploy Backend Service on Render

1. In Render Dashboard, click "New +" and select "Web Service"
2. Connect your GitHub repository containing the `exped360-backend` folder
3. Configure the service:
   - **Name**: `exped360-backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free

## Step 3: Configure Environment Variables

In your backend service settings, add these environment variables:

### Required Variables:
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `DATABASE_URL`: [Paste the Internal Database URL from Step 1]
- `JWT_SECRET`: [Generate a secure random string]
- `JWT_EXPIRES_IN`: `24h`

### Cloudinary Variables (for image uploads):
- `CLOUDINARY_CLOUD_NAME`: [Your Cloudinary cloud name]
- `CLOUDINARY_API_KEY`: [Your Cloudinary API key]
- `CLOUDINARY_API_SECRET`: [Your Cloudinary API secret]
- `CLOUDINARY_NOTIFICATION_URL`: `https://your-render-app.onrender.com/api/cloudinary/webhook`

## Step 4: Link Database to Backend Service

1. In your backend service settings, go to "Environment" tab
2. Under "Linked Databases", click "Link Database"
3. Select your `exped360-db` database
4. This will automatically add the `DATABASE_URL` environment variable

## Step 5: Update Frontend Configuration

Once your backend is deployed, update your frontend's API configuration:

1. Go to your Vercel dashboard
2. Find your Exped360 frontend project
3. Go to Settings > Environment Variables
4. Add/update:
   - `NEXT_PUBLIC_API_URL`: `https://your-render-app.onrender.com/api`

## Step 6: Deploy and Test

1. Click "Deploy" in your Render backend service
2. Wait for the build to complete
3. Test your API endpoints at `https://your-render-app.onrender.com/api`
4. Test the connection from your Vercel frontend

## Step 7: Database Seeding (Optional)

If you want to populate the database with sample data:

1. SSH into your Render service or use the shell
2. Run: `npm run seed`

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs for missing dependencies or TypeScript errors
2. **Database Connection**: Ensure the `DATABASE_URL` is correctly set and the database is linked
3. **CORS Errors**: Verify the frontend URL is in the CORS configuration
4. **Environment Variables**: Double-check all required variables are set

### Useful Commands:
- Check service logs: Render Dashboard > Your Service > Logs
- Restart service: Render Dashboard > Your Service > Manual Deploy
- Check database: Render Dashboard > Your Database > Connect

## Free Tier Limitations

- **Backend Service**: 750 hours/month (about 31 days)
- **Database**: 90 days free trial, then $7/month
- **Bandwidth**: 100GB/month
- **Build Time**: 500 minutes/month

## Cost Optimization

- Use the free tier for development and testing
- Consider upgrading to paid plans for production use
- Monitor usage in the Render dashboard

## Security Notes

- Never commit sensitive environment variables to your repository
- Use Render's built-in secret management
- Regularly rotate JWT secrets
- Enable HTTPS (automatic on Render)
