# Environment Variables Configuration

This document outlines all the required environment variables for the x402-mint-xtest application.

## Backend Environment Variables

Set these in your backend hosting service (Vercel/Railway/Render):

```bash
# Network Configuration
BASE_RPC_URL=https://mainnet.base.org
BASE_CHAIN_ID=8453

# Token Configuration
TOKEN_NAME=xTesT
TOKEN_SYMBOL=XTEST
TOKEN_MAX_SUPPLY=1000000000
TOKEN_PUBLIC_CAP=500000000
TOKEN_DECIMALS=18

# Mint Configuration
MINT_PRICE_USDC=5
MINT_UNIT_XTEST=1000
PER_WALLET_CAP_XTEST=2000000
PAY_TIMEOUT_SECONDS=600

# Wallet Configuration
MERCHANT_WALLET=0xYourBaseWalletAddress
BACKEND_PRIVATE_KEY=0xYourBackendPrivateKey
OWNER_PRIVATE_KEY=0xYourOwnerPrivateKey

# Facilitator Configuration
FACILITATOR_PROVIDER=coinbase
```

## Frontend Environment Variables

Set these in your frontend hosting service (Vercel):

```bash
# Contract Configuration (auto-generated after deployment)
NEXT_PUBLIC_TOKEN_ADDRESS=0xContractAddress
NEXT_PUBLIC_NETWORK_CHAIN_ID=8453
NEXT_PUBLIC_NETWORK_NAME=base

# Backend URL
BACKEND_URL=https://your-backend-url.com

# WalletConnect (optional)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

## Deployment Instructions

### 1. Local Development

1. Copy environment variables to `.env` files:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run development servers:
   ```bash
   pnpm dev
   ```

### 2. Production Deployment

#### Backend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with build command: `pnpm build`
4. Set start command: `pnpm start`

#### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with build command: `pnpm build`
4. Set output directory: `frontend/.next`

#### Contract Deployment

1. Set environment variables
2. Run deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### 3. x402 Registration

After deployment, register your mint endpoint at:
https://x402scan.com/resources/register

Use your backend URL + `/mint` as the resource URL.

## Security Notes

- Never commit private keys to version control
- Use environment variables for all sensitive data
- Consider using hardware wallets for production deployments
- Regularly rotate private keys
- Monitor contract interactions and transactions
