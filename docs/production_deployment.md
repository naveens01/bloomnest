# BloomNest - Production Deployment Guide

## Overview

This guide covers everything needed to deploy BloomNest to production for the first release.

## Current Features (First Release)

✅ **User Authentication**
- Email/password registration and login
- User profile with order history
- Address management (collected during registration)
- JWT-based authentication

✅ **Product Management**
- Admin panel for managing products, categories, and brands
- Product display ordering control
- Image upload support
- Featured products and categories (max 6 each)

✅ **Shopping Experience**
- Product browsing and search
- Shopping cart
- Wishlist functionality
- Category and brand filtering

✅ **Checkout & Payment**
- Razorpay payment integration (UPI, Cards, Net Banking, Wallets)
- Order placement and tracking
- Order history in user profile

✅ **Email Notifications**
- Welcome email on registration
- Order confirmation emails (ready to integrate)
- Development mode (console logging) and production mode (SMTP)

## Pre-Deployment Checklist

### 1. Environment Configuration

Create a production `.env` file with these variables:

```env
# MongoDB Configuration (Production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloomnest?retryWrites=true&w=majority
NODE_ENV=production

# JWT Configuration
JWT_SECRET=generate-a-strong-random-secret-key-here
JWT_EXPIRE=30d

# Razorpay Configuration (Live Mode)
RAZORPAY_KEY_ID=your_live_razorpay_key_id
RAZORPAY_KEY_SECRET=your_live_razorpay_key_secret

# Email Configuration (Optional but recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=BloomNest <noreply@yourdomain.com>

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Server Configuration
PORT=5000
```

### 2. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier (512MB storage)

2. **Create Cluster**
   - Choose cloud provider (AWS/GCP/Azure)
   - Select region closest to your users
   - Choose M0 (Free tier) for testing

3. **Configure Network Access**
   - Add IP whitelist: `0.0.0.0/0` (allow from anywhere)
   - Or add specific server IPs for better security

4. **Create Database User**
   - Username: `bloomnest-admin`
   - Password: Generate strong password
   - Role: Read and write to any database

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Update `MONGODB_URI` in `.env`

### 3. Razorpay Live Mode Setup

1. **Complete KYC Verification**
   - Go to https://dashboard.razorpay.com/
   - Complete business KYC (required for live mode)
   - Submit business documents

2. **Get Live API Keys**
   - Go to Settings → API Keys
   - Generate Live Mode keys
   - Copy Key ID and Key Secret
   - Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`

3. **Configure Payment Methods**
   - Enable UPI, Cards, Net Banking, Wallets
   - Set up webhooks for payment notifications (optional)

4. **Test Live Payments**
   - Use small amounts (₹1-10) for initial testing
   - Verify payment flow end-to-end

### 4. Email Configuration (Optional)

Choose one of these options:

**Option A: Gmail (Quick Setup)**
- Enable 2FA on Gmail account
- Generate App Password
- Update EMAIL_* variables in `.env`
- Limit: 500 emails/day

**Option B: SendGrid (Recommended)**
- Sign up at https://sendgrid.com/
- Get API key
- Update EMAIL_* variables
- Free tier: 100 emails/day

**Option C: Skip for Now**
- Emails will log to console
- Can add later without affecting functionality

See `docs/email_setup.md` for detailed instructions.

## Deployment Options

### Option 1: Heroku (Easiest)

**Pros**: Easy setup, free tier available, automatic deployments
**Cons**: Free tier sleeps after 30 mins of inactivity

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku Apps** (one for backend, one for frontend)
```bash
# Backend
heroku create bloomnest-api

# Frontend
heroku create bloomnest-web
```

4. **Set Environment Variables** (Backend)
```bash
heroku config:set MONGODB_URI="your-mongodb-uri" -a bloomnest-api
heroku config:set JWT_SECRET="your-jwt-secret" -a bloomnest-api
heroku config:set RAZORPAY_KEY_ID="your-key-id" -a bloomnest-api
heroku config:set RAZORPAY_KEY_SECRET="your-key-secret" -a bloomnest-api
heroku config:set NODE_ENV=production -a bloomnest-api
# Add other variables...
```

5. **Deploy Backend**
```bash
cd backend
git init
heroku git:remote -a bloomnest-api
git add .
git commit -m "Initial deployment"
git push heroku main
```

6. **Deploy Frontend**
```bash
cd ..
# Update VITE_API_URL in frontend to point to Heroku backend URL
heroku git:remote -a bloomnest-web
git add .
git commit -m "Initial deployment"
git push heroku main
```

### Option 2: DigitalOcean (Recommended for Production)

**Pros**: Better performance, no sleep, affordable ($5/month)
**Cons**: Requires more setup

1. **Create Droplet**
   - Choose Ubuntu 22.04 LTS
   - Select $5/month plan (1GB RAM)
   - Add SSH key

2. **Connect to Server**
```bash
ssh root@your-server-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2** (Process Manager)
```bash
npm install -g pm2
```

5. **Clone Repository**
```bash
git clone https://github.com/yourusername/bloomnest.git
cd bloomnest
```

6. **Setup Backend**
```bash
cd backend
npm install
# Create .env file with production variables
nano .env
# Start with PM2
pm2 start src/server.js --name bloomnest-api
pm2 save
pm2 startup
```

7. **Setup Frontend**
```bash
cd ../
npm install
npm run build
# Serve with nginx or PM2
pm2 serve dist 3000 --name bloomnest-web
```

8. **Configure Nginx** (Optional, for custom domain)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/bloomnest
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/bloomnest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Vercel (Frontend) + Railway (Backend)

**Pros**: Free tiers, easy deployment, good performance
**Cons**: Separate platforms for frontend/backend

**Backend on Railway:**
1. Go to https://railway.app/
2. Connect GitHub repository
3. Select backend folder
4. Add environment variables
5. Deploy

**Frontend on Vercel:**
1. Go to https://vercel.com/
2. Import GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://your-railway-backend.up.railway.app`
6. Deploy

## Post-Deployment Tasks

### 1. Create Admin User

SSH into your server or use Heroku console:

```bash
cd backend
node src/utils/createAdmin.js
```

This creates an admin user with:
- Email: admin@bloomnest.com
- Password: admin123 (change immediately!)

### 2. Seed Initial Data (Optional)

```bash
node src/utils/seeder.js
```

This adds sample products, categories, and brands.

### 3. Test Complete User Flow

1. **Registration**
   - Register new user
   - Verify welcome email received
   - Check user can login

2. **Shopping**
   - Browse products
   - Add to cart
   - Add to wishlist

3. **Checkout**
   - Proceed to checkout
   - Verify address pre-filled
   - Complete payment with small amount (₹10)
   - Verify order confirmation

4. **Admin Panel**
   - Login as admin
   - Add/edit products
   - Manage categories and brands
   - Test image uploads

### 4. Configure Domain (Optional)

1. **Purchase Domain** (Namecheap, GoDaddy, etc.)

2. **Update DNS Records**
   - A Record: `@` → Your server IP
   - A Record: `www` → Your server IP
   - CNAME Record: `api` → Your backend URL

3. **Setup SSL Certificate** (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

4. **Update Environment Variables**
   - Update `FRONTEND_URL` to your domain
   - Update frontend API URL to your domain

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Enable rate limiting (already configured)
- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Keep dependencies updated
- [ ] Use environment variables (never commit .env)
- [ ] Implement proper error handling

## Monitoring & Maintenance

### 1. Application Monitoring

**PM2 Monitoring** (if using PM2):
```bash
pm2 monit
pm2 logs bloomnest-api
pm2 logs bloomnest-web
```

**Heroku Logs**:
```bash
heroku logs --tail -a bloomnest-api
```

### 2. Database Backups

**MongoDB Atlas**:
- Automatic backups enabled by default
- Configure backup schedule in Atlas dashboard
- Test restore process

### 3. Performance Monitoring

Consider adding:
- Google Analytics for frontend
- Sentry for error tracking
- New Relic for application monitoring

## Troubleshooting

### Issue: Application not starting

**Check:**
- Environment variables are set correctly
- MongoDB connection string is valid
- Port is not already in use
- Node.js version is compatible (v14+)

### Issue: Payment failing

**Check:**
- Razorpay live keys are correct
- KYC is completed
- Payment methods are enabled
- Test with small amounts first

### Issue: Emails not sending

**Check:**
- Email credentials are correct
- SMTP port is not blocked
- Check spam folder
- Review email logs in console

### Issue: Images not loading

**Check:**
- Upload directory has write permissions
- Static file serving is configured
- Image paths are correct
- File size limits

## Scaling Considerations

As your application grows:

1. **Database**: Upgrade MongoDB Atlas tier
2. **Server**: Increase server resources (RAM, CPU)
3. **CDN**: Use Cloudflare for static assets
4. **Caching**: Implement Redis for session/data caching
5. **Load Balancing**: Add multiple server instances
6. **Image Storage**: Move to AWS S3 or Cloudinary

## Support & Resources

- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Razorpay Docs**: https://razorpay.com/docs/
- **Heroku Docs**: https://devcenter.heroku.com/
- **DigitalOcean Docs**: https://docs.digitalocean.com/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/

## Next Steps After Deployment

1. Monitor application for first 24-48 hours
2. Gather user feedback
3. Plan feature enhancements:
   - Mobile OTP login
   - Product reviews and ratings
   - Advanced search and filters
   - Promotional campaigns
   - Analytics dashboard
   - Email marketing integration

## Conclusion

Your BloomNest application is now production-ready! Follow this guide step-by-step, and you'll have a fully functional e-commerce platform live on the internet.

Remember to:
- Test thoroughly before going live
- Start with small payment amounts
- Monitor logs regularly
- Keep backups
- Update dependencies regularly

Good luck with your launch! 🚀