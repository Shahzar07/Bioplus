import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product images uploaded from the dashboard. Without a Blob token they are
    // served from /api/media/<id> on this origin and need no entry here.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
