import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import {
  MAX_PHOTO_SIZE,
  ALLOWED_PHOTO_EXTENSIONS,
  isAllowedPhotoType,
  calculatePhotoDeletionDate,
} from "@/lib/meditike/helpers";
import { UPLOADS_DIR } from "@/lib/meditike/config";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * POST /api/photos/upload
 * Upload d'une photo liée à une demande (le client doit être authentifié).
 * Body: multipart/form-data avec champ "photo" + champ "requestId" (optionnel, si déjà créé)
 *
 * La photo est:
 * - Validée (type MIME, taille max 2 Mo)
 * - Renommée avec un hash SHA256
 * - Stockée dans /uploads/
 * - Enregistrée en DB avec date de suppression calculée
 *
 * Règle suppression:
 * - Si la demande a une réponse: 72h après la première réponse
 * - Sinon: 7 jours après création de la demande
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

    const formData = await req.formData();
    const file = formData.get("photo") as File | null;
    const requestId = formData.get("requestId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });
    }

    // Validation taille
    if (file.size > MAX_PHOTO_SIZE) {
      return NextResponse.json(
        { error: `Photo trop volumineuse. Maximum: 2 Mo. (Reçue: ${(file.size / 1024 / 1024).toFixed(2)} Mo)` },
        { status: 400 }
      );
    }
    if (file.size < 1024) {
      return NextResponse.json(
        { error: "Fichier trop petit (minimum 1 Ko)." },
        { status: 400 }
      );
    }

    // Validation type MIME
    const mimeType = file.type || "";
    if (!isAllowedPhotoType(mimeType)) {
      // Fallback: check extension
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_PHOTO_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          {
            error:
              "Type de fichier non supporté. Utilisez JPG, PNG, WEBP ou HEIC.",
          },
          { status: 400 }
        );
      }
    }

    // Lecture du contenu
    const buffer = Buffer.from(await file.arrayBuffer());
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");

    // Génération du nom de fichier sécurisé
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const safeFilename = `${sha256.slice(0, 16)}${ext}`;
    const uploadPath = path.join(UPLOADS_DIR, safeFilename);

    // S'assurer que le dossier uploads existe
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Écrire le fichier
    await fs.writeFile(uploadPath, buffer);

    // Si requestId fourni: lier la photo à la demande existante
    // Sinon: la photo sera liée lors de la création de la demande (requestId temporairement null)
    let requestCreatedAt = new Date();
    let firstResponseAt: Date | null = null;

    // Pour MVP: la photo est uploadée AVANT la création de la demande.
    // On stocke donc avec requestId="PENDING_{userId}" en attendant que la demande soit créée.
    // La route /api/requests se chargera de relier les photos.
    // On contourne la FK en utilisant un ID de demande bidon si requestId non fourni.

    const tempRequestId = requestId || `PENDING_${session.userId}`;

    // Si pas de requestId réel, on doit créer une fausse demande temporaire
    // Ou mieux: on ne crée pas la photo en DB maintenant, on la garde juste sur disque
    // et on retourne le filename pour que le client l'envoie avec la création de demande.

    // Approche simple: on crée la demande "en attente" tout de suite pour pouvoir lier la photo
    let actualRequestId = requestId;

    if (!actualRequestId) {
      // Créer une demande en statut "draft" qu'on complètera ensuite
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
      const request = await db.productRequest.findUnique({
        where: { id: actualRequestId },
        include: { responses: { orderBy: { createdAt: "asc" }, take: 1 } },
      });
      if (!request) {
        await fs.unlink(uploadPath).catch(() => {});
        return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
      }
      if (request.clientId !== session.userId) {
        await fs.unlink(uploadPath).catch(() => {});
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }
      requestCreatedAt = request.createdAt;
      firstResponseAt = request.responses[0]?.createdAt || null;
    }

    const deleteAt = calculatePhotoDeletionDate(requestCreatedAt, firstResponseAt);

    const photo = await db.photo.create({
      data: {
        requestId: actualRequestId,
        filename: safeFilename,
        originalName: file.name.slice(0, 255),
        mimeType: mimeType || "image/jpeg",
        size: file.size,
        sha256,
        deleteAt,
      },
    });

    return NextResponse.json({
      ok: true,
      photo: {
        id: photo.id,
        requestId: actualRequestId,
        filename: photo.filename,
        size: photo.size,
        deleteAt: photo.deleteAt,
      },
    });
  } catch (err: any) {
    console.error("[photos upload] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
