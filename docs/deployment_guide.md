# BloomNest Deployment Guide - Free Hosting

This guide will help you deploy BloomNest (both frontend and backend) to production using free hosting services.

## 🎯 Deployment Strategy

**Frontend**: Vercel (Free tier)
**Backend**: Render (Free tier)
**Database**: MongoDB Atlas (Free tier - already configured)

---

## 📋 Pre-Deployment Checklist

### 1. Prepare Your Code

```bash
# Make sure all changes are committed
git add .
git commit -m "Production ready - v1.0.0"
```

### 2. Create GitHub Repository (if not already done)

```bash
# Initialize git (if not done)
git init

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/bloomnest.git

# Push code
git branch -M main
git push -u origin main
```

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Sign Up for Render
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

```
Name: bloomnest-backend
Region: Singapore (closest to India)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 3: Add Environment Variables

Click **"Environment"** tab and add these variables:

```env
NODE_ENV=production
PORT=10000

# MongoDB Atlas (use your existing connection string)
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bloomnest?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Razorpay (your existing credentials)
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY

# Email Configuration (Elastic Email)
EMAIL_HOST=smtp.elasticemail.com
EMAIL_PORT=2525
EMAIL_USER=bloomnest.india@gmail.com
EMAIL_PASS=5CEA0AE9BAAD21F42E6DCD8BBA6F02362E3B7CC1AA116DDBD29EDAB04EF865420BCCB5952A9504AA0A1267D84C09A0F2
EMAIL_FROM=bloomnest.india@gmail.com

# CORS (will add frontend URL after deployment)
CORS_ORIGIN=*
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend URL will be: `https://bloomnest-backend.onrender.com`

### Step 5: Test Backend

```bash
# Test health endpoint
curl https://bloomnest-backend.onrender.com/api/health
```

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Sign Up for Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure the project:

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```env
VITE_API_URL=https://bloomnest-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. Your frontend URL will be: `https://bloomnest-xxxx.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., bloomnest.com)
3. Follow DNS configuration instructions

---

## 🔧 Part 3: Update Backend CORS

### Update Render Environment Variables

1. Go back to Render dashboard
2. Click on your backend service
3. Go to **Environment** tab
4. Update `CORS_ORIGIN`:

```env
CORS_ORIGIN=https://bloomnest-xxxx.vercel.app
```

5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## 📱 Part 4: Update Frontend API URL

### Create Production Environment File

The build process will use the environment variables from Vercel, so no code changes needed!

---

## ✅ Part 5: Post-Deployment Verification

### 1. Test Backend Endpoints

```bash
# Health check
curl https://bloomnest-backend.onrender.com/api/health

# Get categories
curl https://bloomnest-backend.onrender.com/api/categories

# Get products
curl https://bloomnest-backend.onrender.com/api/products?limit=10
```

### 2. Test Frontend

1. Visit your Vercel URL: `https://bloomnest-xxxx.vercel.app`
2. Check these pages:
   - ✅ Home page loads
   - ✅ Categories page shows data
   - ✅ Brands page shows data
   - ✅ Products page shows data
   - ✅ Sign up works
   - ✅ Sign in works
   - ✅ Add to cart works
   - ✅ Checkout flow works
   - ✅ Payment integration works

### 3. Create Admin User

```bash
# SSH into Render or use their shell
cd backend
node src/utils/createAdmin.js
```

Or create via MongoDB Atlas:
1. Go to MongoDB Atlas
2. Browse Collections
3. Find `users` collection
4. Create a user with `role: "admin"`

---

## 🎯 Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ✅ 750 hours/month free (enough for 24/7)
- ✅ Automatic HTTPS
- ✅ Automatic deployments from GitHub

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from GitHub
- ⚠️ 100GB bandwidth/month

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared cluster
- ⚠️ Limited to 100 connections

### Performance Tips

1. **Keep Backend Warm**: Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes
2. **Optimize Images**: Compress product images before uploading
3. **Enable Caching**: Already configured in the code
4. **Monitor Usage**: Check Render and Vercel dashboards regularly

---

## 🔐 Security Checklist

- [x] Change JWT_SECRET to a strong random string
- [x] Use environment variables for all secrets
- [x] Enable CORS with specific origin
- [x] Use HTTPS (automatic with Render/Vercel)
- [x] Validate all user inputs (already implemented)
- [x] Rate limiting on API endpoints (consider adding)
- [x] MongoDB connection string uses authentication

---

## 📊 Monitoring & Maintenance

### 1. Set Up Monitoring

**Render Dashboard:**
- Monitor CPU/Memory usage
- Check deployment logs
- View request metrics

**Vercel Dashboard:**
- Monitor bandwidth usage
- Check build logs
- View analytics

**MongoDB Atlas:**
- Monitor database size
- Check connection count
- View slow queries

### 2. Regular Maintenance

```bash
# Weekly: Check logs for errors
# Monthly: Review MongoDB storage usage
# Monthly: Check Razorpay transaction logs
# Quarterly: Update dependencies
```

---

## 🚨 Troubleshooting

### Backend Not Responding
```bash
# Check Render logs
# Verify environment variables
# Check MongoDB Atlas connection
# Ensure service is not sleeping
```

### Frontend Not Loading Data
```bash
# Check browser console for errors
# Verify VITE_API_URL is correct
# Check CORS configuration
# Test backend endpoints directly
```

### Database Connection Issues
```bash
# Verify MongoDB Atlas IP whitelist (should be 0.0.0.0/0 for Render)
# Check connection string format
# Verify database user permissions
```

---

## 🎉 Deployment Complete!

Your BloomNest application is now live and accessible worldwide!

**Frontend URL**: `https://bloomnest-xxxx.vercel.app`
**Backend URL**: `https://bloomnest-backend.onrender.com`

### Next Steps for v2.0:

1. Add product reviews and ratings
2. Implement wishlist functionality
3. Add order tracking with real-time updates
4. Integrate SMS notifications
5. Add social media sharing
6. Implement referral program
7. Add blog/content section
8. Implement advanced search with filters
9. Add multi-language support
10. Implement PWA features

---

## 📞 Support

If you encounter any issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
3. Check MongoDB Atlas: Clusters → Metrics
4. Review this guide again
5. Check environment variables are correct

---

## 🔄 Continuous Deployment

Both Render and Vercel are configured for automatic deployments:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel will auto-deploy frontend (2-3 minutes)
# Render will auto-deploy backend (5-10 minutes)
```

---

**Congratulations! 🎊 Your e-commerce platform is now live!**