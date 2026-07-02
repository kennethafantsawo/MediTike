import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/meditike/admin-guard";
import { normalizeTogoPhone, validateTogoPhone, validatePassword } from "@/lib/meditike/helpers";
import bcrypt from "bcryptjs";

/**
 * GET /api/admin/pharmacies — liste toutes les pharmacies (admin)
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const pharmacies = await db.pharmacy.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          users: true,
          productResponses: true,
        },
      },
    },
  });

  return NextResponse.json({ pharmacies });
}

/**
 * POST /api/admin/pharmacies — créer une pharmacie + compte pharmacien
 * Body: { name, phone1, phone2?, whatsapp?, address?, city?, district?, pharmacistPhone, pharmacistPassword, pharmacistFullName? }
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const {
      name,
      phone1,
      phone2,
      whatsapp,
      address,
      city,
      district,
      pharmacistPhone,
      pharmacistPassword,
      pharmacistFullName,
    } = body;

    // Validations
    if (!name?.trim()) {
      return NextResponse.json({ error: "Nom de la pharmacie requis" }, { status: 400 });
    }
    if (!phone1?.trim()) {
      return NextResponse.json({ error: "Téléphone 1 requis" }, { status: 400 });
    }
    if (!pharmacistPhone?.trim()) {
      return NextResponse.json({ error: "Téléphone du pharmacien requis" }, { status: 400 });
    }

    const cleanPharmaPhone = normalizeTogoPhone(pharmacistPhone);
    if (!validateTogoPhone(cleanPharmaPhone)) {
      return NextResponse.json({ error: "Téléphone pharmacien invalide" }, { status: 400 });
    }

    const pwdError = validatePassword(pharmacistPassword || "");
    if (pwdError) {
      return NextResponse.json({ error: pwdError }, { status: 400 });
    }

    // Vérifier que le téléphone pharmacien n'existe pas déjà
    const existingUser = await db.user.findUnique({ where: { phone: cleanPharmaPhone } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec ce numéro de pharmacien." },
        { status: 409 }
      );
    }

    // Créer la pharmacie
    const pharmacy = await db.pharmacy.create({
      data: {
        name: name.trim(),
        phone1: phone1.trim(),
        phone2: phone2?.trim() || null,
        whatsapp: whatsapp?.trim() || phone1.trim(),
        address: address?.trim() || null,
        city: city?.trim() || "Lomé",
        district: district?.trim() || null,
        createdById: guard.session.userId,
        createdByName: guard.session.fullName,
      },
    });

    // Créer le compte pharmacien lié
    const passwordHash = await bcrypt.hash(pharmacistPassword, 12);
    const pharmacist = await db.user.create({
      data: {
        phone: cleanPharmaPhone,
        passwordHash,
        fullName: pharmacistFullName?.trim() || name.trim(),
        role: "pharmacist",
        pharmacyId: pharmacy.id,
      },
    });

    await logAdminAction(guard.session.userId, "create_pharmacy", {
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      pharmacistId: pharmacist.id,
      pharmacistPhone: pharmacist.phone,
    }, req);

    return NextResponse.json({
      ok: true,
      pharmacy: {
        id: pharmacy.id,
        name: pharmacy.name,
        phone1: pharmacy.phone1,
      },
      pharmacist: {
        id: pharmacist.id,
        phone: pharmacist.phone,
        fullName: pharmacist.fullName,
      },
    });
  } catch (err: any) {
    console.error("[admin pharmacies POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/pharmacies — désactive une pharmacie (ne supprime pas)
 * Body: { pharmacyId }
 */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const pharmacyId = searchParams.get("id");
    if (!pharmacyId) {
      return NextResponse.json({ error: "ID pharmacie requis" }, { status: 400 });
    }

    const pharmacy = await db.pharmacy.update({
      where: { id: pharmacyId },
      data: { isActive: false },
    });

    // Désactiver aussi les comptes pharmaciens liés
    await db.user.updateMany({
      where: { pharmacyId },
      data: { isActive: false },
    });

    await logAdminAction(guard.session.userId, "deactivate_pharmacy", {
      pharmacyId,
      pharmacyName: pharmacy.name,
    }, req);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[admin pharmacies DELETE] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
