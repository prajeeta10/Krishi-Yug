//AgriSupplyChain.test.js
const AgriSupplyChain = artifacts.require("AgriSupplyChain");

contract("AgriSupplyChain", (accounts) => {
    const [owner, farmer1, farmer2] = accounts;

    it("should register a farmer", async () => {
        const instance = await AgriSupplyChain.deployed();

        // Farmer1 registration
        await instance.registerFarmer("John Doe", { from: farmer1 });
        const isRegistered = await instance.isFarmerRegistered(farmer1);

        assert.isTrue(isRegistered, "Farmer1 should be registered.");
    });

    it("should not allow duplicate farmer registration", async () => {
        const instance = await AgriSupplyChain.deployed();

        try {
            // Farmer1 attempts duplicate registration
            await instance.registerFarmer("John Doe", { from: farmer1 });
            assert.fail("Duplicate registration should throw an error.");
        } catch (error) {
            assert.include(error.message, "Farmer is already registered.");
        }
    });

    it("should add a product only by a registered farmer", async () => {
        const instance = await AgriSupplyChain.deployed();

        // Farmer1 adds a product
        await instance.addProduct("Wheat", "Farm A", "Warehouse B", { from: farmer1 });

        // Retrieve product details
        const product = await instance.getProduct(1);
        assert.equal(product.name, "Wheat", "Product name should match.");
    });

    it("should prevent unregistered farmers from adding products", async () => {
        const instance = await AgriSupplyChain.deployed();

        try {
            // Farmer2 (unregistered) tries to add a product
            await instance.addProduct("Rice", "Farm X", "Warehouse Y", { from: farmer2 });
            assert.fail("Unregistered farmer should not add products.");
        } catch (error) {
            assert.include(error.message, "You must be a registered farmer.");
        }
    });

    it("should delete a product by ID", async () => {
        const instance = await AgriSupplyChain.deployed();
    
        // Farmer1 deletes the product
        await instance.deleteProduct(1, { from: farmer1 });
    
        try {
            // Attempt to fetch the deleted product
            await instance.getProduct(1);
            assert.fail("Fetching a deleted product should throw an error.");
        } catch (error) {
            // Check if the error message contains "This product has been deleted."
            assert.include(
                error.message,
                "This product has been deleted.",
                "Error should indicate that the product has been deleted."
            );
        }
    });
  
});
