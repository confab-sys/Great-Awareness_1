# JavaScript Webhook Server Setup Guide

## Overview
This guide will help you replace your PHP webhook with a modern JavaScript webhook server that handles PesaFlux payments and logs transactions to Google Sheets.

## Quick Start

### 1. Install Dependencies
```bash
# Navigate to your project directory
cd c:\Users\Great Awareness\Great-Awareness_1

# Install webhook server dependencies
npm install express body-parser cors axios dotenv

# For development (optional)
npm install --save-dev nodemon
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
# Replace YOUR_SCRIPT_ID with your actual Google Apps Script ID
```

### 3. Update Google Apps Script URL
In your `.env` file, update:
```
GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

### 4. Test the Webhook Server
```bash
# Start the webhook server
npm run start:webhook

# Or for development with auto-restart
npm run dev:webhook
```

### 5. Test the Integration
```bash
# Run webhook tests
node test-webhook.js
```

## Manual Setup

### Option 1: Standalone Server
1. **Install dependencies**:
   ```bash
   npm install express body-parser cors axios dotenv
   ```

2. **Start the server**:
   ```bash
   node webhook-server.js
   ```

3. **Verify it's running**:
   - Health check: http://localhost:3001/health
   - Test endpoint: http://localhost:3001/test

### Option 2: Using PM2 (Production)
1. **Install PM2 globally**:
   ```bash
   npm install -g pm2
   ```

2. **Start with PM2**:
   ```bash
   pm2 start webhook-server.js --name "pesaflex-webhook"
   pm2 save
   pm2 startup
   ```

## Configuration

### Environment Variables (.env)
```bash
# Required
GOOGLE_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Optional
PORT=3001
NODE_ENV=production
```

### Google Apps Script Setup
1. **Update your Google Apps Script** to handle the JavaScript webhook format:
   ```javascript
   function doPost(e) {
     var data = JSON.parse(e.postData.contents);
     
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     sheet.appendRow([
       new Date(),
       data.product,
       data.amount,
       data.msisdn,
       data.transactionId,
       data.status,
       data.receipt
     ]);
     
     return ContentService
       .createTextOutput(JSON.stringify({success: true}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

2. **Deploy the script** as a web app with the correct URL.

## Testing

### Local Testing
1. **Start the webhook server**:
   ```bash
   node webhook-server.js
   ```

2. **Test with curl**:
   ```bash
   curl -X POST http://localhost:3001/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "ResponseCode": 0,
       "TransactionID": "TEST123",
       "TransactionAmount": 1,
       "TransactionReceipt": "RCPT123",
       "Msisdn": "254712345678"
     }'
   ```

3. **Check Google Sheets** for the logged transaction.

### Production Testing
1. **Update PesaFlux webhook URL** to point to your new JavaScript webhook.
2. **Make a test payment** and verify it logs correctly.

## Deployment Options

### Option 1: VPS/Cloud Server
```bash
# Clone to your server
git clone your-repo.git
cd your-repo

# Install dependencies
npm install

# Start with PM2
pm2 start webhook-server.js --name "pesaflex-webhook"
```

### Option 2: Railway/Render/Heroku
1. **Create railway.json** or **Procfile**:
   ```
   web: node webhook-server.js
   ```

2. **Deploy using their CLI or web interface**.

### Option 3: Cloud Functions (Vercel)
Create `api/webhook.js` for serverless deployment.

## Migration from PHP

### Replace PHP webhook.php
1. **Backup your current PHP webhook**.
2. **Update PesaFlux dashboard** with new webhook URL.
3. **Test thoroughly** before removing PHP webhook.

### Webhook URL Examples
- **Local**: http://localhost:3001/webhook
- **Production**: https://yourdomain.com/webhook
- **VPS**: http://your-server-ip:3001/webhook

## Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in .env or use `lsof -i :3001` to kill process.
2. **Google Sheet not logging**: Check GOOGLE_SHEETS_WEBAPP_URL in .env.
3. **CORS errors**: Ensure CORS is enabled in webhook-server.js.

### Debug Mode
```bash
# Enable debug logging
DEBUG=* node webhook-server.js
```

### Check Logs
```bash
# PM2 logs
pm2 logs pesaflex-webhook

# Local logs
node webhook-server.js > webhook.log 2>&1
```

## Security Considerations

1. **Use HTTPS** in production.
2. **Validate webhook signatures** if PesaFlux provides them.
3. **Rate limiting** for production use.
4. **Environment variables** for sensitive data.

## Support

If you encounter issues:
1. Check the webhook server logs
2. Test with the provided test script
3. Verify Google Apps Script URL is accessible
4. Ensure PesaFlux webhook URL is updated correctly