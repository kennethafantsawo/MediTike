import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { getPhoto } from "@/lib/meditike/photo-storage";

/**
 * GET /api/tpc-photos/[id]
 * Sert une photo TPC (ordonnance ou preuve paiement).
 * - Client: seulement ses propres photos
 * - Pharmacien: photos des commandes TPC (assignées ou en attente)
 * - Admin: toutes
 *
 * Les photos TPC ne sont JAMAIS supprimées (pas de deleteAt).
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

    // Une photo TPC peut être soit une entrée TPCPhoto (ordonnance),
    // soit servir la preuve de paiement stockée comme paymentProofFilename
    // sur la commande. On gère les deux cas via ?type=payment.
    const { searchParams } = new URL(req.url);
    const isPaymentProof = searchParams.get("type") === "payment";

    if (isPaymentProof) {
      // ── Sert la preuve de paiement (filename stocké sur TPCOrder) ──
      // `id` est l'ID de la commande TPC
      const order = await db.tPCOrder.findUnique({
        where: { id },
        select: {
          id: true,
          clientId: true,
          pharmacyId: true,
          pharmacistId: true,
          status: true,
          paymentProofFilename: true,
          paymentProofMime: true,
        },
      });

      if (!order || !order.paymentProofFilename) {
        return NextResponse.json(
          { error: "Preuve de paiement introuvable" },
          { status: 404 }
        );
      }

      // Vérification ownership
      if (session.role === "client" && order.clientId !== session.userId) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }

      const result = await getPhoto(order.paymentProofFilename);
      if (!result) {
        return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
      }

      return new NextResponse(result.buffer as unknown as BodyInit, {
        headers: {
          "Content-Type": result.mimeType,
          "Cache-Control": "private, max-age=300",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // ── Sert une photo d'ordonnance (TPCPhoto) ──
    const photo = await db.tPCPhoto.findUnique({
      where: { id },
      include: {
        tpcOrder: {
          select: {
            id: true,
            clientId: true,
            pharmacyId: true,
            pharmacistId: true,
            status: true,
          },
        },
      },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo introuvable" }, { status: 404 });
    }

    // Vérification ownership
    if (session.role === "client" && photo.tpcOrder.clientId !== session.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    // Pharmaciens: accès aux photos TPC (ils peuvent traiter n'importe quelle commande)
    // Admin: accès à tout

    const result = await getPhoto(photo.filename);
    if (!result) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
    }

    return new NextResponse(result.buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": result.mimeType,
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    console.error("[tpc-photos/[id] GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
