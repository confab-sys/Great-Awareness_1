import { Platform } from 'react-native';
import { GOOGLE_SHEETS_WEBAPP_URL } from '../config/constants';

export interface PaymentRecord {
  id: string;
  transactionId: string;
  status: string;
  product: string;
  amount: number;
  phoneNumber: string;
  timestamp: string;
  confirmedAt?: string;
}

export interface PaymentDetectionResult {
  success: boolean;
  found: boolean;
  payment?: PaymentRecord;
  message?: string;
  error?: string;
}

class PaymentDetectionService {
  private lastCheckTime: Date = new Date();
  private isPolling: boolean = false;
  private pollingInterval: number | null = null;

  /**
   * Start polling for recent successful payments
   */
  startPolling(callback: (payment: PaymentRecord) => void) {
    if (this.isPolling) {
      console.log('🔄 Payment polling already active');
      return;
    }

    this.isPolling = true;
    console.log('🔄 Starting payment detection polling...');

    this.pollingInterval = setInterval(async () => {
      try {
        const recentPayments = await this.getRecentSuccessfulPayments();
        
        for (const payment of recentPayments) {
          // Check if this payment is newer than our last check
          const paymentTime = new Date(payment.timestamp);
          if (paymentTime > this.lastCheckTime) {
            console.log('✅ New successful payment detected:', payment);
            callback(payment);
          }
        }
        
        this.lastCheckTime = new Date();
      } catch (error) {
        console.error('❌ Error during payment polling:', error);
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stop polling for payments
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('🛑 Stopped payment detection polling');
  }

  /**
   * Get recent successful payments from Google Sheet
   */
  async getRecentSuccessfulPayments(): Promise<PaymentRecord[]> {
    if (!GOOGLE_SHEETS_WEBAPP_URL) {
      console.warn('GOOGLE_SHEETS_WEBAPP_URL is not configured');
      return [];
    }

    try {
      // Get payments from the last 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const url = `${GOOGLE_SHEETS_WEBAPP_URL}?mode=recent&since=${tenMinutesAgo.toISOString()}`;
      
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

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
        console.error('Failed to fetch recent payments:', response.status);
        return [];
      }

      const result = await response.json();
      
      if (result.success && result.payments) {
        // Filter for confirmed payments only
        return result.payments.filter((payment: any) => 
          payment.status === 'CONFIRMED' || payment.status === 'SUCCESS'
        );
      }

      return [];
    } catch (error) {
      console.error('Error fetching recent payments:', error);
      return [];
    }
  }

  /**
   * Check for specific product payment
   */
  async checkProductPayment(productName: string, amount: number, phoneNumber: string): Promise<PaymentDetectionResult> {
    try {
      const recentPayments = await this.getRecentSuccessfulPayments();
      
      // Look for matching payment
      const matchingPayment = recentPayments.find(payment => 
        payment.product.toLowerCase().includes(productName.toLowerCase()) &&
        payment.amount === amount &&
        payment.phoneNumber === phoneNumber
      );

      if (matchingPayment) {
        return {
          success: true,
          found: true,
          payment: matchingPayment
        };
      }

      return {
        success: true,
        found: false
      };
    } catch (error) {
      return {
        success: false,
        found: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Manual check for payment status
   */
  async manualCheckPayment(productName: string, amount: number, phoneNumber: string): Promise<PaymentDetectionResult> {
    console.log('🔍 Manual payment check:', { productName, amount, phoneNumber });
    
    return await this.checkProductPayment(productName, amount, phoneNumber);
  }
}

export default new PaymentDetectionService();
