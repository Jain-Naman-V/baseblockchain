'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { showToast } from '../../utils/animations';

// Define the context types
type BlockchainContextType = {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  balance: string;
  connecting: boolean;
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  verifyRecord: (recordId: number) => Promise<string>;
  uploadToIPFS: (file: File) => Promise<string>;
  getRecordsByOwner: (address: string) => Promise<any[]>;
};

// Create context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  isConnected: false,
  account: null,
  chainId: null,
  balance: '0',
  connecting: false,
  loading: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  verifyRecord: async () => '',
  uploadToIPFS: async () => '',
  getRecordsByOwner: async () => [],
});

// Hook for components to access the context
export const useBlockchain = () => useContext(BlockchainContext);

// Provider component
export default function BlockchainProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState('0');
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate connection to the blockchain on initial load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check for existing connection in localStorage (for demo purposes)
        const savedAccount = localStorage.getItem('connected_account');
        if (savedAccount) {
          setConnecting(true);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setAccount(savedAccount);
          setChainId(8453); // Base Mainnet
          setBalance('1.234');
          setIsConnected(true);
          setConnecting(false);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setConnecting(false);
      }
    };

    checkConnection();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setConnecting(true);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful connection
      const simulatedAccount = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      setAccount(simulatedAccount);
      setChainId(8453); // Base Mainnet
      setBalance('1.234');
      setIsConnected(true);
      
      // Save to localStorage for persistence
      localStorage.setItem('connected_account', simulatedAccount);
      
      showToast('Wallet connected successfully!', 'success');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      showToast('Failed to connect wallet', 'error');
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setBalance('0');
    setIsConnected(false);
    localStorage.removeItem('connected_account');
    showToast('Wallet disconnected', 'info');
  };

  // Simulate verifying a record on the blockchain
  const verifyRecord = async (recordId: number): Promise<string> => {
    setLoading(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate a fake transaction hash
      const txHash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      showToast('Record verified on Base blockchain', 'success');
      
      return txHash;
    } catch (error) {
      console.error('Error verifying record:', error);
      showToast('Failed to verify record', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulate uploading to IPFS
  const uploadToIPFS = async (file: File): Promise<string> => {
    setLoading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate a fake IPFS hash
      const ipfsHash = `ipfs://Qm${Array.from({length: 44}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      showToast('File uploaded to IPFS', 'success');
      
      return ipfsHash;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      showToast('Failed to upload file', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulate getting records by owner address
  const getRecordsByOwner = async (address: string): Promise<any[]> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demo
      const mockRecords = [
        { 
          id: 1, 
          date: "2024-06-15", 
          type: "Annual Physical", 
          doctor: "Dr. Smith", 
          facility: "General Hospital",
          status: "Completed", 
          txHash: "0x1234567890abcdef1234567890abcdef12345678" 
        },
        { 
          id: 2, 
          date: "2024-05-02", 
          type: "Blood Test", 
          doctor: "Dr. Johnson", 
          facility: "Medical Lab Inc.",
          status: "Completed", 
          txHash: "0xabcdef1234567890abcdef1234567890abcdef12" 
        }
      ];
      
      return mockRecords;
    } catch (error) {
      console.error('Error getting records:', error);
      showToast('Failed to retrieve records', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    isConnected,
    account,
    chainId,
    balance,
    connecting,
    loading,
    connectWallet,
    disconnectWallet,
    verifyRecord,
    uploadToIPFS,
    getRecordsByOwner,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
} 