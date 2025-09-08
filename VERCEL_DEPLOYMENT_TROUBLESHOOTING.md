# Vercel Deployment Troubleshooting Guide

## Issue: Purchases Not Logging to Supabase After Vercel Deployment

### Problem Overview
When deployed to Vercel, purchases are not being logged to Supabase, preventing the automatic download popup from appearing after successful payments.

### Quick Diagnostic Steps

#### 1. Verify Webhook URL Configuration
**Check your PesaFlux provider settings:**
- Ensure the webhook URL is set to: `https://your-project-name.vercel.app/api/webhook`
- Test the webhook endpoint directly: `curl -X POST https://your-project-name.vercel.app/api/webhook`

#### 2. Check Vercel Environment Variables
**Required Environment Variables:**
```bash
# In Vercel Dashboard > Settings > Environment Variables
SUPABASE_URL=https://seequpormifvziwxfeqv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

#### 3. Verify API Route Accessibility
**Test your webhook endpoint:**
```bash
curl -X POST https://your-project-name.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Common Issues and Solutions

#### Issue 1: Missing Environment Variables
**Symptoms:** Webhook returns 500 errors, no Supabase logging
**Solution:**
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add all required variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NODE_ENV=production`

#### Issue 2: CORS/Security Headers
**Symptoms:** Webhook requests blocked by browser
**Solution:** Update your webhook handler to handle CORS:

```typescript
// In pages/api/webhook.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // ... rest of your handler
}
```

#### Issue 3: Function Timeout
**Symptoms:** Webhook processing times out
**Solution:** Increase function timeout in `vercel.json`:

```json
{
  "functions": {
    "pages/api/webhook.ts": {
      "maxDuration": 30
    }
  }
}
```

### Debugging Steps

#### Step 1: Check Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# View real-time logs
vercel logs your-project-name.vercel.app --follow
```

#### Step 2: Add Enhanced Logging
**Update your webhook handler with detailed logging:**

```typescript
// In pages/api/webhook.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== WEBHOOK DEBUG INFO ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Supabase URL exists:', !!process.env.SUPABASE_URL);
  
  try {
    // Your existing code...
  } catch (error) {
    console.error('=== WEBHOOK ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ error: error.message });
  }
}
```

#### Step 3: Test Webhook Manually
**Create a test script:**

```bash
# test-webhook.sh
#!/bin/bash
WEBHOOK_URL="https://your-project-name.vercel.app/api/webhook"

curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "TransactionID": "test-123",
    "TransactionAmount": "1",
    "TransactionReceipt": "test-receipt",
    "Msisdn": "254700000000",
    "TransactionStatus": "Completed"
  }'
```

### Environment Variable Checklist

#### Required Variables for Production
```bash
# Add these in Vercel Dashboard
SUPABASE_URL=https://seequpormifvziwxfeqv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
```

#### Optional but Recommended
```bash
# For better debugging
VERCEL_URL=your-project-name.vercel.app
```

### Testing Your Fix

#### 1. Redeploy with Changes
```bash
# Deploy to Vercel
vercel --prod
```

#### 2. Monitor Logs
```bash
# Watch logs during testing
vercel logs your-project-name.vercel.app --follow
```

#### 3. Test Complete Flow
1. Make a test payment through your app
2. Check Vercel logs for webhook hits
3. Verify Supabase has new purchase records
4. Confirm download popup appears

### Quick Fix Commands

#### Check Current Configuration
```bash
# Check if webhook is accessible
curl -I https://your-project-name.vercel.app/api/webhook

# Test with sample data
curl -X POST https://your-project-name.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"TransactionID":"test","TransactionAmount":"1","Msisdn":"254700000000"}'
```

### Emergency Rollback
If issues persist:
1. Check if ngrok URL still works for comparison
2. Temporarily revert to development webhook URL
3. Debug locally with `vercel dev`

### Support Resources
- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Logs Documentation](https://vercel.com/docs/cli#logs

### Next Steps
1. Add the missing environment variables to Vercel
2. Test the webhook endpoint directly
3. Check Vercel logs for specific error messages
4. Verify the complete payment flow works end-to-end