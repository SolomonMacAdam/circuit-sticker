import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
      "@react-native-async-storage/async-storage",
      "pino-pretty"
    ];

    return config;
  }
};

export default nextConfig;
