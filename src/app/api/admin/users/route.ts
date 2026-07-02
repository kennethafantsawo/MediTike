import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/meditike/admin-guard";

/**
 * GET /api/admin/users — liste tous les utilisateurs
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const users = await db.user.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      pharmacy: { select: { id: true, name: true } },
    },
    take: 500,
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      phone: u.phone,
      fullName: u.fullName,
      role: u.role,
      isActive: u.isActive,
      pharmacyId: u.pharmacyId,
      pharmacyName: u.pharmacy?.name,
      lastSeenAt: u.lastSeenAt,
      createdAt: u.createdAt,
    })),
  });
}

/**
 * PATCH /api/admin/users — activer/désactiver un utilisateur
 * Body: { userId, isActive }
 */
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { userId, isActive } = await req.json();
  if (!userId || typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  // Ne pas permettre de désactiver son propre compte admin
  if (userId === guard.session.userId && !isActive) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas désactiver votre propre compte." },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { id: userId },
    data: { isActive },
  });

  return NextResponse.json({ ok: true });
}
