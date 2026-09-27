import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { sanitizeRequestBody, containsInjection } from "@/lib/meditike/sanitizer";
import crypto from "crypto";

/**
 * GET /api/tpc/[id]
 * - Retourne une commande TPC spécifique avec ses photos
 * - Vérifie ownership (client = propriétaire, pharmacien = assigné, admin = tous)
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
    const order = await db.tPCOrder.findUnique({
      where: { id },
      include: {
        photos: {
          select: {
            id: true,
            filename: true,
            mimeType: true,
            size: true,
            type: true,
            originalName: true,
            uploadedAt: true,
          },
          orderBy: { uploadedAt: "asc" },
        },
        client: { select: { id: true, fullName: true, phone: true } },
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

    if (!order) {
      return NextResponse.json({ error: "Commande TPC introuvable" }, { status: 404 });
    }

    // Vérification des permissions
    if (session.role === "client" && order.clientId !== session.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    // Pharmacien: accès à toutes les commandes TPC (peut les traiter)
    // Admin: accès à toutes

    return NextResponse.json(
      { order },
      { headers: { "Cache-Control": "private, no-cache" } }
    );
  } catch (err: any) {
    console.error("[tpc/[id] GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tpc/[id]
 * Body: { action: "confirm-availability" | "submit-payment" | "confirm-payment" |
 *        "complete" | "reject", ... }
 *
 * - confirm-availability (pharmacien) → status "available", assigne pharmacien + pharmacie
 * - submit-payment (patient) → status "awaiting_payment"
 * - confirm-payment (pharmacien) → status "paid", génère numéro de reçu
 * - complete (pharmacien) → status "completed", completedAt timestamp
 * - reject (pharmacien) → status "rejected"
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const rawBody = await req.json();
    if (containsInjection(rawBody)) {
      console.warn(`[SECURITY] Injection bloquée sur /api/tpc/[id] par user: ${session.userId}`);
      return NextResponse.json({ error: "Entrée invalide." }, { status: 400 });
    }
    const body = sanitizeRequestBody(rawBody);
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Action manquante" }, { status: 400 });
    }

    const order = await db.tPCOrder.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Commande TPC introuvable" }, { status: 404 });
    }

    // ── Action: confirm-availability (pharmacien) ──
    if (action === "confirm-availability") {
      if (session.role !== "pharmacist") {
        return NextResponse.json({ error: "Réservé aux pharmaciens" }, { status: 403 });
      }
      if (!session.pharmacyId) {
        return NextResponse.json(
          { error: "Vous n'êtes pas rattaché à une pharmacie" },
          { status: 400 }
        );
      }
      if (order.status !== "sent") {
        return NextResponse.json(
          { error: "Cette commande n'est plus en attente de confirmation" },
          { status: 400 }
        );
      }

      const totalAmount = parseFloat(body.totalAmount);
      if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
        return NextResponse.json(
          { error: "Montant total invalide" },
          { status: 400 }
        );
      }
      if (totalAmount > 10_000_000) {
        return NextResponse.json(
          { error: "Montant trop élevé (max 10 000 000 FCFA)" },
          { status: 400 }
        );
      }

      const pharmacyNote = body.pharmacyNote?.trim() || null;
      if (pharmacyNote && pharmacyNote.length > 2000) {
        return NextResponse.json(
          { error: "Note pharmacie trop longue (2000 caractères max)" },
          { status: 400 }
        );
      }

      const updated = await db.tPCOrder.update({
        where: { id },
        data: {
          status: "available",
          totalAmount,
          pharmacyNote,
          pharmacyId: session.pharmacyId,
          pharmacistId: session.userId,
          confirmedAt: new Date(),
        },
      });

      return NextResponse.json({
        ok: true,
        order: {
          id: updated.id,
          status: updated.status,
          totalAmount: updated.totalAmount,
          confirmedAt: updated.confirmedAt,
        },
      });
    }

    // ── Action: submit-payment (patient) ──
    if (action === "submit-payment") {
      if (session.role !== "client" && session.role !== "pharmacist") {
        return NextResponse.json({ error: "Réservé aux clients" }, { status: 403 });
      }
      if (order.clientId !== session.userId) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }
      if (order.status !== "available") {
        return NextResponse.json(
          { error: "Cette commande n'est pas en attente de paiement" },
          { status: 400 }
        );
      }

      const paymentMethod = body.paymentMethod;
      if (!["mobile_money", "cash"].includes(paymentMethod)) {
        return NextResponse.json(
          { error: "Méthode de paiement invalide" },
          { status: 400 }
        );
      }

      const updateData: any = {
        status: "awaiting_payment",
        paymentMethod,
      };

      // Si Mobile Money, une preuve est requise (uploadée séparément via upload-payment)
      if (paymentMethod === "mobile_money") {
        // La preuve doit être uploadée via /api/tpc/[id]/upload-payment AVANT
        // Ici on accepte paymentProofFilename optionnel (uploadé juste avant)
        if (body.paymentProofFilename) {
          updateData.paymentProofFilename = body.paymentProofFilename;
          updateData.paymentProofMime = body.paymentProofMime || null;
          updateData.paymentProofSize = body.paymentProofSize || null;
        } else if (!order.paymentProofFilename) {
          return NextResponse.json(
            { error: "Preuve de paiement requise pour Mobile Money" },
            { status: 400 }
          );
        }
      }

      const updated = await db.tPCOrder.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        ok: true,
        order: {
          id: updated.id,
          status: updated.status,
          paymentMethod: updated.paymentMethod,
        },
      });
    }

    // ── Action: confirm-payment (pharmacien) → status "paid" + numéro de reçu ──
    if (action === "confirm-payment") {
      if (session.role !== "pharmacist") {
        return NextResponse.json({ error: "Réservé aux pharmaciens" }, { status: 403 });
      }
      if (order.status !== "awaiting_payment") {
        return NextResponse.json(
          { error: "Cette commande n'est pas en attente de paiement" },
          { status: 400 }
        );
      }
      if (!order.totalAmount) {
        return NextResponse.json(
          { error: "Montant total manquant" },
          { status: 400 }
        );
      }

      // ── Génère numéro de reçu unique: REC-{année}-{compteur sur 4 chiffres} ──
      const year = new Date().getFullYear();
      const prefix = `REC-${year}-`;
      const lastReceipt = await db.tPCOrder.findFirst({
        where: { receiptNumber: { startsWith: prefix } },
        orderBy: { receiptNumber: "desc" },
        select: { receiptNumber: true },
      });

      let nextNum = 1;
      if (lastReceipt?.receiptNumber) {
        const lastNum = parseInt(
          lastReceipt.receiptNumber.replace(prefix, ""),
          10
        );
        if (!isNaN(lastNum)) nextNum = lastNum + 1;
      }
      const receiptNumber = `${prefix}${String(nextNum).padStart(4, "0")}`;

      const updated = await db.tPCOrder.update({
        where: { id },
        data: {
          status: "paid",
          paidAt: new Date(),
          receiptNumber,
        },
      });

      return NextResponse.json({
        ok: true,
        order: {
          id: updated.id,
          status: updated.status,
          receiptNumber: updated.receiptNumber,
          paidAt: updated.paidAt,
          totalAmount: updated.totalAmount,
        },
      });
    }

    // ── Action: complete (pharmacien) → status "completed" + completedAt ──
    if (action === "complete") {
      if (session.role !== "pharmacist") {
        return NextResponse.json({ error: "Réservé aux pharmaciens" }, { status: 403 });
      }
      if (order.status !== "paid") {
        return NextResponse.json(
          { error: "Le paiement doit être confirmé avant de générer le reçu" },
          { status: 400 }
        );
      }
      if (!order.receiptNumber) {
        return NextResponse.json(
          { error: "Numéro de reçu manquant" },
          { status: 400 }
        );
      }

      const updated = await db.tPCOrder.update({
        where: { id },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        ok: true,
        order: {
          id: updated.id,
          status: updated.status,
          receiptNumber: updated.receiptNumber,
          completedAt: updated.completedAt,
          totalAmount: updated.totalAmount,
          paymentMethod: updated.paymentMethod,
          clientName: updated.clientName,
          pharmacyNote: updated.pharmacyNote,
        },
      });
    }

    // ── Action: reject (pharmacien) → status "rejected" ──
    if (action === "reject") {
      if (session.role !== "pharmacist") {
        return NextResponse.json({ error: "Réservé aux pharmaciens" }, { status: 403 });
      }
      if (!["sent", "available"].includes(order.status)) {
        return NextResponse.json(
          { error: "Cette commande ne peut plus être refusée" },
          { status: 400 }
        );
      }

      const reason = body.reason?.trim() || null;
      if (reason && reason.length > 1000) {
        return NextResponse.json(
          { error: "Raison trop longue (1000 caractères max)" },
          { status: 400 }
        );
      }

      const updated = await db.tPCOrder.update({
        where: { id },
        data: {
          status: "rejected",
          pharmacyNote: reason
            ? `Refus: ${reason}`
            : order.pharmacyNote,
          pharmacyId: session.pharmacyId,
          pharmacistId: session.userId,
        },
      });

      return NextResponse.json({
        ok: true,
        order: { id: updated.id, status: updated.status },
      });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch (err: any) {
    console.error("[tpc/[id] PATCH] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Helper local pour utilisation dans d'autres modules (signature numérique du reçu)
export function computeReceiptSignature(receiptNumber: string): string {
  const secret =
    process.env.MEDITIKE_SESSION_SECRET ||
    "meditike-dev-secret-change-in-production-please-use-strong-secret-2024";
  return crypto
    .createHmac("sha256", secret)
    .update(receiptNumber)
    .digest("hex")
    .substring(0, 16)
    .toUpperCase();
}
