import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: { minimumCacheTTL: 2678400 },
  async headers() {
    return [
      {
        // Hero media carries a content hash in its filename, so it can be cached forever.
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
