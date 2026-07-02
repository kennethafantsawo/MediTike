import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";

/**
 * POST /api/requests/[id]/responses
 * Pharmacist responds to a search request.
 * Body: { available: boolean, price?: number, note?: string }
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.role !== "pharmacist" || !session.pharmacyId) {
      return NextResponse.json({ error: "Réservé aux pharmaciens." }, { status: 403 });
    }
    const { id } = await params;
    const { available, price, note } = await req.json();

    const request = await db.searchRequest.findUnique({ where: { id } });
    if (!request) {
      return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
    }

    const response = await db.searchResponse.create({
      data: {
        requestId: id,
        pharmacistId: session.userId,
        pharmacyId: session.pharmacyId,
        available: !!available,
        price: typeof price === "number" ? price : null,
        note: note?.trim() || null,
      },
      include: { pharmacy: true },
    });

    // Auto-resolve the request when a pharmacist responds
    await db.searchRequest.update({
      where: { id },
      data: { status: "resolved" },
    });

    return NextResponse.json({ ok: true, response });
  } catch (err: any) {
    console.error("[responses POST] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
