// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable {
    MyToken public token;
    uint256 public tokenPrice;

    event TokensPurchased(address indexed buyer, uint256 amount);

    // Pass the deployer's address to the Ownable constructor
    constructor(MyToken _token, uint256 _tokenPrice) Ownable(msg.sender) {
        token = _token;
        tokenPrice = _tokenPrice;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Value must be greater than 0");
        uint256 amount = (msg.value * (10**token.decimals())) / tokenPrice;
        require(token.balanceOf(address(this)) >= amount, "Not enough tokens for sale");

        token.transfer(msg.sender, amount);
        emit TokensPurchased(msg.sender, amount);
    }

    function tokensLeftForSale() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function withdrawEther() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
