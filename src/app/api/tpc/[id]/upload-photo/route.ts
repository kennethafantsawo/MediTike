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
 * Retourne true si le buffer correspond à un vrai JPEG, PNG ou WebP.
 */
function checkMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return mimeType === "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
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

  // WebP: RIFF ... WEBP
  if (
    buffer[0] === 0x52 && // 'R'
    buffer[1] === 0x49 && // 'I'
    buffer[2] === 0x46 && // 'F'
    buffer[3] === 0x46 && // 'F'
    buffer[8] === 0x57 && // 'W'
    buffer[9] === 0x45 && // 'E'
    buffer[10] === 0x42 && // 'B'
    buffer[11] === 0x50 // 'P'
  ) {
    return mimeType === "image/webp";
  }

  return false;
}

/**
 * Déduit l'extension à partir du type MIME.
 */
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
 * POST /api/tpc/[id]/upload-photo
 * - Upload photo ordonnance (max 1 Mo, jpg/png/webp)
 * - Validation MIME + extension + magic bytes
 * - Stocke dans /uploads/ avec hash SHA256
 * - Crée entrée TPCPhoto (type "ordonnance")
 * - Rate limiting: 10/min
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
        { error: "Réservé aux utilisateurs connectés" },
        { status: 403 }
      );
    }

    // ── Rate limiting : 10 uploads/minute ──
    const ip = getRateLimitIdentifier(req, session.userId);
    const rl = rateLimit(ip, { windowMs: 60 * 1000, max: 10 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Trop d'uploads. Patientez 1 minute." },
        { status: 429 }
      );
    }

    const { id } = await params;

    // Vérifier que la commande TPC existe et appartient au client
    const order = await db.tPCOrder.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Commande TPC introuvable" }, { status: 404 });
    }
    if (session.role === "client" && order.clientId !== session.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    // On ne peut ajouter des photos d'ordonnance qu'en statut "sent"
    if (order.status !== "sent") {
      return NextResponse.json(
        { error: "Vous ne pouvez plus ajouter de photos à cette commande" },
        { status: 400 }
      );
    }

    // Limite: 5 photos d'ordonnance max par commande TPC
    const existingCount = await db.tPCPhoto.count({
      where: { tpcOrderId: id, type: "ordonnance" },
    });
    if (existingCount >= 5) {
      return NextResponse.json(
        { error: "Maximum 5 photos d'ordonnance par commande" },
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
        `[SECURITY] Magic bytes invalides sur /api/tpc/[id]/upload-photo par user ${session.userId}`
      );
      return NextResponse.json(
        { error: "Le fichier ne correspond pas à une image valide" },
        { status: 400 }
      );
    }

    // ── Calcul hash SHA256 (nommage + intégrité) ──
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    const ext = getExtensionForMime(file.type);
    const filename = `tpc-${sha256.substring(0, 32)}${ext}`;

    // ── Stockage (Supabase ou local selon config) ──
    await storePhoto(filename, buffer, file.type);

    // ── Création entrée TPCPhoto ──
    const photo = await db.tPCPhoto.create({
      data: {
        tpcOrderId: id,
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        type: "ordonnance",
      },
    });

    return NextResponse.json({
      ok: true,
      photo: {
        id: photo.id,
        filename: photo.filename,
        mimeType: photo.mimeType,
        size: photo.size,
        type: photo.type,
        originalName: photo.originalName,
      },
    });
  } catch (err: any) {
    console.error("[tpc/[id]/upload-photo] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
