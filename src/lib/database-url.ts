/**
 * Resolves the Postgres connection strings from the environment.
 *
 * Two names exist for each connection because Vercel's Neon integration
 * injects its own (`DATABASE_URL_UNPOOLED`, `POSTGRES_URL*`) when a Neon store
 * is attached to the project, while a hand-configured deployment or a local
 * Postgres uses the names in .env.example. Accepting both means attaching the
 * store is enough — nothing has to be copied between dashboards.
 *
 * Kept dependency-free so `prisma.config.ts` and the seed script, which run
 * outside the Next.js bundle, can use it too.
 */

const first = (...names: string[]): string | undefined => {
  for (const name of names) {
    const value = process.env[name];
    if (value) return value;
  }
  return undefined;
};

/** Pooled connection used by the app at runtime. */
export function poolUrl(): string | undefined {
  return first("DATABASE_URL", "POSTGRES_URL", "POSTGRES_PRISMA_URL");
}

/**
 * Unpooled connection used by `prisma migrate`. Neon's pooler cannot run DDL,
 * so migrations need the direct host; a plain Postgres server has no pooler
 * and falls back to the same URL.
 */
export function directUrl(): string | undefined {
  return (
    first("DIRECT_DATABASE_URL", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING") ?? poolUrl()
  );
}

/** The pooled URL, or a clear failure naming what to set. */
export function requirePoolUrl(): string {
  const url = poolUrl();
  if (!url) {
    throw new Error(
      "No database connection string. Set DATABASE_URL (or attach a Neon store, which sets POSTGRES_URL) — see .env.example",
    );
  }
  return url;
}
