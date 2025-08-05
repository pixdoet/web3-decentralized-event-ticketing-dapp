// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title EventTicketing
 * @dev NFT-based event ticketing system with dynamic pricing and resale functionality
 */
contract EventTicketing is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Events
    event EventCreated(uint256 indexed eventId, address indexed organizer, string title, uint256 totalTickets);
    event TicketMinted(uint256 indexed tokenId, uint256 indexed eventId, address indexed buyer, uint256 price);
    event TicketResold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event EventCancelled(uint256 indexed eventId, string reason);
    event PriceUpdated(uint256 indexed eventId, uint256 newPrice, uint256 newMaxPrice);
    
    // Structs
    struct Event {
        uint256 id;
        string title;
        string description;
        string location;
        uint256 date;
        uint256 price;
        uint256 maxPrice;
        uint256 totalTickets;
        uint256 soldTickets;
        address payable organizer;
        address payable receiverWallet;
        string category;
        string imageURI;
        bool isActive;
        bool isCancelled;
    }
    
    struct Ticket {
        uint256 eventId;
        uint256 purchasePrice;
        uint256 purchaseDate;
        bool isForSale;
        uint256 salePrice;
        bool isUsed;
    }
    
    // State variables
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => uint256[]) public eventTickets; // eventId => tokenIds
    mapping(address => uint256[]) public userTickets; // user => tokenIds
    
    uint256 public eventCounter;
    uint256 public platformFeePercentage = 250; // 2.5%
    address payable public platformWallet;
    
    // Constants
    uint256 public constant MAX_TICKETS_PER_EVENT = 10000;
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10%
    
    constructor(address payable _platformWallet) ERC721("EventTicket", "ETKT") {
        platformWallet = _platformWallet;
        _tokenIdCounter.increment(); // Start from 1
    }
    
    /**
     * @dev Create a new event
     */
    function createEvent(
        string memory _title,
        string memory _description,
        string memory _location,
        uint256 _date,
        uint256 _price,
        uint256 _maxPrice,
        uint256 _totalTickets,
        address payable _receiverWallet,
        string memory _category,
        string memory _imageURI
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_date > block.timestamp, "Event date must be in the future");
        require(_price > 0, "Price must be greater than 0");
        require(_maxPrice >= _price, "Max price must be >= price");
        require(_totalTickets > 0 && _totalTickets <= MAX_TICKETS_PER_EVENT, "Invalid ticket count");
        require(_receiverWallet != address(0), "Invalid receiver wallet");
        
        eventCounter++;
        
        events[eventCounter] = Event({
            id: eventCounter,
            title: _title,
            description: _description,
            location: _location,
            date: _date,
            price: _price,
            maxPrice: _maxPrice,
            totalTickets: _totalTickets,
            soldTickets: 0,
            organizer: payable(msg.sender),
            receiverWallet: _receiverWallet,
            category: _category,
            imageURI: _imageURI,
            isActive: true,
            isCancelled: false
        });
        
        emit EventCreated(eventCounter, msg.sender, _title, _totalTickets);
        return eventCounter;
    }
    
    /**
     * @dev Mint a ticket for an event
     */
    function mintTicket(uint256 _eventId, string memory _tokenURI) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Event storage eventData = events[_eventId];
        require(eventData.isActive, "Event is not active");
        require(!eventData.isCancelled, "Event is cancelled");
        require(eventData.date > block.timestamp, "Event has already occurred");
        require(eventData.soldTickets < eventData.totalTickets, "All tickets sold");
        
        uint256 currentPrice = getCurrentPrice(_eventId);
        require(msg.value >= currentPrice, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        // Store ticket data
        tickets[tokenId] = Ticket({
            eventId: _eventId,
            purchasePrice: currentPrice,
            purchaseDate: block.timestamp,
            isForSale: false,
            salePrice: 0,
            isUsed: false
        });
        
        // Update event data
        eventData.soldTickets++;
        eventTickets[_eventId].push(tokenId);
        userTickets[msg.sender].push(tokenId);
        
        // Handle payments
        _handlePayment(currentPrice, eventData.receiverWallet);
        
        // Refund excess payment
        if (msg.value > currentPrice) {
            payable(msg.sender).transfer(msg.value - currentPrice);
        }
        
        emit TicketMinted(tokenId, _eventId, msg.sender, currentPrice);
    }
    
    /**
     * @dev Get current ticket price with dynamic pricing
     */
    function getCurrentPrice(uint256 _eventId) public view returns (uint256) {
        Event memory eventData = events[_eventId];
        if (eventData.soldTickets == 0) {
            return eventData.price;
        }
        
        // Dynamic pricing: price increases as more tickets are sold
        uint256 soldPercentage = (eventData.soldTickets * 100) / eventData.totalTickets;
        uint256 priceIncrease = ((eventData.maxPrice - eventData.price) * soldPercentage) / 100;
        
        return eventData.price + priceIncrease;
    }
    
    /**
     * @dev List ticket for resale
     */
    function listTicketForSale(uint256 _tokenId, uint256 _salePrice) external {
        require(ownerOf(_tokenId) == msg.sender, "Not ticket owner");
        require(!tickets[_tokenId].isUsed, "Ticket already used");
        require(_salePrice > 0, "Sale price must be greater than 0");
        
        Event memory eventData = events[tickets[_tokenId].eventId];
        require(eventData.date > block.timestamp, "Event has already occurred");
        require(!eventData.isCancelled, "Event is cancelled");
        
        tickets[_tokenId].isForSale = true;
        tickets[_tokenId].salePrice = _salePrice;
    }
    
    /**
     * @dev Remove ticket from sale
     */
    function removeTicketFromSale(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not ticket owner");
        
        tickets[_tokenId].isForSale = false;
        tickets[_tokenId].salePrice = 0;
    }
    
    /**
     * @dev Buy ticket from resale market
     */
    function buyResaleTicket(uint256 _tokenId) external payable nonReentrant whenNotPaused {
        require(tickets[_tokenId].isForSale, "Ticket not for sale");
        require(!tickets[_tokenId].isUsed, "Ticket already used");
        require(msg.value >= tickets[_tokenId].salePrice, "Insufficient payment");
        
        Event memory eventData = events[tickets[_tokenId].eventId];
        require(eventData.date > block.timestamp, "Event has already occurred");
        require(!eventData.isCancelled, "Event is cancelled");
        
        address seller = ownerOf(_tokenId);
        uint256 salePrice = tickets[_tokenId].salePrice;
        
        // Update ticket data
        tickets[_tokenId].isForSale = false;
        tickets[_tokenId].salePrice = 0;
        
        // Transfer NFT
        _transfer(seller, msg.sender, _tokenId);
        
        // Update user tickets mapping
        _removeFromUserTickets(seller, _tokenId);
        userTickets[msg.sender].push(_tokenId);
        
        // Handle payment
        _handleResalePayment(salePrice, payable(seller));
        
        // Refund excess payment
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }
        
        emit TicketResold(_tokenId, seller, msg.sender, salePrice);
    }
    
    /**
     * @dev Use ticket (mark as used)
     */
    function useTicket(uint256 _tokenId) external {
        Event memory eventData = events[tickets[_tokenId].eventId];
        require(
            msg.sender == eventData.organizer || msg.sender == owner(),
            "Only organizer or contract owner can use tickets"
        );
        require(!tickets[_tokenId].isUsed, "Ticket already used");
        
        tickets[_tokenId].isUsed = true;
        tickets[_tokenId].isForSale = false;
        tickets[_tokenId].salePrice = 0;
    }
    
    /**
     * @dev Cancel event and enable refunds
     */
    function cancelEvent(uint256 _eventId, string memory _reason) external {
        Event storage eventData = events[_eventId];
        require(
            msg.sender == eventData.organizer || msg.sender == owner(),
            "Only organizer or contract owner can cancel"
        );
        require(eventData.isActive, "Event is not active");
        require(!eventData.isCancelled, "Event already cancelled");
        
        eventData.isCancelled = true;
        eventData.isActive = false;
        
        emit EventCancelled(_eventId, _reason);
    }
    
    /**
     * @dev Claim refund for cancelled event
     */
    function claimRefund(uint256 _tokenId) external nonReentrant {
        require(ownerOf(_tokenId) == msg.sender, "Not ticket owner");
        
        Event memory eventData = events[tickets[_tokenId].eventId];
        require(eventData.isCancelled, "Event is not cancelled");
        require(!tickets[_tokenId].isUsed, "Cannot refund used ticket");
        
        uint256 refundAmount = tickets[_tokenId].purchasePrice;
        tickets[_tokenId].isUsed = true; // Prevent double refund
        
        // Burn the NFT
        _burn(_tokenId);
        
        // Remove from user tickets
        _removeFromUserTickets(msg.sender, _tokenId);
        
        // Send refund
        payable(msg.sender).transfer(refundAmount);
    }
    
    /**
     * @dev Update event pricing (organizer only)
     */
    function updateEventPricing(uint256 _eventId, uint256 _newPrice, uint256 _newMaxPrice) external {
        Event storage eventData = events[_eventId];
        require(msg.sender == eventData.organizer, "Only organizer can update pricing");
        require(eventData.isActive, "Event is not active");
        require(_newPrice > 0, "Price must be greater than 0");
        require(_newMaxPrice >= _newPrice, "Max price must be >= price");
        
        eventData.price = _newPrice;
        eventData.maxPrice = _newMaxPrice;
        
        emit PriceUpdated(_eventId, _newPrice, _newMaxPrice);
    }
    
    /**
     * @dev Get event details
     */
    function getEvent(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }
    
    /**
     * @dev Get ticket details
     */
    function getTicket(uint256 _tokenId) external view returns (Ticket memory) {
        return tickets[_tokenId];
    }
    
    /**
     * @dev Get user's tickets
     */
    function getUserTickets(address _user) external view returns (uint256[] memory) {
        return userTickets[_user];
    }
    
    /**
     * @dev Get event tickets
     */
    function getEventTickets(uint256 _eventId) external view returns (uint256[] memory) {
        return eventTickets[_eventId];
    }
    
    /**
     * @dev Handle payment distribution
     */
    function _handlePayment(uint256 _amount, address payable _receiverWallet) private {
        uint256 platformFee = (_amount * platformFeePercentage) / 10000;
        uint256 receiverAmount = _amount - platformFee;
        
        if (platformFee > 0) {
            platformWallet.transfer(platformFee);
        }
        
        _receiverWallet.transfer(receiverAmount);
    }
    
    /**
     * @dev Handle resale payment distribution
     */
    function _handleResalePayment(uint256 _amount, address payable _seller) private {
        uint256 platformFee = (_amount * platformFeePercentage) / 10000;
        uint256 sellerAmount = _amount - platformFee;
        
        if (platformFee > 0) {
            platformWallet.transfer(platformFee);
        }
        
        _seller.transfer(sellerAmount);
    }
    
    /**
     * @dev Remove token from user's ticket list
     */
    function _removeFromUserTickets(address _user, uint256 _tokenId) private {
        uint256[] storage userTokens = userTickets[_user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == _tokenId) {
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Override required by Solidity
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    // Admin functions
    function setPlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= MAX_PLATFORM_FEE, "Fee too high");
        platformFeePercentage = _newFeePercentage;
    }
    
    function setPlatformWallet(address payable _newPlatformWallet) external onlyOwner {
        require(_newPlatformWallet != address(0), "Invalid address");
        platformWallet = _newPlatformWallet;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency withdrawal (only for stuck funds)
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
