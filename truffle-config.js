//truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Matches any network ID
      gas: 6721975,
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

