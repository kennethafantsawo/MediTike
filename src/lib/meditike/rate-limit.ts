/**
 * Rate limiting simple en mémoire pour les API routes.
 * Sur Vercel serverless, chaque instance a son propre store,
 * mais cela limite déjà les abus par instance.
 *
 * Pour une protection plus robuste, utiliser Upstash Redis (Vercel KV).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Fenêtre en millisecondes */
  windowMs: number;
  /** Nombre max de requêtes dans la fenêtre */
  max: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Vérifie le rate limit pour un identifiant donné.
 * @param identifier IP ou userId
 * @param options windowMs + max
 * @returns { allowed, remaining, resetAt }
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, max: 30 }
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  // Si pas d'entrée ou fenêtre expirée → nouveau compteur
  if (!entry || entry.resetAt < now) {
    const resetAt = now + options.windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: options.max - 1, resetAt };
  }

  // Incrémenter
  entry.count++;
  store.set(identifier, entry);

  if (entry.count > options.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    allowed: true,
    remaining: options.max - entry.count,
    resetAt: entry.resetAt,
  };
}

/** Récupère l'identifiant pour le rate limit (IP ou session) */
export function getRateLimitIdentifier(req: Request, sessionUserId?: string): string {
  if (sessionUserId) return `user:${sessionUserId}`;

  const xff = req.headers.get("x-forwarded-for");
  if (xff) return `ip:${xff.split(",")[0].trim()}`;

  const xri = req.headers.get("x-real-ip");
  if (xri) return `ip:${xri}`;

  return "ip:unknown";
}

/** Nettoie périodiquement les entrées expirées (toutes les 5 minutes) */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}
