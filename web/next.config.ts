import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stops `next dev` from generating an AGENTS.md file in the repo
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
