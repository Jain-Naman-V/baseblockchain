import React from 'react';

interface FooterProps {
  year: number;
}

export default function Footer({ year }: FooterProps) {
  return (
    <footer className="py-6 bg-white border-t border-gray-200 text-center text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <p>© {year} Medilocker — Secured by Base L2 & IPFS</p>
        <div className="flex justify-center mt-3 space-x-4">
          <a href="/terms" className="hover:text-gray-700 dark:hover:text-gray-200 transition">
            Terms of Service
          </a>
          <a href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200 transition">
            Privacy Policy
          </a>
          <a href="/contact" className="hover:text-gray-700 dark:hover:text-gray-200 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
} 