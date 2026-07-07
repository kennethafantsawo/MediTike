import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/meditike/helpers";

/**
 * GET /api/client/settings — infos du client connecté
 * Retourne : id, phone, fullName, createdAt
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "client") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    const user = await db.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

/**
 * PATCH /api/client/settings
 *
 * Body: { action: "change-password", currentPassword, newPassword }
 *   → Vérifie l'ancien mot de passe, valide le nouveau, met à jour le hash.
 *
 * Body: { action: "update-profile", fullName }
 *   → Met à jour le nom complet du client.
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "client") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    // ── Changer le mot de passe ───────────────────────────────────
    if (action === "change-password") {
      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Ancien et nouveau mot de passe requis" },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({
        where: { id: session.userId },
      });
      if (!user) {
        return NextResponse.json(
          { error: "Utilisateur introuvable" },
          { status: 404 }
        );
      }

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect" },
          { status: 400 }
        );
      }

      const pwdError = validatePassword(newPassword);
      if (pwdError) {
        return NextResponse.json({ error: pwdError }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await db.user.update({
        where: { id: session.userId },
        data: { passwordHash },
      });
      return NextResponse.json({ ok: true });
    }

    // ── Mettre à jour le profil ───────────────────────────────────
    if (action === "update-profile") {
      const { fullName } = body;
      if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
        return NextResponse.json(
          { error: "Le nom complet est requis" },
          { status: 400 }
        );
      }
      if (fullName.trim().length > 100) {
        return NextResponse.json(
          { error: "Le nom complet est trop long (100 caractères max)" },
          { status: 400 }
        );
      }
      await db.user.update({
        where: { id: session.userId },
        data: { fullName: fullName.trim() },
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
