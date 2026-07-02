/**
 * Helper admin: vérifie la session et le rôle admin.
 * À appeler au début de chaque route admin.
 */
import { getSession, getClientIP } from "@/lib/meditike/session";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Non authentifié" }, { status: 401 }),
    };
  }
  if (session.role !== "admin") {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Accès refusé" }, { status: 403 }),
    };
  }
  return { ok: true as const, session };
}

export async function logAdminAction(
  adminId: string,
  action: string,
  details: any = null,
  req?: Request
) {
  try {
    await db.auditLog.create({
      data: {
        adminId,
        action,
        details: details ? JSON.stringify(details).slice(0, 2000) : null,
        ip: req ? getClientIP(req) : null,
      },
    });
  } catch (e) {
    console.error("[audit log] failed:", e);
  }
}
