const { create } = require('ipfs-http-client');
const CryptoJS = require('crypto-js');
const { ethers } = require('ethers');

/**
 * IPFS Service for handling storage and retrieval of encrypted medical records
 */
class IPFSService {
  constructor(config) {
    // Create auth string for Infura/Pinata authentication
    const auth = 
      'Basic ' + Buffer.from(
        config.ipfsProjectId + ':' + config.ipfsProjectSecret
      ).toString('base64');

    // Create IPFS client
    this.ipfs = create({
      host: config.ipfsHost || 'ipfs.infura.io',
      port: config.ipfsPort || 5001,
      protocol: config.ipfsProtocol || 'https',
      headers: {
        authorization: auth,
      },
    });
    
    this.ipfsGateway = config.ipfsGateway || 'https://ipfs.io/ipfs/';
  }

  /**
   * Encrypt data using AES-256
   * @param {Object|string} data - The data to encrypt
   * @param {string} encryptionKey - The key to use for encryption
   * @returns {string} - The encrypted data
   */
  encrypt(data, encryptionKey) {
    const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
    return CryptoJS.AES.encrypt(dataString, encryptionKey).toString();
  }

  /**
   * Decrypt data using AES-256
   * @param {string} encryptedData - The data to decrypt
   * @param {string} encryptionKey - The key to use for decryption
   * @returns {string|Object} - The decrypted data
   */
  decrypt(encryptedData, encryptionKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    try {
      // Try to parse as JSON
      return JSON.parse(decryptedData);
    } catch (e) {
      // Return as is if not valid JSON
      return decryptedData;
    }
  }

  /**
   * Upload encrypted data to IPFS
   * @param {Object|string} data - The data to encrypt and upload
   * @param {string} encryptionKey - The key to use for encryption
   * @returns {Promise<Object>} - The IPFS upload result with CID and hash
   */
  async uploadEncrypted(data, encryptionKey) {
    try {
      // Encrypt the data
      const encryptedData = this.encrypt(data, encryptionKey);
      
      // Upload to IPFS
      const { cid } = await this.ipfs.add(encryptedData);
      const cidString = cid.toString();
      
      // Calculate SHA-256 hash of the original data
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(
        typeof data === 'object' ? JSON.stringify(data) : data
      ));
      
      return {
        cid: cidString,
        ipfsUrl: `${this.ipfsGateway}${cidString}`,
        contentHash: dataHash,
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
  }

  /**
   * Retrieve and decrypt data from IPFS
   * @param {string} cid - The IPFS CID of the encrypted data
   * @param {string} encryptionKey - The key to use for decryption
   * @returns {Promise<Object|string>} - The decrypted data
   */
  async retrieveAndDecrypt(cid, encryptionKey) {
    try {
      // Retrieve from IPFS
      const chunks = [];
      for await (const chunk of this.ipfs.cat(cid)) {
        chunks.push(chunk);
      }
      
      // Combine chunks and convert to string
      const encryptedData = Buffer.concat(chunks).toString();
      
      // Decrypt the data
      return this.decrypt(encryptedData, encryptionKey);
    } catch (error) {
      console.error('IPFS retrieval error:', error);
      throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
    }
  }

  /**
   * Pin a file in IPFS to ensure persistence
   * @param {string} cid - The IPFS CID to pin
   */
  async pinFile(cid) {
    try {
      await this.ipfs.pin.add(cid);
      return { success: true, cid };
    } catch (error) {
      console.error('IPFS pinning error:', error);
      throw new Error(`Failed to pin file in IPFS: ${error.message}`);
    }
  }

  /**
   * Generate a unique encryption key from a user's address and optional salt
   * @param {string} address - The user's Ethereum address
   * @param {string} salt - Optional salt to add entropy
   * @returns {string} - The derived encryption key
   */
  generateEncryptionKey(address, salt = '') {
    const combined = `${address.toLowerCase()}:${salt}`;
    return CryptoJS.SHA256(combined).toString();
  }
}

module.exports = IPFSService; 