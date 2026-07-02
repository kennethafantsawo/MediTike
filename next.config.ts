import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Disable the Next.js dev tools indicator for cleaner UI
  devIndicators: false,
};

export default nextConfig;
