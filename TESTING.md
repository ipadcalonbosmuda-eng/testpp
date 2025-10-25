# x402-mint-xtest Testing Guide

## Overview

This guide covers testing the x402 payment standard implementation and token minting functionality.

## Prerequisites

- Node.js 18+
- pnpm installed
- Base testnet wallet with test USDC
- Environment variables configured

## Test Scenarios

### 1. Contract Testing

```bash
cd contracts
pnpm test
```

Tests include:
- Token deployment
- Minting functionality
- Supply cap enforcement
- Per-wallet cap enforcement
- Access control

### 2. Backend API Testing

```bash
cd backend
pnpm dev
```

Test endpoints:

#### Health Check
```bash
curl http://localhost:3001/health
```

#### Stats Endpoint
```bash
curl http://localhost:3001/stats
```

#### Mint Endpoint (x402 Flow)
```bash
curl -X POST http://localhost:3001/mint \
  -H "Content-Type: application/json" \
  -d '{"buyer": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", "unitCount": 1}'
```

Expected response: HTTP 402 with x402 payment instructions

### 3. Frontend Testing

```bash
cd frontend
pnpm dev
```

Open http://localhost:3000 and test:
- Wallet connection
- Stats display
- Minting flow
- Payment simulation

### 4. Integration Testing

1. Start all services:
   ```bash
   pnpm dev
   ```

2. Test complete flow:
   - Connect wallet
   - View token stats
   - Attempt to mint tokens
   - Verify x402 response
   - Complete payment simulation
   - Verify successful minting

## x402 Payment Standard Testing

### Valid x402 Response Structure

The backend should return HTTP 402 with this structure:

```json
{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "maxAmountRequired": "5",
      "resource": "https://your-backend-url/mint",
      "description": "Mint xTesT (1x)",
      "mimeType": "application/json",
      "payTo": "MERCHANT_WALLET",
      "maxTimeoutSeconds": 600,
      "asset": "USDC",
      "outputSchema": {
        "input": {
          "type": "http",
          "method": "POST",
          "bodyType": "json",
          "bodyFields": {
            "buyer": { "type": "string", "required": true },
            "unitCount": { "type": "number", "required": false }
          }
        },
        "output": {
          "ok": "boolean",
          "txHash": "string",
          "minted": "string"
        }
      }
    }
  ]
}
```

### Testing Payment Verification

The payment facilitator includes mock functionality for testing:

1. Payment simulation is triggered automatically after 5 seconds
2. Payment verification checks timeout (10 minutes)
3. Payment processing marks transactions as completed

## Production Testing

### 1. Contract Deployment

```bash
# Deploy to Base Mainnet
cd contracts
pnpm deploy
```

### 2. Backend Deployment

Deploy to Vercel/Railway/Render with environment variables set.

### 3. Frontend Deployment

Deploy to Vercel with environment variables set.

### 4. x402 Registration

Register your mint endpoint at:
https://x402scan.com/resources/register

## Troubleshooting

### Common Issues

1. **Contract not deployed**: Ensure `TOKEN_ADDRESS` is set in environment
2. **Payment verification fails**: Check facilitator configuration
3. **Wallet connection issues**: Verify Base network configuration
4. **CORS errors**: Ensure backend CORS is configured correctly

### Debug Mode

Enable debug logging:

```bash
DEBUG=x402-mint:* pnpm dev
```

## Security Testing

1. **Access Control**: Verify only authorized minters can mint
2. **Supply Limits**: Test supply cap enforcement
3. **Wallet Limits**: Test per-wallet cap enforcement
4. **Payment Verification**: Ensure payments are properly verified
5. **Input Validation**: Test invalid inputs are rejected

## Performance Testing

1. **Load Testing**: Test with multiple concurrent requests
2. **Gas Optimization**: Monitor gas usage for minting
3. **Response Times**: Measure API response times
4. **Frontend Performance**: Test UI responsiveness

## Monitoring

Set up monitoring for:
- Contract events
- API response times
- Error rates
- Payment success rates
- Gas usage patterns
