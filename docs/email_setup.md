# Email Configuration Guide

## Overview

BloomNest uses **nodemailer** to send transactional emails to users. The system supports two modes:

1. **Development Mode** (Default): Emails are logged to console instead of being sent
2. **Production Mode**: Emails are sent via SMTP server (Gmail, SendGrid, etc.)

## Features

- ✅ Welcome email on user registration
- ✅ Order confirmation emails
- ✅ Non-blocking email sending (registration won't fail if email fails)
- ✅ Beautiful HTML email templates
- ✅ Automatic fallback to development mode if credentials not configured

## Development Mode

By default, if email credentials are not configured in `.env`, the system runs in **development mode**:

- Emails are **logged to the console** instead of being sent
- You'll see the email content in your terminal
- No SMTP configuration needed
- Perfect for local development and testing

Example console output:
```
📧 ===== EMAIL (DEVELOPMENT MODE) =====
To: user@example.com
Subject: Welcome to BloomNest! 🌱
Content: [email text content]
=====================================
```

## Production Mode Setup

### Option 1: Gmail (Recommended for Small Scale)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update `.env` file**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=BloomNest <noreply@bloomnest.com>
FRONTEND_URL=http://localhost:5173
```

**Gmail Limitations:**
- 500 emails per day limit
- May require additional verification for new accounts
- Not recommended for high-volume production use

### Option 2: Elastic Email (Recommended - What You're Using!)

Elastic Email offers excellent deliverability and affordable pricing.

**Your API Key:** `5CEA0AE9BAAD21F42E6DCD8BBA6F02362E3B7CC1AA116DDBD29EDAB04EF865420BCCB5952A9504AA0A1267D84C09A0F2`

**Important:** Free tier only sends to verified email (bloomnest.india@gmail.com). Upgrade to paid plan to send to all users.

1. **Update `.env` file**:
```env
EMAIL_HOST=smtp.elasticemail.com
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=bloomnest.india@gmail.com
EMAIL_PASS=5CEA0AE9BAAD21F42E6DCD8BBA6F02362E3B7CC1AA116DDBD29EDAB04EF865420BCCB5952A9504AA0A1267D84C09A0F2
EMAIL_FROM=BloomNest <bloomnest.india@gmail.com>
FRONTEND_URL=http://localhost:5173
```

**Elastic Email Benefits:**
- Very affordable ($0.09 per 1000 emails)
- Good deliverability
- Email analytics dashboard
- API and SMTP support
- Free tier for testing (limited to verified emails)

**Pricing:**
- Pay as you go: $0.09 per 1000 emails
- No monthly fees
- Much cheaper than competitors

**To Send to All Users:**
1. Go to https://elasticemail.com/account#/settings/billing
2. Add payment method
3. Purchase email credits (minimum $10 = ~111,000 emails)
4. All email addresses will work immediately

### Option 3: SendGrid (Alternative)

SendGrid offers 100 free emails per day, perfect for production use.

1. **Sign up** at https://sendgrid.com/
2. **Create API Key**:
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Update `.env` file**:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
EMAIL_FROM=BloomNest <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
```

**SendGrid Benefits:**
- 100 emails/day free tier
- Better deliverability
- Email analytics
- No daily sending limits on paid plans

### Option 4: AWS SES (Best for High Volume)

1. **Sign up** for AWS SES
2. **Verify your domain** or email address
3. **Get SMTP credentials** from SES console

4. **Update `.env` file**:
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASS=your-ses-smtp-password
EMAIL_FROM=BloomNest <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
```

**AWS SES Benefits:**
- Very low cost ($0.10 per 1000 emails)
- High deliverability
- Scalable for millions of emails
- Requires domain verification

## Email Types

### 1. Welcome Email
Sent automatically when a user registers:
- Greeting with user's name
- Overview of platform features
- Call-to-action button to start shopping
- Professional HTML template

### 2. Order Confirmation Email
Sent when an order is placed:
- Order number and details
- Total amount
- Number of items
- Link to track order
- Professional HTML template

## Testing Email Functionality

### Test in Development Mode (No Setup Required)

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Register a new user via the frontend
3. Check the terminal - you should see:
```
📧 ===== EMAIL (DEVELOPMENT MODE) =====
To: user@example.com
Subject: Welcome to BloomNest! 🌱
...
```

### Test in Production Mode

1. Configure email credentials in `.env`
2. Restart the backend server
3. Register a new user
4. Check your email inbox for the welcome email

## Troubleshooting

### Emails Not Sending (Production Mode)

**Problem**: Emails not arriving in inbox

**Solutions**:
1. Check spam/junk folder
2. Verify SMTP credentials are correct
3. Check console for error messages
4. For Gmail: Ensure App Password is used (not regular password)
5. For Gmail: Check "Less secure app access" is enabled (if not using App Password)

### Gmail "Less Secure Apps" Error

**Problem**: Gmail blocks login attempts

**Solution**: Use App Password instead of regular password (see Gmail setup above)

### SendGrid Emails Going to Spam

**Problem**: Emails landing in spam folder

**Solutions**:
1. Verify your sender domain in SendGrid
2. Set up SPF and DKIM records
3. Use a custom domain instead of generic email

### Port Connection Issues

**Problem**: Cannot connect to SMTP server

**Solutions**:
1. Try different ports: 587 (TLS), 465 (SSL), 25 (plain)
2. Check firewall settings
3. Verify EMAIL_SECURE setting matches port (587=false, 465=true)

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_HOST` | No | - | SMTP server hostname |
| `EMAIL_PORT` | No | - | SMTP server port (587 for TLS, 465 for SSL) |
| `EMAIL_SECURE` | No | false | Use SSL (true for port 465, false for 587) |
| `EMAIL_USER` | No | - | SMTP username or API key |
| `EMAIL_PASS` | No | - | SMTP password or API key |
| `EMAIL_FROM` | No | BloomNest <noreply@bloomnest.com> | Sender name and email |
| `FRONTEND_URL` | No | http://localhost:5173 | Frontend URL for email links |

## Production Deployment Checklist

- [ ] Choose email service provider (Gmail/SendGrid/AWS SES)
- [ ] Create account and get SMTP credentials
- [ ] Update `.env` with production credentials
- [ ] Set `EMAIL_FROM` to your domain email
- [ ] Set `FRONTEND_URL` to your production domain
- [ ] Test email sending with a real registration
- [ ] Check email deliverability (inbox vs spam)
- [ ] Set up domain verification (for SendGrid/SES)
- [ ] Configure SPF/DKIM records (for better deliverability)
- [ ] Monitor email sending logs

## Code Structure

### Email Utility (`backend/src/utils/email.js`)
- `sendWelcomeEmail(email, name)` - Send welcome email to new users
- `sendOrderConfirmationEmail(email, name, order)` - Send order confirmation
- Automatic development/production mode detection
- Non-blocking email sending

### Integration Points
- **Registration**: `backend/src/routes/auth.js` - Sends welcome email after user creation
- **Orders**: Can be integrated in order creation endpoint (future enhancement)

## Future Enhancements

Potential email features to add:
- Password reset emails
- Order shipping notifications
- Order delivery confirmations
- Promotional emails
- Newsletter subscriptions
- Email verification for new accounts
- Weekly/monthly digest emails

## Support

For issues or questions:
1. Check this documentation
2. Review console logs for error messages
3. Test in development mode first
4. Verify SMTP credentials
5. Check email service provider documentation