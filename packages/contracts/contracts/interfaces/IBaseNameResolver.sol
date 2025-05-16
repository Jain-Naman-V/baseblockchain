// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IBaseNameResolver
 * @dev Interface for the Base L2 naming system
 */
interface IBaseNameResolver {
    /**
     * @dev Get the address associated with a Base name
     * @param name The Base name to resolve
     * @return The address linked to the name
     */
    function resolveName(string calldata name) external view returns (address);
    
    /**
     * @dev Get the Base name associated with an address
     * @param addr The address to reverse resolve
     * @return The Base name linked to the address
     */
    function reverseLookup(address addr) external view returns (string memory);
} 