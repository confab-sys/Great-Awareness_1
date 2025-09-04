import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🧪 Test webhook endpoint hit!');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);

  // Log to a file for debugging
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query
  };

  console.log('📝 Full log data:', JSON.stringify(logData, null, 2));

  return res.status(200).json({
    success: true,
    message: 'Test webhook received successfully',
    receivedAt: new Date().toISOString(),
    data: req.body
  });
}
