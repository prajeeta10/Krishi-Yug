//2_deploy_contracts.js
const AgriSupplyChain = artifacts.require("AgriSupplyChain");

module.exports = function (deployer) {
    deployer.deploy(AgriSupplyChain); 
};
