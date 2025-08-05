const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Wallet Information");
  console.log("=====================");
  
  // Get wallet from private key
  const [deployer] = await ethers.getSigners();
  console.log("📍 Wallet Address:", deployer.address);
  
  try {
    // Check balance on different networks
    console.log("\n💰 Balance Check:");
    
    // Local balance
    try {
      const localBalance = await deployer.provider.getBalance(deployer.address);
      console.log("Local Network:", ethers.formatEther(localBalance), "ETH");
    } catch (e) {
      console.log("Local Network: Not connected");
    }
    
    // Sepolia balance (if connected)
    if (process.env.SEPOLIA_RPC_URL) {
      try {
        const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const sepoliaBalance = await sepoliaProvider.getBalance(deployer.address);
        console.log("Sepolia Testnet:", ethers.formatEther(sepoliaBalance), "ETH");
        
        if (sepoliaBalance === 0n) {
          console.log("\n⚠️  You need Sepolia testnet ETH to deploy!");
          console.log("📋 Get testnet ETH from these faucets:");
          console.log("1. https://sepoliafaucet.com/");
          console.log("2. https://www.alchemy.com/faucets/ethereum-sepolia");
          console.log("3. https://sepolia-faucet.pk910.de/");
          console.log("\n💡 Send testnet ETH to:", deployer.address);
        }
      } catch (e) {
        console.log("Sepolia Testnet: Connection failed");
      }
    }
    
  } catch (error) {
    console.error("Error checking balances:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
