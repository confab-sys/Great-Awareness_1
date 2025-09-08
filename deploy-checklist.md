# Vercel Deployment Checklist - Fix Supabase Logging

## Immediate Actions Required

### 1. Environment Variables Setup
**Go to Vercel Dashboard > Your Project > Settings > Environment Variables**

Add these required variables:
- `SUPABASE_URL=https://seequpormifvziwxfeqv.supabase.co`
- `SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZXF1cG9ybWlmdnppd3hmZXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NjA5NzEsImV4cCI6MjA1MTIzNjk3MX0.9IqQ7rDTZ3z4z3K7G9G8J7G9G8J7G9G8J7G9G8J7G9G8`
- `NODE_ENV=production`

### 2. Update Webhook URL in PesaFlux
**Your new webhook URL:**
```
https://great-awareness-app.vercel.app/api/webhook
```

Replace `great-awareness-app` with your actual Vercel project name.

### 3. Redeploy After Environment Variables
```bash
# In your project directory
vercel --prod
```

### 4. Test the Webhook
```bash
# Test your webhook endpoint
curl -X POST https://great-awareness-app.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"TransactionID":"test-123","TransactionAmount":"1","TransactionReceipt":"test","Msisdn":"254700000000","TransactionStatus":"Completed"}'
```

## Quick Verification Steps

1. **Check Vercel Logs:**
   ```bash
   vercel logs great-awareness-app.vercel.app --follow
   ```

2. **Test Purchase Flow:**
   - Make a test payment
   - Check Vercel logs for webhook hits
   - Verify Supabase has new purchase record
   - Confirm download popup appears

## Common Missing Variables

### Required for Production:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NODE_ENV=production`

### Optional but Helpful:
- `VERCEL_URL` (auto-set by Vercel)

## Debug Commands

### Check Environment Variables in Vercel:
```bash
vercel env pull .env.local
```

### Test Locally with Production Environment:
```bash
vercel dev
```

## Expected Behavior After Fix

1. ✅ Webhook receives payment notifications
2. ✅ Purchases logged to Supabase
3. ✅ Automatic download popup appears
4. ✅ Test product downloads work correctly

## If Still Not Working

1. **Check Vercel deployment logs:**
   ```bash
   vercel logs --tail
   ```

2. **Verify webhook URL format:**
   - Must be HTTPS
   - Must end with `/api/webhook`
   - Must be accessible from PesaFlux

3. **Test with browser:**
   - Open: `https://your-project.vercel.app/api/webhook`
   - Should return 405 (Method Not Allowed) - this is correct

## Project Name Discovery

To find your exact Vercel project name:
```bash
# Check your current deployment
vercel ls
```

Your webhook URL will be: `https://[project-name].vercel.app/api/webhook`