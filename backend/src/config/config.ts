export const config = {
  // Network configuration
  BASE_RPC_URL: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  BASE_CHAIN_ID: parseInt(process.env.BASE_CHAIN_ID || '8453'),
  
  // Token configuration
  TOKEN_NAME: process.env.TOKEN_NAME || 'xTesT',
  TOKEN_SYMBOL: process.env.TOKEN_SYMBOL || 'XTEST',
  TOKEN_MAX_SUPPLY: BigInt(process.env.TOKEN_MAX_SUPPLY || '1000000000') * BigInt(10**18),
  TOKEN_PUBLIC_CAP: BigInt(process.env.TOKEN_PUBLIC_CAP || '500000000') * BigInt(10**18),
  TOKEN_DECIMALS: parseInt(process.env.TOKEN_DECIMALS || '18'),
  
  // Mint configuration
  MINT_PRICE_USDC: parseFloat(process.env.MINT_PRICE_USDC || '5'),
  MINT_UNIT_XTEST: parseFloat(process.env.MINT_UNIT_XTEST || '1000'),
  PER_WALLET_CAP_XTEST: BigInt(process.env.PER_WALLET_CAP_XTEST || '2000000') * BigInt(10**18),
  PAY_TIMEOUT_SECONDS: parseInt(process.env.PAY_TIMEOUT_SECONDS || '600'),
  
  // Wallet configuration
  MERCHANT_WALLET: process.env.MERCHANT_WALLET || '',
  BACKEND_PRIVATE_KEY: process.env.BACKEND_PRIVATE_KEY || '',
  OWNER_PRIVATE_KEY: process.env.OWNER_PRIVATE_KEY || '',
  
  // Facilitator configuration
  FACILITATOR_PROVIDER: process.env.FACILITATOR_PROVIDER || 'coinbase',
  
  // Contract address (will be set after deployment)
  TOKEN_ADDRESS: '',
};

// Load contract address from deployment
try {
  const addressConfig = require('./config/address.json');
  config.TOKEN_ADDRESS = addressConfig.tokenAddress;
} catch (error) {
  console.warn('Contract address not found. Run deployment first.');
}
