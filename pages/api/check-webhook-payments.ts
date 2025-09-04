import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory storage for recent webhook payments (in production, use a database)
let recentWebhookPayments: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber, expectedAmount, productTitle } = req.body;

    console.log('🔍 Checking for webhook payments...');
    console.log('Looking for:', { phoneNumber, expectedAmount, productTitle });

    // Check if there are any recent successful payments
    const recentPayments = recentWebhookPayments.filter(payment => {
      // Check if payment is recent (within last 5 minutes)
      const isRecent = Date.now() - payment.timestamp < 5 * 60 * 1000;
      
      // Check if payment matches our criteria
      const matchesAmount = payment.amount === expectedAmount;
      const matchesProduct = payment.productName === productTitle;
      
      return isRecent && matchesAmount && matchesProduct;
    });

    if (recentPayments.length > 0) {
      const payment = recentPayments[0]; // Get the most recent matching payment
      
      console.log('✅ Found matching webhook payment:', payment);
      
      // Remove this payment from the list so it's not processed again
      recentWebhookPayments = recentWebhookPayments.filter(p => p.transactionId !== payment.transactionId);
      
      return res.status(200).json({
        success: true,
        downloadTriggered: true,
        productName: payment.productName,
        amount: payment.amount,
        receipt: payment.receipt,
        transactionId: payment.transactionId,
        phoneNumber: payment.phoneNumber
      });
    }

    return res.status(200).json({
      success: true,
      downloadTriggered: false,
      message: 'No matching webhook payments found'
    });

  } catch (error) {
    console.error('❌ Error checking webhook payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking webhook payments'
    });
  }
}

// Function to store webhook payments (called by the webhook endpoint)
export function storeWebhookPayment(paymentData: any) {
  recentWebhookPayments.push({
    ...paymentData,
    timestamp: Date.now()
  });
  
  // Keep only recent payments (last 10 minutes)
  recentWebhookPayments = recentWebhookPayments.filter(
    payment => Date.now() - payment.timestamp < 10 * 60 * 1000
  );
  
  console.log('💾 Stored webhook payment:', paymentData);
  console.log('📊 Total stored payments:', recentWebhookPayments.length);
}
