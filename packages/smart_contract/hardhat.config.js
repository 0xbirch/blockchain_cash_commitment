require("@nomiclabs/hardhat-waffle");
require('dotenv').config()
require("@nomiclabs/hardhat-etherscan");

const {PRIVATE_KEY, ALCH_API_KEY} = process.env

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    const balance = await account.getBalance()
    console.log(account.address, ":", hre.ethers.utils.formatEther(balance.toString()), "ether", "nonce", await account.getTransactionCount());
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
//	paths: {
//    	artifacts: '../dapp/src/artifacts',
//  	},
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337
    },
    hardhat: { 
      chainId: 1337
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY]
    },
		ropsten: {
			url: `https://eth-ropsten.alchemyapi.io/v2/${ALCH_API_KEY}`,
			accounts: [`${PRIVATE_KEY}`]
		}
	},
	etherscan: {
		apiKey: `${ETHERSCAN_KEY}`
}
}

