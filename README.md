# x402-mint-xtest

A full-stack web application for minting ERC-20 tokens using the x402 payment standard on Base Mainnet.

## Features

- 🪙 **ERC-20 Token**: xTesT token with configurable supply and minting caps
- 💳 **x402 Payment Standard**: Revolutionary HTTP 402 payment required responses
- 🔗 **Base Network**: Built on Base mainnet for fast, low-cost transactions
- 🎯 **Fair Launch**: Per-wallet caps and public supply limits
- 🚀 **Modern Stack**: Next.js, Express.js, Hardhat, wagmi/viem

## Token Configuration

- **Name**: xTesT
- **Symbol**: XTEST
- **Decimals**: 18
- **Max Supply**: 1,000,000,000 XTEST
- **Public Mint Cap**: 500,000,000 XTEST
- **Mint Price**: 5 USDC per 1,000 XTEST
- **Per-wallet Cap**: 2,000,000 XTEST
- **Network**: Base Mainnet (Chain ID 8453)

## Project Structure

```
x402-mint-xtest/
├── contracts/          # Hardhat project with ERC-20 contracts
├── backend/           # Express.js API with x402 facilitator
├── frontend/          # Next.js app with wagmi/viem integration
├── package.json       # Root package.json for monorepo
└── pnpm-workspace.yaml
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Base wallet with USDC for testing

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd x402-mint-xtest

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter contracts dev
pnpm --filter backend dev
pnpm --filter frontend dev
```

### Deployment

```bash
# Deploy contracts and build applications
chmod +x deploy.sh
./deploy.sh
```

## Architecture

### Smart Contracts

- **XTestToken.sol**: ERC-20 token with minting functionality
- **Features**: Supply caps, per-wallet limits, minter management
- **Security**: OpenZeppelin contracts, ReentrancyGuard

### Backend API

- **Express.js** server with TypeScript
- **x402 Payment Standard** implementation
- **Endpoints**:
  - `GET /health` - Health check
  - `GET /stats` - Token statistics
  - `POST /mint` - Mint tokens (returns HTTP 402 for payment)

### Frontend

- **Next.js 14** with App Router
- **wagmi/viem** for Web3 integration
- **Tailwind CSS** for styling
- **Components**: Wallet connection, minting interface, stats display

## x402 Payment Flow

1. User clicks "Mint" button
2. Frontend sends POST request to `/mint`
3. Backend returns HTTP 402 with payment instructions
4. Frontend redirects to payment facilitator
5. User completes payment
6. Frontend retries `/mint` request
7. Backend verifies payment and mints tokens
8. Transaction hash returned to user

## Environment Variables

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete environment variable configuration.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Review the deployment guide

## Security

- Private keys are never committed to version control
- All sensitive data uses environment variables
- Smart contracts use OpenZeppelin security patterns
- Regular security audits recommended for production use
