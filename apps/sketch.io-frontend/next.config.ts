// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true, // Prevent build failures due to ESLint in CI
  },
  experimental: {
    serverActions: true, // Only if you're using Server Actions in app router
  },
  transpilePackages: ["@repo/ui", "@repo/db", "@repo/common"], // Adjust based on your monorepo packages
};

export default nextConfig;
