const Web3 = require('web3');
const { MyToken } = require('./build/contracts/MyToken.json');
const { TokenSale } = require('./build/contracts/TokenSale.json');

async function main() {
    const web3 = new Web3('http://localhost:8545'); // Connect to your Ethereum node

    const accounts = await web3.eth.getAccounts();

    // Deploy MyToken contract
    const myTokenContract = new web3.eth.Contract(MyToken.abi);
    const myTokenDeployed = await myTokenContract.deploy({ data: MyToken.bytecode }).send({ from: accounts[0], gas: '1000000' });

    // Deploy TokenSale contract
    const tokenPriceInWei = web3.utils.toWei('0.001', 'ether'); // Set token price
    const tokenSaleContract = new web3.eth.Contract(TokenSale.abi);
    const tokenSaleDeployed = await tokenSaleContract.deploy({ data: TokenSale.bytecode, arguments: [myTokenDeployed.options.address, tokenPriceInWei] }).send({ from: accounts[0], gas: '1000000' });

    // Purchase tokens
    await tokenSaleDeployed.methods.buyTokens().send({ from: accounts[1], value: web3.utils.toWei('1', 'ether') });

    // Display account's token balance
    const tokenBalance = await myTokenDeployed.methods.balanceOf(accounts[1]).call();
    console.log(`Token Balance: ${web3.utils.fromWei(tokenBalance)} MTK`);

    // Print number of tokens left for sale
    const tokensLeft = await tokenSaleDeployed.methods.tokensLeftForSale().call();
    console.log(`Tokens Left for Sale: ${web3.utils.fromWei(tokensLeft)} MTK`);
}

main();
