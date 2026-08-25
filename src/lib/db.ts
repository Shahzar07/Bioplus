import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

/**
 * Prisma 7 connects through a driver adapter rather than a schema-level URL.
 * `PrismaPg` works against both the local Postgres used in development and a
 * Neon pooled connection in production.
 *
 * The client is cached on globalThis so Next.js hot reloads (and warm
 * serverless invocations) reuse one connection pool instead of exhausting the
 * database with a new one per module evaluation.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — see .env.example");
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
