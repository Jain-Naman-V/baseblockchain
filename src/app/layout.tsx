'use client';
import React, { useEffect, ReactNode } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BlockchainProvider from './providers/BlockchainProvider';
import './globals.css';
import { initializeAnimations } from '../utils/animations';

// Note: In 'use client' components, we need to use Head for metadata
// Next.js metadata API works with Server Components

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  useEffect(() => {
    // Initialize animations when the component mounts
    initializeAnimations();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="scroll-smooth font-sans">
      <head>
        <title>Medilocker – Decentralized Medical Data Vault</title>
        <meta name="description" content="A secure platform for storing and managing medical records using blockchain technology." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-gray-50 text-gray-800 antialiased dark:bg-gray-900 dark:text-gray-200">
        <BlockchainProvider>
          {/* Skip link for better keyboard navigation */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-600 px-3 py-2 rounded shadow"
          >
            Skip to content
          </a>

          <div className="flex flex-col min-h-screen">
            <Navigation />

            <main
              id="main-content"
              className="flex-1 container mx-auto px-4 py-8 lg:px-8 lg:py-12"
            >
              {children}
            </main>

            <Footer year={currentYear} />
          </div>
        </BlockchainProvider>
      </body>
    </html>
  );
} 