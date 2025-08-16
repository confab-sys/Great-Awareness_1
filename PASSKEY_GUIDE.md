# 🔑 What is a Passkey and How to Get It

## **What is a Passkey?**
A **Passkey** is a unique security key required for STK Push (Lipa Na M-Pesa Online) transactions. It's used to encrypt the payment request and verify that you're authorized to initiate payments from your shortcode.

## **Why Do You Need It?**
- **STK Push requires it**: Without a passkey, STK push won't work
- **Security**: It encrypts payment requests
- **Authorization**: Proves you own the shortcode

## **How to Get Your Passkey:**

### **Step 1: Enable LNMO (Lipa Na M-Pesa Online)**
1. **Log into Safaricom Developer Portal**: https://developer.safaricom.co.ke/
2. **Go to your app dashboard**
3. **Find "Lipa Na M-Pesa Online" or "LNMO" settings**
4. **Enable LNMO for your shortcode 6340984**

### **Step 2: Generate Passkey**
1. **In your app settings**, look for "Passkey" or "LNMO Passkey"
2. **Click "Generate Passkey"** or "Create Passkey"
3. **Copy the generated passkey** (it's a long string of letters/numbers)

### **Step 3: Update Config**
Once you have your passkey, update `config/daraja.js`:
```javascript
PASSKEY: 'YOUR_ACTUAL_PASSKEY_HERE',
```

## **Current Status:**
- ✅ **Consumer Key**: Added
- ✅ **Consumer Secret**: Added  
- ✅ **Shortcode**: 6340984 (your real shortcode)
- 🔄 **Passkey**: Need to generate in Daraja portal

## **Testing Now:**
The app will work with the sandbox passkey for testing, but for real payments you need your own passkey.

## **Common Issues:**
- **"Passkey not found"**: Enable LNMO first
- **"Invalid passkey"**: Make sure you copied it correctly
- **"LNMO not enabled"**: Contact Safaricom support

**Need help?** Check your Daraja portal for LNMO settings!
