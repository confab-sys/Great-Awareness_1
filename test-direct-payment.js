// Simple direct test script for Test Product payment processing

// Import webhookService with the correct path
const webhookService = require('./services/webhookService.ts');
// If the above import fails, try this alternative:
// import webhookService from './services/webhookService';

async function testDirectPayment() {
  console.log('🧪 Testing Test Product payment processing directly...');
  
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
  
  console.log('📊 Mock webhook data:', mockWebhook);
  
  try {
    // Process the payment directly using the webhookService
    console.log('\n🔄 Processing payment directly through webhookService...');
    const result = await webhookService.processPaymentWebhook(mockWebhook);
    
    console.log('\n✅ Payment processing result:', result);
    
    if (result && result.success) {
      console.log('🎉 Test Product payment processed successfully!');
      console.log('📦 Product:', result.productName);
      console.log('🔗 Download triggered:', result.downloadTriggered);
    } else {
      console.log('❌ Payment processing failed:', result);
    }
  } catch (error) {
    console.error('❌ Error processing payment:', error.message);
  }
}

// Run the test
testDirectPayment();