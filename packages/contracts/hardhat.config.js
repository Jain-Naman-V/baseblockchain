require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    "base-testnet": {
      url: process.env.BASE_TESTNET_RPC_URL || "https://goerli.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84531,
    },
    "base-mainnet": {
      url: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      "base-testnet": process.env.BASESCAN_API_KEY,
      "base-mainnet": process.env.BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: "base-testnet",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "base-mainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}; 