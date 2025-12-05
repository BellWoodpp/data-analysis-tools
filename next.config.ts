import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/auth/magic-callback',
        destination: '/',
        permanent: false,
      },
      {
        source: '/auth/magic-callback/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
