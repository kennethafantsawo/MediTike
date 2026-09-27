import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { storePhoto } from "@/lib/meditike/photo-storage";
import {
  isAllowedPhotoType,
  isAllowedPhotoExtension,
  MAX_PHOTO_SIZE,
} from "@/lib/meditike/helpers";
import { rateLimit, getRateLimitIdentifier } from "@/lib/meditike/rate-limit";
import crypto from "crypto";

/**
 * Valide les magic bytes d'un fichier image (anti-upload malveillant).
 */
function checkMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return mimeType === "image/jpeg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return mimeType === "image/png";
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return mimeType === "image/webp";
  }

  return false;
}

function getExtensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return ".jpg";
  }
}

/**
 * POST /api/tpc/[id]/upload-payment
 * - Upload capture d'écran du paiement (max 1 Mo, jpg/png/webp)
 * - Validation MIME + extension + magic bytes
 * - Met à jour la commande TPC avec paymentProofFilename, paymentProofMime, paymentProofSize
 * - Rate limiting: 5/min
 * - JAMAIS supprimée (pas de deleteAt)
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
    if (session.role !== "client" && session.role !== "pharmacist") {
      return NextResponse.json(
        { error: "Réservé aux clients" },
        { status: 403 }
      );
    }

    // ── Rate limiting : 5 uploads/minute ──
    const ip = getRateLimitIdentifier(req, session.userId);
    const rl = rateLimit(ip, { windowMs: 60 * 1000, max: 5 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop d'uploads. Patientez 1 minute." },
        { status: 429 }
      );
    }

    const { id } = await params;

    const order = await db.tPCOrder.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Commande TPC introuvable" }, { status: 404 });
    }
    if (session.role === "client" && order.clientId !== session.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    // On ne peut uploader une preuve de paiement que si statut "available"
    if (order.status !== "available") {
      return NextResponse.json(
        { error: "Cette commande n'attend pas de paiement" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("photo");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    // ── Validation taille ──
    if (file.size > MAX_PHOTO_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 1 Mo)" },
        { status: 400 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Fichier vide" }, { status: 400 });
    }

    // ── Validation type MIME ──
    if (!isAllowedPhotoType(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé (jpg, png, webp uniquement)" },
        { status: 400 }
      );
    }

    // ── Validation extension ──
    if (!isAllowedPhotoExtension(file.name)) {
      return NextResponse.json(
        { error: "Extension non autorisée" },
        { status: 400 }
      );
    }

    // ── Lecture du buffer ──
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── Validation magic bytes ──
    if (!checkMagicBytes(buffer, file.type)) {
      console.warn(
        `[SECURITY] Magic bytes invalides sur /api/tpc/[id]/upload-payment par user ${session.userId}`
      );
      return NextResponse.json(
        { error: "Le fichier ne correspond pas à une image valide" },
        { status: 400 }
      );
    }

    // ── Calcul hash SHA256 ──
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    const ext = getExtensionForMime(file.type);
    const filename = `tpc-pay-${sha256.substring(0, 32)}${ext}`;

    // ── Stockage ──
    await storePhoto(filename, buffer, file.type);

    // ── Mise à jour de la commande TPC avec la preuve ──
    const updated = await db.tPCOrder.update({
      where: { id },
      data: {
        paymentProofFilename: filename,
        paymentProofMime: file.type,
        paymentProofSize: file.size,
      },
    });

    return NextResponse.json({
      ok: true,
      order: {
        id: updated.id,
        paymentProofFilename: updated.paymentProofFilename,
        paymentProofMime: updated.paymentProofMime,
        paymentProofSize: updated.paymentProofSize,
      },
    });
  } catch (err: any) {
    console.error("[tpc/[id]/upload-payment] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
