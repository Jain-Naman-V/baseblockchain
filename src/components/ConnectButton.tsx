'use client';
import React, { useState } from 'react';
import { useBlockchain, useBaseConnection } from '../app/providers/BlockchainProvider';

const ConnectButton: React.FC = () => {
  const { 
    isConnected, 
    address, 
    connect, 
    disconnect,
    error
  } = useBlockchain();
  
  const { 
    isBaseChain,
    connectToBase 
  } = useBaseConnection();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format address for display
  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleConnect = () => {
    connect('injected');
  };

  const handleConnectCoinbase = () => {
    connect('coinbase');
  };

  const handleSwitchToBase = async () => {
    await connectToBase();
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Display different button states based on connection status
  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Connect Wallet
        </button>
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={handleConnect}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <div className="flex items-center">
                  <img 
                    src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
                    alt="MetaMask"
                    className="w-5 h-5 mr-2"
                  />
                  Connect with MetaMask
                </div>
              </button>
              <button
                onClick={handleConnectCoinbase}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <div className="flex items-center">
                  <img 
                    src="https://www.coinbase.com/img/favicon/favicon-32.png" 
                    alt="Coinbase Wallet"
                    className="w-5 h-5 mr-2"
                  />
                  Connect with Coinbase Wallet
                </div>
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error.message}
          </div>
        )}
      </div>
    );
  }

  // If connected but not on Base network
  if (isConnected && !isBaseChain) {
    return (
      <button
        onClick={handleSwitchToBase}
        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
      >
        Switch to Base Network
      </button>
    );
  }

  // Connected and on Base network
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center"
      >
        {address && address.toLowerCase().startsWith('0x9e67029e') && (
          <img 
            src="https://www.coinbase.com/img/favicon/favicon-32.png" 
            alt="Coinbase"
            className="w-4 h-4 mr-2"
          />
        )}
        {formatAddress(address)}
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={handleDisconnect}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectButton; 