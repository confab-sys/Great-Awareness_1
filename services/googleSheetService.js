import { GOOGLE_SHEETS_WEBAPP_URL } from '../config/constants.js';

class GoogleSheetService {
  constructor() {
    // Use URL from constants file
    this.appsScriptUrl = GOOGLE_SHEETS_WEBAPP_URL;
  }

  async getRecentTransactions() {
    try {
      console.log('📊 Fetching recent transactions from Google Apps Script...');
      
      // Direct fetch without CORS proxy
      const response = await fetch(this.appsScriptUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors' // Try with CORS mode
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Apps Script response:', data);
      
      return data.transactions || data || [];
      
    } catch (error) {
      console.error('❌ Error fetching from Google Apps Script:', error);
      return [];
    }
  }

  async checkForRecentSuccessfulTransaction(expectedAmount, phoneNumber, timeWindowMinutes = 10) {
    try {
      console.log('🔍 Checking for recent successful transaction...');
      console.log('🔍 Looking for:', {
        amount: expectedAmount,
        phone: phoneNumber,
        timeWindow: `${timeWindowMinutes} minutes`
      });
      
      const transactions = await this.getRecentTransactions();
      
      if (!transactions || transactions.length === 0) {
        console.log('📊 No transactions found in Apps Script response');
        return null;
      }
      
      const now = new Date();
      const timeWindowMs = timeWindowMinutes * 60 * 1000;
      
      for (const transaction of transactions) {
        console.log('🔍 Checking transaction:', transaction);
        
                 // Use your exact column name: timestamp_ (with underscore)
         const transactionDate = new Date(transaction.timestamp_ || transaction.timestamp);
         const isRecent = (now - transactionDate) <= timeWindowMs;
         
         // Use your exact column name: amount_ (with underscore)
         const transactionAmount = parseFloat(transaction.amount_ || transaction.amount || 0);
         const amountMatches = Math.abs(transactionAmount - expectedAmount) < 0.01;
         
         // Use your exact column name: msisdn_ (with underscore)
         const phoneMatches = !phoneNumber || 
           transaction.msisdn_ === phoneNumber ||
           transaction.msisdn_ === phoneNumber.toString() ||
           transaction.msisdn === phoneNumber ||
           transaction.msisdn === phoneNumber.toString();
         
         // Use your exact column name: status - CONFIRMED means success
         const isSuccessful = transaction.status === 'CONFIRMED' || 
           transaction.status === 'SUCCESS' || 
           transaction.status === 'COMPLETED' || 
           transaction.status === '200' ||
           transaction.status === '0' ||
           transaction.status === '1';
        
                 console.log('🔍 Transaction check:', {
           isRecent,
           amountMatches,
           phoneMatches,
           isSuccessful,
           transactionDate,
           transactionAmount,
           expectedAmount,
           transactionStatus: transaction.status,
           transactionMsisdn: transaction.msisdn_ || transaction.msisdn,
           lookingForPhone: phoneNumber
         });
        
                 if (isRecent && amountMatches && phoneMatches && isSuccessful) {
           console.log('🎉 Found matching successful transaction:', transaction);
           return {
             success: true,
             transaction: transaction,
             transactionId: transaction.transactionid_ || transaction.transactionId, // Your exact column name with underscore
             amount: transactionAmount,
             receipt: transaction.transactionid_ || transaction.transactionId, // Use transactionId as receipt
             timestamp: transactionDate,
             phoneNumber: transaction.msisdn_ || transaction.msisdn, // Your exact column name with underscore
             product: transaction.product_ || transaction.product // Your exact column name with underscore
           };
         }
      }
      
      console.log('📊 No matching recent successful transactions found');
      return null;
      
    } catch (error) {
      console.error('❌ Error checking for recent transactions:', error);
      return null;
    }
  }
}

export default new GoogleSheetService();
