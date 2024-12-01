//truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Matches any network ID
      gas: 6721975,
      hooks: {
        afterDeploy: () => {
          const source = path.resolve(__dirname, 'build/contracts/AgriSupplyChain.json');
          const destination = path.resolve(__dirname, 'client/src/contracts/AgriSupplyChain.json');
    
          fs.copyFileSync(source, destination);
          console.log('Contract ABI copied successfully.');
        },
      },
    },
  },
  compilers: {
    solc: {
      version: "0.8.19", // Ensure this matches your contract
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};

