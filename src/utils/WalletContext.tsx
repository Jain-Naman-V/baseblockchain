'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { baseProvider, BASE_RPC_URL, BASE_CHAIN_IDS, BASE_RPC_URLS } from './baseProvider';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  connectCoinbaseWallet: () => Promise<void>;
  disconnect: () => void;
  signer: ethers.JsonRpcSigner | null;
  isBase: boolean;
  isCoinbaseWallet: boolean;
  switchToBase: () => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connect: async () => {},
  connectCoinbaseWallet: async () => {},
  disconnect: () => {},
  signer: null,
  isBase: false,
  isCoinbaseWallet: false,
  switchToBase: async () => false,
});

export function useWallet() {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isBase, setIsBase] = useState<boolean>(false);
  const [isCoinbaseWallet, setIsCoinbaseWallet] = useState<boolean>(false);

  // Check if user was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem('connectedAddress');
    if (savedAddress) {
      connectWallet();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet();
        } else if (accounts[0] !== address) {
          // Address changed
          setAddress(accounts[0]);
          localStorage.setItem('connectedAddress', accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        // Check if the chain is Base
        setIsBase([BASE_CHAIN_IDS.MAINNET, BASE_CHAIN_IDS.TESTNET, BASE_CHAIN_IDS.SEPOLIA].includes(chainId));
        
        // Refresh page on chain change as recommended by MetaMask
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      
      // Check if we're using Coinbase Wallet
      setIsCoinbaseWallet(!!ethereum.isCoinbaseWallet);
      
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address]);

  // Switch to Base network
  const switchToBase = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_CHAIN_IDS.MAINNET }],
        });
        setIsBase(true);
        return true;
      } catch (switchError: any) {
        // If the chain isn't added yet, add it
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: BASE_CHAIN_IDS.MAINNET,
                  chainName: 'Base Mainnet',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: [BASE_RPC_URLS.MAINNET],
                  blockExplorerUrls: ['https://basescan.org/'],
                },
              ],
            });
            setIsBase(true);
            return true;
          } catch (addError) {
            console.error('Error adding Base chain:', addError);
            return false;
          }
        } else {
          console.error('Error switching to Base chain:', switchError);
          return false;
        }
      }
    }
    return false;
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // Request user to switch to Base network
        await switchToBase();

        // Now connect the wallet
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const newSigner = await provider.getSigner();
        
        setAddress(accounts[0]);
        setSigner(newSigner);
        localStorage.setItem('connectedAddress', accounts[0]);
        
        // Check if we're using Coinbase Wallet
        setIsCoinbaseWallet(!!(window as any).ethereum.isCoinbaseWallet);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
  };

  // Special connect function for Coinbase Wallet
  const connectCoinbaseWallet = async () => {
    // Check if Coinbase Wallet is injected
    if (typeof window !== 'undefined' && (window as any).coinbaseWalletExtension) {
      try {
        const coinbaseProvider = (window as any).coinbaseWalletExtension;
        
        // Request user to switch to Base network
        await switchToBase();

        // Connect
        const provider = new ethers.BrowserProvider(coinbaseProvider);
        const accounts = await provider.send('eth_requestAccounts', []);
        const newSigner = await provider.getSigner();
        
        setAddress(accounts[0]);
        setSigner(newSigner);
        setIsCoinbaseWallet(true);
        localStorage.setItem('connectedAddress', accounts[0]);
      } catch (error) {
        console.error('Error connecting Coinbase Wallet:', error);
      }
    } else {
      // Redirect to Coinbase Wallet download page or show instructions
      window.open('https://www.coinbase.com/wallet', '_blank');
      alert('Coinbase Wallet not detected. Please install Coinbase Wallet extension and try again.');
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    setIsBase(false);
    setIsCoinbaseWallet(false);
    localStorage.removeItem('connectedAddress');
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        connect: connectWallet,
        connectCoinbaseWallet,
        disconnect: disconnectWallet,
        signer,
        isBase,
        isCoinbaseWallet,
        switchToBase,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
} 