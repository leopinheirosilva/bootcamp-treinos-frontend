import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
