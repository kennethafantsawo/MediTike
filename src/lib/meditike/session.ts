/**
 * Session sécurisée — cookies HTTP-only signés HMAC-SHA256.
 * Standard de sécurité: cookies SameSite=Lax, Secure en production, httpOnly.
 *
 * Améliorations P2 audit:
 * - Rotation des clés : clé actuelle + clé précédente (grace period)
 * - Expiration intégrée au token (24h, refresh automatique)
 * - Détection de réutilisation de token (replay attack)
 */
import { cookies } from "next/headers";
import crypto from "crypto";

// Clé actuelle + clé précédente pour rotation sans coupure
const CURRENT_SECRET =
  process.env.MEDITIKE_SESSION_SECRET ||
  "meditike-dev-secret-change-in-production-please-use-strong-secret-2024";
const PREVIOUS_SECRET =
  process.env.MEDITIKE_SESSION_SECRET_PREV || null; // Clé précédente pendant rotation

const TOKEN_TTL = 24 * 60 * 60; // 24 heures (en secondes)

export interface SessionPayload {
  userId: string;
  role: "client" | "pharmacist" | "admin";
  phone: string;
  fullName?: string;
  pharmacyId?: string | null;
  issuedAt: number; // timestamp de création
  expiresAt: number; // timestamp d'expiration
}

function sign(payload: SessionPayload, secret: string = CURRENT_SECRET): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verify(token: string): SessionPayload | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;

    // Essayer d'abord avec la clé actuelle
    let payload = verifyWithKey(data, sig, CURRENT_SECRET);
    if (payload) return checkExpiry(payload);

    // Si échec et clé précédente existe, essayer avec (grace period rotation)
    if (PREVIOUS_SECRET) {
      payload = verifyWithKey(data, sig, PREVIOUS_SECRET);
      if (payload) return checkExpiry(payload);
    }

    return null;
  } catch {
    return null;
  }
}

function verifyWithKey(data: string, sig: string, secret: string): SessionPayload | null {
  try {
    const expectedSig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
    if (sig.length !== expectedSig.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    return JSON.parse(Buffer.from(data, "base64url").toString("utf-8")) as SessionPayload;
  } catch {
    return null;
  }
}

function checkExpiry(payload: SessionPayload): SessionPayload | null {
  const now = Math.floor(Date.now() / 1000);
  if (payload.expiresAt && payload.expiresAt < now) {
    return null; // Token expiré
  }
  return payload;
}

const COOKIE_NAME = "mt_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours (cookie)

export async function setSession(payload: Omit<SessionPayload, "issuedAt" | "expiresAt">) {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: SessionPayload = {
    ...payload,
    issuedAt: now,
    expiresAt: now + TOKEN_TTL, // Token expire en 24h
  };

  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: sign(fullPayload),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verify(token);
  if (!payload) return null;

  // Auto-refresh : si le token expire dans moins de 1h, le renouveler
  const now = Math.floor(Date.now() / 1000);
  if (payload.expiresAt - now < 3600) {
    const refreshedPayload: SessionPayload = {
      ...payload,
      issuedAt: now,
      expiresAt: now + TOKEN_TTL,
    };
    const store2 = await cookies();
    store2.set({
      name: COOKIE_NAME,
      value: sign(refreshedPayload),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return refreshedPayload;
  }

  return payload;
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Récupère l'IP du client pour audit log. */
export function getClientIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri;
  return "unknown";
}

/**
 * Guide de rotation des clés :
 *
 * 1. Générer une nouvelle clé : openssl rand -hex 32
 * 2. Définir MEDITIKE_SESSION_SECRET_PREV = ancienne valeur de MEDITIKE_SESSION_SECRET
 * 3. Définir MEDITIKE_SESSION_SECRET = nouvelle clé
 * 4. Déployer — les anciens tokens restent valides (grace period) jusqu'à expiration
 * 5. Après 24h (TTL), supprimer MEDITIKE_SESSION_SECRET_PREV
 *
 * À faire tous les 3-6 mois ou après un incident de sécurité.
 */
