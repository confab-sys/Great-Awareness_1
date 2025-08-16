// Daraja API Configuration
export const DARAJA_CONFIG = {
	// Environment: 'sandbox' or 'production'
	ENVIRONMENT: 'sandbox',
	
	// API Base URLs
	BASE_URL: 'https://sandbox.safaricom.co.ke',
	PRODUCTION_URL: 'https://api.safaricom.co.ke',
	
	// Your app credentials (replace with your actual values)
	CONSUMER_KEY: 'kF9UugQhUllgaYpIjgoPJLkEM6yI2fx4eANnGnpojdi5bz8D',
	CONSUMER_SECRET: 'K6N7wT0ESgxDY0nbSLmfVxykG0nheLjC9yVTVo8JBfeJABjC7UOl6XlpyoLCBfsr',
	
	// Your actual shortcode
	BUSINESS_TILL: '8491530', // Your real shortcode
	
	// Passkey for STK Push (get this from your Daraja app settings for your own shortcode)
	// Using the official sandbox passkey for shortcode 174379
	PASSKEY: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
	
	// API Endpoints
	ENDPOINTS: {
		OAUTH: '/oauth/v1/generate?grant_type=client_credentials',
		STK_PUSH: '/mpesa/stkpush/v1/processrequest',
		STK_QUERY: '/mpesa/stkpushquery/v1/query',
		C2B_REGISTER: '/mpesa/c2b/v1/registerurl',
		B2C: '/mpesa/b2c/v1/paymentrequest',
	},
	
	// Callback URLs (we'll set these up later)
	CALLBACK_URL: 'https://your-backend-url.com/api/mpesa/callback',
	
	// Transaction Types
	TRANSACTION_TYPES: {
		CUSTOMER_PAY_BILL_ONLINE: 'CustomerPayBillOnline',
		CUSTOMER_BUY_GOODS_ONLINE: 'CustomerBuyGoodsOnline',
	},
};

// Helper function to get the correct base URL
export const getBaseUrl = () => {
	return DARAJA_CONFIG.ENVIRONMENT === 'production' 
		? DARAJA_CONFIG.PRODUCTION_URL 
		: DARAJA_CONFIG.BASE_URL;
};

// Helper function to get full endpoint URL
export const getEndpointUrl = (endpoint) => {
	return `${getBaseUrl()}${DARAJA_CONFIG.ENDPOINTS[endpoint]}`;
};
