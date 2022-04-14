// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HelloWorld {
    string message;

    constructor() public {
        message = "Hello World!";
    }

    function Get() public view returns (string memory) {
        return message;
    }

    function Set(string memory newMessage) public {
        message = newMessage;
    }
}
