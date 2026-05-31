# 🚀 Quick Start - Deploy BloomNest in 30 Minutes

This is a condensed guide to get BloomNest live quickly. For detailed instructions, see [`docs/deployment_guide.md`](docs/deployment_guide.md).

## ⏱️ Timeline
- **5 min**: Setup accounts
- **10 min**: Deploy backend
- **10 min**: Deploy frontend
- **5 min**: Testing & verification

---

## 📝 Step 1: Prepare (5 minutes)

### 1.1 Create Accounts (if you don't have them)
- [ ] [Render.com](https://render.com) - Sign up with GitHub
- [ ] [Vercel.com](https://vercel.com) - Sign up with GitHub
- [ ] [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Already have ✅

### 1.2 Push Code to GitHub
```bash
# If not already done
git init
git add .
git commit -m "Production ready v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/bloomnest.git
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend to Render (10 minutes)

### 2.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `bloomnest-backend`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.2 Add Environment Variables
Click **"Environment"** tab, add these (one by one):

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bloomnest?retryWrites=true&w=majority
JWT_SECRET=GENERATE_A_STRONG_32_CHAR_RANDOM_STRING_HERE
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
EMAIL_HOST=smtp.elasticemail.com
EMAIL_PORT=2525
EMAIL_USER=bloomnest.india@gmail.com
EMAIL_PASS=YOUR_ELASTIC_EMAIL_API_KEY
EMAIL_FROM=bloomnest.india@gmail.com
CORS_ORIGIN=*
```

**Generate JWT_SECRET:**
```bash
# Run this in terminal to generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.3 Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes
3. Your backend URL: `https://bloomnest-backend.onrender.com`

### 2.4 Test Backend
```bash
curl https://bloomnest-backend.onrender.com/api/health
```

---

## 🎨 Step 3: Deploy Frontend to Vercel (10 minutes)

### 3.1 Import Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Add Environment Variables
Click **"Environment Variables"**, add:

```env
VITE_API_URL=https://bloomnest-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
```

### 3.3 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your frontend URL: `https://bloomnest-xxxx.vercel.app`

---

## 🔄 Step 4: Update Backend CORS (2 minutes)

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to **"Environment"** tab
4. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://bloomnest-xxxx.vercel.app
   ```
5. Click **"Save Changes"** (auto-redeploys in 2-3 min)

---

## ✅ Step 5: Verify Everything Works (5 minutes)

### 5.1 Test Backend
```bash
# Health check
curl https://bloomnest-backend.onrender.com/api/health

# Get categories
curl https://bloomnest-backend.onrender.com/api/categories
```

### 5.2 Test Frontend
Visit: `https://bloomnest-xxxx.vercel.app`

Check these pages:
- [ ] Home page loads
- [ ] Categories page shows data
- [ ] Brands page shows data
- [ ] Products page shows data
- [ ] Sign up works
- [ ] Sign in works
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Payment works (test with ₹1)

---

## 👤 Step 6: Create Admin User (3 minutes)

### Option 1: Via Render Shell
1. Go to Render Dashboard
2. Click on your backend service
3. Click **"Shell"** tab
4. Run:
   ```bash
   cd backend
   node src/utils/createAdmin.js
   ```

### Option 2: Via MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Browse Collections"**
3. Find `users` collection
4. Click **"Insert Document"**
5. Add:
   ```json
   {
     "name": "Admin",
     "email": "admin@bloomnest.com",
     "password": "$2a$10$HASHED_PASSWORD_HERE",
     "role": "admin",
     "isVerified": true,
     "createdAt": "2026-05-10T00:00:00.000Z"
   }
   ```

---

## 🎯 Optional: Keep Backend Warm

Render free tier spins down after 15 min of inactivity. To prevent this:

1. Sign up at [UptimeRobot.com](https://uptimerobot.com) (free)
2. Create **HTTP(s)** monitor
3. URL: `https://bloomnest-backend.onrender.com/api/health`
4. Interval: **5 minutes**

This pings your backend every 5 minutes, keeping it warm!

---

## 🎉 You're Live!

**Frontend**: `https://bloomnest-xxxx.vercel.app`
**Backend**: `https://bloomnest-backend.onrender.com`

### Share Your URLs
- Update README.md with live URLs
- Share with users
- Post on social media

### Monitor Your App
- **Render**: Check logs and metrics
- **Vercel**: Check analytics and bandwidth
- **MongoDB Atlas**: Monitor database usage

---

## 🚨 Troubleshooting

### Backend not responding?
- Check Render logs
- Verify environment variables
- Check MongoDB Atlas IP whitelist (should be `0.0.0.0/0`)

### Frontend not loading data?
- Check browser console
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend

### Payment not working?
- Verify Razorpay LIVE credentials (not test)
- Check Razorpay dashboard for errors
- Test with small amount first

---

## 📞 Need Help?

- **Detailed Guide**: [`docs/deployment_guide.md`](docs/deployment_guide.md)
- **Checklist**: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)
- **Email**: bloomnest.india@gmail.com

---

## 🔄 Continuous Deployment

Both platforms auto-deploy on git push:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel deploys in 2-3 minutes
# Render deploys in 5-10 minutes
```

---

**Congratulations! 🎊 BloomNest is now live!**

Next: Plan v2.0 features and gather user feedback.