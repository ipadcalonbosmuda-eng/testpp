#!/bin/bash

# Deployment script for x402-mint-xtest
# This script handles the complete deployment process

set -e

echo "🚀 Starting deployment process for x402-mint-xtest..."

# Check if required environment variables are set
check_env() {
    local var_name=$1
    if [ -z "${!var_name}" ]; then
        echo "❌ Error: $var_name environment variable is not set"
        echo "Please set the following environment variables:"
        echo "- BASE_RPC_URL"
        echo "- MERCHANT_WALLET"
        echo "- BACKEND_PRIVATE_KEY"
        echo "- OWNER_PRIVATE_KEY"
        exit 1
    fi
}

echo "📋 Checking environment variables..."
check_env "BASE_RPC_URL"
check_env "MERCHANT_WALLET"
check_env "BACKEND_PRIVATE_KEY"
check_env "OWNER_PRIVATE_KEY"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build contracts
echo "🔨 Building contracts..."
cd contracts
pnpm compile
echo "✅ Contracts compiled successfully"

# Deploy contracts
echo "🚀 Deploying contracts to Base Mainnet..."
pnpm deploy
echo "✅ Contracts deployed successfully"

# Build backend
echo "🔨 Building backend..."
cd ../backend
pnpm build
echo "✅ Backend built successfully"

# Build frontend
echo "🔨 Building frontend..."
cd ../frontend
pnpm build
echo "✅ Frontend built successfully"

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to your hosting service (Vercel/Railway/Render)"
echo "2. Deploy frontend to Vercel"
echo "3. Set environment variables in your hosting dashboard"
echo "4. Register your /mint endpoint at https://x402scan.com/resources/register"
echo ""
echo "🔗 Contract addresses and configuration have been written to:"
echo "- backend/src/config/address.json"
echo "- frontend/.env.local"
