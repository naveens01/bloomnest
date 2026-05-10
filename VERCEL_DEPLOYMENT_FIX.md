# 🔧 Vercel Deployment Fix - Environment Variables Not Working

## Problem
Frontend is still connecting to `localhost:5000` instead of Railway backend URL, even though environment variables are set in Vercel dashboard.

## Root Cause
Vite requires environment variables at **BUILD TIME**, not runtime. The variables must be available when `npm run build` runs.

## ✅ Solution: Proper Vercel Environment Variable Setup

### Step 1: Delete Existing Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. **DELETE** these variables:
   - `VITE_API_URL`
   - `VITE_RAZORPAY_KEY_ID`

### Step 2: Add Variables Correctly (NOT as Sensitive)
1. Click **"Add New"**
2. For `VITE_API_URL`:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://bloomnest-production.up.railway.app`
   - **Environments**: Check ✅ Production, ✅ Preview, ✅ Development
   - **DO NOT** check "Sensitive" ❌
   - Click **Save**

3. For `VITE_RAZORPAY_KEY_ID`:
   - **Key**: `VITE_RAZORPAY_KEY_ID`
   - **Value**: `rzp_live_gvBWJfKlqxWJXy`
   - **Environments**: Check ✅ Production, ✅ Preview, ✅ Development
   - **DO NOT** check "Sensitive" ❌
   - Click **Save**

### Step 3: Trigger New Deployment
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"** button (three dots menu → Redeploy)
4. **IMPORTANT**: Check ✅ "Use existing Build Cache" should be **UNCHECKED**
5. Click **"Redeploy"**

### Step 4: Verify Build Logs
1. Wait for deployment to complete
2. Click on the deployment
3. Go to **"Build Logs"** tab
4. Search for "VITE_API_URL" in logs
5. You should see it being used during build

### Step 5: Test in Browser
1. **Close ALL browser windows** (completely quit browser)
2. Open browser in **Incognito/Private mode**
3. Visit: `https://bloomnest-pi.vercel.app`
4. Open Developer Tools (F12) → Network tab
5. Try to sign in
6. Check Request URL - should be `https://bloomnest-production.up.railway.app/api/...`

## Why "Sensitive" Doesn't Work for Vite

When you mark variables as "Sensitive" in Vercel:
- They are **encrypted** and only available at runtime
- Vite needs them at **BUILD TIME** to embed in the JavaScript bundle
- Result: Variables are `undefined` during build, so code falls back to `localhost:5000`

## Alternative: Use Vercel CLI (If Above Doesn't Work)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables via CLI
vercel env add VITE_API_URL production
# Enter: https://bloomnest-production.up.railway.app

vercel env add VITE_RAZORPAY_KEY_ID production
# Enter: rzp_live_gvBWJfKlqxWJXy

# Trigger deployment
vercel --prod
```

## Verification Checklist

- [ ] Environment variables added as **plain** (not sensitive)
- [ ] Variables set for **all environments** (Production, Preview, Development)
- [ ] Redeployed with **build cache disabled**
- [ ] Build logs show `VITE_API_URL` being used
- [ ] Browser Network tab shows requests to Railway URL
- [ ] No more "port 5000" error messages

## Still Not Working?

If issue persists after following all steps:

1. **Check Vercel Project Settings**:
   - Settings → General → Root Directory should be `.` (not `frontend` or anything else)
   - Settings → General → Framework Preset should be "Vite"

2. **Check Git Repository**:
   - Make sure `vercel.json` is committed and pushed
   - Make sure `.env.production` is in `.gitignore` (should NOT be committed)

3. **Nuclear Option - Delete and Recreate Project**:
   - Delete project from Vercel
   - Import again from GitHub
   - Set environment variables (NOT as sensitive)
   - Deploy

## Contact Support

If none of the above works, contact Vercel support with:
- Project URL
- Build logs showing environment variables
- Screenshot of environment variables settings