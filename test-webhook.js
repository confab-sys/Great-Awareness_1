// Test script for JavaScript webhook server
const axios = require('axios');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:8081/webhook';

// Test data for successful payment
const successfulPaymentData = {
  ResponseCode: 0,
  ResponseDescription: "Success",
  TransactionID: "TEST123456789",
  TransactionAmount: 1,
  TransactionReceipt: "RCPT123456789",
  Msisdn: "254712345678",
  ThirdPartyTransID: "TP123456789",
  ConversationID: "CONV123456789",
  OriginatorConversationID: "ORIG123456789"
};

// Test data for failed payment
const failedPaymentData = {
  ResponseCode: 1,
  ResponseDescription: "Insufficient funds",
  TransactionID: "TEST987654321",
  TransactionAmount: 400,
  TransactionReceipt: "",
  Msisdn: "254712345678",
  ThirdPartyTransID: "",
  ConversationID: "CONV987654321",
  OriginatorConversationID: "ORIG987654321"
};

async function testWebhook(data, testName) {
  console.log(`\n🧪 Testing ${testName}...`);
  console.log('Data:', JSON.stringify(data, null, 2));
  
  try {
    const response = await axios.post(WEBHOOK_URL, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`✅ ${testName} Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ ${testName} Error:`, error.response?.data || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting webhook tests...');
  console.log('Webhook URL:', WEBHOOK_URL);
  
  // Test successful payment
  await testWebhook(successfulPaymentData, 'Successful Payment');
  
  // Test failed payment
  await testWebhook(failedPaymentData, 'Failed Payment');
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testWebhook, runTests };