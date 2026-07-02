import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { getPhoto } from "@/lib/meditike/photo-storage";

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

    // Récupérer la photo depuis le stockage (Supabase ou local)
    const result = await getPhoto(photo.filename);
    if (!result) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": result.mimeType,
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    console.error("[photo GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
