import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Turbopack configuration for monorepo resolution
  turbopack: {
    // Current working directory is the project root
    root: path.resolve(process.cwd()),
  },
  // Adding standard experimental features if needed, but for now just basic
};

export default nextConfig;
