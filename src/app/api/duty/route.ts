import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMondayUTC } from "@/lib/meditike/helpers";

/**
 * GET /api/duty
 * Retourne les pharmacies de garde pour la semaine courante (ou une semaine spécifique).
 * Query params: ?week=YYYY-MM-DD (lundi)
 *
 * Pas d'auth requise: c'est une info publique.
 * Optimisé : cache en mémoire 5 minutes pour réduire la charge DB.
 */

// Cache en mémoire simple (5 minutes)
const CACHE_TTL = 5 * 60 * 1000; // 5 min
const cache = new Map<string, { data: any; expires: number }>();

function getCached(key: string): any | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  if (entry) cache.delete(key);
  return null;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

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

    // Clé de cache basée sur la semaine
    const cacheKey = `duty_${weekStart.toISOString().slice(0, 10)}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
      });
    }

    // Requêtes parallèles pour optimiser
    const [duties, availableWeeks] = await Promise.all([
      db.pharmacyDuty.findMany({
        where: { weekStart },
        orderBy: [{ name: "asc" }],
        select: {
          id: true,
          name: true,
          address: true,
          phone1: true,
          phone2: true,
          weekStart: true,
          weekEnd: true,
        },
      }),
      db.pharmacyDuty.groupBy({
        by: ["weekStart"],
        orderBy: { weekStart: "asc" },
        take: 30,
      }),
    ]);

    const responseData = {
      weekStart,
      duties,
      total: duties.length,
      availableWeeks: availableWeeks.map((w) => new Date(w.weekStart).toISOString().slice(0, 10)),
    };

    // Mettre en cache
    setCached(cacheKey, responseData);

    return NextResponse.json(responseData, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err: any) {
    console.error("[duty GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
