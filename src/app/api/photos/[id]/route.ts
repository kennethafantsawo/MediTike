import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { UPLOADS_DIR } from "@/lib/meditike/config";
import fs from "fs/promises";
import path from "path";

/**
 * GET /api/photos/[id]
 * Sert une photo de demande. Sécurisé:
 * - Client: seulement ses propres photos
 * - Pharmacien: seulement les photos des demandes ouvertes
 * - Admin: toutes
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
    const photo = await db.photo.findUnique({
      where: { id },
      include: { request: { select: { clientId: true, status: true } } },
    });

    if (!photo || photo.deletedAt) {
      return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
    }

    // Vérification des permissions
    if (session.role === "client" && photo.request.clientId !== session.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    // Pharmaciens: accès aux demandes "open" ou "responded"
    if (session.role === "pharmacist" && !["open", "responded"].includes(photo.request.status)) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const filePath = path.join(UPLOADS_DIR, photo.filename);
    try {
      const buffer = await fs.readFile(filePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": photo.mimeType,
          "Cache-Control": "private, max-age=300",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (e) {
      return NextResponse.json({ error: "Fichier introuvable sur disque" }, { status: 404 });
    }
  } catch (err: any) {
    console.error("[photo GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
