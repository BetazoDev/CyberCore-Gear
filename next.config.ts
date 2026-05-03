import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "headwp.halonso.digital",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "headwp.halonso.digital",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://headwp.halonso.digital http://headwp.halonso.digital",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://headwp.halonso.digital",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
