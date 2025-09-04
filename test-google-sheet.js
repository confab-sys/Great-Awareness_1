// Test script to verify Google Apps Script endpoint
const fetch = require('node-fetch');

// Get the Google Sheets URL from constants.js
const { GOOGLE_SHEETS_WEBAPP_URL } = require('./config/constants.js');

async function testGoogleSheetEndpoint() {
  try {
    console.log('🧪 Testing Google Apps Script endpoint...');
    
    // Create a test transaction payload
    const testPayload = {
      timestamp: new Date().toISOString(),
      product: 'TEST TRANSACTION',
      amount: 100,
      msisdn: '254700000000',
      transactionId: 'TEST_' + Date.now(),
      status: 'CONFIRMED'
    };

    console.log('📤 Sending test payload to Google Apps Script:', testPayload);
    console.log('🌐 Endpoint URL:', GOOGLE_SHEETS_WEBAPP_URL);

    // Send POST request to the Google Apps Script endpoint
    const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Google Sheet write response:', result);
    
    console.log('🎉 Test completed successfully!');
    console.log('Please check your Google Sheet to verify the test transaction was added.');
    
    return result;
    
  } catch (error) {
    console.error('❌ Error testing Google Sheet endpoint:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testGoogleSheetEndpoint().then(result => {
  console.log('Test completed with result:', result);
});