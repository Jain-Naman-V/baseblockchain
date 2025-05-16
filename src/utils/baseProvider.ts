import { ethers } from 'ethers';

// Base chain IDs
export const BASE_CHAIN_IDS = {
  MAINNET: '0x2105', // 8453 in decimal
  TESTNET: '0x14a33', // 84531 in decimal (Goerli testnet)
  SEPOLIA: '0x14a34' // 84532 in decimal (Sepolia testnet)
};

// Base RPC URLs
export const BASE_RPC_URLS = {
  MAINNET: 'https://mainnet.base.org',
  TESTNET: 'https://goerli.base.org',
  SEPOLIA: 'https://sepolia.base.org'
};

// Base block explorer URLs
export const BASE_EXPLORERS = {
  MAINNET: 'https://basescan.org',
  TESTNET: 'https://goerli.basescan.org',
  SEPOLIA: 'https://sepolia.basescan.org'
};

// Base Mainnet RPC (public, for demo; use your own for production)
export const BASE_RPC_URL = BASE_RPC_URLS.MAINNET;

// Create provider instance
export const baseProvider = new ethers.JsonRpcProvider(BASE_RPC_URL);

// Get the current block number
export async function getBaseBlockNumber() {
  return await baseProvider.getBlockNumber();
}

// Get Base gas price
export async function getBaseGasPrice() {
  const feeData = await baseProvider.getFeeData();
  return feeData.gasPrice;
}

// Get Base explorer URL based on chain ID
export const getBaseExplorerUrl = (chainId: string): string => {
  switch (chainId) {
    case BASE_CHAIN_IDS.MAINNET:
      return BASE_EXPLORERS.MAINNET;
    case BASE_CHAIN_IDS.TESTNET:
      return BASE_EXPLORERS.TESTNET;
    case BASE_CHAIN_IDS.SEPOLIA:
      return BASE_EXPLORERS.SEPOLIA;
    default:
      return BASE_EXPLORERS.MAINNET;
  }
};

// Format transaction URL for Base explorer
export const formatTxUrl = (chainId: string, txHash: string): string => {
  const baseUrl = getBaseExplorerUrl(chainId);
  return `${baseUrl}/tx/${txHash}`;
};

// Format address URL for Base explorer
export const formatAddressUrl = (chainId: string, address: string): string => {
  const baseUrl = getBaseExplorerUrl(chainId);
  return `${baseUrl}/address/${address}`;
};

// Check if a chain ID is a Base chain
export const isBaseChain = (chainId: string): boolean => {
  return [
    BASE_CHAIN_IDS.MAINNET,
    BASE_CHAIN_IDS.TESTNET,
    BASE_CHAIN_IDS.SEPOLIA
  ].includes(chainId);
};

// Format address for display (0x1234...5678)
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Check if connected to Base network
export async function isBaseNetwork(): Promise<boolean> {
  try {
    const network = await baseProvider.getNetwork();
    return [8453, 84531, 84532].includes(Number(network.chainId));
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
} 