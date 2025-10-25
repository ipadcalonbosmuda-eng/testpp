import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ethers } from 'ethers';
import { mintHandler } from './routes/mint';
import { statsHandler } from './routes/stats';
import { healthHandler } from './routes/health';
import { config } from './config/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', healthHandler);
app.get('/stats', statsHandler);
app.post('/mint', mintHandler);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Token: ${config.TOKEN_NAME} (${config.TOKEN_SYMBOL})`);
  console.log(`Network: Base Mainnet (${config.BASE_CHAIN_ID})`);
  console.log(`Merchant Wallet: ${config.MERCHANT_WALLET}`);
});
