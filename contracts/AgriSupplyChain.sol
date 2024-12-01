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
        uint256 price;
        string additionalInfo;
        address farmer; // Owner of the crop
    }

    // State variables
    mapping(address => Farmer) public farmers;
    mapping(address => Customer) public customers;
    mapping(uint256 => Crop) public crops;
    uint256 public cropCount;

    // Events
    event FarmerRegistered(address indexed farmer, string name);
    event CustomerRegistered(address indexed customer, string name);
    event CropRegistered(uint256 indexed id, string name, address indexed farmer);

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

     function loginFarmer(string memory _username, string memory _password) public view returns (bool) {
        Farmer memory farmer = farmers[msg.sender];
        require(farmer.isRegistered, "Farmer not registered.");
        require(
            keccak256(abi.encodePacked(farmer.username)) == keccak256(abi.encodePacked(_username)) &&
            keccak256(abi.encodePacked(farmer.password)) == keccak256(abi.encodePacked(_password)),
            "Invalid username or password."
        );
        return true;
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

    // Customer Login
    function loginCustomer(string memory _username, string memory _password) public view returns (bool) {
        Customer memory customer = customers[msg.sender];
        require(customer.isRegistered, "Customer not registered.");
        require(
            keccak256(abi.encodePacked(customer.username)) == keccak256(abi.encodePacked(_username)) &&
            keccak256(abi.encodePacked(customer.password)) == keccak256(abi.encodePacked(_password)),
            "Invalid username or password."
        );
        return true;
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

    // Get Crop Details
    function getCrop(uint256 _id)
        public
        view
        returns (
            uint256 id,
            string memory name,
            string memory location,
            uint256 harvestTime,
            uint256 price,
            string memory additionalInfo,
            address farmer
        )
    {
        Crop memory crop = crops[_id];
        return (crop.id, crop.name, crop.location, crop.harvestTime, crop.price, crop.additionalInfo, crop.farmer);
    }
}
