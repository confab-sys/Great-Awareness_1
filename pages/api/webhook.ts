import { NextApiRequest, NextApiResponse } from 'next';
import webhookService from '../../services/webhookService';
import { storeWebhookPayment } from './check-webhook-payments';
import supabaseService from '../../services/supabaseService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔔 Webhook received:', req.body);

    // Process the webhook data
    const result = await webhookService.processPaymentWebhook(req.body);

    if (result.success) {
      console.log('✅ Webhook processed successfully:', result);
      
      // Handle successful payment for any product including Test Product
      if (result.downloadTriggered) {
        console.log(`🎉 Automatic download triggered for ${result.productName}!`)
        
        // Store the payment data for client-side access
        storeWebhookPayment({
          productName: result.productName,
          amount: req.body.TransactionAmount,
          receipt: req.body.TransactionReceipt,
          transactionId: req.body.TransactionID,
          phoneNumber: req.body.Msisdn,
          downloadTriggered: true
        });
        
        // Log transaction to Supabase instead of Google Sheets
        try {
          console.log('📊 Logging transaction to Supabase');
          await supabaseService.recordPurchase({
            bookId: result.productName === 'Test Product' ? 'test-product' : 
                   result.productName === 'The Confidence Map' ? 'confidence-map' : 'unknown',
            transactionId: req.body.TransactionID,
            amount: parseFloat(req.body.TransactionAmount),
            phoneNumber: req.body.Msisdn,
            receipt: req.body.TransactionReceipt
          });
          console.log('✅ Transaction logged to Supabase successfully');
        } catch (error) {
          console.error('❌ Error logging to Supabase:', error);
        }
      }

      return res.status(200).json({
        success: true,
        message: result.message,
        productName: result.productName,
        downloadTriggered: result.downloadTriggered
      });
    } else {
      console.log('❌ Webhook processing failed:', result.message);
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
