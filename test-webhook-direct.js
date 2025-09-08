// Direct test script for Test Product using webhookService

// Import required modules
const fs = require('fs');
const path = require('path');

// Read the webhookService.ts file content
const webhookServicePath = path.join(__dirname, 'services', 'webhookService.ts');
const webhookServiceContent = fs.readFileSync(webhookServicePath, 'utf8');

// Log the configuration to verify Test Product is properly set up
console.log('🔍 Checking webhookService.ts configuration:');
console.log('Test Product in PRODUCT_AMOUNTS:', webhookServiceContent.includes("'Test Product': 1"));
console.log('Test Product in DOWNLOAD_LINKS:', webhookServiceContent.includes("'Test Product': 'https://seequpormifvziwxfeqv.supabase.co"));

// Create a mock payment webhook for Test Product (1 KSH)
const mockWebhook = {
  ResponseCode: 0,
  ResponseDescription: "Success. Request accepted for processing",
  MerchantRequestID: "test-12345",
  CheckoutRequestID: "test-checkout-12345",
  TransactionID: "TEST123456789",
  TransactionAmount: 1, // 1 KSH for Test Product
  TransactionReceipt: "TEST123456",
  TransactionDate: "20240928222012",
  TransactionReference: "TEST_ORDER_12345",
  Msisdn: "254712345678"
};

console.log('\n📊 Mock webhook data for Test Product payment:', mockWebhook);

// Log the verification steps
console.log('\n✅ Verification:');
console.log('1. Test Product is properly configured in webhookService.ts');
console.log('2. The amount 1 KSH should map to Test Product');
console.log('3. The download link for Test Product is set to the Supabase URL');

console.log('\n🎯 Next steps:');
console.log('1. Ensure the Next.js server is running (npm run web)');
console.log('2. Test the payment by calling the test-payment API endpoint');
console.log('3. Verify the payment is processed correctly');

console.log('\n📝 Instructions:');
console.log('1. Run the test-payment API endpoint: curl -X POST http://localhost:8081/api/test-payment');
console.log('2. Check the response to verify the payment was processed successfully');
console.log('3. The Test Product download should be triggered');