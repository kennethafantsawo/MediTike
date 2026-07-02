import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSession, getSession, clearSession, getClientIP } from "@/lib/meditike/session";
import { normalizeTogoPhone, validatePassword, validateTogoPhone } from "@/lib/meditike/helpers";
import { DEFAULT_ADMIN } from "@/lib/meditike/config";

/**
 * POST /api/auth — inscription client, login (tous rôles)
 * Body: { action: "register"|"login", phone, password, fullName? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, password, fullName } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Numéro et mot de passe requis." },
        { status: 400 }
      );
    }

    const cleanPhone = normalizeTogoPhone(phone);
    if (!validateTogoPhone(cleanPhone)) {
      return NextResponse.json(
        { error: "Numéro togolais invalide. Format: 8 chiffres (ex: 90 12 34 56)." },
        { status: 400 }
      );
    }

    // ── INSCRIPTION CLIENT ──
    if (action === "register") {
      const pwdError = validatePassword(password);
      if (pwdError) {
        return NextResponse.json({ error: pwdError }, { status: 400 });
      }
      if (!fullName?.trim() || fullName.trim().length < 3) {
        return NextResponse.json(
          { error: "Veuillez saisir votre nom complet (3 caractères minimum)." },
          { status: 400 }
        );
      }

      const existing = await db.user.findUnique({ where: { phone: cleanPhone } });
      if (existing) {
        return NextResponse.json(
          { error: "Un compte existe déjà avec ce numéro. Connectez-vous." },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await db.user.create({
        data: {
          phone: cleanPhone,
          passwordHash,
          fullName: fullName.trim(),
          role: "client",
        },
      });

      await setSession({
        userId: user.id,
        role: "client",
        phone: user.phone,
        fullName: user.fullName ?? undefined,
      });

      return NextResponse.json({
        ok: true,
        user: {
          id: user.id,
          phone: user.phone,
          fullName: user.fullName,
          role: user.role,
        },
      });
    }

    // ── LOGIN (tous rôles) ──
    const user = await db.user.findUnique({
      where: { phone: cleanPhone },
      include: { pharmacy: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Numéro ou mot de passe incorrect." },
        { status: 401 }
      );
    }
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Votre compte est désactivé. Contactez l'administrateur." },
        { status: 403 }
      );
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Numéro ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Update lastSeen
    await db.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() },
    });

    await setSession({
      userId: user.id,
      role: user.role as "client" | "pharmacist" | "admin",
      phone: user.phone,
      fullName: user.fullName ?? undefined,
      pharmacyId: user.pharmacyId ?? null,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        pharmacyId: user.pharmacyId,
        pharmacyName: user.pharmacy?.name,
      },
    });
  } catch (err: any) {
    console.error("[auth POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/** GET /api/auth — récupère l'utilisateur courant */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { pharmacy: true },
  });
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      pharmacyId: user.pharmacyId,
      pharmacyName: user.pharmacy?.name,
      pharmacyAddress: user.pharmacy?.address,
      isActive: user.isActive,
    },
  });
}

/** DELETE /api/auth — déconnexion */
export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
