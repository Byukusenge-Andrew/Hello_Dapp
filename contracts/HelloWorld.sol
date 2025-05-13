// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    
    constructor() {
       message = "Hello, World!"; 
    }
    
    function getName() public view returns (string memory) {
        return message;
    }
    
    function setName(string memory _name) public {
       message = _name;
    }
    
    function clearMessage() public {
        message = "";
    }
}