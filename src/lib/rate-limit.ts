import "server-only";

/**
 * Minimal in-memory rate limiter for login and registration.
 *
 * Serverless instances do not share memory, so this throttles a burst against
 * one warm instance rather than enforcing a global quota — enough to blunt
 * credential stuffing without adding an external store. If the shop ever needs
 * a hard guarantee, swap the Map for Redis behind the same interface.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSeconds: 0 };
}

/**
 * Attempt allowances, overridable per deployment.
 *
 * The defaults are deliberately generous enough for a shared institutional IP
 * — a whole university lab can sit behind one address — while still blunting
 * automated attempts.
 */
export function limitFromEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Keeps the map from growing without bound on a long-lived instance. */
export function pruneRateLimits() {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}
