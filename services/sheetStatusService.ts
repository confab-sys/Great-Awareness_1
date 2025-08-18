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
}

export default new SheetStatusService();
