# Test Product Setup Guide

This guide explains how to set up and test the Test Product payment and download functionality.

## Overview

The Test Product is a 1 KSH product that uses the same payment flow as other products in the application. When a user purchases the Test Product, they will receive a download link to access the PDF file stored in Supabase.

## Setup Steps

### 1. Add Test Product to Supabase Database

Run the SQL script to add the Test Product to your Supabase database:

```sql
-- Run this in your Supabase SQL Editor
INSERT INTO books (id, title, author, description, price, file_path, cover_path, created_at, updated_at)
VALUES (
  'Test Product',
  'Test Product',
  'Great Awareness',
  'This is a test product for payment system testing.',
  1,
  'test product.pdf',
  NULL,
  NOW(),
  NOW()
);
```

### 2. Upload Test Product PDF to Supabase Storage

The Test Product PDF should already be uploaded to your Supabase storage at:
`https://seequpormifvziwxfeqv.supabase.co/storage/v1/object/public/Books/test%20product.pdf`

If not, upload it through the Supabase dashboard:
1. Go to Storage in your Supabase dashboard
2. Navigate to the 'Books' bucket
3. Upload the Test Product PDF file with the name 'test product.pdf'

### 3. Verify Webhook Configuration

Ensure your webhook server is properly configured to handle payments:

1. Check that your webhook server is running:
   ```bash
   npm run start:webhook
   ```

2. Verify that your Vercel deployment has the correct environment variables:
   - `GOOGLE_SHEETS_WEBAPP_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - Other required environment variables

3. Make sure PesaFlux is configured to send webhooks to your Vercel deployment URL:
   ```
   https://your-vercel-app.vercel.app/api/webhook
   ```

### 4. Test the Payment Flow

#### Local Testing

You can test the webhook functionality locally using the provided test script:

```bash
node test-test-product-webhook.js
```

This will simulate a successful payment for the Test Product and verify that the download link is generated correctly.

#### Live Testing

To test the complete payment flow:

1. Navigate to the Test Product page in your application
2. Click the "Purchase" button
3. Enter a valid M-Pesa phone number
4. Complete the payment (1 KSH)
5. After payment is confirmed, you should receive a download link

## Troubleshooting

### Payment Not Being Detected

If payments are not being detected:

1. Check the webhook logs in your Vercel deployment
2. Verify that PesaFlux is correctly configured to send webhooks to your endpoint
3. Ensure the Test Product is properly set up in the `webhookService.ts` file

### Download Link Not Working

If the download link is not working:

1. Check that the Test Product is correctly added to the Supabase database
2. Verify that the file path in the database matches the actual file path in Supabase storage
3. Ensure the Supabase service is correctly configured with the proper credentials

## Callback URL Information

The callback URL is the endpoint where PesaFlux will send payment notifications.

### For Production (Vercel Deployment)

```
https://your-vercel-app.vercel.app/api/webhook
```

### For Local Testing

When testing locally, you'll need to make your local server accessible to PesaFlux. There are two approaches:

1. **Using a Tunnel Service (Option 1)**:
   Use a service like localtunnel or Cloudflare Tunnel to expose your local server to the internet.
   
   For example, with localtunnel (install via npm first):
   ```bash
   npm install -g localtunnel
   lt --port 8081
   ```

   Then use the generated URL as your callback:
   ```
   https://your-random-subdomain.loca.lt/api/webhook
   ```

   Note: Your local server is running on port 8081, so make sure to use that port when setting up the tunnel.

2. **Direct Local Testing**:
   If you're only testing the webhook functionality without actual PesaFlux integration, you can use the test script provided (`test-test-product-webhook.js`) which simulates the webhook locally without requiring an external URL.

Make sure this URL is configured in your PesaFlux dashboard as the callback URL for payment notifications.