# 🚀 BloomNest Deployment Checklist

Use this checklist to ensure smooth deployment to production.

## ✅ Pre-Deployment Tasks

### 1. Code Preparation
- [ ] All features tested locally
- [ ] No console.log statements in production code
- [ ] All TODO comments resolved or documented
- [ ] Code is properly formatted and linted
- [ ] All dependencies are up to date

### 2. Environment Variables
- [ ] Backend `.env` file configured with production values
- [ ] MongoDB Atlas connection string ready
- [ ] Razorpay LIVE credentials ready (not test mode)
- [ ] Email credentials (Elastic Email) verified
- [ ] JWT_SECRET is a strong random string (min 32 characters)

### 3. Git Repository
- [ ] GitHub repository created
- [ ] All code committed to main branch
- [ ] `.gitignore` properly configured
- [ ] Sensitive files NOT committed (.env, node_modules, etc.)

### 4. Database Setup
- [ ] MongoDB Atlas cluster created (Free tier)
- [ ] Database user created with proper permissions
- [ ] IP whitelist set to 0.0.0.0/0 (allow all for Render)
- [ ] Connection string tested

---

## 🔧 Backend Deployment (Render)

### Step 1: Create Render Account
- [ ] Sign up at https://render.com with GitHub
- [ ] Authorize Render to access your repository

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select your GitHub repository
- [ ] Configure settings:
  - Name: `bloomnest-backend`
  - Region: `Singapore`
  - Branch: `main`
  - Root Directory: `backend`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`

### Step 3: Add Environment Variables
Copy these to Render Environment tab:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-strong-random-32-char-string>
RAZORPAY_KEY_ID=<your-live-key-id>
RAZORPAY_KEY_SECRET=<your-live-secret>
EMAIL_HOST=smtp.elasticemail.com
EMAIL_PORT=2525
EMAIL_USER=bloomnest.india@gmail.com
EMAIL_PASS=<your-elastic-email-api-key>
EMAIL_FROM=bloomnest.india@gmail.com
CORS_ORIGIN=*
```

### Step 4: Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 minutes)
- [ ] Note your backend URL: `https://bloomnest-backend.onrender.com`
- [ ] Test health endpoint: `curl https://bloomnest-backend.onrender.com/api/health`
- [ ] Test categories: `curl https://bloomnest-backend.onrender.com/api/categories`

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
- [ ] Sign up at https://vercel.com with GitHub
- [ ] Authorize Vercel to access your repository

### Step 2: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select your GitHub repository
- [ ] Configure settings:
  - Framework Preset: `Vite`
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### Step 3: Add Environment Variables
```
VITE_API_URL=https://bloomnest-backend.onrender.com
VITE_RAZORPAY_KEY_ID=<your-live-key-id>
```

### Step 4: Deploy & Test
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Note your frontend URL: `https://bloomnest-xxxx.vercel.app`
- [ ] Visit the URL and test all pages

---

## 🔄 Update Backend CORS

### After Frontend Deployment
- [ ] Go to Render dashboard
- [ ] Click on backend service
- [ ] Go to Environment tab
- [ ] Update `CORS_ORIGIN` to your Vercel URL:
  ```
  CORS_ORIGIN=https://bloomnest-xxxx.vercel.app
  ```
- [ ] Save changes (auto-redeploys)

---

## ✅ Post-Deployment Verification

### Backend Tests
- [ ] Health endpoint responds: `/api/health`
- [ ] Categories load: `/api/categories`
- [ ] Brands load: `/api/brands`
- [ ] Products load: `/api/products?limit=10`
- [ ] Featured categories: `/api/categories/featured`
- [ ] Featured products: `/api/products/featured?limit=6`

### Frontend Tests
- [ ] Home page loads correctly
- [ ] Categories page shows all categories
- [ ] Brands page shows all brands
- [ ] Products page shows products
- [ ] Product detail page works
- [ ] Sign up creates new user
- [ ] Sign in works with credentials
- [ ] Add to cart functionality works
- [ ] Cart displays items correctly
- [ ] Checkout flow works
- [ ] Payment integration works (test with small amount)
- [ ] Order confirmation displays
- [ ] Profile page shows user info
- [ ] Admin panel accessible (after creating admin user)

### Mobile Tests
- [ ] Test on mobile device or Chrome DevTools mobile view
- [ ] All pages responsive
- [ ] Touch interactions work
- [ ] Forms are usable on mobile
- [ ] Payment flow works on mobile

---

## 👤 Create Admin User

### Option 1: Via Render Shell
```bash
cd backend
node src/utils/createAdmin.js
```

### Option 2: Via MongoDB Atlas
1. Go to MongoDB Atlas
2. Browse Collections
3. Find `users` collection
4. Create user with:
   ```json
   {
     "name": "Admin",
     "email": "admin@bloomnest.com",
     "password": "<bcrypt-hashed-password>",
     "role": "admin",
     "isVerified": true
   }
   ```

---

## 🎯 Performance Optimization

### Keep Backend Warm (Prevent Spin-Down)
- [ ] Sign up at https://uptimerobot.com (free)
- [ ] Create HTTP monitor
- [ ] URL: `https://bloomnest-backend.onrender.com/api/health`
- [ ] Interval: 5 minutes
- [ ] This prevents Render free tier from spinning down

### Image Optimization
- [ ] Compress product images before uploading
- [ ] Use WebP format where possible
- [ ] Keep images under 500KB each

---

## 📊 Monitoring Setup

### Render Dashboard
- [ ] Bookmark backend service URL
- [ ] Check logs regularly
- [ ] Monitor CPU/Memory usage

### Vercel Dashboard
- [ ] Bookmark project URL
- [ ] Check deployment logs
- [ ] Monitor bandwidth usage

### MongoDB Atlas
- [ ] Monitor database size
- [ ] Check connection count
- [ ] Review slow queries

---

## 🔐 Security Final Check

- [ ] JWT_SECRET is strong and unique
- [ ] All secrets in environment variables (not in code)
- [ ] CORS configured with specific origin
- [ ] MongoDB uses authentication
- [ ] Razorpay using LIVE credentials (not test)
- [ ] HTTPS enabled (automatic with Render/Vercel)
- [ ] Rate limiting enabled on API

---

## 📝 Documentation

- [ ] Update README.md with live URLs
- [ ] Document admin credentials securely
- [ ] Save all environment variables in secure location
- [ ] Document deployment process for team

---

## 🎉 Launch!

Once all items are checked:
- [ ] Announce launch to users
- [ ] Share live URL
- [ ] Monitor for first 24 hours
- [ ] Collect user feedback
- [ ] Plan v2.0 features

---

## 🆘 Emergency Contacts

**Render Support**: https://render.com/docs
**Vercel Support**: https://vercel.com/docs
**MongoDB Atlas Support**: https://www.mongodb.com/docs/atlas/
**Razorpay Support**: https://razorpay.com/docs/

---

## 📞 Troubleshooting Quick Links

- Backend not responding → Check Render logs
- Frontend not loading data → Check browser console + CORS
- Database connection failed → Check MongoDB Atlas IP whitelist
- Payment not working → Verify Razorpay credentials
- Email not sending → Check Elastic Email quota

---

**Last Updated**: May 10, 2026
**Version**: 1.0.0