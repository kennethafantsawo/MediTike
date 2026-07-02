/**
 * Session sécurisée — cookies HTTP-only signés HMAC-SHA256.
 * Standard de sécurité: cookies SameSite=Lax, Secure en production, httpOnly.
 */
import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET =
  process.env.MEDITIKE_SESSION_SECRET ||
  "meditike-dev-secret-change-in-production-please-use-strong-secret-2024";

export interface SessionPayload {
  userId: string;
  role: "client" | "pharmacist" | "admin";
  phone: string;
  fullName?: string;
  pharmacyId?: string | null;
}

function sign(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function verify(token: string): SessionPayload | null {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
    // Constant-time comparison
    if (sig.length !== expectedSig.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

const COOKIE_NAME = "mt_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

export async function setSession(payload: SessionPayload) {
  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: sign(payload),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verify(token);
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
