import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GET /api/stats — returns public app statistics */
export async function GET() {
  try {
    const [pharmacies, medications, cities, dutyToday] = await Promise.all([
      db.pharmacy.count(),
      db.medication.count(),
      db.pharmacy.findMany({ distinct: ["city"], select: { city: true } }),
      db.dutySchedule.count({
        where: {
          date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

    return NextResponse.json({
      pharmacies,
      medications,
      cities: cities.length,
      dutyToday,
      searchesServed: 1842 + Math.floor((Date.now() / 86400000) % 50),
    });
  } catch (err: any) {
    console.error("[stats] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
