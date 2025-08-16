# Daraja API Setup Guide

## Step 1: Get Your Credentials
1. Go to https://developer.safaricom.co.ke/
2. Register and create an app
3. Get your Consumer Key and Secret

## Step 2: Update Config
Edit `config/daraja.js`:
```javascript
CONSUMER_KEY: 'YOUR_KEY_HERE',
CONSUMER_SECRET: 'YOUR_SECRET_HERE',
BUSINESS_TILL: 'YOUR_TILL_NUMBER',
```

## Step 3: Test
1. Run: `npm start`
2. Go to Newsletter & Videos
3. Tap Buy Now
4. Enter phone number
5. Test payment flow

## Current Status
✅ Frontend ready
🔄 Need your Daraja credentials
🔄 Need backend server for production
