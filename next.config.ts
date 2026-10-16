import type { NextConfig } from "next";

const ONE_YEAR_IN_SECONDS = 31_536_000;
const STATIC_TIMEOUT = 120;

const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920] as const;
const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256] as const;

const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;",
  },
] as const;

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Low-RAM build host (4 vCPU): cap page-data/static-gen workers.
    cpus: 2,
  },

  headers() {
    return [
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff2)",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source: "/_next/static/:path*",
      },
      {
        headers: [...SECURITY_HEADERS],
        source: "/:path*",
      },
    ];
  },

  images: {
    deviceSizes: [...DEVICE_SIZES],
    formats: ["image/avif", "image/webp"],
    imageSizes: [...IMAGE_SIZES],
    minimumCacheTTL: ONE_YEAR_IN_SECONDS,
  },

  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  reactCompiler: true,

  staticPageGenerationTimeout: STATIC_TIMEOUT,

  turbopack: {},

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
