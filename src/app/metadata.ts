import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medilocker - Decentralized Medical Data Vault',
  description: 'A secure platform for storing and managing medical records using blockchain technology',
  keywords: ['blockchain', 'medical records', 'healthcare', 'Base', 'decentralized', 'IPFS'],
  authors: [{ name: 'Medilocker Team' }],
  openGraph: {
    title: 'Medilocker - Decentralized Medical Data Vault',
    description: 'A secure platform for storing and managing medical records using blockchain technology',
    url: 'https://medilocker.app',
    siteName: 'Medilocker',
    images: [
      {
        url: 'https://base.org/assets/images/base-logo.svg',
        width: 800,
        height: 600,
        alt: 'Medilocker Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medilocker - Decentralized Medical Data Vault',
    description: 'A secure platform for storing and managing medical records using blockchain technology',
    images: ['https://base.org/assets/images/base-logo.svg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
  themeColor: '#0052FF',
  manifest: '/manifest.json',
}; 