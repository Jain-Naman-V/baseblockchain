'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { showToast } from '../utils/animations';
import { useBlockchain } from '../app/providers/BlockchainProvider';

const Navigation = () => {
  const { connectWallet: connectBlockchainWallet, disconnectWallet, isConnected, account } = useBlockchain();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  
  const pathname = usePathname();
  
  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const connectWallet = () => {
    // Simulating connection delay with animation
    const buttonElement = document.querySelector('.connect-button');
    if (buttonElement) {
      buttonElement.classList.add('animate-pulse');
      buttonElement.setAttribute('disabled', 'true');
    }
    
    // Call the blockchain provider's connect function
    connectBlockchainWallet()
      .then(() => {
        if (buttonElement) {
          buttonElement.classList.remove('animate-pulse');
          buttonElement.removeAttribute('disabled');
        }
      })
      .catch(error => {
        console.error('Connection error:', error);
        if (buttonElement) {
          buttonElement.classList.remove('animate-pulse');
          buttonElement.removeAttribute('disabled');
        }
      });
  };
  
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: '📊', 
    },
    { 
      name: 'Records', 
      path: '/records', 
      icon: '📄', 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: '👤', 
    },
  ];
  
  // Clear notifications
  const clearNotifications = () => {
    setNotificationCount(0);
    showToast('Notifications cleared', 'info');
  };
  
  return (
    <nav className={`fixed top-0 w-full z-50 bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="https://base.org/assets/images/base-logo.svg"
                  alt="Medilocker"
                  className="h-7 w-auto"
                />
                <span className="text-lg font-bold text-gray-800">Medilocker</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Right side buttons */}
          <div className="hidden sm:flex sm:items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={clearNotifications}
              >
                <span>🔔</span>
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Wallet Connection */}
            {isConnected ? (
              <button
                type="button"
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                onClick={() => disconnectWallet()}
              >
                <span className="mr-1.5">⚡</span>
                {account && formatAddress(account)}
              </button>
            ) : (
              <button
                type="button"
                className="connect-button bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                onClick={connectWallet}
              >
                <span className="flex items-center">
                  <span className="mr-1.5">🔒</span>
                  Connect Wallet
                </span>
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span>{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            <div className="flex justify-between items-center">
              {/* Notifications */}
              <button 
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={clearNotifications}
              >
                <span className="relative">
                  🔔
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </span>
              </button>
              
              {/* Wallet Connection */}
              {isConnected ? (
                <button
                  type="button"
                  className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
                  onClick={() => disconnectWallet()}
                >
                  <span className="mr-1.5">⚡</span>
                  {account && formatAddress(account)}
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="flex items-center">
                    <span className="mr-1.5">🔒</span>
                    Connect Wallet
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 