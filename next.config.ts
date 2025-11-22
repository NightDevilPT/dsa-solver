import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable polling for file watching in Docker
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // Empty turbopack config to silence the error (we're using webpack for Docker polling)
  turbopack: {},
};

export default nextConfig;
