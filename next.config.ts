import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/Partners',
        destination: '/partners',
      },
    ];
  },
};

export default nextConfig;
