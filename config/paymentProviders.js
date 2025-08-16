export const PAYMENT_PROVIDERS = {

  pesaflux: {
    name: 'PesaFlux',
    baseUrl: 'https://api.pesaflux.co.ke', // Updated domain from .co.ke to .com
    endpoints: {
      stkPush: '/v1/initiatestk',
      transactionStatus: '/v1/transactionstatus',
    },
    credentials: {
      apiKey: 'PSFXn2TDSkns', // Verified API key
      email: 'ashwaashard@gmail.com',
    },
  },
};