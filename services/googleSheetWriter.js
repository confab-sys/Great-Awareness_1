import { GOOGLE_SHEETS_WEBAPP_URL } from '../config/constants.js';

class GoogleSheetWriter {
  constructor() {
    // Use the Google Apps Script web app URL from constants
    this.appsScriptUrl = GOOGLE_SHEETS_WEBAPP_URL;
  }

  async logSuccessfulTransaction(transactionData) {
    try {
      console.log('📝 Logging successful transaction to Google Sheet:', transactionData);
      console.log('🌐 Using Google Sheet URL:', this.appsScriptUrl);
      
      const payload = {
        timestamp: new Date().toISOString(),
        product: transactionData.product || 'Unknown',
        amount: transactionData.amount || 0,
        msisdn: transactionData.phoneNumber || transactionData.msisdn || 'Unknown',
        transactionId: transactionData.transactionId || 'Unknown',
        status: 'CONFIRMED',
        receipt: transactionData.receipt || 'Unknown'
      };

      console.log('📤 Sending to Google Apps Script:', JSON.stringify(payload));

      console.log('🔄 Attempting fetch to Google Sheet URL:', this.appsScriptUrl);
      
      // Enhanced fetch with better CORS handling
      const response = await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send cookies
        cache: 'no-cache', // Don't use cache
        body: JSON.stringify(payload)
      });
      
      console.log('📡 Fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Google Sheet write response:', result);
      
      // Handle both response formats: {success: true} and {ok: true}
      return result.success === true || result.ok === true;
      
    } catch (error) {
      console.error('❌ Error writing to Google Sheet:', error);
      return false;
    }
  }

  async logFailedTransaction(transactionData) {
    try {
      console.log('📝 Logging failed transaction to Google Sheet:', transactionData);
      
      const payload = {
        timestamp: new Date().toISOString(),
        product: transactionData.product || 'Unknown',
        amount: transactionData.amount || 0,
        msisdn: transactionData.phoneNumber || transactionData.msisdn || 'Unknown',
        transactionId: transactionData.transactionId || 'Unknown',
        status: 'FAILED'
      };

      const response = await fetch(this.appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Google Sheet write response (failed):', result);
      
      return result.success === true;
      
    } catch (error) {
      console.error('❌ Error writing failed transaction to Google Sheet:', error);
      return false;
    }
  }
}

export default new GoogleSheetWriter();
