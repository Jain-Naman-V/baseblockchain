import { ethers } from 'ethers';
import { baseProvider } from './baseProvider';

// Base Name Resolver contract details
// This would be the deployed address of the BaseNameResolver.sol contract
const BASE_NAME_RESOLVER_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual deployed address

// Define interface for the contract methods to fix TypeScript errors
interface BaseNameResolverInterface extends ethers.BaseContract {
  resolveName(name: string): Promise<string>;
  reverseLookup(addr: string): Promise<string>;
  registerName(name: string): Promise<ethers.ContractTransactionResponse>;
  isNameAvailable(name: string): Promise<boolean>;
  transferName(name: string, newOwner: string): Promise<ethers.ContractTransactionResponse>;
}

// ABI for BaseNameResolver
const BASE_NAME_RESOLVER_ABI = [
  // Function to resolve a name to an address
  "function resolveName(string calldata name) external view returns (address)",
  // Function to reverse lookup an address to a name
  "function reverseLookup(address addr) external view returns (string memory)",
  // Function to register a new name
  "function registerName(string calldata name) external",
  // Function to check if a name is available
  "function isNameAvailable(string calldata name) external view returns (bool)",
  // Function to transfer a name to a new owner
  "function transferName(string calldata name, address newOwner) external",
  // Events
  "event NameRegistered(string name, address indexed owner)",
  "event NameTransferred(string name, address indexed oldOwner, address indexed newOwner)"
];

/**
 * Base Name Service - Utilities for interacting with the Base naming system
 */
export class BaseNameService {
  private provider: ethers.JsonRpcProvider;
  private contract: BaseNameResolverInterface;
  
  constructor(provider = baseProvider) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      BASE_NAME_RESOLVER_ADDRESS, 
      BASE_NAME_RESOLVER_ABI, 
      provider
    ) as unknown as BaseNameResolverInterface;
  }
  
  /**
   * Get the address for a Base name
   * @param name The Base name to resolve
   * @returns The address associated with the name, or null if not found
   */
  async resolveName(name: string): Promise<string | null> {
    try {
      const address = await this.contract.resolveName(name);
      return address !== ethers.ZeroAddress ? address : null;
    } catch (error) {
      console.error("Error resolving Base name:", error);
      return null;
    }
  }
  
  /**
   * Get the Base name for an address
   * @param address The address to lookup
   * @returns The Base name associated with the address, or null if not found
   */
  async getNameFromAddress(address: string): Promise<string | null> {
    try {
      const name = await this.contract.reverseLookup(address);
      return name && name.length > 0 ? name : null;
    } catch (error) {
      console.error("Error getting Base name from address:", error);
      return null;
    }
  }
  
  /**
   * Check if a Base name is available
   * @param name The name to check
   * @returns True if the name is available, false otherwise
   */
  async isNameAvailable(name: string): Promise<boolean> {
    try {
      return await this.contract.isNameAvailable(name);
    } catch (error) {
      console.error("Error checking Base name availability:", error);
      return false;
    }
  }
  
  /**
   * Register a new Base name (requires signer)
   * @param name The name to register
   * @param signer The signer to use for the transaction
   * @returns The transaction hash
   */
  async registerName(name: string, signer: ethers.JsonRpcSigner): Promise<string | null> {
    try {
      const contract = this.contract.connect(signer) as unknown as BaseNameResolverInterface;
      const tx = await contract.registerName(name);
      return tx.hash;
    } catch (error) {
      console.error("Error registering Base name:", error);
      return null;
    }
  }
  
  /**
   * Transfer a Base name to a new owner (requires signer)
   * @param name The name to transfer
   * @param newOwner The new owner address
   * @param signer The signer to use for the transaction
   * @returns The transaction hash
   */
  async transferName(
    name: string, 
    newOwner: string, 
    signer: ethers.JsonRpcSigner
  ): Promise<string | null> {
    try {
      const contract = this.contract.connect(signer) as unknown as BaseNameResolverInterface;
      const tx = await contract.transferName(name, newOwner);
      return tx.hash;
    } catch (error) {
      console.error("Error transferring Base name:", error);
      return null;
    }
  }
}

// Export a singleton instance
export default new BaseNameService(); 