import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  turbopack: {
    rules: {
      '*.txt': {
        type: 'raw'
      }
    },
  },
};

export default nextConfig;
