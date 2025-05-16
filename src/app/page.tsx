'use client';
import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {/* Logo and Title */}
      <header className="text-center mb-8">
        <div className="mb-4">
          <img 
            src="https://base.org/assets/images/base-logo.svg" 
            alt="Base Logo" 
            className="w-12 h-12 inline-block" 
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medilocker</h1>
        <p className="text-base text-gray-600 max-w-md mx-auto">
          A decentralized medical data vault built on Base L2 blockchain
        </p>
      </header>
      
      {/* Main Card */}
      <main className="bg-white rounded-lg shadow p-6 max-w-2xl w-full">
        <h2 className="text-xl font-medium text-gray-800 mb-5">Demonstration Options</h2>
        
        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dashboard Link */}
          <Link href="/dashboard" className="block">
            <div className="bg-gray-50 rounded-lg p-5 h-full border border-gray-200 hover:border-blue-300 hover:shadow transition-all">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Interactive Dashboard
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Experience patient dashboard with medical records and health metrics.
              </p>
              <span className="text-sm text-blue-600 font-medium">
                Launch Dashboard →
              </span>
            </div>
          </Link>
          
          {/* Documentation Link */}
          <a href="https://docs.base.org" target="_blank" rel="noopener noreferrer" className="block">
            <div className="bg-gray-50 rounded-lg p-5 h-full border border-gray-200 hover:border-blue-300 hover:shadow transition-all">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Base Documentation
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Learn about Base L2 technology and building decentralized apps.
              </p>
              <span className="text-sm text-blue-600 font-medium">
                View Docs →
              </span>
            </div>
          </a>
        </div>
        
        {/* Info Banner */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <span className="text-yellow-500 mr-2">ℹ️</span>
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-1">Demo Mode Information</h4>
              <p className="text-sm text-gray-600">
                This is a demonstration version. Blockchain connections are simulated for display purposes.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm">
        <p>© 2024 Medilocker - Built on Base L2</p>
      </footer>
    </div>
  );
} 