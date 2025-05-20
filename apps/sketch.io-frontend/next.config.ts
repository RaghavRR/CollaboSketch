import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify: true,  // Remove or comment out this line if it causes warnings/errors
  eslint: {
    ignoreDuringBuilds: true, // Prevent build failures due to ESLint in CI
  },
  experimental: {
    serverActions: {}, // Correct usage as per latest Next.js
  },
  transpilePackages: ["@repo/ui", "@repo/db", "@repo/common"], // Adjust based on your monorepo packages
};

export default nextConfig;
