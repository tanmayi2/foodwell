import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.immediate.co.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'allrecipes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imagesvc.meredithcorp.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.simplyrecipes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'simplyrecipes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.allrecipes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.simplyrecipes.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
