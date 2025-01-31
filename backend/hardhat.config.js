require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    avalancheFuji: {
      url: process.env.AVALANCHE_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};