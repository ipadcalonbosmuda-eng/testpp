import { Request, Response } from 'express';

export const healthHandler = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'x402-mint-backend'
  });
};
