# Deployment & Environment Configuration Guide

## Environment Variables
Reference configuration in `.env`:
```ini
PORT=3000
NODE_ENV=production

# Firebase Project
FIREBASE_PROJECT_ID=sareeshop-2edcf
VITE_FIREBASE_PROJECT_ID=sareeshop-2edcf
VITE_FIREBASE_AUTH_DOMAIN=sareeshop-2edcf.firebaseapp.com

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=qudcaa6j
CLOUDINARY_API_KEY=your_cloudinary_api_key

# Razorpay (Payments)
RAZORPAY_KEY_ID=your_razorpay_test_key_id
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id

# Nodemailer / Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=ankitakhot015@gmail.com
SMTP_FROM=Kolhapuri Fashion Saree <ankitakhot015@gmail.com>

OTP_EXPIRY_MINUTES=5
```

## Running the Application
1. **Development**:
   ```bash
   npm run dev
   ```
2. **Production Build**:
   ```bash
   npm run build
   ```
3. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```
