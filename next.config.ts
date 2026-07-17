import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,
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
