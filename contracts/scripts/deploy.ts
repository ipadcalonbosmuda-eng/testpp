import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying XTestToken...");
  
  const XTestToken = await ethers.getContractFactory("XTestToken");
  const token = await XTestToken.deploy();
  
  await token.deployed();
  
  console.log("XTestToken deployed to:", token.address);
  
  // Set the backend as a minter
  const backendAddress = process.env.MERCHANT_WALLET;
  if (backendAddress) {
    console.log("Setting backend as minter:", backendAddress);
    await token.setMinter(backendAddress, true);
    console.log("Backend set as minter successfully");
  }
  
  // Write contract address to backend config
  const backendConfigPath = path.join(__dirname, "../backend/src/config/address.json");
  const backendConfigDir = path.dirname(backendConfigPath);
  
  if (!fs.existsSync(backendConfigDir)) {
    fs.mkdirSync(backendConfigDir, { recursive: true });
  }
  
  const config = {
    tokenAddress: token.address,
    network: "base",
    chainId: 8453
  };
  
  fs.writeFileSync(backendConfigPath, JSON.stringify(config, null, 2));
  console.log("Contract address written to backend config");
  
  // Write contract address to frontend env
  const frontendEnvPath = path.join(__dirname, "../frontend/.env.local");
  const frontendEnvDir = path.dirname(frontendEnvPath);
  
  if (!fs.existsSync(frontendEnvDir)) {
    fs.mkdirSync(frontendEnvDir, { recursive: true });
  }
  
  const envContent = `NEXT_PUBLIC_TOKEN_ADDRESS=${token.address}
NEXT_PUBLIC_NETWORK_CHAIN_ID=8453
NEXT_PUBLIC_NETWORK_NAME=base`;
  
  fs.writeFileSync(frontendEnvPath, envContent);
  console.log("Contract address written to frontend env");
  
  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("Token Address:", token.address);
  console.log("Network: Base Mainnet (8453)");
  console.log("Max Supply: 1,000,000,000 XTEST");
  console.log("Public Cap: 500,000,000 XTEST");
  console.log("Per Wallet Cap: 2,000,000 XTEST");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
