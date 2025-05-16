/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
  },
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard',
      },
      {
        source: '/records',
        destination: '/records',
      },
      {
        source: '/profile',
        destination: '/profile',
      },
    ];
  },
  env: {
    PORT: "3002",
  },
};

module.exports = nextConfig; 