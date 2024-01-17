// migrations/3_deploy_tokensale.js
const TokenSale = artifacts.require("TokenSale");
const MyToken = artifacts.require("MyToken");

module.exports = async function (deployer) {
  // Deploy MyToken
  await deployer.deploy(MyToken);
  const myTokenInstance = await MyToken.deployed();

  // Set token price in Wei
  const tokenPriceInWei = web3.utils.toWei("0.001", "ether");

  // Deploy TokenSale with MyToken's address and token price
  await deployer.deploy(TokenSale, myTokenInstance.address, tokenPriceInWei);
};
