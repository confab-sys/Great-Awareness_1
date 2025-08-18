import { Platform } from 'react-native';
import { GOOGLE_SHEETS_WEBAPP_URL } from '../config/constants';

export type PurchaseLogPayload = {
  timestamp: string;
  product: string;
  amount: number;
  msisdn: string;
  transactionId: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'FAILED';
};

class TelemetryService {
  async logPurchase(payload: PurchaseLogPayload): Promise<void> {
    if (payload.status !== 'CONFIRMED') {
      // Only persist confirmed transactions per request
      return;
    }
    if (!GOOGLE_SHEETS_WEBAPP_URL || GOOGLE_SHEETS_WEBAPP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL') {
      console.warn('GOOGLE_SHEETS_WEBAPP_URL is not configured. Skipping purchase logging.');
      return;
    }
    try {
      const isWeb = Platform.OS === 'web';
      const headers = isWeb
        ? { 'Content-Type': 'text/plain' } // avoid CORS preflight in browsers
        : { 'Content-Type': 'application/json' };
      await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn('Failed to log purchase:', error);
    }
  }
}

export default new TelemetryService();


