export const PAYMENT_PROVIDERS = {
  pesaflux: {
    name: 'PesaFlux',
    baseUrl: 'https://api.pesaflux.co.ke',
    endpoints: {
      stkPush: '/v1/initiatestk',
      transactionStatus: '/v1/transactionstatus',
    },
    credentials: {
      apiKey: process.env.PESAFLEX_API_KEY || 'PSFXn2TDSkns',
      email: 'ashwaashard@gmail.com',
    },
    webhook: {
      url: process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhook',
      endpoint: '/api/webhook',
    },
  },
};