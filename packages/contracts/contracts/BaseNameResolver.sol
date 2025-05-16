// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBaseNameResolver.sol";

/**
 * @title BaseNameResolver
 * @dev Implementation of Base L2 naming system for human-readable identities
 * This is a simplified mock for our medilocker application
 */
contract BaseNameResolver is IBaseNameResolver, Ownable {
    // Mapping from name to address
    mapping(string => address) private nameToAddress;
    
    // Mapping from address to name
    mapping(address => string) private addressToName;
    
    // Events
    event NameRegistered(string name, address indexed owner);
    event NameTransferred(string name, address indexed oldOwner, address indexed newOwner);
    
    /**
     * @dev Constructor
     */
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new Base name
     * @param name The Base name to register
     */
    function registerName(string calldata name) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(nameToAddress[name] == address(0), "Name already registered");
        
        // Clear previous registration if exists
        string memory oldName = addressToName[msg.sender];
        if (bytes(oldName).length > 0) {
            nameToAddress[oldName] = address(0);
        }
        
        // Register new name
        nameToAddress[name] = msg.sender;
        addressToName[msg.sender] = name;
        
        emit NameRegistered(name, msg.sender);
    }
    
    /**
     * @dev Transfer a Base name to another address
     * @param name The Base name to transfer
     * @param newOwner The new owner of the name
     */
    function transferName(string calldata name, address newOwner) external {
        require(nameToAddress[name] == msg.sender, "Not the owner of this name");
        require(newOwner != address(0), "Cannot transfer to zero address");
        
        // Clear the new owner's previous name if exists
        string memory oldName = addressToName[newOwner];
        if (bytes(oldName).length > 0) {
            nameToAddress[oldName] = address(0);
        }
        
        // Update mappings
        nameToAddress[name] = newOwner;
        addressToName[msg.sender] = "";
        addressToName[newOwner] = name;
        
        emit NameTransferred(name, msg.sender, newOwner);
    }
    
    /**
     * @dev Get the address associated with a Base name
     * @param name The Base name to resolve
     * @return The address linked to the name
     */
    function resolveName(string calldata name) external view override returns (address) {
        return nameToAddress[name];
    }
    
    /**
     * @dev Get the Base name associated with an address
     * @param addr The address to reverse resolve
     * @return The Base name linked to the address
     */
    function reverseLookup(address addr) external view override returns (string memory) {
        return addressToName[addr];
    }
    
    /**
     * @dev Check if a name is available
     * @param name The Base name to check
     * @return True if the name is available, false otherwise
     */
    function isNameAvailable(string calldata name) external view returns (bool) {
        return nameToAddress[name] == address(0);
    }
} 