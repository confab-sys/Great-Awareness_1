import axios from 'axios';
import { Buffer } from 'buffer';
import { DARAJA_CONFIG, getEndpointUrl } from '../config/daraja';
import { formatPhoneNumber, generatePassword, generateTimestamp, generateTransactionReference } from '../utils/encryption';

class DarajaService {
  constructor() {
    this.accessToken = null;
  }

  // Get OAuth access token
  async getAccessToken() {
    try {
      const raw = `${DARAJA_CONFIG.CONSUMER_KEY}:${DARAJA_CONFIG.CONSUMER_SECRET}`;
      const credentials = Buffer.from(raw).toString('base64');
      
      const response = await axios.get(`${DARAJA_CONFIG.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with Daraja API');
    }
  }

  // Process book payment
  async processBookPayment(phoneNumber, amount = 400) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = generateTimestamp();
      const password = generatePassword(
        DARAJA_CONFIG.BUSINESS_TILL,
        DARAJA_CONFIG.PASSKEY,
        timestamp
      );
      const transactionReference = generateTransactionReference();
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Make the actual STK push call
      const payload = {
        BusinessShortCode: DARAJA_CONFIG.BUSINESS_TILL,
        Password: password,
        Timestamp: timestamp,
        // In the processBookPayment method, change:
        TransactionType: DARAJA_CONFIG.TRANSACTION_TYPES.CUSTOMER_BUY_GOODS_ONLINE,
        // Instead of:
        // TransactionType: DARAJA_CONFIG.TRANSACTION_TYPES.CUSTOMER_PAY_BILL_ONLINE,
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: DARAJA_CONFIG.BUSINESS_TILL,
        PhoneNumber: formattedPhone,
        CallBackURL: DARAJA_CONFIG.CALLBACK_URL,
        AccountReference: 'Great Awareness Book Store',
        TransactionDesc: 'Book Purchase - Unlocking the Primal Brain',
        CheckoutRequestID: transactionReference,
      };

      const response = await axios.post(getEndpointUrl('STK_PUSH'), payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.ResponseCode === '0') {
        return {
          success: true,
          message: 'Payment request sent successfully. Please check your phone for M-Pesa prompt.',
          checkoutRequestID: response.data.CheckoutRequestID,
          transactionReference: transactionReference,
        };
      } else {
        return {
          success: false,
          message: response.data.ResponseDescription || 'Payment request failed',
        };
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        message: error.message || 'Payment processing failed',
      };
    }
  }
}

const darajaService = new DarajaService();
export default darajaService;
