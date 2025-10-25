import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { config } from '../config/config';
import { PaymentFacilitator } from '../services/paymentFacilitator';

interface MintRequest {
  buyer: string;
  unitCount?: number;
}

interface X402Response {
  x402Version: number;
  accepts: Array<{
    scheme: string;
    network: string;
    maxAmountRequired: string;
    resource: string;
    description: string;
    mimeType: string;
    payTo: string;
    maxTimeoutSeconds: number;
    asset: string;
    outputSchema: {
      input: {
        type: string;
        method: string;
        bodyType: string;
        bodyFields: {
          buyer: { type: string; required: boolean };
          unitCount: { type: string; required: boolean };
        };
      };
      output: {
        ok: string;
        txHash: string;
        minted: string;
      };
    };
  }>;
}

export const mintHandler = async (req: Request, res: Response) => {
  try {
    const { buyer, unitCount = 1 }: MintRequest = req.body;

    if (!buyer) {
      return res.status(400).json({ error: 'Buyer address is required' });
    }

    if (!config.TOKEN_ADDRESS) {
      return res.status(500).json({ error: 'Token contract not deployed' });
    }

    // Validate buyer address
    if (!ethers.isAddress(buyer)) {
      return res.status(400).json({ error: 'Invalid buyer address' });
    }

    // Calculate mint amount
    const mintAmount = ethers.parseEther((unitCount * config.MINT_UNIT_XTEST).toString());
    const totalPrice = config.MINT_PRICE_USDC * unitCount;

    // Check if payment has been made
    const paymentFacilitator = new PaymentFacilitator();
    const paymentVerified = await paymentFacilitator.verifyPayment(buyer, totalPrice);

    if (!paymentVerified) {
      // Return HTTP 402 with x402 payment instructions
      const x402Response: X402Response = {
        x402Version: 1,
        accepts: [
          {
            scheme: 'exact',
            network: 'base',
            maxAmountRequired: totalPrice.toString(),
            resource: `${req.protocol}://${req.get('host')}/mint`,
            description: `Mint ${config.TOKEN_NAME} (${unitCount}x)`,
            mimeType: 'application/json',
            payTo: config.MERCHANT_WALLET,
            maxTimeoutSeconds: config.PAY_TIMEOUT_SECONDS,
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
      };

      return res.status(402).json(x402Response);
    }

    // Payment verified, proceed with minting
    const provider = new ethers.JsonRpcProvider(config.BASE_RPC_URL);
    const wallet = new ethers.Wallet(config.BACKEND_PRIVATE_KEY, provider);
    
    const contract = new ethers.Contract(
      config.TOKEN_ADDRESS,
      [
        'function mint(address to, uint256 amount) external',
        'function walletMinted(address) view returns (uint256)',
        'function getWalletRemainingCap(address) view returns (uint256)'
      ],
      wallet
    );

    // Check wallet cap
    const walletMinted = await contract.walletMinted(buyer);
    const remainingCap = await contract.getWalletRemainingCap(buyer);
    
    if (mintAmount > remainingCap) {
      return res.status(400).json({ 
        error: 'Exceeds per-wallet cap',
        walletMinted: ethers.formatEther(walletMinted),
        remainingCap: ethers.formatEther(remainingCap),
        requested: ethers.formatEther(mintAmount)
      });
    }

    // Execute mint transaction
    const tx = await contract.mint(buyer, mintAmount);
    await tx.wait();

    // Mark payment as processed
    await paymentFacilitator.markPaymentProcessed(buyer, totalPrice);

    res.json({
      ok: true,
      txHash: tx.hash,
      minted: ethers.formatEther(mintAmount),
      buyer,
      unitCount
    });

  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ error: 'Minting failed', details: error.message });
  }
};
