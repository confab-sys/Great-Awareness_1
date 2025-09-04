import { Platform } from 'react-native';
import { GOOGLE_SHEETS_WEBAPP_URL } from '../config/constants';

export type SheetTransactionResponse = {
  success: boolean;
  found: boolean;
  transaction?: {
    rowIndex: number;
    transactionId: string;
    status: string;
    product: string;
    amount: number;
    msisdn: string;
    timestamp: string;
    id?: string;
  };
  message?: string;
  error?: string;
};

class SheetStatusService {
  async checkTransactionStatus(transactionId: string): Promise<SheetTransactionResponse> {
    if (!GOOGLE_SHEETS_WEBAPP_URL) {
      console.warn('GOOGLE_SHEETS_WEBAPP_URL is not configured. Cannot check transaction status.');
      return {
        success: false,
        found: false,
        error: 'Google Sheets URL not configured'
      };
    }

    try {
      console.log('🔍 Checking transaction status in Google Sheet for ID:', transactionId);
      
      // Construct the URL with transaction ID as parameter
      const url = `${GOOGLE_SHEETS_WEBAPP_URL}?transactionId=${encodeURIComponent(transactionId)}`;
      
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      // For web, use 'text/plain' to avoid CORS preflight issues
      if (Platform.OS === 'web') {
        headers['Content-Type'] = 'text/plain';
      } else {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to check transaction status in Google Sheet:', response.status, errorText);
        return {
          success: false,
          found: false,
          error: `HTTP ${response.status}: ${errorText}`
        };
      }

      const result: SheetTransactionResponse = await response.json();
      console.log('📊 Google Sheet status check result:', result);
      
      return result;
    } catch (error) {
      console.error('Error checking transaction status in Google Sheet:', error);
      return {
        success: false,
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async checkRecentPayments(productTitle: string, amount: number, phoneNumber: string): Promise<SheetTransactionResponse> {
    if (!GOOGLE_SHEETS_WEBAPP_URL) {
      console.warn('GOOGLE_SHEETS_WEBAPP_URL is not configured. Cannot check recent payments.');
      return {
        success: false,
        found: false,
        error: 'Google Sheets URL not configured'
      };
    }

    try {
      console.log('🔍 Checking for recent payments:', { productTitle, amount, phoneNumber });
      
      // Get all recent payments from the last 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const url = `${GOOGLE_SHEETS_WEBAPP_URL}?mode=recent&since=${tenMinutesAgo.toISOString()}`;
      
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      // For web, use 'text/plain' to avoid CORS preflight issues
      if (Platform.OS === 'web') {
        headers['Content-Type'] = 'text/plain';
      } else {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to check recent payments in Google Sheet:', response.status, errorText);
        return {
          success: false,
          found: false,
          error: `HTTP ${response.status}: ${errorText}`
        };
      }

      const result = await response.json();
      console.log('📊 Recent payments check result:', result);
      
      // If we got a list of payments, filter for our specific payment
      if (result.success && result.payments && Array.isArray(result.payments)) {
        const matchingPayment = result.payments.find((payment: any) => 
          payment.product && payment.product.toLowerCase().includes(productTitle.toLowerCase()) &&
          payment.amount === amount &&
          payment.msisdn === phoneNumber &&
          (payment.status === 'CONFIRMED' || payment.status === 'SUCCESS')
        );

        if (matchingPayment) {
          return {
            success: true,
            found: true,
            transaction: {
              rowIndex: matchingPayment.rowIndex || 0,
              transactionId: matchingPayment.transactionId || matchingPayment.id || '',
              status: matchingPayment.status,
              product: matchingPayment.product,
              amount: matchingPayment.amount,
              msisdn: matchingPayment.msisdn,
              timestamp: matchingPayment.timestamp,
              id: matchingPayment.id || matchingPayment.transactionId
            }
          };
        }
      }

      // Fallback to the original specific search
      const specificUrl = `${GOOGLE_SHEETS_WEBAPP_URL}?product=${encodeURIComponent(productTitle)}&amount=${amount}&phone=${encodeURIComponent(phoneNumber)}&mode=recent`;
      
      const specificResponse = await fetch(specificUrl, {
        method: 'GET',
        headers: headers,
      });

      if (specificResponse.ok) {
        const specificResult: SheetTransactionResponse = await specificResponse.json();
        return specificResult;
      }

      return {
        success: true,
        found: false
      };
    } catch (error) {
      console.error('Error checking recent payments in Google Sheet:', error);
      return {
        success: false,
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export default new SheetStatusService();
