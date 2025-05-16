'use client';
import React from 'react';
import { useBlockchain } from '../app/providers/BlockchainProvider';
import { getBaseExplorerTxUrl, getBaseExplorerAddressUrl, BASE_EXPLORERS } from '../utils/baseProvider';

interface BaseScanExplorerProps {
  txHash?: string;
  address?: string;
  label?: string;
  network?: 'MAINNET' | 'TESTNET' | 'SEPOLIA';
}

const BaseScanExplorer: React.FC<BaseScanExplorerProps> = ({
  txHash,
  address,
  label,
  network = 'MAINNET',
}) => {
  const { isBaseChain } = useBlockchain();
  
  if (!txHash && !address) {
    return null;
  }
  
  let url = '';
  let displayText = label || '';
  
  if (txHash) {
    url = getBaseExplorerTxUrl(txHash, network);
    displayText = label || `View Transaction ${txHash.substring(0, 6)}...${txHash.substring(txHash.length - 4)}`;
  } else if (address) {
    url = getBaseExplorerAddressUrl(address, network);
    displayText = label || `View Address ${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  return (
    <div className="flex items-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        {displayText}
      </a>
      {!isBaseChain && (
        <span className="ml-2 text-xs text-red-500">
          (Switch to Base network to see details)
        </span>
      )}
    </div>
  );
};

export default BaseScanExplorer; 