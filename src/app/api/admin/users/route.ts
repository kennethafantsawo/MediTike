import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/meditike/admin-guard";

/** Génère un mot de passe temporaire aléatoire (12 caractères lisibles). */
function generateTemporaryPassword(length: number = 12): string {
  // Caractères non ambigus (sans 0/O/1/I/l) pour faciliter la lecture
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const digits = "23456789";
  const special = "!@#$%&*";
  const all = lower + upper + digits + special;
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += all[bytes[i] % all.length];
  }
  // Garantit la présence d'au moins une lettre, un chiffre et un caractère spécial
  if (!/[A-Za-z]/.test(out)) out = "a" + out.slice(1);
  if (!/[0-9]/.test(out)) out = out.slice(0, -2) + "5" + out.slice(-1);
  if (!/[!@#$%&*]/.test(out)) out = out.slice(0, -1) + "!";
  return out;
}

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
 * PATCH /api/admin/users — plusieurs actions selon le corps de la requête.
 *
 * Body (action "toggle"): { userId, isActive }
 *   → Active / désactive un utilisateur.
 *
 * Body (action "reset-password"): { userId, action: "reset-password" }
 *   → Génère un mot de passe temporaire (12 caractères), le hash avec bcrypt,
 *     met à jour le user en base, journalise l'action dans AuditLog et retourne
 *     le mot de passe en clair pour que l'admin puisse le communiquer.
 */
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const body = await req.json();
  const { userId, action } = body;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  // ── Action : réinitialiser le mot de passe ──
  if (action === "reset-password") {
    // Récupérer l'utilisateur cible pour le journal d'audit
    const target = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, phone: true, fullName: true, role: true },
    });
    if (!target) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    // Générer un mot de passe temporaire et le hasher
    const temporaryPassword = generateTemporaryPassword(12);
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Journaliser l'action
    await logAdminAction(guard.session.userId, "reset_user_password", {
      targetUserId: target.id,
      targetPhone: target.phone,
      targetName: target.fullName,
      targetRole: target.role,
    }, req);

    return NextResponse.json({ ok: true, temporaryPassword });
  }

  // ── Action par défaut : activer / désactiver ──
  const { isActive } = body;
  if (typeof isActive !== "boolean") {
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
