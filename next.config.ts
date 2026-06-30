import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Permite subir imagenes de producto via Server Actions (default 1MB).
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
