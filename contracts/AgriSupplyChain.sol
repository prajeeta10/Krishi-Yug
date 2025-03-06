//AgriSupplyChain.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriSupplyChain {
    address public admin;

    struct Farmer {
        address walletAddress;
        string username;
        string password;
        string name;
        bool isRegistered;
        uint256 lastLogin;
    }

    struct Customer {
        address walletAddress;
        string username;
        string password;
        string name;
        bool isRegistered;
        uint256 lastLogin;
    }

    struct Crop {
        uint256 id;
        string name;
        string location;
        uint256 quantityProduced;
        uint256 price; // Price in rupees
        string additionalInfo;
        address farmer; // Owner of the crop
    }

    struct Transaction {
        uint256 cropId;
        address farmer;
        address customer;
        uint256 amount; // Paid in ether
        uint256 timestamp;
    }

    mapping(address => Farmer) public farmers;
    mapping(address => Customer) public customers;
    mapping(uint256 => Crop) public crops;
    mapping(address => Transaction[]) public farmerTransactions;
    mapping(address => Transaction[]) public customerTransactions;
    uint256 public cropCount;
    uint256 public etherRate = 80000; // Conversion rate from rupees to ether

    event FarmerRegistered(address indexed farmer, string name);
    event CustomerRegistered(address indexed customer, string name);
    event CropRegistered(uint256 indexed id, string name, address indexed farmer);
    event CropPurchased(uint256 indexed id, address indexed customer, address indexed farmer, uint256 amount);
    event CropSoldOut(address indexed farmer, string cropName, uint256 id);
    event FarmerLoggedIn(address indexed farmer, uint256 timestamp);
    event CustomerLoggedIn(address indexed customer, uint256 timestamp);

    modifier onlyFarmer() {
        require(farmers[msg.sender].isRegistered, "Only registered farmers can execute this.");
        _;
    }

    modifier onlyCustomer() {
        require(customers[msg.sender].isRegistered, "Only registered customers can execute this.");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can execute this.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

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

    function loginFarmer(string memory _username, string memory _password) public onlyFarmer {
        require(
            keccak256(abi.encodePacked(farmers[msg.sender].username)) == keccak256(abi.encodePacked(_username)),
            "Invalid username."
        );
        require(
            keccak256(abi.encodePacked(farmers[msg.sender].password)) == keccak256(abi.encodePacked(_password)),
            "Invalid password."
        );
        farmers[msg.sender].lastLogin = block.timestamp;
        emit FarmerLoggedIn(msg.sender, block.timestamp);
    }

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

    function loginCustomer(string memory _username, string memory _password) public onlyCustomer {
        require(
            keccak256(abi.encodePacked(customers[msg.sender].username)) == keccak256(abi.encodePacked(_username)),
            "Invalid username."
        );
        require(
            keccak256(abi.encodePacked(customers[msg.sender].password)) == keccak256(abi.encodePacked(_password)),
            "Invalid password."
        );
        customers[msg.sender].lastLogin = block.timestamp;
        emit CustomerLoggedIn(msg.sender, block.timestamp);
    }

    function registerCrop(
        string memory _name,
        string memory _location,
        uint256 _quantityProduced,
        uint256 _price,
        string memory _additionalInfo
    ) public onlyFarmer {
        cropCount++;
        crops[cropCount] = Crop({
            id: cropCount,
            name: _name,
            location: _location,
            quantityProduced: _quantityProduced,
            price: _price,
            additionalInfo: _additionalInfo,
            farmer: msg.sender
        });
        emit CropRegistered(cropCount, _name, msg.sender);
    }

    function getCrop(uint256 _id) public view returns (
        uint256 id,
        string memory name,
        string memory location,
        uint256 quantityProduced,
        uint256 price,
        string memory additionalInfo,
        address farmer
    ) {
        Crop memory crop = crops[_id];
        require(crop.id != 0, "Crop does not exist.");
        return (
            crop.id,
            crop.name,
            crop.location,
            crop.quantityProduced,
            crop.price,
            crop.additionalInfo,
            crop.farmer
        );
    }

    // Function to calculate the price based on quantity and crop ID
function calculatePrice(uint256 cropId, uint256 quantity) public view returns (uint256) {
    // Check if the quantity requested is available in the crop
    require(crops[cropId].quantityProduced >= quantity, "Insufficient quantity available.");

    // Calculate the total price in wei
    uint256 totalPrice = crops[cropId].price * quantity;
    return totalPrice;
}

// Function to buy a crop
function buyCrop(uint256 _id, uint256 _quantity) public payable onlyCustomer {
    // Calculate the price for the requested crop and quantity
    uint256 price = calculatePrice(_id, _quantity);
    uint256 receivedValue = msg.value;

    // Ensure that the amount of ETH sent is sufficient for the total price
    require(receivedValue >= price, "Insufficient ETH sent.");

    // Refund any excess amount if it is greater than the price
    if (receivedValue > price) {
        payable(msg.sender).transfer(receivedValue - price);
    }

    // Verify the crop exists and other conditions
    Crop storage crop = crops[_id];
    require(crop.id != 0, "Crop does not exist.");
    require(_quantity > 0, "Quantity must be greater than zero.");
    require(crop.quantityProduced >= _quantity, "Not enough quantity available.");

    // Update the quantity of the crop after purchase
    crop.quantityProduced -= _quantity;

    // If the quantity reaches zero, emit the CropSoldOut event
    if (crop.quantityProduced == 0) {
        emit CropSoldOut(crop.farmer, crop.name, crop.id);
    }

    // Transfer the received value to the farmer
    (bool success, ) = crop.farmer.call{value: price}("");
    require(success, "Payment to farmer failed.");

    // Log the transaction for both farmer and customer
    Transaction memory txn = Transaction({
        cropId: _id,
        farmer: crop.farmer,
        customer: msg.sender,
        amount: price,
        timestamp: block.timestamp
    });
    farmerTransactions[crop.farmer].push(txn);
    customerTransactions[msg.sender].push(txn);

    // Emit event to indicate a successful crop purchase
    emit CropPurchased(_id, msg.sender, crop.farmer, price);
}



    function setEtherRate(uint256 _newRate) public onlyAdmin {
        require(_newRate > 0, "Conversion rate must be positive.");
        etherRate = _newRate;
    }

    function convertRupeesToEther(uint256 rupees) public view returns (uint256) {
    return (rupees * 1 ether) / etherRate; // Define conversionRate (e.g., 100 INR = 1 Ether)
}


    function getFarmerTransactions() public view returns (Transaction[] memory) {
        return farmerTransactions[msg.sender];
    }

    function getCustomerTransactions() public view returns (Transaction[] memory) {
        return customerTransactions[msg.sender];
    }
    // Define a struct for order details
    struct Order {
        address customer;
        string customerName;
        string customerAddress;
        string customerContact;
        string cropName;
        string harvestLocation;
        string deliveredTo;
        uint pricePerUnit;
        uint quantityPurchased;
        uint expectedDeliveryDate;
    }

    // Map cropId to an array of orders
    mapping(uint => Order[]) public orders;

    // Function to get orders by cropId
    function getOrders(uint cropId) public view returns (Order[] memory) {
        return orders[cropId];
    }

}