import "dotenv/config";
import { defineConfig } from "prisma/config";
import { directUrl } from "./src/lib/database-url";

/**
 * Prisma 7 keeps connection URLs out of schema.prisma and no longer loads .env
 * on its own, hence the dotenv import above.
 *
 * Migrations run against the unpooled connection — on Neon the pooler cannot
 * run DDL. See src/lib/database-url.ts for the names that are accepted.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: directUrl() ?? "",
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
