import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'swiper'],
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fatoradrive.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  async rewrites() {
    const laravelUrl = (process.env.LARAVEL_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

    return {
      beforeFiles: [
        { source: "/api/:path*", destination: `${laravelUrl}/api/:path*` },
        { source: "/sanctum/csrf-cookie", destination: `${laravelUrl}/sanctum/csrf-cookie` },
      ],
      // Let Next serve files shipped in `public/uploads` first (including the
      // workbook's pre-optimized product images). Files not present there still
      // fall through to Laravel, which serves newly uploaded admin media.
      afterFiles: [
        { source: "/uploads/:path*", destination: `${laravelUrl}/uploads/:path*` },
      ],
    };
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
