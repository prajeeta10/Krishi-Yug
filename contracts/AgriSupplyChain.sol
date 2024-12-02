//AgriSupplyChain.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriSupplyChain {
    // Farmer Structure
    struct Farmer {
        address walletAddress;
        string username;
        string password;
        string name;
        bool isRegistered;
        uint256 lastLogin;
    }

    // Customer Structure
    struct Customer {
        address walletAddress;
        string username;
        string password;
        string name;
        bool isRegistered;
        uint256 lastLogin;
    }

    // Crop Structure
    struct Crop {
        uint256 id;
        string name;
        string location;
        uint256 harvestTime; // Days required for harvest
        uint256 price; // Price in rupees
        string additionalInfo;
        address farmer; // Owner of the crop
    }

    // Transaction Structure
    struct Transaction {
        uint256 cropId;
        address farmer;
        address customer;
        uint256 amount; // Paid in ether
        uint256 timestamp;
    }

    // State Variables
    mapping(address => Farmer) public farmers;
    mapping(address => Customer) public customers;
    mapping(uint256 => Crop) public crops;
    mapping(address => Transaction[]) public farmerTransactions;
    mapping(address => Transaction[]) public customerTransactions;
    uint256 public cropCount;

    // Events
    event FarmerRegistered(address indexed farmer, string name);
    event CustomerRegistered(address indexed customer, string name);
    event CropRegistered(uint256 indexed id, string name, address indexed farmer);
    event CropPurchased(uint256 indexed id, address indexed customer, address indexed farmer, uint256 amount);

    // Register Farmer
    function registerFarmer(
        string memory _username,
        string memory _password,
        string memory _name
    ) public {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered.");
        farmers[msg.sender] = Farmer({
            walletAddress: msg.sender,
            username: _username,
            password: _password,
            name: _name,
            isRegistered: true,
            lastLogin: 0
        });
        emit FarmerRegistered(msg.sender, _name);
    }

    // Register Customer
    function registerCustomer(
        string memory _username,
        string memory _password,
        string memory _name
    ) public {
        require(!customers[msg.sender].isRegistered, "Customer already registered.");
        customers[msg.sender] = Customer({
            walletAddress: msg.sender,
            username: _username,
            password: _password,
            name: _name,
            isRegistered: true,
            lastLogin: 0
        });
        emit CustomerRegistered(msg.sender, _name);
    }

    // Register Crop
    function registerCrop(
        string memory _name,
        string memory _location,
        uint256 _harvestTime,
        uint256 _price,
        string memory _additionalInfo
    ) public {
        require(farmers[msg.sender].isRegistered, "Only registered farmers can add crops.");
        cropCount++;
        crops[cropCount] = Crop({
            id: cropCount,
            name: _name,
            location: _location,
            harvestTime: _harvestTime,
            price: _price,
            additionalInfo: _additionalInfo,
            farmer: msg.sender
        });
        emit CropRegistered(cropCount, _name, msg.sender);
    }

    // Purchase Crop
    function buyCrop(uint256 _id, uint256 _quantity) public payable {
        require(customers[msg.sender].isRegistered, "Only registered customers can buy crops.");
        Crop memory crop = crops[_id];
        require(crop.id != 0, "Crop does not exist.");
        require(_quantity > 0, "Quantity must be greater than zero.");

        uint256 totalPriceInRupees = crop.price * _quantity;
        uint256 totalPriceInEther = convertRupeesToEther(totalPriceInRupees);

        require(msg.value >= totalPriceInEther, "Insufficient ETH sent.");

        // Transfer payment to farmer
        payable(crop.farmer).transfer(msg.value);

        // Record transaction
        Transaction memory txn = Transaction({
            cropId: _id,
            farmer: crop.farmer,
            customer: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });
        farmerTransactions[crop.farmer].push(txn);
        customerTransactions[msg.sender].push(txn);

        emit CropPurchased(_id, msg.sender, crop.farmer, msg.value);
    }

    // Utility: Convert Rupees to Ether
    function convertRupeesToEther(uint256 rupees) public pure returns (uint256) {
        uint256 etherRate = 80000; // Example conversion rate: 1 ETH = 80,000 INR
        return rupees * 1 ether / etherRate;
    }

    // View Farmer Transactions
    function getFarmerTransactions() public view returns (Transaction[] memory) {
        return farmerTransactions[msg.sender];
    }

    // View Customer Transactions
    function getCustomerTransactions() public view returns (Transaction[] memory) {
        return customerTransactions[msg.sender];
    }
}
