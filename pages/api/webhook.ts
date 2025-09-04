import { NextApiRequest, NextApiResponse } from 'next';
import googleSheetWriter from '../../services/googleSheetWriter';
import webhookService from '../../services/webhookService';
import { storeWebhookPayment } from './check-webhook-payments';

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
      
      // If download was triggered for The Confidence Map
      if (result.downloadTriggered && result.productName === 'The Confidence Map') {
        console.log('🎉 Automatic download triggered for The Confidence Map!');
        
        // Store the payment data for client-side access
        storeWebhookPayment({
          productName: result.productName,
          amount: req.body.TransactionAmount,
          receipt: req.body.TransactionReceipt,
          transactionId: req.body.TransactionID,
          phoneNumber: req.body.Msisdn,
          downloadTriggered: true
        });
        
        // You can add additional actions here:
        // - Send push notification to user
        // - Send email with download link
        // - Update database with purchase record
        // - Send SMS with download link
      }
      
      // Log transaction to Google Sheet
      try {
        console.log('📊 Logging transaction to Google Sheet');
        await googleSheetWriter.logSuccessfulTransaction(
          req.body.TransactionID,
          req.body.TransactionAmount,
          req.body.Msisdn,
          result.productName || 'Unknown Product',
          'CONFIRMED',
          req.body.TransactionReceipt
        );
        console.log('✅ Transaction logged to Google Sheet successfully');
      } catch (error) {
        console.error('❌ Error logging to Google Sheet:', error);
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
