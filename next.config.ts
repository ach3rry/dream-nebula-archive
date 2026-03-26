import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler is experimental - removed for stability
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
};

export default nextConfig;
