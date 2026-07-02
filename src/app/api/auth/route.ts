import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/meditike/session";
import { normalizeTogoPhone } from "@/lib/meditike/helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password, action } = body;

    // ── REGISTER (client only via this route)
    if (action === "register") {
      const { fullName } = body;
      const cleanPhone = normalizeTogoPhone(phone);
      if (!cleanPhone) {
        return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
      }
      if (!fullName?.trim()) {
        return NextResponse.json({ error: "Veuillez saisir votre nom complet." }, { status: 400 });
      }
      if (!password || password.length < 6) {
        return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères." }, { status: 400 });
      }
      const existing = await db.user.findUnique({ where: { phone: cleanPhone } });
      if (existing) {
        return NextResponse.json({ error: "Un compte existe déjà avec ce numéro." }, { status: 409 });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await db.user.create({
        data: { phone: cleanPhone, passwordHash, fullName: fullName.trim(), role: "client" },
      });
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
    }

    // ── REGISTER PHARMACY (open registration — becomes pharmacist user)
    if (action === "register-pharmacy") {
      const { fullName, pharmacyName, city, district, address } = body;
      const cleanPhone = normalizeTogoPhone(phone);
      if (!cleanPhone || !pharmacyName?.trim() || !address?.trim()) {
        return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
      }
      if (!password || password.length < 6) {
        return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères." }, { status: 400 });
      }
      let pharmacy = await db.pharmacy.findFirst({ where: { name: pharmacyName.trim() } });
      if (!pharmacy) {
        pharmacy = await db.pharmacy.create({
          data: {
            name: pharmacyName.trim(),
            phone: cleanPhone,
            whatsapp: cleanPhone,
            address: address.trim(),
            city: city || "Lomé",
            district: district || null,
            openingHours: "08:00-20:00",
            isOpen24h: false,
          },
        });
      }
      const existing = await db.user.findUnique({ where: { phone: cleanPhone } });
      if (existing) {
        return NextResponse.json({ error: "Un compte existe déjà avec ce numéro." }, { status: 409 });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await db.user.create({
        data: {
          phone: cleanPhone,
          passwordHash,
          fullName: fullName?.trim() || pharmacyName.trim(),
          role: "pharmacist",
          pharmacyId: pharmacy.id,
        },
      });
      await setSession({
        userId: user.id,
        role: user.role,
        phone: user.phone,
        fullName: user.fullName ?? undefined,
        pharmacyId: pharmacy.id,
      });
      return NextResponse.json({
        ok: true,
        user: { id: user.id, phone: user.phone, fullName: user.fullName, role: user.role, pharmacyId: pharmacy.id },
      });
    }

    // ── LOGIN (default)
    const cleanPhone = normalizeTogoPhone(phone);
    if (!cleanPhone || !password) {
      return NextResponse.json({ error: "Numéro et mot de passe requis." }, { status: 400 });
    }
    const user = await db.user.findUnique({
      where: { phone: cleanPhone },
      include: { pharmacy: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Numéro ou mot de passe incorrect." }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Numéro ou mot de passe incorrect." }, { status: 401 });
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
    console.error("[auth] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  const { getSession } = await import("@/lib/meditike/session");
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
      pharmacyCity: user.pharmacy?.city,
      pharmacyDistrict: user.pharmacy?.district,
    },
  });
}

export async function DELETE() {
  const { clearSession } = await import("@/lib/meditike/session");
  await clearSession();
  return NextResponse.json({ ok: true });
}
