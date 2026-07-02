/**
 * Simple cookie-based session for MediTike.
 * Stores userId + role in an httpOnly cookie signed with HMAC-SHA256.
 * For production-grade auth use NextAuth, but for this MVP the signed cookie is enough.
 */
import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.MEDITIKE_SESSION_SECRET || "meditike-dev-secret-change-in-prod-2024";

export interface SessionPayload {
  userId: string;
  role: string;
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
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

const COOKIE_NAME = "meditike_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

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

/** Client-side helper to read whether a session cookie exists (not the payload). */
export function hasSessionCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(COOKIE_NAME);
}
