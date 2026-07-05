import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/meditike/session";

/**
 * POST /api/seed-demo
 * One-click demo access: creates a fresh demo client account and logs in.
 * Returns the session cookie + user info.
 */
export async function POST() {
  try {
    const phone = "+22890000000";
    let user = await db.user.findUnique({ where: { phone } });
    if (!user) {
      const passwordHash = await bcrypt.hash("demo1234", 10);
      user = await db.user.create({
        data: {
          phone,
          passwordHash,
          fullName: "Visiteur Démo",
          role: "client",
        },
      });
    }
    await setSession({
      userId: user.id,
      role: user.role,
      phone: user.phone,
      fullName: user.fullName ?? undefined,
      pharmacyId: user.pharmacyId ?? null,
    });
    return NextResponse.json({
      ok: true,
      user: { id: user.id, phone: user.phone, fullName: user.fullName, role: user.role },
    });
  } catch (err: any) {
    console.error("[seed-demo] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
