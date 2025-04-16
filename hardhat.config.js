require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@chainlink/contracts');
require('dotenv').config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_URL,
      accounts: [process.env.WALLET_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};