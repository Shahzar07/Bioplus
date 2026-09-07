import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // nodemailer opens raw TCP sockets and loads its own templates at runtime;
  // leaving it external keeps the bundler from rewriting either.
  serverExternalPackages: ["nodemailer"],
  outputFileTracingRoot: __dirname,
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
