/**
 * Canonical site origin, in priority order:
 * NEXT_PUBLIC_SITE_URL (the real domain, set in Vercel once it exists)
 * → VERCEL_PROJECT_PRODUCTION_URL (dopres.vercel.app, publicly reachable)
 * → VERCEL_URL (per-deployment URL, behind deployment protection)
 * → localhost.
 */
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

export const siteUrl = fromEnv.replace(/\/$/, "");

/** Only the production deployment of the real domain may be indexed. */
export const indexable =
  Boolean(process.env.NEXT_PUBLIC_SITE_URL) && process.env.VERCEL_ENV === "production";
