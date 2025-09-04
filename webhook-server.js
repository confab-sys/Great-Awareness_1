// JavaScript Webhook Server - Replaces PHP webhook
// Run with: node webhook-server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

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
    1: 'The Confidence Map',
    400: 'Unlocking the Primal Brain',
    500: 'The Power Within'
};

const DOWNLOAD_LINKS = {
    'The Confidence Map': 'https://drive.usercontent.google.com/download?id=1m8VHhQzvVBhzIKMfFQRFQwvKRoO9Xtr4&export=download&authuser=0',
    'Unlocking the Primal Brain': 'https://drive.google.com/file/d/1_wIIkiGz6yDPdMupfqUmTbM2cYm_u7AJ/view?usp=drive_link'
};

// Google Sheet logging function
async function logToGoogleSheet(transactionData) {
    try {
        const GOOGLE_SHEETS_WEBAPP_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || 'YOUR_GOOGLE_APPS_SCRIPT_URL';
        
        const payload = {
            transactionId: transactionData.TransactionID,
            amount: transactionData.TransactionAmount,
            msisdn: transactionData.Msisdn,
            product: transactionData.productName,
            status: 'CONFIRMED',
            receipt: transactionData.TransactionReceipt,
            timestamp: new Date().toISOString()
        };

        console.log('📊 Logging to Google Sheet:', payload);
        
        const response = await axios.post(GOOGLE_SHEETS_WEBAPP_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000
        });

        console.log('✅ Google Sheet response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error logging to Google Sheet:', error.message);
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

            // Log to Google Sheet
            try {
                await logToGoogleSheet({
                    ...webhookData,
                    productName
                });
            } catch (error) {
                console.error('❌ Failed to log to Google Sheet:', error);
            }

            // Handle automatic downloads
            const downloadLink = DOWNLOAD_LINKS[productName];
            let downloadTriggered = false;

            if (downloadLink && productName === 'The Confidence Map') {
                console.log('🎉 Triggering automatic download for The Confidence Map');
                downloadTriggered = true;
                
                // Here you could send email/SMS with download link
                // or trigger any other post-purchase actions
            }

            return res.status(200).json({
                success: true,
                message: `Payment successful for ${productName}`,
                productName,
                downloadTriggered,
                transactionId
            });

        } else {
            console.log('❌ Payment failed:', webhookData.ResponseDescription);
            
            // Log failed transaction
            await logToGoogleSheet({
                ...webhookData,
                productName: 'FAILED_PAYMENT',
                status: 'FAILED'
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