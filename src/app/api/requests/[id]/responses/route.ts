import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { calculatePhotoDeletionDate } from "@/lib/meditike/helpers";
import { sanitizeRequestBody, containsInjection } from "@/lib/meditike/sanitizer";
import { rateLimit, getRateLimitIdentifier } from "@/lib/meditike/rate-limit";

/**
 * POST /api/requests/[id]/responses
 * Pharmacien répond à une demande.
 * Body: { available, price?, note? }
 *
 * Une fois la réponse créée:
 * - La demande passe en "responded"
 * - Les photos liées sont reprogrammées pour suppression dans 72h
 * - Le client peut voir la réponse
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.role !== "pharmacist" || !session.pharmacyId) {
      return NextResponse.json(
        { error: "Réservé aux pharmaciens actifs" },
        { status: 403 }
      );
    }

    // ── Rate limiting : 20 réponses/min par pharmacien ──
    const ip = getRateLimitIdentifier(req, session.userId);
    const rl = rateLimit(ip, { windowMs: 60 * 1000, max: 20 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Trop de réponses. Patientez 1 minute." }, { status: 429 });
    }

    const { id } = await params;
    const { available, price, note } = await req.json();

    const request = await db.productRequest.findUnique({
      where: { id },
      include: { responses: true, photos: { where: { deletedAt: null } } },
    });
    if (!request) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }
    if (request.status === "closed" || request.status === "expired") {
      return NextResponse.json(
        { error: "Cette demande est clôturée." },
        { status: 400 }
      );
    }

    // Empêcher double réponse
    const existing = await db.productResponse.findFirst({
      where: { requestId: id, pharmacistId: session.userId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Vous avez déjà répondu à cette demande." },
        { status: 400 }
      );
    }

    // Validation
    if (typeof available !== "boolean") {
      return NextResponse.json(
        { error: "Le champ 'available' est requis (booléen)." },
        { status: 400 }
      );
    }
    if (available && (typeof price !== "number" || price <= 0 || price > 1000000)) {
      return NextResponse.json(
        { error: "Prix invalide (entre 1 et 1 000 000 FCFA)." },
        { status: 400 }
      );
    }
    if (note && note.length > 1000) {
      return NextResponse.json(
        { error: "Note trop longue (1000 caractères max)." },
        { status: 400 }
      );
    }

    const response = await db.productResponse.create({
      data: {
        requestId: id,
        pharmacistId: session.userId,
        pharmacyId: session.pharmacyId,
        available,
        price: available && price ? price : null,
        note: note?.trim() || null,
      },
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
    });

    // Marquer la demande comme "responded"
    await db.productRequest.update({
      where: { id },
      data: { status: "responded" },
    });

    // Reprogrammer la suppression des photos à 72h à partir de maintenant
    const newDeleteAt = calculatePhotoDeletionDate(request.createdAt, new Date());
    if (request.photos.length > 0) {
      await db.photo.updateMany({
        where: { id: { in: request.photos.map((p) => p.id) } },
        data: { deleteAt: newDeleteAt },
      });
    }

    return NextResponse.json({ ok: true, response });
  } catch (err: any) {
    console.error("[responses POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/requests/[id]/responses
 * Récupère toutes les réponses d'une demande (côté client).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const request = await db.productRequest.findUnique({
      where: { id },
      select: { clientId: true },
    });
    if (!request) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    // Seul le client propriétaire, l'admin ou les pharmaciens peuvent voir
    if (
      session.role === "client" &&
      request.clientId !== session.userId
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const responses = await db.productResponse.findMany({
      where: { requestId: id },
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
    });

    // Marquer comme lues si c'est le client
    if (session.role === "client" && request.clientId === session.userId) {
      await db.productResponse.updateMany({
        where: { requestId: id, read: false },
        data: { read: true },
      });
    }

    return NextResponse.json({ responses });
  } catch (err: any) {
    console.error("[responses GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
