import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { sanitizeRequestBody, containsInjection } from "@/lib/meditike/sanitizer";
import { rateLimit, getRateLimitIdentifier } from "@/lib/meditike/rate-limit";

/**
 * GET /api/tpc
 * - Client: ses propres commandes TPC (avec photos)
 * - Pharmacien: toutes les commandes TPC ouvertes (status "sent" ou "awaiting_payment"
 *   ou non traitées par lui)
 * - Admin: toutes
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    let orders;
    if (session.role === "client" || (session.role === "pharmacist" && mode === "my")) {
      // Client: ses propres commandes TPC (historique complet)
      orders = await db.tPCOrder.findMany({
        where: { clientId: session.userId },
        include: {
          photos: {
            select: {
              id: true,
              filename: true,
              mimeType: true,
              size: true,
              type: true,
              originalName: true,
            },
            orderBy: { uploadedAt: "asc" },
          },
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
        take: 100,
      });
    } else if (session.role === "pharmacist") {
      // Pharmacien: commandes à traiter (status "sent" ou "awaiting_payment")
      // + commandes déjà traitées par lui (assigned ou paid/completed)
      orders = await db.tPCOrder.findMany({
        where: {
          OR: [
            { status: "sent" },
            { status: "awaiting_payment" },
            { status: "available" },
            { status: "paid" },
            { status: "completed" },
            { status: "rejected" },
          ],
        },
        include: {
          photos: {
            select: {
              id: true,
              filename: true,
              mimeType: true,
              size: true,
              type: true,
              originalName: true,
            },
            orderBy: { uploadedAt: "asc" },
          },
          client: {
            select: { id: true, fullName: true, phone: true },
          },
          pharmacy: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
    } else {
      // Admin: toutes les commandes TPC
      orders = await db.tPCOrder.findMany({
        include: {
          photos: {
            select: {
              id: true,
              filename: true,
              mimeType: true,
              size: true,
              type: true,
              originalName: true,
            },
          },
          client: { select: { id: true, fullName: true, phone: true } },
          pharmacy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
    }

    return NextResponse.json(
      { orders },
      { headers: { "Cache-Control": "private, no-cache" } }
    );
  } catch (err: any) {
    console.error("[tpc GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tpc
 * Body: { note?: string }
 * - Crée une nouvelle commande TPC (statut "sent")
 * - Les photos d'ordonnance sont uploadées séparément via /api/tpc/[id]/upload-photo
 * - Le client doit être connecté
 * - Rate limiting: 5/min
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    // Clients ET pharmaciens peuvent créer des commandes TPC
    if (session.role !== "client" && session.role !== "pharmacist") {
      return NextResponse.json(
        { error: "Réservé aux utilisateurs connectés" },
        { status: 403 }
      );
    }

    // ── Rate limiting : 5 commandes TPC par minute ──
    const ip = getRateLimitIdentifier(req, session.userId);
    const rl = rateLimit(ip, { windowMs: 60 * 1000, max: 5 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop de demandes. Patientez 1 minute." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    // ── Sanitization anti-XSS ──
    if (containsInjection(rawBody)) {
      console.warn(`[SECURITY] Injection bloquée sur /api/tpc par user: ${session.userId}`);
      return NextResponse.json({ error: "Entrée invalide." }, { status: 400 });
    }
    const { note } = sanitizeRequestBody(rawBody);

    // Note optionnelle — limitée à 1000 caractères
    const cleanNote = note?.trim() || null;
    if (cleanNote && cleanNote.length > 1000) {
      return NextResponse.json(
        { error: "La note est trop longue (1000 caractères max)." },
        { status: 400 }
      );
    }

    const order = await db.tPCOrder.create({
      data: {
        clientId: session.userId,
        status: "sent",
        clientName: session.fullName || null,
        clientPhone: session.phone,
        note: cleanNote,
      },
    });

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (err: any) {
    console.error("[tpc POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
