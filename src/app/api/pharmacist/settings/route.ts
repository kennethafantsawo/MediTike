import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/meditike/helpers";

/** GET /api/pharmacist/settings — infos du pharmacien connecté */
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "pharmacist") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    const user = await db.user.findUnique({
      where: { id: session.userId },
      include: { pharmacy: true },
    });
    if (!user || !user.pharmacyId) {
      return NextResponse.json({ error: "Pharmacien sans pharmacie" }, { status: 400 });
    }
    return NextResponse.json({
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
      },
      pharmacy: {
        id: user.pharmacy!.id,
        name: user.pharmacy!.name,
        phone1: user.pharmacy!.phone1,
        phone2: user.pharmacy!.phone2,
        whatsapp: user.pharmacy!.whatsapp,
        address: user.pharmacy!.address,
        district: user.pharmacy!.district,
        city: user.pharmacy!.city,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}

/** PATCH /api/pharmacist/settings — changer mot de passe ou mettre à jour WhatsApp */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "pharmacist") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    const { action } = await req.json();

    if (action === "change-password") {
      const { currentPassword, newPassword } = await req.json();
      const user = await db.user.findUnique({ where: { id: session.userId } });
      if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

      const pwdError = validatePassword(newPassword);
      if (pwdError) return NextResponse.json({ error: pwdError }, { status: 400 });

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await db.user.update({ where: { id: session.userId }, data: { passwordHash } });
      return NextResponse.json({ ok: true });
    }

    if (action === "update-whatsapp") {
      const { whatsappNumbers } = await req.json();
      if (!Array.isArray(whatsappNumbers) || whatsappNumbers.length > 3) {
        return NextResponse.json({ error: "Maximum 3 numéros WhatsApp" }, { status: 400 });
      }
      // Stocker séparés par virgules dans le champ whatsapp existant
      const whatsapp = whatsappNumbers.filter(Boolean).join(",");
      const user = await db.user.findUnique({ where: { id: session.userId } });
      if (!user?.pharmacyId) return NextResponse.json({ error: "Pharmacien sans pharmacie" }, { status: 400 });
      await db.pharmacy.update({ where: { id: user.pharmacyId }, data: { whatsapp } });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
