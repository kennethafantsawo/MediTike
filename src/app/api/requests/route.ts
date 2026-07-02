import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/meditike/session";
import { normalizeSearch } from "@/lib/meditike/helpers";

/**
 * GET /api/requests
 * Returns:
 *  - For client: their own requests with responses
 *  - For pharmacist: all pending requests (so they can respond)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    let requests;
    if (session.role === "pharmacist") {
      // Pharmacists see all active requests
      requests = await db.searchRequest.findMany({
        where: { status: "pending" },
        include: { responses: { include: { pharmacy: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    } else {
      // Clients see their own
      requests = await db.searchRequest.findMany({
        where: { clientId: session.userId },
        include: { responses: { include: { pharmacy: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }

    return NextResponse.json({ requests });
  } catch (err: any) {
    console.error("[requests GET] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}

/**
 * POST /api/requests
 * Body: { query: string }
 * Client creates a new search request → visible to all pharmacists.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.role !== "client") {
      return NextResponse.json({ error: "Réservé aux patients." }, { status: 403 });
    }

    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: "Veuillez saisir un médicament." }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const request = await db.searchRequest.create({
      data: {
        clientId: session.userId,
        query: query.trim(),
        normalizedQuery: normalizeSearch(query),
        status: "pending",
        clientName: session.fullName,
        clientPhone: session.phone,
        expiresAt,
      },
    });
    return NextResponse.json({ ok: true, request });
  } catch (err: any) {
    console.error("[requests POST] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
