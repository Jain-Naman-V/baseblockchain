'use client';
import React from 'react';
import { useState } from 'react';

export default function MetaMaskConnect({ onConnect }: { onConnect?: (address: string) => void }) {
  const [address, setAddress] = useState<string | null>(null);

  async function connectWallet() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      if (onConnect) onConnect(accounts[0]);
    } else {
      alert('MetaMask not found. Please install it.');
    }
  }

  return (
    <div>
      {address ? (
        <span>Connected: {address.substring(0, 6)}...{address.slice(-4)}</span>
      ) : (
        <button onClick={connectWallet} className="btn-primary">Connect MetaMask</button>
      )}
    </div>
  );
} 