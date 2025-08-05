const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Platform wallet address from environment
  const platformWallet = process.env.PLATFORM_WALLET_ADDRESS || "0x4c053D8F0293B41D1df8dC7D65cE7B818Aa20018";
  console.log("Platform wallet:", platformWallet);

  try {
    // Deploy EventTicketingFactory
    console.log("\nDeploying EventTicketingFactory...");
    const EventTicketingFactory = await ethers.getContractFactory("EventTicketingFactory");
    const factory = await EventTicketingFactory.deploy(platformWallet, deployer.address);
    await factory.waitForDeployment();
    
    const factoryAddress = await factory.getAddress();
    console.log("EventTicketingFactory deployed to:", factoryAddress);

    // Deploy a sample EventTicketing contract through the factory
    console.log("\nDeploying sample EventTicketing contract...");
    const deploymentFee = await factory.deploymentFee();
    console.log("Deployment fee:", ethers.formatEther(deploymentFee), "ETH");

    const tx = await factory.deployEventTicketing(
      "Sample Event Platform",
      "A sample event ticketing platform for testing",
      platformWallet,
      { value: deploymentFee }
    );
    
    const receipt = await tx.wait();
    console.log("Sample contract deployment transaction:", receipt.hash);

    // Get the deployed contract address from events
    const deployedEvent = receipt.logs.find(log => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed.name === 'ContractDeployed';
      } catch (e) {
        return false;
      }
    });

    if (deployedEvent) {
      const parsedEvent = factory.interface.parseLog(deployedEvent);
      const sampleContractAddress = parsedEvent.args.contractAddress;
      console.log("Sample EventTicketing contract deployed to:", sampleContractAddress);

      // Verify the contract is working
      const EventTicketing = await ethers.getContractFactory("EventTicketing");
      const sampleContract = EventTicketing.attach(sampleContractAddress);
      
      const owner = await sampleContract.owner();
      console.log("Sample contract owner:", owner);
      console.log("Sample contract platform wallet:", await sampleContract.platformWallet());
    }

    console.log("\n=== Deployment Summary ===");
    console.log("Factory Address:", factoryAddress);
    console.log("Platform Wallet:", platformWallet);
    console.log("Deployer:", deployer.address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    
    console.log("\n=== Environment Variables to Update ===");
    console.log(`VITE_FACTORY_CONTRACT_ADDRESS=${factoryAddress}`);
    if (deployedEvent) {
      const parsedEvent = factory.interface.parseLog(deployedEvent);
      console.log(`VITE_SAMPLE_CONTRACT_ADDRESS=${parsedEvent.args.contractAddress}`);
    }

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
