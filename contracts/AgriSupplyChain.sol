// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriSupplyChain {
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
        require(keccak256(abi.encodePacked(farmers[msg.sender].username)) == keccak256(abi.encodePacked(_username)), "Invalid username.");
        require(keccak256(abi.encodePacked(farmers[msg.sender].password)) == keccak256(abi.encodePacked(_password)), "Invalid password.");
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
        require(keccak256(abi.encodePacked(customers[msg.sender].username)) == keccak256(abi.encodePacked(_username)), "Invalid username.");
        require(keccak256(abi.encodePacked(customers[msg.sender].password)) == keccak256(abi.encodePacked(_password)), "Invalid password.");
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

    function buyCrop(uint256 _id, uint256 _quantity) public payable onlyCustomer {
        Crop memory crop = crops[_id];
        require(crop.id != 0, "Crop does not exist.");
        require(_quantity > 0, "Quantity must be greater than zero.");
        require(crop.quantityProduced >= _quantity, "Not enough quantity available.");

        uint256 totalPriceInRupees = crop.price * _quantity;
        uint256 totalPriceInEther = convertRupeesToEther(totalPriceInRupees);

        require(msg.value >= totalPriceInEther, "Insufficient ETH sent.");

        crops[_id].quantityProduced -= _quantity;

        if (crops[_id].quantityProduced == 0) {
            emit CropSoldOut(crop.farmer, crop.name, crop.id);
        }

        (bool success, ) = crop.farmer.call{value: msg.value}("");
        require(success, "Payment to farmer failed.");

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

    function convertRupeesToEther(uint256 rupees) public pure returns (uint256) {
        uint256 etherRate = 80000;
        return rupees * 1 ether / etherRate;
    }

    function getFarmerTransactions() public view returns (Transaction[] memory) {
        return farmerTransactions[msg.sender];
    }

    function getCustomerTransactions() public view returns (Transaction[] memory) {
        return customerTransactions[msg.sender];
    }
}
