/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Required when using export
  },
  
  // Completely disable file tracing to avoid permission errors
  output: 'export',
  
  // Add other Next.js configuration options here
  reactStrictMode: true,
  
  // Disable experimental features
  experimental: {
    // Completely disable output file tracing
    outputFileTracing: false,
  },
};

module.exports = nextConfig;