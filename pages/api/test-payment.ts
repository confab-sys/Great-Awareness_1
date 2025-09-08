import { NextApiRequest, NextApiResponse } from 'next';
import webhookService from '../../services/webhookService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulate a successful payment for "Test Product" (1 KSH)
    const testWebhookData = {
      ResponseCode: 0,
      ResponseDescription: "Success. Request accepted for processing",
      MerchantRequestID: "test-12345",
      CheckoutRequestID: "test-checkout-12345",
      TransactionID: "TEST123456789",
      TransactionAmount: 1, // 1 KSH for Test Product
      TransactionReceipt: "TEST123456",
      TransactionDate: "20240928222012",
      TransactionReference: "TEST_ORDER_12345",
      Msisdn: "254769290734"
    };

    console.log('🧪 Testing webhook with data:', testWebhookData);

    // Process the test webhook
    const result = await webhookService.processPaymentWebhook(testWebhookData);

    console.log('🧪 Test result:', result);

    return res.status(200).json({
      success: true,
      message: 'Test webhook processed',
      result: result,
      testData: testWebhookData
    });

  } catch (error) {
    console.error('❌ Test webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Test webhook error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
