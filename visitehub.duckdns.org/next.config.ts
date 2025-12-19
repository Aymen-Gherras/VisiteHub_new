import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com", "images.pexels.com"],
    remotePatterns: [
      // Local docker/dev backend uploads
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4001',
        pathname: '/uploads/**',
      },
      // Some setups expose backend on 4000 directly
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4000',
        pathname: '/uploads/**',
      },
      // Production backend uploads
      {
        protocol: 'https',
        hostname: 'visiteapihub.duckdns.org',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'visiteapihub.duckdns.org',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    // IMPORTANT:
    // - NEXT_PUBLIC_API_BASE_URL is used by the browser (host machine)
    // - API_INTERNAL_BASE_URL is used by the Next.js server (container)
    // This avoids Next/Image and rewrites trying to call "localhost" from inside the container.
    const apiUrl = process.env.API_INTERNAL_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
