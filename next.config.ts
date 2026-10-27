import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 768, 1024, 1366, 1600, 1920],
  },
  async redirects() {
    // Service pages from the original six-service catalogue, sent to their closest replacement.
    return [
      { source: "/services/ecu-coding", destination: "/services/ecm-bcm-programming", permanent: true },
      { source: "/services/software-updates", destination: "/services/ecm-bcm-programming", permanent: true },
      { source: "/services/ecu-repair", destination: "/services/ecm-bcm-programming", permanent: true },
      { source: "/services/ecu-remapping", destination: "/services/remapping-race-tuning", permanent: true },
      { source: "/services/performance-tuning", destination: "/services/remapping-race-tuning", permanent: true },
      { source: "/services/dpf-service", destination: "/services", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Processed media is content-addressed by the media script; cache aggressively.
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
