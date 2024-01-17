// MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        // Add debugging information
        emit DebugLog("MyToken constructor called");

        // Mint initial supply
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        // Add debugging information
        emit DebugLog("Transfer function called");

        _transfer(msg.sender, to, amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    // Add a debug event
    event DebugLog(string message);
}
