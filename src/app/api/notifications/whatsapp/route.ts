import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { normalizePhone, formatPrice } from "@/lib/meditike/helpers";

/**
 * POST /api/notifications/whatsapp
 * Body: { responseId: string }
 *
 * Génère un lien WhatsApp pré-rempli contenant le résumé de la réponse
 * d'une pharmacie à une demande client. Le client clique sur ce lien pour
 * ouvrir WhatsApp avec le message déjà prêt à être envoyé à la pharmacie.
 *
 * MVP : on utilise un lien WhatsApp direct (pas l'API Business) — pas de
 * configuration de token ni de webhook, juste une URL wa.me.
 *
 * Sécurité :
 *  - la session doit être un client connecté ;
 *  - la réponse doit appartenir à une demande créée par ce client ;
 *  - la pharmacie doit avoir un numéro WhatsApp.
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

    const body = await req.json();
    const { responseId } = body;
    if (!responseId || typeof responseId !== "string") {
      return NextResponse.json(
        { error: "responseId est requis." },
        { status: 400 }
      );
    }

    // ── Récupération de la réponse + demande + pharmacie ──────────
    const response = await db.productResponse.findUnique({
      where: { id: responseId },
      include: {
        request: {
          select: { id: true, clientId: true, productName: true },
        },
        pharmacy: {
          select: { id: true, name: true, whatsapp: true },
        },
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: "Réponse introuvable." },
        { status: 404 }
      );
    }

    // Vérifier que la réponse appartient à une demande du client connecté.
    if (response.request.clientId !== session.userId) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    // La pharmacie doit avoir un numéro WhatsApp.
    if (!response.pharmacy.whatsapp) {
      return NextResponse.json(
        { error: "Cette pharmacie n'a pas de numéro WhatsApp." },
        { status: 400 }
      );
    }

    // ── Construction du message pré-rempli ────────────────────────
    // ⚠️ SÉCURITÉ : Ne JAMAIS inclure de données médicales dans l'URL WhatsApp
    // (le nom du médicament, les notes, etc. sont des données de santé)
    const pharmacyName = response.pharmacy.name;

    const parts: string[] = [
      `Bonjour, la pharmacie ${pharmacyName} a répondu à votre demande sur MediTike.`,
      response.available ? "Le produit est disponible." : "Le produit n'est pas disponible.",
    ];
    // PAS de prix, PAS de note, PAS de nom de médicament dans l'URL
    parts.push("Connectez-vous sur MediTike pour voir les détails.");
    const message = parts.join(" ");

    // ── Construction de l'URL WhatsApp ────────────────────────────
    // wa.me attend le numéro au format international sans le "+".
    const whatsappNumber = normalizePhone(
      response.pharmacy.whatsapp,
      "228"
    ).replace("+", "");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    return NextResponse.json({ ok: true, whatsappUrl });
  } catch (err: any) {
    console.error("[whatsapp notification POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
