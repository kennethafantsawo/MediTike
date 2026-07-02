import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { calculatePhotoDeletionDate } from "@/lib/meditike/helpers";

/**
 * GET /api/requests
 * - Client: ses propres demandes (avec photos + réponses)
 * - Pharmacien: demandes ouvertes à répondre
 * - Admin: toutes les demandes
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    let requests;
    if (session.role === "client") {
      requests = await db.productRequest.findMany({
        where: {
          clientId: session.userId,
          status: { not: "draft" },
        },
        include: {
          photos: {
            where: { deletedAt: null },
            select: { id: true, filename: true, mimeType: true, size: true },
          },
          responses: {
            include: {
              pharmacy: {
                select: {
                  id: true,
                  name: true,
                  phone1: true,
                  phone2: true,
                  whatsapp: true,
                  address: true,
                  district: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    } else if (session.role === "pharmacist") {
      // Pharmaciens voient les demandes ouvertes non encore répondues par eux
      const respondedByMe = await db.productResponse.findMany({
        where: { pharmacistId: session.userId },
        select: { requestId: true },
      });
      const respondedIds = respondedByMe.map((r) => r.requestId);

      requests = await db.productRequest.findMany({
        where: {
          status: "open",
          id: { notIn: respondedIds },
        },
        include: {
          photos: {
            where: { deletedAt: null },
            select: { id: true, filename: true, mimeType: true, size: true },
          },
          responses: {
            where: { pharmacistId: session.userId },
            select: { id: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    } else {
      // Admin: tout
      requests = await db.productRequest.findMany({
        where: { status: { not: "draft" } },
        include: {
          client: { select: { id: true, fullName: true, phone: true } },
          photos: {
            where: { deletedAt: null },
            select: { id: true, filename: true, mimeType: true, size: true },
          },
          responses: {
            include: {
              pharmacy: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
    }

    return NextResponse.json({ requests });
  } catch (err: any) {
    console.error("[requests GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/requests — création d'une demande client
 * Body: { productName, note?, photoIds? (tableau d'IDs de photos uploadées) }
 *
 * Le client crée sa demande. Si photoIds fournis, on relie les photos.
 * La demande est immédiatement "ouverte" et visible par tous les pharmaciens.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.role !== "client") {
      return NextResponse.json(
        { error: "Réservé aux clients" },
        { status: 403 }
      );
    }

    const { productName, note, photoIds, draftRequestId } = await req.json();

    if (!productName?.trim() || productName.trim().length < 2) {
      return NextResponse.json(
        { error: "Veuillez saisir le nom du médicament recherché." },
        { status: 400 }
      );
    }
    if (productName.trim().length > 200) {
      return NextResponse.json(
        { error: "Le nom du médicament est trop long (200 caractères max)." },
        { status: 400 }
      );
    }

    // Compter les pharmacies actives qui seront notifiées
    const activePharmacies = await db.pharmacy.count({
      where: { isActive: true },
    });

    // Si draftRequestId fourni: mettre à jour la demande existante
    let request;
    if (draftRequestId) {
      const draft = await db.productRequest.findUnique({
        where: { id: draftRequestId },
      });
      if (!draft || draft.clientId !== session.userId || draft.status !== "draft") {
        return NextResponse.json(
          { error: "Demande draft invalide" },
          { status: 400 }
        );
      }
      request = await db.productRequest.update({
        where: { id: draftRequestId },
        data: {
          productName: productName.trim(),
          note: note?.trim() || null,
          status: "open",
          clientName: session.fullName,
          clientPhone: session.phone,
          notifiedPharmacies: activePharmacies,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    } else {
      // Créer une nouvelle demande
      request = await db.productRequest.create({
        data: {
          clientId: session.userId,
          productName: productName.trim(),
          note: note?.trim() || null,
          status: "open",
          clientName: session.fullName,
          clientPhone: session.phone,
          notifiedPharmacies: activePharmacies,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Si photoIds fournis: relier les photos à la demande
    // (les photos ont été uploadées avec un draftRequestId temporaire)
    if (photoIds && Array.isArray(photoIds) && photoIds.length > 0) {
      for (const photoId of photoIds) {
        const photo = await db.photo.findUnique({ where: { id: photoId } });
        if (photo && photo.requestId === request.id) {
          // Déjà relié via draft — juste s'assurer que deleteAt est correct
          const deleteAt = calculatePhotoDeletionDate(request.createdAt, null);
          await db.photo.update({
            where: { id: photoId },
            data: { deleteAt },
          });
        }
      }
    }

    return NextResponse.json({
      ok: true,
      request: {
        id: request.id,
        productName: request.productName,
        status: request.status,
        notifiedPharmacies: request.notifiedPharmacies,
        createdAt: request.createdAt,
      },
    });
  } catch (err: any) {
    console.error("[requests POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
