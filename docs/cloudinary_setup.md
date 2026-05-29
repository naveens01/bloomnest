# Cloudinary Setup Guide

## Why Cloudinary?

Render and other cloud platforms have **ephemeral filesystems** - uploaded files are deleted when the server restarts. Cloudinary provides persistent cloud storage for images.

## Benefits

- ✅ Images persist across server restarts
- ✅ Automatic image optimization
- ✅ CDN delivery for fast loading
- ✅ Free tier: 25GB storage, 25GB bandwidth/month
- ✅ Automatic format conversion (WebP, AVIF)
- ✅ On-the-fly image transformations

## Setup Steps

### 1. Create Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials

After logging in, go to your Dashboard:

1. **Cloud Name**: Found at the top of the dashboard
2. **API Key**: Found in the "Account Details" section
3. **API Secret**: Click "Reveal" to see it

### 3. Add to Environment Variables

#### Local Development (.env)

Add these to `backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

#### Render Deployment

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Click "Save Changes"

### 4. How It Works

The system automatically detects if Cloudinary is configured:

- **If configured**: Images upload to Cloudinary (persistent)
- **If not configured**: Images save locally (temporary on Render)

```javascript
// Automatic detection in code
if (isCloudinaryConfigured()) {
  // Upload to Cloudinary
  const result = await uploadToCloudinary(filePath, 'bloomnest/products');
  imageUrl = result.url; // Cloudinary CDN URL
} else {
  // Fall back to local storage
  imageUrl = generateLocalUrl(filename);
}
```

### 5. Image Organization

Images are organized in Cloudinary folders:

- `bloomnest/products` - Product images
- `bloomnest/brands` - Brand logos
- `bloomnest/categories` - Category images
- `bloomnest/avatars` - User avatars

### 6. Testing

After setup:

1. Restart your backend server
2. Go to Admin Panel
3. Create a product with images
4. Check Cloudinary dashboard - images should appear
5. Restart server - images should still load

### 7. Free Tier Limits

Cloudinary free tier includes:

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

This is sufficient for most small to medium projects.

### 8. Troubleshooting

**Images not uploading to Cloudinary:**
- Check environment variables are set correctly
- Verify API credentials in Cloudinary dashboard
- Check backend logs for error messages

**Images still disappearing:**
- Confirm Cloudinary env vars are set in Render
- Restart Render service after adding env vars
- Check Cloudinary dashboard for uploaded images

**Local development:**
- You can develop without Cloudinary (images save locally)
- Add Cloudinary credentials when ready to test persistence

## Alternative: Local Development Without Cloudinary

For local development, you can work without Cloudinary:

1. Don't set Cloudinary environment variables
2. Images save to `backend/uploads/` folder
3. Images persist locally (but not on Render)
4. Add Cloudinary before deploying to production

## Production Recommendation

**Always use Cloudinary (or similar cloud storage) in production** to ensure:
- Images persist across deployments
- Better performance with CDN
- Automatic optimization
- Scalability

---

**Need Help?** Check Cloudinary documentation: https://cloudinary.com/documentation