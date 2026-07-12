import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import {
  MAX_PHOTO_SIZE,
  isAllowedPhotoType,
  isAllowedPhotoExtension,
  calculatePhotoDeletionDate,
} from "@/lib/meditike/helpers";
import { storePhoto } from "@/lib/meditike/photo-storage";
import { sanitizeRequestBody, containsInjection } from "@/lib/meditike/sanitizer";
import { rateLimit, getRateLimitIdentifier } from "@/lib/meditike/rate-limit";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    if (session.role !== "client" && session.role !== "pharmacist") {
      return NextResponse.json({ error: "Réservé aux utilisateurs connectés" }, { status: 403 });
    }

    // Rate limiting: 10 uploads/min
    const ip = getRateLimitIdentifier(req, session.userId);
    const rl = rateLimit(ip, { windowMs: 60 * 1000, max: 10 });
    if (!rl.allowed) return NextResponse.json({ error: "Trop d'uploads. Patientez." }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get("photo") as File | null;
    const requestId = formData.get("requestId") as string | null;
    if (!file) return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });

    // Validation taille
    if (file.size > MAX_PHOTO_SIZE) {
      return NextResponse.json({ error: "Photo trop volumineuse (max 2 Mo)" }, { status: 400 });
    }
    if (file.size < 1024) {
      return NextResponse.json({ error: "Fichier trop petit" }, { status: 400 });
    }

    // Validation type MIME (rejette SVG, HTML, etc.)
    if (!isAllowedPhotoType(file.type)) {
      return NextResponse.json({ error: "Type de fichier non autorisé. Utilisez JPG, PNG, WEBP ou HEIC." }, { status: 400 });
    }

    // Validation extension (double vérification)
    if (!isAllowedPhotoExtension(file.name)) {
      return NextResponse.json({ error: "Extension de fichier non autorisée." }, { status: 400 });
    }

    // Vérifier le magic bytes (anti polyglot)
    const buffer = Buffer.from(await file.arrayBuffer());
    const magicBytes = buffer.subarray(0, 8).toString("hex");
    const validMagic: Record<string, string[]> = {
      "image/jpeg": ["ffd8ff"],
      "image/png": ["89504e47"],
      "image/webp": ["52494646"],
    };
    const expectedMagic = validMagic[file.type];
    if (expectedMagic && !expectedMagic.some((m) => magicBytes.startsWith(m))) {
      console.warn(`[SECURITY] Magic bytes mismatch: type=${file.type} bytes=${magicBytes}`);
      return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
    }

    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const safeFilename = `${sha256.slice(0, 16)}${ext}`;

    let requestCreatedAt = new Date();
    let actualRequestId = requestId;

    if (!actualRequestId) {
      const draftRequest = await db.productRequest.create({
        data: {
          clientId: session.userId,
          productName: "__DRAFT__",
          status: "draft",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      actualRequestId = draftRequest.id;
      requestCreatedAt = draftRequest.createdAt;
    } else {
      const request = await db.productRequest.findUnique({ where: { id: actualRequestId } });
      if (!request) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
      // IDOR check: la demande doit appartenir à l'utilisateur connecté
      if (request.clientId !== session.userId) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }
      requestCreatedAt = request.createdAt;
    }

    const deleteAt = calculatePhotoDeletionDate(requestCreatedAt, null);
    await storePhoto(safeFilename, buffer, file.type || "image/jpeg");

    const photo = await db.photo.create({
      data: {
        requestId: actualRequestId,
        filename: safeFilename,
        originalName: file.name.slice(0, 255),
        mimeType: file.type || "image/jpeg",
        size: file.size,
        sha256,
        deleteAt,
      },
    });

    return NextResponse.json({
      ok: true,
      photo: { id: photo.id, requestId: actualRequestId, filename: photo.filename, size: photo.size, deleteAt: photo.deleteAt },
    });
  } catch (err: any) {
    console.error("[photos upload] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
