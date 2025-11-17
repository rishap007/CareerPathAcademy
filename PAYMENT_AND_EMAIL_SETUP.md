# Payment and Email Integration Setup Guide

This guide explains how to configure and use the Stripe payment integration and email notification system in CareerCompass.

## Table of Contents

1. [Features Implemented](#features-implemented)
2. [Stripe Payment Setup](#stripe-payment-setup)
3. [Email Configuration](#email-configuration)
4. [Testing Locally](#testing-locally)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Features Implemented

### Payment Features
- ✅ Stripe checkout for paid courses
- ✅ Webhook handler for payment confirmation
- ✅ Free course enrollment (no payment required)
- ✅ Automatic enrollment after successful payment
- ✅ Payment success/cancel handling
- ✅ Secure payment intent tracking

### Email Features
- ✅ Enrollment confirmation emails
- ✅ Password reset flow
- ✅ Professional HTML email templates
- ✅ Support for Gmail, SendGrid, and custom SMTP
- ✅ Fallback handling when email is not configured

---

## Stripe Payment Setup

### 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete account verification

### 2. Get Your API Keys

**Test Mode (Development):**
1. Log into Stripe Dashboard
2. Click **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

**Live Mode (Production):**
- After testing, toggle to **Live mode** in the dashboard
- Copy the live keys (`pk_live_` and `sk_live_`)

### 3. Configure Environment Variables

Update your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URL (important for redirects)
APP_URL=http://localhost:5000
```

### 4. Set Up Stripe Webhooks (Required for Production)

Webhooks allow Stripe to notify your app when payments succeed.

**Local Development (Using Stripe CLI):**

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:5000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env`

**Production Deployment:**

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** and add to production environment variables

---

## Email Configuration

### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Create an App-Specific Password:**
   - Go to [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Under "2-Step Verification", click **App passwords**
   - Select **Mail** and **Other (Custom name)**
   - Copy the generated 16-character password

3. **Update `.env` file:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=CareerCompass <noreply@careercompass.com>
   ```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Verify your sender email/domain
4. Update `.env`:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=CareerCompass <noreply@yourdomain.com>
   ```

### Option 3: Other SMTP Services

Works with any SMTP provider (Mailgun, AWS SES, Postmark, etc.):

```env
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM=CareerCompass <noreply@yourdomain.com>
```

---

## Testing Locally

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Free Course Enrollment

1. Navigate to a course with `priceInCents: 0`
2. Click "Enroll Now"
3. You should be enrolled immediately
4. Check console logs for email output (if email not configured)

### 3. Test Paid Course Enrollment

1. Navigate to a paid course (e.g., Career Development Mastery - $199)
2. Click "Enroll Now"
3. You'll be redirected to Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

5. Complete checkout
6. You'll be redirected back with payment success message
7. Webhook will create enrollment and send confirmation email

### 4. Test Password Reset

1. Go to `/forgot-password`
2. Enter your email
3. Check console logs for reset link (if email not configured)
4. Click the reset link or copy the URL
5. Enter new password
6. Confirm password reset

### Stripe Test Cards

| Card Number | Description |
|------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Declined payment |
| 4000 0000 0000 3220 | Requires authentication (3D Secure) |

---

## Production Deployment

### 1. Environment Variables Checklist

Ensure these are set in your production environment:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Session
SESSION_SECRET=generate-a-strong-random-secret-here

# Stripe (LIVE keys)
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# App URL (IMPORTANT!)
APP_URL=https://yourdomain.com

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-production-sendgrid-key
EMAIL_FROM=CareerCompass <noreply@yourdomain.com>

# Application
NODE_ENV=production
PORT=5000
```

### 2. Database Migration

```bash
npm run db:push
```

### 3. Build for Production

```bash
npm run build
```

### 4. Start Production Server

```bash
npm start
```

### 5. Verify Webhooks

1. Make a test purchase in production
2. Check Stripe Dashboard → **Developers** → **Webhooks**
3. Verify webhook events are being received successfully

---

## API Endpoints Reference

### Payment Endpoints

**Create Enrollment (with payment handling)**
```http
POST /api/enrollments
Content-Type: application/json

{
  "courseId": 1
}

Response (Free course):
{
  "id": 1,
  "userId": "user-id",
  "courseId": 1,
  "purchasedAt": "2024-01-01T00:00:00Z"
}

Response (Paid course):
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/..."
}
```

**Stripe Webhook Handler**
```http
POST /api/webhooks/stripe
Headers:
  stripe-signature: {signature}
Body: {raw Stripe event}
```

### Email/Auth Endpoints

**Forgot Password**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Reset Password**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

---

## Email Templates

Three email templates are included:

### 1. Enrollment Confirmation
- Sent when: User enrolls in a course (free or paid)
- Contains: Course title, price (if paid), "Start Learning" button
- Template: `getEnrollmentConfirmationEmail()`

### 2. Password Reset
- Sent when: User requests password reset
- Contains: Reset link (expires in 1 hour), security warnings
- Template: `getPasswordResetEmail()`

### 3. Course Completion
- Sent when: User completes all lessons in a course
- Contains: Congratulations message, certificate download link
- Template: `getCourseCompletionEmail()`

---

## Troubleshooting

### Issue: "Stripe is not configured" error

**Solution:**
- Check that `STRIPE_SECRET_KEY` is set in `.env`
- Restart the server after updating `.env`
- Verify the key starts with `sk_test_` or `sk_live_`

### Issue: Emails not sending

**Solution:**
1. Check email credentials in `.env`
2. For Gmail: Ensure app-specific password is used (not account password)
3. Check server logs for email errors
4. Test SMTP connection:
   ```bash
   npm run dev
   # Check startup logs for "Email service is ready" message
   ```

### Issue: Webhook signature verification failed

**Solution:**
- Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- For local testing: Use Stripe CLI to forward webhooks
- Verify webhook endpoint URL is correct in Stripe Dashboard

### Issue: Payment succeeds but enrollment not created

**Solution:**
- Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is publicly accessible (production)
- Check server logs for webhook processing errors
- Ensure `courseId` and `userId` are correctly passed in metadata

### Issue: Password reset link doesn't work

**Solution:**
- Check that `APP_URL` is set correctly in `.env`
- Verify email contains the correct reset URL
- Check token hasn't expired (1 hour limit)
- Ensure password meets minimum requirements (8 characters)

### Issue: Redirects to wrong URL after payment

**Solution:**
- Update `APP_URL` in `.env` to match your domain
- For production: Use `https://yourdomain.com`
- For local: Use `http://localhost:5000`
- Restart server after changing `APP_URL`

---

## Security Considerations

1. **Never commit `.env` file to git** - It contains sensitive keys
2. **Use strong session secrets** in production
3. **Enable HTTPS** in production (Stripe requires it)
4. **Rotate API keys** periodically
5. **Monitor webhook events** for suspicious activity
6. **Rate limit** password reset endpoints
7. **Use environment-specific keys** (test for dev, live for prod)

---

## Next Steps

After setup is complete, consider:

1. **Testing payment flows** thoroughly with test cards
2. **Customizing email templates** to match your brand
3. **Setting up monitoring** (Sentry, LogRocket) for errors
4. **Adding receipt/invoice generation** for paid courses
5. **Implementing refund handling** if needed
6. **Creating admin dashboard** for payment analytics
7. **Adding subscription support** for recurring payments

---

## Support Resources

- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Nodemailer Docs: [https://nodemailer.com](https://nodemailer.com)
- Gmail SMTP Guide: [https://support.google.com/mail/answer/7126229](https://support.google.com/mail/answer/7126229)
- SendGrid Setup: [https://docs.sendgrid.com](https://docs.sendgrid.com)

---

**Implementation completed!** All payment and email features are now ready for testing and deployment. 🚀
