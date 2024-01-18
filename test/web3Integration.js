const Web3 = require('web3');
const MyToken = require('./build/contracts/MyToken.json');
const TokenSale = require('./build/contracts/TokenSale.json');

async function main() {
    const web3 = new Web3('http://localhost:8545'); // Connect to your Ethereum node

    const accounts = await web3.eth.getAccounts();

    // Deploy MyToken contract
    const myTokenContract = new web3.eth.Contract(MyToken.abi);
    const myTokenDeployed = await myTokenContract.deploy({ data: MyToken.bytecode, arguments: [1000000 * 10**18] }).send({ from: accounts[0], gas: '5000000' });

    console.log('MyToken contract deployed at address:', myTokenDeployed.options.address);

    // Deploy TokenSale contract
    const tokenPriceInWei = web3.utils.toWei('0.001', 'ether'); // Set token price
    const tokenSaleContract = new web3.eth.Contract(TokenSale.abi);
    const tokenSaleDeployed = await tokenSaleContract.deploy({ data: TokenSale.bytecode, arguments: [myTokenDeployed.options.address, tokenPriceInWei] }).send({ from: accounts[0], gas: '5000000' });

    console.log('TokenSale contract deployed at address:', tokenSaleDeployed.options.address);

    // Transfer all tokens to TokenSale contract
    await myTokenDeployed.methods.transfer(tokenSaleDeployed.options.address, 1000000 * 10**18).send({ from: accounts[0] });

    // Purchase tokens
    const numberOfTokensToBuy = 10; // Specify the number of tokens to buy
    await tokenSaleDeployed.methods.buyTokens(numberOfTokensToBuy).send({ from: accounts[1], value: web3.utils.toWei((numberOfTokensToBuy * 0.001).toString(), 'ether') });

    // Display account's token balance
    const tokenBalance = await myTokenDeployed.methods.balanceOf(accounts[1]).call();
    console.log(`Token Balance: ${web3.utils.fromWei(tokenBalance, 'ether')} MTK`);

    // Print number of tokens left for sale
    const tokensLeft = await myTokenDeployed.methods.balanceOf(tokenSaleDeployed.options.address).call();
    console.log(`Tokens Left for Sale: ${web3.utils.fromWei(tokensLeft, 'ether')} MTK`);
}

main().catch(console.error);
