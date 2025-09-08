// Simple test script for Test Product payment

const axios = require('axios');

async function testSimplePayment() {
  console.log('🧪 Testing Test Product payment processing...');
  
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
    // Call the test-payment API endpoint
    console.log('\n🌐 Calling test-payment API endpoint...');
    const response = await axios.post('http://localhost:8081/webhook', mockWebhook, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ API response:', response.data);
    
    if (response.data && (response.data.success || response.data.status === 'success')) {
      console.log('🎉 Test payment processed successfully!');
    } else {
      console.log('⚠️ Test payment processing failed or returned unexpected result.');
    }
  } catch (error) {
    console.error('❌ Error calling API:', error.message);
    if (error.response) {
      console.error('📄 Error response:', error.response.data);
    }
  }
}

// Run the test
testSimplePayment();