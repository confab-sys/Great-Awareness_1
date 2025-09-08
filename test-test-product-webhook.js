// Test script for Test Product webhook functionality

const axios = require('axios');
// Import webhookService with proper path
const webhookService = require('./services/webhookService');

// Mock webhook data for a Test Product purchase
const mockWebhookData = {
  ResponseCode: 0, // 0 means success
  ResponseDescription: 'Success',
  MerchantRequestID: 'test-merchant-' + Date.now(),
  CheckoutRequestID: 'test-checkout-' + Date.now(),
  TransactionID: 'TEST' + Date.now(),
  TransactionAmount: 1, // 1 KSH for Test Product
  TransactionReceipt: 'TEST' + Math.floor(Math.random() * 1000000),
  TransactionDate: new Date().toISOString(),
  TransactionReference: 'Test Product Purchase',
  Msisdn: '254712345678' // Test phone number
};

async function testWebhook() {
  console.log('🧪 Testing Test Product webhook...');
  console.log('📊 Mock webhook data:', mockWebhookData);
  
  try {
    // Option 1: Test directly with webhookService
    console.log('\n🔍 Testing directly with webhookService...');
    const directResult = await webhookService.processPaymentWebhook(mockWebhookData);
    console.log('✅ Direct test result:', directResult);
    
    if (directResult.downloadInfo && directResult.downloadInfo.downloadLink) {
      console.log('🔗 Download link generated:', directResult.downloadInfo.downloadLink);
    } else {
      console.log('❌ No download link generated');
    }
    
    // Option 2: Test via HTTP endpoint (if server is running)
    console.log('\n🌐 Testing via HTTP endpoint...');
    console.log('⚠️ Make sure your webhook server is running!');
    
    try {
      const response = await axios.post('http://localhost:8081/webhook', mockWebhookData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ HTTP test status:', response.status);
      console.log('📄 HTTP test response:', response.data);
    } catch (httpError) {
      console.error('❌ HTTP test failed:', httpError.message);
      console.log('💡 Is your webhook server running? Start it with: npm run webhook');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testWebhook();