import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 keeps connection URLs out of schema.prisma and no longer loads .env
 * on its own, hence the dotenv import above.
 *
 * DATABASE_URL is the pooled connection the app uses at runtime.
 * DIRECT_DATABASE_URL is the unpooled connection migrations need — on Neon the
 * pooler cannot run DDL. Falls back to DATABASE_URL for a plain Postgres
 * server, which has no pooler.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? "",
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
