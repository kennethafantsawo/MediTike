import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSession, getSession, clearSession, getClientIP } from "@/lib/meditike/session";
import { normalizePhone, validatePassword } from "@/lib/meditike/helpers";
import { rateLimit, getRateLimitIdentifier } from "@/lib/meditike/rate-limit";
import { sanitizeRequestBody, containsInjection } from "@/lib/meditike/sanitizer";

/**
 * POST /api/auth — inscription client, login (tous rôles)
 *
 * Body (inscription client) : { action: "register", phone, password, fullName }
 * Body (login patient/admin): { phone, password }
 * Body (login pharmacien)   : { pharmacyId, password }
 */
export async function POST(req: NextRequest) {
  try {
    // ── Rate limiting : 5 tentatives par minute par IP ──
    const ip = getRateLimitIdentifier(req);
    const rl = rateLimit(ip, { windowMs: 60 * 1000, max: 5 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Patientez 1 minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
    const rawBody = await req.json();
    // ── Sanitization anti-XSS / anti-injection ──
    if (containsInjection(rawBody)) {
      console.warn(`[SECURITY] Injection bloquée sur /api/auth depuis IP: ${getRateLimitIdentifier(req)}`);
      return NextResponse.json({ error: "Entrée invalide." }, { status: 400 });
    }
    const body = sanitizeRequestBody(rawBody);
    const { action, phone, password, fullName, pharmacyId } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Mot de passe requis." },
        { status: 400 }
      );
    }

    // ── INSCRIPTION CLIENT ──
    if (action === "register") {
      if (!phone) {
        return NextResponse.json(
          { error: "Numéro de téléphone requis." },
          { status: 400 }
        );
      }
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

      // Normaliser le numéro de téléphone (accepte tous les indicatifs pays)
      const cleanPhone = normalizePhoneInput(phone);
      if (!cleanPhone) {
        return NextResponse.json(
          { error: "Numéro de téléphone invalide. Vérifiez votre indicatif pays et votre numéro." },
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

    // ── LOGIN PHARMACIEN (par sélection de pharmacie) ──
    if (pharmacyId) {
      // On cherche un User avec role='pharmacist' lié à cette pharmacie.
      // Si plusieurs pharmaciens existent pour une même pharmacie, on prend le premier actif.
      const pharmacist = await db.user.findFirst({
        where: {
          pharmacyId,
          role: "pharmacist",
          isActive: true,
        },
        include: { pharmacy: true },
        orderBy: { createdAt: "asc" },
      });

      // Même message que pour le login patient pour éviter de révéler
      // l'existence d'un compte pharmacien (sécurité anti-énumération).
      if (!pharmacist) {
        return NextResponse.json(
          { error: "Pharmacie ou mot de passe incorrect." },
          { status: 401 }
        );
      }

      // Vérifier que la pharmacie est bien active
      if (!pharmacist.pharmacy || !pharmacist.pharmacy.isActive) {
        return NextResponse.json(
          { error: "Cette pharmacie est désactivée. Contactez l'administrateur." },
          { status: 403 }
        );
      }

      const valid = await bcrypt.compare(password, pharmacist.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Pharmacie ou mot de passe incorrect." },
          { status: 401 }
        );
      }

      // Mettre à jour la dernière connexion
      await db.user.update({
        where: { id: pharmacist.id },
        data: { lastSeenAt: new Date() },
      });

      await setSession({
        userId: pharmacist.id,
        role: "pharmacist",
        phone: pharmacist.phone,
        fullName: pharmacist.fullName ?? undefined,
        pharmacyId: pharmacist.pharmacyId ?? null,
      });

      return NextResponse.json({
        ok: true,
        user: {
          id: pharmacist.id,
          phone: pharmacist.phone,
          fullName: pharmacist.fullName,
          role: pharmacist.role,
          pharmacyId: pharmacist.pharmacyId,
          pharmacyName: pharmacist.pharmacy?.name,
        },
      });
    }

    // ── LOGIN PATIENT / ADMIN (par téléphone + mot de passe) ──
    if (!phone) {
      return NextResponse.json(
        { error: "Numéro de téléphone requis." },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhoneInput(phone);
    if (!cleanPhone || !/^\+\d{6,15}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Numéro de téléphone invalide. Vérifiez votre indicatif pays et votre numéro." },
        { status: 400 }
      );
    }

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

/**
 * Normalise un numéro de téléphone saisi (avec ou sans indicatif).
 * @returns format +XXXYYYYYYYYY ou null si invalide
 */
function normalizePhoneInput(phone: string): string | null {
  const cleanPhone = phone.startsWith("+")
    ? phone.replace(/[^0-9+]/g, "")
    : normalizePhone(phone);
  if (!cleanPhone || !/^\+\d{6,15}$/.test(cleanPhone)) return null;
  return cleanPhone;
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
