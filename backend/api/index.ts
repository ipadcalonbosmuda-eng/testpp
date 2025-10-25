import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);
    
    switch (pathname) {
      case '/health':
        res.status(200).json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'x402-mint-backend'
        });
        break;
        
      case '/stats':
        // For now, return mock stats until contract is deployed
        res.status(200).json({
          token: {
            name: 'xTesT',
            symbol: 'XTEST',
            address: process.env.TOKEN_ADDRESS || 'Not deployed',
            decimals: 18
          },
          supply: {
            total: '0',
            publicMinted: '0',
            remaining: '500000000',
            maxSupply: '1000000000',
            publicCap: '500000000'
          },
          pricing: {
            priceUsdc: 5,
            unitXtest: 1000,
            pricePerToken: 0.005
          },
          limits: {
            perWalletCap: '2000000'
          }
        });
        break;
        
      case '/mint':
        if (req.method !== 'POST') {
          res.status(405).json({ error: 'Method not allowed' });
          return;
        }
        
        const { buyer, unitCount = 1 } = req.body;
        
        if (!buyer) {
          res.status(400).json({ error: 'Buyer address is required' });
          return;
        }
        
        // Return x402 payment required response
        res.status(402).json({
          x402Version: 1,
          accepts: [
            {
              scheme: 'exact',
              network: 'base',
              maxAmountRequired: (unitCount * 5).toString(),
              resource: `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/mint`,
              description: `Mint xTesT (${unitCount}x)`,
              mimeType: 'application/json',
              payTo: process.env.MERCHANT_WALLET || '0x0000000000000000000000000000000000000000',
              maxTimeoutSeconds: 600,
              asset: 'USDC',
              outputSchema: {
                input: {
                  type: 'http',
                  method: 'POST',
                  bodyType: 'json',
                  bodyFields: {
                    buyer: { type: 'string', required: true },
                    unitCount: { type: 'number', required: false }
                  }
                },
                output: {
                  ok: 'boolean',
                  txHash: 'string',
                  minted: 'string'
                }
              }
            }
          ]
        });
        break;
        
      default:
        res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
