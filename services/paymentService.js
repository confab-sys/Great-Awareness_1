import axios from 'axios';
import { PAYMENT_PROVIDERS } from '../config/paymentProviders';
import googleSheetWriter from './googleSheetWriter';

class PaymentService {
  async sendSTKPush(phoneNumber, amount, provider = 'pesaflux', productName = '') {
    switch(provider.toLowerCase()) {
      case 'daraja':
        return this.darajaPayment(phoneNumber, amount);
      case 'pesaflux':
        return this.pesafluxPayment(phoneNumber, amount, productName);
      default:
        throw new Error('Payment provider not supported');
    }
  }

  async darajaPayment(phoneNumber, amount) {
    // Existing Daraja implementation placeholder
    throw new Error('Daraja implementation not available');
  }

  async pesafluxPayment(phoneNumber, amount, productName = '') {
    try {
      console.log('📞 Phone Number:', phoneNumber);
      console.log('💰 Amount:', amount);
      console.log('🔑 API Key:', PAYMENT_PROVIDERS.pesaflux.credentials.apiKey);
      
      const config = PAYMENT_PROVIDERS.pesaflux;
      
      // Format phone number
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('+254')) {
        formattedPhone = phoneNumber.substring(1);
      }
      
      console.log('📱 Formatted Phone:', formattedPhone);
      
      const payload = {
        api_key: config.credentials.apiKey.trim(), // Ensure no whitespace in API key
        email: config.credentials.email,
        amount: amount.toString(),
        msisdn: formattedPhone,
        reference: 'GA_' + Date.now(), // Adding required reference parameter with unique timestamp
      };
      
      console.log('📤 Payload:', payload);
      console.log('🌐 Endpoint:', `${config.baseUrl}${config.endpoints.stkPush}`);
      
      console.log('⏳ Sending request to PesaFlux API...');
      try {
        console.log('🔄 Attempting connection to:', `${config.baseUrl}${config.endpoints.stkPush}`);
        const response = await axios.post(
          `${config.baseUrl}${config.endpoints.stkPush}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          }
        );
        
        console.log('✅ Response:', response.data);
        
        // Handle success response format
        if (response.data && response.data.success === "200") {
          const result = {
            success: true,
            message: response.data.massage || 'Request sent successfully',
            transactionId: response.data.transaction_request_id,
            provider: 'pesaflux',
            response: response.data,
          };
          
          // Log the payment initiation to Google Sheet
          try {
            await googleSheetWriter.logSuccessfulTransaction({
              transactionId: response.data.transaction_request_id,
              amount: amount,
              msisdn: formattedPhone,
              product: productName || 'Payment Initiated',
              status: 'CONFIRMED'
            });
          } catch (error) {
            console.error('❌ Error logging payment initiation:', error);
          }
          
          return result;
        }

        return {
          success: false,
          message: 'Unexpected response format',
          response: response.data,
        };
      } catch (error) {
        console.error('❌ PesaFlux API Error:', error);
        console.error('❌ Error Code:', error.code);
        console.error('❌ Error Message:', error.message);
        
        // Log more details about the error
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          console.error('❌ Response Status:', error.response.status);
          console.error('❌ Response Data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('❌ No response received from server');
          console.error('❌ Request details:', error.request);
        }
        
        // Return a structured error response
        return {
          success: false,
          message: `Network Error: ${error.message}`,
          error: error,
          provider: 'pesaflux'
        };
      }

    } catch (error) {
      console.error('❌ Payment Error:', error);
      
      // Log network error details
      if (error.code === 'ECONNREFUSED') {
        console.error('❌ Connection refused. The server is not reachable.');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('❌ Connection timed out. The server took too long to respond.');
      } else if (error.code === 'ENOTFOUND') {
        console.error('❌ DNS lookup failed. The domain name could not be resolved.');
      }
      
      // Log response error if available
      if (error.response) {
        console.error('❌ Error Status:', error.response.status);
        console.error('❌ Error Response:', error.response.data);
      } else if (error.request) {
        console.error('❌ No response received from server. Request was made but no response.');
      } else {
        console.error('❌ Error setting up request:', error.message);
      }
      
      return this.handlePesaFluxError(error);
    }
  }

  async checkTransactionStatus(transactionId) {
    try {
      const config = PAYMENT_PROVIDERS.pesaflux;
      
      const payload = {
        api_key: config.credentials.apiKey.trim(), // Ensure no whitespace in API key
        email: config.credentials.email,
        transaction_request_id: transactionId,
        reference: 'GA_STATUS_' + Date.now(), // Adding required reference parameter with unique timestamp
      };
      
      console.log('🔍 Checking transaction status for ID:', transactionId);
      console.log('📤 Status Check Payload:', payload);
      console.log('🌐 Status Check Endpoint:', `${config.baseUrl}${config.endpoints.transactionStatus}`);

      try {
        console.log('🔄 Attempting connection to status endpoint...');
        const response = await axios.post(
          `${config.baseUrl}${config.endpoints.transactionStatus}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          }
        );
        
        console.log('✅ Status Response:', response.data);
        
        // Handle transaction status response format
        if (response.data && (response.data.ResultCode === "200" || response.data.ResultCode === 200)) {
          return {
            success: true,
            transactionId: response.data.TransactionID,
            status: response.data.TransactionStatus,
            transactionCode: response.data.TransactionCode,
            transactionReceipt: response.data.TransactionReceipt,
            amount: response.data.TransactionAmount,
            msisdn: response.data.Msisdn,
            transactionDate: response.data.TransactionDate,
            transactionReference: response.data.TransactionReference,
            response: response.data,
          };
        }
        
        // Also check for successful transactions with different response formats
        if (response.data && response.data.TransactionStatus === "SUCCESS") {
          return {
            success: true,
            transactionId: response.data.TransactionID,
            status: response.data.TransactionStatus,
            transactionCode: response.data.TransactionCode,
            transactionReceipt: response.data.TransactionReceipt,
            amount: response.data.TransactionAmount,
            msisdn: response.data.Msisdn,
            transactionDate: response.data.TransactionDate,
            transactionReference: response.data.TransactionReference,
            response: response.data,
          };
        }
        
        // If we got a response but it's not a success
        return {
          success: false,
          message: response.data.ResultDesc || 'Transaction status check failed',
          response: response.data,
          provider: 'pesaflux'
        };
      } catch (error) {
        console.error('❌ Transaction Status API Error:', error);
        console.error('❌ Error Code:', error.code);
        console.error('❌ Error Message:', error.message);
        
        // Log more details about the error
        if (error.response) {
          console.error('❌ Response Status:', error.response.status);
          console.error('❌ Response Data:', error.response.data);
        } else if (error.request) {
          console.error('❌ No response received from server');
          console.error('❌ Request details:', error.request);
        }
        
        // Return a structured error response
        return {
          success: false,
          message: `Network Error: ${error.message}`,
          error: error,
          provider: 'pesaflux'
        };
      }

    } catch (error) {
      console.error('❌ Outer try-catch error in checkTransactionStatus:', error);
      return this.handlePesaFluxError(error);
    }
  }

  handlePesaFluxError(error) {
    // Handle error response format
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Handle PesaFlux error format
      if (errorData.ResponseCode) {
        return {
          success: false,
          message: errorData.ResponseDescription || 'Payment failed',
          responseCode: errorData.ResponseCode,
          transactionId: errorData.TransactionID,
          provider: 'pesaflux',
          error: errorData,
        };
      }
      
      // Handle transaction status error format
      if (errorData.ResultCode) {
        return {
          success: false,
          message: errorData.ResultDesc || 'Transaction check failed',
          responseCode: errorData.ResultCode,
          provider: 'pesaflux',
          error: errorData,
        };
      }
      
      return {
        success: false,
        message: errorData.message || 'Payment failed',
        provider: 'pesaflux',
        error: errorData,
      };
    }

    return {
      success: false,
      message: error.message || 'Payment failed',
      provider: 'pesaflux',
      error: error,
    };
  }
}

export default new PaymentService();