import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.freepik.com", "collection.cloudinary.com"],
  },
  // middleware.ts rate-limits /api/extension with rate-limiter-flexible,
  // which needs Node.js APIs unavailable on the default Edge runtime.
  experimental: {
    nodeMiddleware: true,
  },
};

export default nextConfig;
