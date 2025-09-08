// Simple test script to check if Test Product payment processing works

const axios = require('axios');

// Mock payment data for a Test Product purchase
const mockPaymentData = {
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

async function testPaymentProcessing() {
  console.log('🧪 Testing Test Product payment processing...');
  console.log('📊 Mock payment data:', mockPaymentData);
  
  try {
    // Test the payment processing via the test-payment API endpoint
    console.log('\n🌐 Testing payment processing via test-payment API endpoint...');
    
    // Call the test-payment endpoint which will process a test webhook
    console.log('1️⃣ Calling test-payment API...');
    const testPaymentResponse = await axios.post('http://localhost:8081/api/test-payment', {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Test payment response:', testPaymentResponse.data);
    
    // Then, check if the payment was processed
    console.log('\n2️⃣ Checking payment status...');
    const statusResponse = await axios.post('http://localhost:8081/api/check-webhook-payments', {
      phoneNumber: mockPaymentData.Msisdn,
      expectedAmount: mockPaymentData.TransactionAmount,
      productTitle: 'Test Product'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Payment status response:', statusResponse.data);
    
    if (statusResponse.data && statusResponse.data.downloadTriggered) {
      console.log('🎉 Payment processed successfully!');
    } else {
      console.log('⚠️ Payment not processed yet. This could be normal if the webhook hasn\'t been received.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📄 Error response:', error.response.data);
    }
  }
}

// Run the test
testPaymentProcessing();