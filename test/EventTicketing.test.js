const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventTicketing", function () {
  let EventTicketing, eventTicketing;
  let owner, organizer, buyer, platformWallet, receiverWallet;
  let eventId;

  beforeEach(async function () {
    [owner, organizer, buyer, platformWallet, receiverWallet] = await ethers.getSigners();
    
    EventTicketing = await ethers.getContractFactory("EventTicketing");
    eventTicketing = await EventTicketing.deploy(platformWallet.address);
    await eventTicketing.waitForDeployment();
  });

  describe("Event Creation", function () {
    it("Should create an event successfully", async function () {
      const eventDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      
      const tx = await eventTicketing.connect(organizer).createEvent(
        "Test Event",
        "Test Description",
        "Test Location",
        eventDate,
        ethers.parseEther("0.1"),
        ethers.parseEther("0.2"),
        100,
        receiverWallet.address,
        "Technology",
        "https://test-image.com"
      );

      await expect(tx)
        .to.emit(eventTicketing, "EventCreated")
        .withArgs(1, organizer.address, "Test Event", 100);

      const event = await eventTicketing.getEvent(1);
      expect(event.title).to.equal("Test Event");
      expect(event.organizer).to.equal(organizer.address);
      expect(event.receiverWallet).to.equal(receiverWallet.address);
      expect(event.isActive).to.be.true;
    });

    it("Should fail to create event with invalid parameters", async function () {
      const pastDate = Math.floor(Date.now() / 1000) - 86400; // 1 day ago
      
      await expect(
        eventTicketing.connect(organizer).createEvent(
          "",
          "Test Description",
          "Test Location",
          pastDate,
          ethers.parseEther("0.1"),
          ethers.parseEther("0.2"),
          100,
          receiverWallet.address,
          "Technology",
          "https://test-image.com"
        )
      ).to.be.revertedWith("Title cannot be empty");
    });
  });

  describe("Ticket Minting", function () {
    beforeEach(async function () {
      const eventDate = Math.floor(Date.now() / 1000) + 86400;
      await eventTicketing.connect(organizer).createEvent(
        "Test Event",
        "Test Description",
        "Test Location",
        eventDate,
        ethers.parseEther("0.1"),
        ethers.parseEther("0.2"),
        100,
        receiverWallet.address,
        "Technology",
        "https://test-image.com"
      );
      eventId = 1;
    });

    it("Should mint a ticket successfully", async function () {
      const ticketPrice = ethers.parseEther("0.1");
      
      const tx = await eventTicketing.connect(buyer).mintTicket(
        eventId,
        "https://test-metadata.com",
        { value: ticketPrice }
      );

      await expect(tx)
        .to.emit(eventTicketing, "TicketMinted")
        .withArgs(1, eventId, buyer.address, ticketPrice);

      expect(await eventTicketing.ownerOf(1)).to.equal(buyer.address);
      
      const ticket = await eventTicketing.getTicket(1);
      expect(ticket.eventId).to.equal(eventId);
      expect(ticket.purchasePrice).to.equal(ticketPrice);
    });

    it("Should handle dynamic pricing correctly", async function () {
      const initialPrice = await eventTicketing.getCurrentPrice(eventId);
      expect(initialPrice).to.equal(ethers.parseEther("0.1"));

      // Mint some tickets to increase price
      for (let i = 0; i < 50; i++) {
        await eventTicketing.connect(buyer).mintTicket(
          eventId,
          "https://test-metadata.com",
          { value: ethers.parseEther("0.2") }
        );
      }

      const newPrice = await eventTicketing.getCurrentPrice(eventId);
      expect(newPrice).to.be.gt(initialPrice);
    });

    it("Should fail with insufficient payment", async function () {
      await expect(
        eventTicketing.connect(buyer).mintTicket(
          eventId,
          "https://test-metadata.com",
          { value: ethers.parseEther("0.05") }
        )
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("Ticket Resale", function () {
    let tokenId;

    beforeEach(async function () {
      const eventDate = Math.floor(Date.now() / 1000) + 86400;
      await eventTicketing.connect(organizer).createEvent(
        "Test Event",
        "Test Description",
        "Test Location",
        eventDate,
        ethers.parseEther("0.1"),
        ethers.parseEther("0.2"),
        100,
        receiverWallet.address,
        "Technology",
        "https://test-image.com"
      );
      
      await eventTicketing.connect(buyer).mintTicket(
        1,
        "https://test-metadata.com",
        { value: ethers.parseEther("0.1") }
      );
      
      tokenId = 1;
    });

    it("Should list ticket for sale", async function () {
      const salePrice = ethers.parseEther("0.15");
      
      await eventTicketing.connect(buyer).listTicketForSale(tokenId, salePrice);
      
      const ticket = await eventTicketing.getTicket(tokenId);
      expect(ticket.isForSale).to.be.true;
      expect(ticket.salePrice).to.equal(salePrice);
    });

    it("Should buy resale ticket", async function () {
      const salePrice = ethers.parseEther("0.15");
      const [, , , newBuyer] = await ethers.getSigners();
      
      await eventTicketing.connect(buyer).listTicketForSale(tokenId, salePrice);
      
      const tx = await eventTicketing.connect(newBuyer).buyResaleTicket(tokenId, {
        value: salePrice
      });

      await expect(tx)
        .to.emit(eventTicketing, "TicketResold")
        .withArgs(tokenId, buyer.address, newBuyer.address, salePrice);

      expect(await eventTicketing.ownerOf(tokenId)).to.equal(newBuyer.address);
    });
  });

  describe("Event Cancellation and Refunds", function () {
    let tokenId;

    beforeEach(async function () {
      const eventDate = Math.floor(Date.now() / 1000) + 86400;
      await eventTicketing.connect(organizer).createEvent(
        "Test Event",
        "Test Description",
        "Test Location",
        eventDate,
        ethers.parseEther("0.1"),
        ethers.parseEther("0.2"),
        100,
        receiverWallet.address,
        "Technology",
        "https://test-image.com"
      );
      
      await eventTicketing.connect(buyer).mintTicket(
        1,
        "https://test-metadata.com",
        { value: ethers.parseEther("0.1") }
      );
      
      tokenId = 1;
    });

    it("Should cancel event", async function () {
      const tx = await eventTicketing.connect(organizer).cancelEvent(1, "Venue unavailable");
      
      await expect(tx)
        .to.emit(eventTicketing, "EventCancelled")
        .withArgs(1, "Venue unavailable");

      const event = await eventTicketing.getEvent(1);
      expect(event.isCancelled).to.be.true;
    });

    it("Should process refund for cancelled event", async function () {
      await eventTicketing.connect(organizer).cancelEvent(1, "Venue unavailable");
      
      const balanceBefore = await ethers.provider.getBalance(buyer.address);
      
      const tx = await eventTicketing.connect(buyer).claimRefund(tokenId);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const balanceAfter = await ethers.provider.getBalance(buyer.address);
      const expectedBalance = balanceBefore + ethers.parseEther("0.1") - gasUsed;
      
      expect(balanceAfter).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to set platform fee", async function () {
      await expect(
        eventTicketing.connect(organizer).setPlatformFee(500)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await eventTicketing.connect(owner).setPlatformFee(500);
      expect(await eventTicketing.platformFeePercentage()).to.equal(500);
    });

    it("Should only allow organizer to cancel event", async function () {
      const eventDate = Math.floor(Date.now() / 1000) + 86400;
      await eventTicketing.connect(organizer).createEvent(
        "Test Event",
        "Test Description",
        "Test Location",
        eventDate,
        ethers.parseEther("0.1"),
        ethers.parseEther("0.2"),
        100,
        receiverWallet.address,
        "Technology",
        "https://test-image.com"
      );

      await expect(
        eventTicketing.connect(buyer).cancelEvent(1, "Test reason")
      ).to.be.revertedWith("Only organizer or contract owner can cancel");
    });
  });
});
