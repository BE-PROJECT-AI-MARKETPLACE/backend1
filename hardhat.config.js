require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Assuming Ganache is running on the default port
      accounts: {
        mnemonic: "glory sting actor video mouse result income amateur mass polar confirm unfold",
      },
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
      viaIR: true,
    },
  }
};
