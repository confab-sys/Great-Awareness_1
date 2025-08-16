# 🔑 Daraja Credentials Setup

## **Step 1: Get Your Credentials from Safaricom Developer Portal**

1. **Log into your Safaricom Developer Portal**: https://developer.safaricom.co.ke/
2. **Go to your app dashboard**
3. **Copy these values**:

### **Required Credentials:**
- **Consumer Key** (from your app dashboard)
- **Consumer Secret** (from your app dashboard)  
- **Business Till Number** (your M-Pesa till number)
- **Passkey** (from your app settings - required for STK push)

## **Step 2: Update the Configuration**

Open `config/daraja.js` and replace the placeholder values:

```javascript
// Replace these with your actual values
CONSUMER_KEY: 'YOUR_ACTUAL_CONSUMER_KEY',
CONSUMER_SECRET: 'YOUR_ACTUAL_CONSUMER_SECRET', 
BUSINESS_TILL: 'YOUR_ACTUAL_TILL_NUMBER',
PASSKEY: 'YOUR_ACTUAL_PASSKEY',
```

## **Step 3: Environment Setup**

**For Testing (Sandbox):**
- Keep `ENVIRONMENT: 'sandbox'`
- Use test phone numbers: `254708374149`, `254708374150`, `254708374151`

**For Production:**
- Change to `ENVIRONMENT: 'production'`
- Use real phone numbers

## **Step 4: Test the Integration**

1. **Save the file** after updating credentials
2. **Restart the app**: `npm start`
3. **Test the payment flow**:
   - Go to Newsletter & Videos
   - Tap "Buy Now"
   - Enter phone number
   - Tap "Send Payment Request"

## **Expected Result:**
- User should receive an M-Pesa STK push prompt on their phone
- User enters PIN to complete payment
- Payment is processed through your till

## **Troubleshooting:**
- **"Invalid credentials"**: Check Consumer Key/Secret
- **"Passkey error"**: Verify Passkey in Daraja portal
- **"Till number invalid"**: Check your till number format

**Need help?** Share your error messages and I'll help debug!
