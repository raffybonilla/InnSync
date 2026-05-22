import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-image-domain.com",
      },
    ],
  },

  // ✅ FIX: allow LAN access (removes cross-origin warning)
  allowedDevOrigins: ["192.168.8.42"],
};

export default nextConfig;