import { NextApiRequest, NextApiResponse } from 'next';
import supabaseService from '../../services/supabaseService';

// Product mappings
const PRODUCT_AMOUNTS = {
  'Test Product': 1,
  'The Confidence Map': 100,
  'Great Awareness Book': 200,
  'Digital Marketing Guide': 50
};

const DOWNLOAD_LINKS = {
  'Test Product': 'https://great-awareness-1.vercel.app/api/download/test-product',
  'The Confidence Map': 'https://great-awareness-1.vercel.app/api/download/confidence-map',
  'Great Awareness Book': 'https://great-awareness-1.vercel.app/api/download/great-awareness',
  'Digital Marketing Guide': 'https://great-awareness-1.vercel.app/api/download/digital-marketing'
};

const BOOK_IDS = {
  'Test Product': 'test-product',
  'The Confidence Map': 'confidence-map',
  'Great Awareness Book': 'great-awareness',
  'Digital Marketing Guide': 'digital-marketing'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    console.log('🔔 Webhook received:', webhookData);

    // Validate webhook data
    if (!webhookData || !webhookData.ResponseCode) {
      console.error('❌ Invalid webhook data:', webhookData);
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook data'
      });
    }

    // Check if payment was successful
    if (webhookData.ResponseCode !== '00000000') {
      console.log('❌ Payment failed:', webhookData.ResponseDescription);
      return res.status(400).json({
        success: false,
        message: `Payment failed: ${webhookData.ResponseDescription}`
      });
    }

    // Determine product by amount
    const amount = parseFloat(webhookData.TransactionAmount);
    let productName = 'Unknown Product';
    
    for (const [name, productAmount] of Object.entries(PRODUCT_AMOUNTS)) {
      if (amount === productAmount) {
        productName = name;
        break;
      }
    }

    console.log(`💰 Payment received: ${amount} for ${productName}`);

    // Log purchase to Supabase
    try {
      console.log('📊 Logging purchase to Supabase...');
      await supabaseService.recordPurchase({
        bookId: BOOK_IDS[productName] || 'unknown',
        transactionId: webhookData.TransactionID,
        amount: amount,
        phoneNumber: webhookData.Msisdn,
        receipt: webhookData.TransactionReceipt
      });
      console.log('✅ Purchase logged to Supabase successfully');
    } catch (error) {
      console.error('❌ Error logging to Supabase:', error);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: `Payment processed successfully for ${productName}`,
      productName: productName,
      downloadUrl: DOWNLOAD_LINKS[productName] || null,
      transactionId: webhookData.TransactionID
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
