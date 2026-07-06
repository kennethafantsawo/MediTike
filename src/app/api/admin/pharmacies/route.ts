import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/meditike/admin-guard";
import { normalizePhone, validatePassword } from "@/lib/meditike/helpers";
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

    // Accepter tous les indicatifs pays (le numéro doit commencer par +)
    const cleanPharmaPhone = pharmacistPhone.startsWith("+")
      ? pharmacistPhone.replace(/[^0-9+]/g, "")
      : normalizePhone(pharmacistPhone);
    if (!cleanPharmaPhone || !/^\+\d{6,15}$/.test(cleanPharmaPhone)) {
      return NextResponse.json({ error: "Téléphone pharmacien invalide (format attendu: +XXX numéro)" }, { status: 400 });
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
 * DELETE /api/admin/pharmacies — désactive, réactive ou supprime une pharmacie
 * Query params:
 *   - id: ID pharmacie (requis)
 *   - action: "deactivate" (défaut) | "activate" | "delete"
 *
 * - action=deactivate : désactive la pharmacie + ses pharmaciens (comportement historique)
 * - action=activate   : réactive la pharmacie + ses pharmaciens
 * - action=delete     : supprime définitivement si la pharmacie n'a pas d'historique
 *                       de réponses. Sinon, désactive pour préserver l'historique.
 *                       Les comptes pharmaciens sans historique sont supprimés ;
 *                       ceux avec historique sont désactivés.
 */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const pharmacyId = searchParams.get("id");
    const action = searchParams.get("action") || "deactivate";

    if (!pharmacyId) {
      return NextResponse.json({ error: "ID pharmacie requis" }, { status: 400 });
    }

    const pharmacy = await db.pharmacy.findUnique({
      where: { id: pharmacyId },
      include: {
        _count: {
          select: {
            productResponses: true,
          },
        },
      },
    });

    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacie introuvable" }, { status: 404 });
    }

    // ── action=activate : réactiver la pharmacie ───────────────────
    if (action === "activate") {
      await db.pharmacy.update({
        where: { id: pharmacyId },
        data: { isActive: true },
      });
      await db.user.updateMany({
        where: { pharmacyId },
        data: { isActive: true },
      });
      await logAdminAction(guard.session.userId, "activate_pharmacy", {
        pharmacyId,
        pharmacyName: pharmacy.name,
      }, req);
      return NextResponse.json({ ok: true, action: "activated" });
    }

    // ── action=delete : supprimer définitivement (si pas d'historique) ─
    if (action === "delete") {
      const hasHistory = pharmacy._count.productResponses > 0;

      if (hasHistory) {
        // Préserver l'historique : désactiver au lieu de supprimer
        await db.pharmacy.update({
          where: { id: pharmacyId },
          data: { isActive: false },
        });
        await db.user.updateMany({
          where: { pharmacyId },
          data: { isActive: false },
        });
        await logAdminAction(
          guard.session.userId,
          "delete_pharmacy_downgraded",
          {
            pharmacyId,
            pharmacyName: pharmacy.name,
            reason: "Historique de réponses — désactivation au lieu de suppression",
          },
          req
        );
        return NextResponse.json({
          ok: true,
          action: "deactivated",
          message:
            "Cette pharmacie a de l'historique. Elle a été désactivée au lieu d'être supprimée.",
        });
      }

      // Pas d'historique côté pharmacie : on peut supprimer complètement.
      // On distingue les pharmaciens selon qu'ils ont (ou non) des réponses
      // (par ex. s'ils ont changé de pharmacie par le passé).
      const pharmacists = await db.user.findMany({
        where: { pharmacyId },
        include: {
          _count: {
            select: { productResponses: true },
          },
        },
      });

      let pharmacistsDeleted = 0;
      let pharmacistsDeactivated = 0;

      await db.$transaction(async (tx) => {
        for (const pharma of pharmacists) {
          if (pharma._count.productResponses > 0) {
            // Conserver l'historique : désactiver et détacher
            await tx.user.update({
              where: { id: pharma.id },
              data: { isActive: false, pharmacyId: null },
            });
            pharmacistsDeactivated++;
          } else {
            await tx.user.delete({ where: { id: pharma.id } });
            pharmacistsDeleted++;
          }
        }
        // PharmacyDuty.onDelete = SetNull → Prisma gère la nullification
        await tx.pharmacy.delete({ where: { id: pharmacyId } });
      });

      await logAdminAction(guard.session.userId, "delete_pharmacy", {
        pharmacyId,
        pharmacyName: pharmacy.name,
        pharmacistsDeleted,
        pharmacistsDeactivated,
      }, req);

      return NextResponse.json({ ok: true, action: "deleted" });
    }

    // ── action=deactivate (défaut) : désactiver ───────────────────
    await db.pharmacy.update({
      where: { id: pharmacyId },
      data: { isActive: false },
    });
    await db.user.updateMany({
      where: { pharmacyId },
      data: { isActive: false },
    });

    await logAdminAction(guard.session.userId, "deactivate_pharmacy", {
      pharmacyId,
      pharmacyName: pharmacy.name,
    }, req);

    return NextResponse.json({ ok: true, action: "deactivated" });
  } catch (err: any) {
    console.error("[admin pharmacies DELETE] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
