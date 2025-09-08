// JavaScript Webhook Server - Replaces PHP webhook
// Run with: node webhook-server.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const supabaseService = require('./services/supabaseService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Product mapping
const PRODUCT_AMOUNTS = {
    1: 'Test Product', // 1 KSH for Test Product
    400: 'Unlocking the Primal Brain',
    500: 'The Power Within',
    1000: 'The Confidence Map' // Updated amount for The Confidence Map
};

const DOWNLOAD_LINKS = {
    'Test Product': 'supabase', // This will use Supabase for secure file delivery
    'Unlocking the Primal Brain': 'supabase' // This will use Supabase for secure file delivery
};

// Book UUID mappings from database
const BOOK_IDS = {
  'Test Product': '6c62e16c-dc7f-41e0-9f6d-2738fb15e1fb',
  'The Confidence Map': '60caab41-0e88-4652-ba8d-a3443a5393f5',
  'Unlocking the Primal Brain': 'cdcd63b2-5465-4ee3-8a49-9095db44459e',
  'Unlocking the primal brainThe hidden force shaping your thoughts and emotions': 'cdcd63b2-5465-4ee3-8a49-9095db44459e'
};

// Supabase logging function
async function logToSupabase(transactionData) {
    try {
        const bookName = transactionData.productName || 'Unknown Product';
        const payload = {
            book_id: BOOK_IDS[bookName] || bookName,
            transaction_id: transactionData.TransactionID,
            amount: transactionData.TransactionAmount,
            phone_number: transactionData.Msisdn,
            receipt: transactionData.TransactionReceipt,
            status: transactionData.status || 'completed',
            created_at: new Date().toISOString()
        };

        console.log('📊 Logging to Supabase:', payload);
        
        const result = await supabaseService.recordPurchase(payload);
        console.log('✅ Supabase response:', result);
        return result;
    } catch (error) {
        console.error('❌ Error logging to Supabase:', error.message);
        throw error;
    }
}

// Main webhook endpoint
app.post('/webhook', async (req, res) => {
    try {
        const webhookData = req.body;
        console.log('🔔 PesaFlux Webhook received:', JSON.stringify(webhookData, null, 2));

        // Validate webhook data
        if (!webhookData || !webhookData.TransactionID) {
            console.error('❌ Invalid webhook data');
            return res.status(400).json({
                success: false,
                message: 'Invalid webhook data'
            });
        }

        const responseCode = webhookData.ResponseCode;
        const transactionId = webhookData.TransactionID;
        const amount = webhookData.TransactionAmount;
        const receipt = webhookData.TransactionReceipt;
        const phone = webhookData.Msisdn;

        console.log(`💰 Transaction Details: ID=${transactionId}, Amount=${amount}, Phone=${phone}`);

        // Check if transaction was successful
        if (responseCode === 0 || responseCode === "0") {
            console.log('✅ Payment successful');

            // Determine product
            const productName = PRODUCT_AMOUNTS[amount] || 'Unknown Product';
            console.log('📦 Product:', productName);

            // Handle automatic downloads and logging
            const downloadLink = DOWNLOAD_LINKS[productName];
            let downloadTriggered = false;
            let downloadUrl = null;

            if (productName === 'Unlocking the Primal Brain') {
                console.log('🎉 Triggering Supabase logging and download for Unlocking the Primal Brain');
                
                try {
                    // Record the purchase in Supabase with correct field mapping
                    await supabaseService.recordPurchase({
                        book_id: BOOK_IDS[productName] || productName,
                        transaction_id: transactionId,
                        amount: amount,
                        phone_number: phone,
                        receipt: receipt,
                        status: 'completed'
                    });
                    
                    console.log('✅ Purchase logged to Supabase successfully');
                    
                    // Generate a temporary download URL that expires
                    downloadUrl = await supabaseService.generateTempDownloadUrl(productName);
                    
                    if (downloadUrl) {
                        downloadTriggered = true;
                        console.log('✅ Supabase download URL generated successfully');
                    }
                } catch (error) {
                    console.error('❌ Error with Supabase operations:', error);
                }
            } else if (productName === 'Test Product') {
                console.log('🎉 Triggering Supabase logging for Test Product');
                
                try {
                    // Record Test Product purchases in Supabase
                    await supabaseService.recordPurchase({
                        book_id: BOOK_IDS[productName] || productName,
                        transaction_id: transactionId,
                        amount: amount,
                        phone_number: phone,
                        receipt: receipt,
                        status: 'completed'
                    });
                    
                    console.log('✅ Test Product purchase logged to Supabase successfully');
                } catch (error) {
                    console.error('❌ Error logging Test Product to Supabase:', error);
                }
            } else if (downloadLink && productName === 'The Confidence Map') {
                console.log('🎉 Triggering automatic download for The Confidence Map');
                downloadTriggered = true;
                downloadUrl = downloadLink;
                
                // Here you could send email/SMS with download link
                // or trigger any other post-purchase actions
            }

            return res.status(200).json({
                success: true,
                message: `Payment successful for ${productName}`,
                productName,
                downloadTriggered,
                downloadUrl,
                transactionId
            });

        } else {
            console.log('❌ Payment failed:', webhookData.ResponseDescription);
            
            // Log failed transaction
            await logToSupabase({
                ...webhookData,
                productName: 'FAILED_PAYMENT',
                status: 'failed'
            });

            return res.status(200).json({
                success: false,
                message: `Payment failed: ${webhookData.ResponseDescription}`
            });
        }

    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'JavaScript Webhook Server is running',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Webhook server is ready to receive PesaFlux notifications',
        endpoints: {
            webhook: '/webhook',
            health: '/health'
        },
        supportedProducts: PRODUCT_AMOUNTS
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 JavaScript Webhook Server running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
    console.log(`🩺 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    process.exit(0);
});

module.exports = app;