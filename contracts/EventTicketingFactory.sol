// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./EventTicketing.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EventTicketingFactory
 * @dev Factory contract to deploy and manage multiple EventTicketing contracts
 */
contract EventTicketingFactory is Ownable {
    
    // Events
    event ContractDeployed(address indexed contractAddress, address indexed deployer, string name);
    event ContractRegistered(address indexed contractAddress, address indexed owner, string name);
    
    // Struct to store contract info
    struct ContractInfo {
        address contractAddress;
        address owner;
        string name;
        string description;
        uint256 deployedAt;
        bool isActive;
    }
    
    // State variables
    mapping(address => ContractInfo) public contracts;
    mapping(address => address[]) public userContracts; // user => contract addresses
    address[] public allContracts;
    
    uint256 public deploymentFee = 0.01 ether;
    address payable public feeRecipient;
    
    constructor(address payable _feeRecipient) {
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Deploy a new EventTicketing contract
     */
    function deployEventTicketing(
        string memory _name,
        string memory _description,
        address payable _platformWallet
    ) external payable returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_platformWallet != address(0), "Invalid platform wallet");
        
        // Deploy new contract
        EventTicketing newContract = new EventTicketing(_platformWallet);
        address contractAddress = address(newContract);
        
        // Transfer ownership to deployer
        newContract.transferOwnership(msg.sender);
        
        // Store contract info
        contracts[contractAddress] = ContractInfo({
            contractAddress: contractAddress,
            owner: msg.sender,
            name: _name,
            description: _description,
            deployedAt: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        userContracts[msg.sender].push(contractAddress);
        allContracts.push(contractAddress);
        
        // Send fee to recipient
        if (msg.value > 0) {
            feeRecipient.transfer(msg.value);
        }
        
        emit ContractDeployed(contractAddress, msg.sender, _name);
        return contractAddress;
    }
    
    /**
     * @dev Register an existing EventTicketing contract
     */
    function registerContract(
        address _contractAddress,
        string memory _name,
        string memory _description
    ) external {
        require(_contractAddress != address(0), "Invalid contract address");
        require(contracts[_contractAddress].contractAddress == address(0), "Contract already registered");
        
        // Verify the caller owns the contract
        EventTicketing ticketingContract = EventTicketing(_contractAddress);
        require(ticketingContract.owner() == msg.sender, "Not contract owner");
        
        // Store contract info
        contracts[_contractAddress] = ContractInfo({
            contractAddress: _contractAddress,
            owner: msg.sender,
            name: _name,
            description: _description,
            deployedAt: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        userContracts[msg.sender].push(_contractAddress);
        allContracts.push(_contractAddress);
        
        emit ContractRegistered(_contractAddress, msg.sender, _name);
    }
    
    /**
     * @dev Get user's contracts
     */
    function getUserContracts(address _user) external view returns (address[] memory) {
        return userContracts[_user];
    }
    
    /**
     * @dev Get all contracts
     */
    function getAllContracts() external view returns (address[] memory) {
        return allContracts;
    }
    
    /**
     * @dev Get contract info
     */
    function getContractInfo(address _contractAddress) external view returns (ContractInfo memory) {
        return contracts[_contractAddress];
    }
    
    /**
     * @dev Get total number of deployed contracts
     */
    function getTotalContracts() external view returns (uint256) {
        return allContracts.length;
    }
    
    /**
     * @dev Deactivate a contract (owner only)
     */
    function deactivateContract(address _contractAddress) external {
        require(contracts[_contractAddress].owner == msg.sender || msg.sender == owner(), "Not authorized");
        contracts[_contractAddress].isActive = false;
    }
    
    /**
     * @dev Reactivate a contract (owner only)
     */
    function reactivateContract(address _contractAddress) external {
        require(contracts[_contractAddress].owner == msg.sender || msg.sender == owner(), "Not authorized");
        contracts[_contractAddress].isActive = true;
    }
    
    // Admin functions
    function setDeploymentFee(uint256 _newFee) external onlyOwner {
        deploymentFee = _newFee;
    }
    
    function setFeeRecipient(address payable _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid address");
        feeRecipient = _newRecipient;
    }
    
    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
