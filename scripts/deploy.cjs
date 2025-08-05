const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  console.log("========================");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("⚠️  Warning: Account has no ETH for gas fees!");
    return;
  }
  
  console.log("\n📦 Deploying contracts...");
  
  // Deploy EventTicketingFactory
  const EventTicketingFactory = await ethers.getContractFactory("EventTicketingFactory");
  console.log("⏳ Deploying EventTicketingFactory...");
  
  const factory = await EventTicketingFactory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("✅ EventTicketingFactory deployed to:", factoryAddress);
  
  // Deploy TicketMetadata
  const TicketMetadata = await ethers.getContractFactory("TicketMetadata");
  console.log("⏳ Deploying TicketMetadata...");
  
  const metadata = await TicketMetadata.deploy();
  await metadata.waitForDeployment();
  
  const metadataAddress = await metadata.getAddress();
  console.log("✅ TicketMetadata deployed to:", metadataAddress);
  
  console.log("\n🎉 Deployment completed!");
  console.log("========================");
  console.log("📋 Contract Addresses:");
  console.log("EventTicketingFactory:", factoryAddress);
  console.log("TicketMetadata:", metadataAddress);
  
  console.log("\n📝 Add these to your .env file:");
  console.log(`VITE_FACTORY_CONTRACT_ADDRESS=${factoryAddress}`);
  console.log(`VITE_METADATA_CONTRACT_ADDRESS=${metadataAddress}`);
  
  // Verify contracts on Etherscan (if not local network)
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 1337n && network.chainId !== 31337n) {
    console.log("\n🔍 Verifying contracts on Etherscan...");
    console.log("Run these commands after deployment:");
    console.log(`npx hardhat verify --network ${network.name} ${factoryAddress}`);
    console.log(`npx hardhat verify --network ${network.name} ${metadataAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
