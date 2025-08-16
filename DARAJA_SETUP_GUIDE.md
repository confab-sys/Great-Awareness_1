# 🚀 Daraja API Integration Setup Guide

## **Step 1: Safaricom Developer Portal Setup**

### 1.1 Register on Safaricom Developer Portal
1. Go to [https://developer.safaricom.co.ke/](https://developer.safaricom.co.ke/)
2. Click "Register" and create an account
3. Verify your email address

### 1.2 Create Your App
1. Log in to the portal
2. Click "Create App"
3. Choose "M-Pesa API"
4. Fill in your app details:
   - **App Name**: `Great Awareness Book Store`
   - **Description**: `Digital book sales with M-Pesa integration`
   - **Callback URL**: `https://your-backend-url.com/api/mpesa/callback` (we'll set this up later)

### 1.3 Get Your Credentials
After app creation, you'll receive:
- **Consumer Key**
- **Consumer Secret**
- **Environment** (Sandbox/Production)

## **Step 2: Update Configuration**

### 2.1 Update Daraja Config
Open `config/daraja.js` and replace the placeholder values:

```javascript
// Replace these with your actual values
CONSUMER_KEY: 'YOUR_ACTUAL_CONSUMER_KEY',
CONSUMER_SECRET: 'YOUR_ACTUAL_CONSUMER_SECRET',
BUSINESS_TILL: 'YOUR_ACTUAL_TILL_NUMBER',
```

### 2.2 Environment Setup
- **Sandbox**: For testing (use test phone numbers)
- **Production**: For real payments (requires approval from Safaricom)

## **Step 3: Backend Server Setup (Required for Production)**

### 3.1 Why You Need a Backend
- **Security**: API credentials should never be in mobile apps
- **Webhooks**: Daraja needs a server to send payment confirmations
- **Token Management**: Handle OAuth tokens securely

### 3.2 Backend Options
**Option A: Simple Node.js Server**
```bash
# Create a new directory for backend
mkdir great-awareness-backend
cd great-awareness-backend
npm init -y
npm install express cors dotenv axios
```

**Option B: Use a Backend-as-a-Service**
- **Firebase Functions**
- **Vercel Functions**
- **Netlify Functions**

## **Step 4: Testing the Integration**

### 4.1 Test Phone Numbers (Sandbox)
Use these test numbers for sandbox testing:
- `254708374149`
- `254708374150`
- `254708374151`

### 4.2 Test the App
1. Run your app: `npm start`
2. Navigate to "Newsletter & Videos"
3. Tap "Buy Now"
4. Enter a test phone number
5. Tap "Send Payment Request"

## **Step 5: Production Deployment**

### 5.1 Backend Deployment
1. Deploy your backend server
2. Update callback URL in Daraja portal
3. Switch environment to "Production"

### 5.2 App Store Deployment
1. Update app with production backend URL
2. Test with real phone numbers
3. Submit to app stores

## **Step 6: Payment Flow**

### 6.1 Current Flow (Simulation)
1. User taps "Buy Now"
2. App shows phone number input
3. User enters phone number
4. App shows success message
5. User receives SMS prompt (in real implementation)

### 6.2 Real Flow (With Backend)
1. User taps "Buy Now"
2. App sends request to your backend
3. Backend calls Daraja API
4. User receives SMS with payment prompt
5. User enters PIN on their phone
6. Daraja sends webhook to your backend
7. Backend confirms payment to your app

## **Step 7: Next Steps**

### 7.1 Immediate Actions
1. ✅ Register on Safaricom Developer Portal
2. ✅ Create your app
3. ✅ Get your credentials
4. ✅ Update `config/daraja.js`
5. 🔄 Set up backend server
6. 🔄 Deploy and test

### 7.2 Advanced Features
- **Payment History**: Store transaction records
- **Receipt Generation**: Send email/SMS receipts
- **Inventory Management**: Track book stock
- **Analytics**: Payment success rates

## **Troubleshooting**

### Common Issues
1. **"Invalid credentials"**: Check Consumer Key/Secret
2. **"Network error"**: Check internet connection
3. **"Phone number invalid"**: Use correct format (254XXXXXXXXX)

### Support
- **Safaricom Developer Support**: [https://developer.safaricom.co.ke/support](https://developer.safaricom.co.ke/support)
- **Daraja Documentation**: [https://developer.safaricom.co.ke/docs](https://developer.safaricom.co.ke/docs)

---

## **🎯 Current Status**

✅ **Frontend Integration**: Complete
✅ **UI/UX**: Complete  
🔄 **Backend Setup**: Pending
🔄 **Daraja Credentials**: Pending
🔄 **Testing**: Pending

**Next Action**: Register on Safaricom Developer Portal and get your credentials!
