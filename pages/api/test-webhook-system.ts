import { NextApiRequest, NextApiResponse } from 'next';
import { storeWebhookPayment } from './check-webhook-payments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing complete webhook system...');

    // Simulate a successful payment for "The Confidence Map"
    const testPaymentData = {
      productName: 'The Confidence Map',
      amount: 1,
      receipt: 'TEST123456',
      transactionId: 'TEST123456789',
      phoneNumber: '254769290734',
      downloadTriggered: true
    };

    // Store the test payment
    storeWebhookPayment(testPaymentData);

    console.log('✅ Test payment stored successfully');

    return res.status(200).json({
      success: true,
      message: 'Test webhook system activated',
      testData: testPaymentData,
      instructions: [
        '1. The test payment has been stored',
        '2. The client should now detect this payment within 5 seconds',
        '3. The download should be triggered automatically',
        '4. Check the browser console for logs'
      ]
    });

  } catch (error) {
    console.error('❌ Test webhook system error:', error);
    return res.status(500).json({
      success: false,
      message: 'Test webhook system error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
