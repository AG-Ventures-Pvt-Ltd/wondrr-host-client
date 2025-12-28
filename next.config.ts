import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:8005/api/auth/:path*",
      },
    ];
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.olamaps.io' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'd1hjk5b7z017su.cloudfront.net' },
      { protocol: 'https', hostname: 'wondrrprod.s3.ap-south-1.amazonaws.com' },
      {
        protocol: "https",
        hostname: "wondrrprod.s3.amazonaws.com",
      },
    ],
    qualities: [90,100],
},
}

export default nextConfig;
