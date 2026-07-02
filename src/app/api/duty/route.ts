import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMondayUTC } from "@/lib/meditike/helpers";

/**
 * GET /api/duty
 * Retourne les pharmacies de garde pour la semaine courante (ou une semaine spécifique).
 * Query params: ?week=YYYY-MM-DD (lundi)
 *
 * Pas d'auth requise: c'est une info publique.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const weekParam = url.searchParams.get("week");

    let weekStart: Date;
    if (weekParam) {
      weekStart = new Date(weekParam);
      if (isNaN(weekStart.getTime())) {
        weekStart = getMondayUTC();
      }
    } else {
      weekStart = getMondayUTC();
    }
    weekStart.setUTCHours(0, 0, 0, 0);

    const duties = await db.pharmacyDuty.findMany({
      where: { weekStart },
      orderBy: [{ name: "asc" }],
    });

    // Compter les semaines disponibles pour navigation
    const availableWeeks = await db.pharmacyDuty.groupBy({
      by: ["weekStart"],
      orderBy: { weekStart: "asc" },
      take: 30,
    });

    return NextResponse.json({
      weekStart,
      duties,
      total: duties.length,
      availableWeeks: availableWeeks.map((w) => w.weekStart),
    });
  } catch (err: any) {
    console.error("[duty GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
