const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Configuration
  const PLATFORM_WALLET = "0x4c053D8F0293B41D1df8dC7D65cE7B818Aa20018"; // Your specified receiver wallet
  const FEE_RECIPIENT = "0x4c053D8F0293B41D1df8dC7D65cE7B818Aa20018"; // Same wallet for fees

  try {
    // Deploy EventTicketing contract
    console.log("\n1. Deploying EventTicketing contract...");
    const EventTicketing = await ethers.getContractFactory("EventTicketing");
    const eventTicketing = await EventTicketing.deploy(PLATFORM_WALLET);
    await eventTicketing.waitForDeployment();
    
    const eventTicketingAddress = await eventTicketing.getAddress();
    console.log("✅ EventTicketing deployed to:", eventTicketingAddress);

    // Deploy EventTicketingFactory contract
    console.log("\n2. Deploying EventTicketingFactory contract...");
    const EventTicketingFactory = await ethers.getContractFactory("EventTicketingFactory");
    const factory = await EventTicketingFactory.deploy(FEE_RECIPIENT);
    await factory.waitForDeployment();
    
    const factoryAddress = await factory.getAddress();
    console.log("✅ EventTicketingFactory deployed to:", factoryAddress);

    // Verify deployment
    console.log("\n3. Verifying deployment...");
    
    // Check EventTicketing
    const owner = await eventTicketing.owner();
    const platformWallet = await eventTicketing.platformWallet();
    const platformFee = await eventTicketing.platformFeePercentage();
    
    console.log("EventTicketing Details:");
    console.log("- Owner:", owner);
    console.log("- Platform Wallet:", platformWallet);
    console.log("- Platform Fee:", platformFee.toString(), "basis points (", (platformFee / 100).toString(), "%)");
    
    // Check Factory
    const factoryOwner = await factory.owner();
    const deploymentFee = await factory.deploymentFee();
    const feeRecipient = await factory.feeRecipient();
    
    console.log("\nEventTicketingFactory Details:");
    console.log("- Owner:", factoryOwner);
    console.log("- Deployment Fee:", ethers.formatEther(deploymentFee), "ETH");
    console.log("- Fee Recipient:", feeRecipient);

    // Create a sample event for testing
    console.log("\n4. Creating sample event...");
    
    const eventDate = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
    const sampleEventTx = await eventTicketing.createEvent(
      "Blockchain Summit 2024",
      "The premier blockchain conference featuring industry leaders and developers.",
      "San Francisco, CA",
      eventDate,
      ethers.parseEther("0.5"), // 0.5 ETH
      ethers.parseEther("0.75"), // 0.75 ETH max
      500, // total tickets
      PLATFORM_WALLET,
      "Technology",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
    );
    
    await sampleEventTx.wait();
    console.log("✅ Sample event created successfully!");

    // Get event details
    const eventDetails = await eventTicketing.getEvent(1);
    console.log("Sample Event Details:");
    console.log("- Title:", eventDetails.title);
    console.log("- Price:", ethers.formatEther(eventDetails.price), "ETH");
    console.log("- Max Price:", ethers.formatEther(eventDetails.maxPrice), "ETH");
    console.log("- Total Tickets:", eventDetails.totalTickets.toString());
    console.log("- Receiver Wallet:", eventDetails.receiverWallet);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("EventTicketing:", eventTicketingAddress);
    console.log("EventTicketingFactory:", factoryAddress);
    
    console.log("\n🔧 Next Steps:");
    console.log("1. Update your frontend with these contract addresses");
    console.log("2. Add the contract ABIs to your frontend");
    console.log("3. Configure your Web3 provider to connect to these contracts");
    console.log("4. Test ticket minting functionality");

    // Save deployment info
    const deploymentInfo = {
      network: hre.network.name,
      chainId: (await ethers.provider.getNetwork()).chainId,
      contracts: {
        EventTicketing: {
          address: eventTicketingAddress,
          deployer: deployer.address,
          deploymentHash: eventTicketing.deploymentTransaction()?.hash
        },
        EventTicketingFactory: {
          address: factoryAddress,
          deployer: deployer.address,
          deploymentHash: factory.deploymentTransaction()?.hash
        }
      },
      configuration: {
        platformWallet: PLATFORM_WALLET,
        feeRecipient: FEE_RECIPIENT,
        platformFeePercentage: platformFee.toString(),
        deploymentFee: ethers.formatEther(deploymentFee)
      },
      timestamp: new Date().toISOString()
    };

    console.log("\n💾 Deployment Info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
