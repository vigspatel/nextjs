import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "demo-next-js.code",
      },
      {
        protocol: "https",
        hostname: "demo-next-js.code",
      },
      {
        protocol: "https",
        hostname: "bluereeftech.com",
      },
    ],
  },
  allowedDevOrigins: ["10.5.0.2"],
};

export default nextConfig;
