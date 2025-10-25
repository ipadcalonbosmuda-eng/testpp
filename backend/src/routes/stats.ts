import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { config } from '../config/config';

export const statsHandler = async (req: Request, res: Response) => {
  try {
    if (!config.TOKEN_ADDRESS) {
      return res.status(500).json({ error: 'Token contract not deployed' });
    }

    const provider = new ethers.JsonRpcProvider(config.BASE_RPC_URL);
    const contract = new ethers.Contract(
      config.TOKEN_ADDRESS,
      [
        'function totalSupply() view returns (uint256)',
        'function publicMinted() view returns (uint256)',
        'function getRemainingPublicSupply() view returns (uint256)',
        'function walletMinted(address) view returns (uint256)'
      ],
      provider
    );

    const [totalSupply, publicMinted, remainingSupply] = await Promise.all([
      contract.totalSupply(),
      contract.publicMinted(),
      contract.getRemainingPublicSupply()
    ]);

    const mintPrice = config.MINT_PRICE_USDC;
    const mintUnit = config.MINT_UNIT_XTEST;

    res.json({
      token: {
        name: config.TOKEN_NAME,
        symbol: config.TOKEN_SYMBOL,
        address: config.TOKEN_ADDRESS,
        decimals: config.TOKEN_DECIMALS
      },
      supply: {
        total: ethers.formatEther(totalSupply),
        publicMinted: ethers.formatEther(publicMinted),
        remaining: ethers.formatEther(remainingSupply),
        maxSupply: ethers.formatEther(config.TOKEN_MAX_SUPPLY),
        publicCap: ethers.formatEther(config.TOKEN_PUBLIC_CAP)
      },
      pricing: {
        priceUsdc: mintPrice,
        unitXtest: mintUnit,
        pricePerToken: mintPrice / mintUnit
      },
      limits: {
        perWalletCap: ethers.formatEther(config.PER_WALLET_CAP_XTEST)
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
