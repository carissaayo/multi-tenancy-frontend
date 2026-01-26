import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [];
  },
  // Allow subdomain routing in development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
