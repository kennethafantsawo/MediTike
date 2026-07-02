import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/duty
 * Returns pharmacies on duty today (and optionally for a specific date).
 */
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const duties = await db.dutySchedule.findMany({
      where: { date: today },
      include: { pharmacy: true },
      orderBy: [{ isDay: "desc" }, { startTime: "asc" }],
    });

    const result = duties.map((d) => ({
      id: d.id,
      date: d.date,
      startTime: d.startTime,
      endTime: d.endTime,
      isDay: d.isDay,
      pharmacy: {
        id: d.pharmacy.id,
        name: d.pharmacy.name,
        phone: d.pharmacy.phone,
        whatsapp: d.pharmacy.whatsapp,
        address: d.pharmacy.address,
        city: d.pharmacy.city,
        district: d.pharmacy.district,
        openingHours: d.pharmacy.openingHours,
        isOpen24h: d.pharmacy.isOpen24h,
      },
    }));

    // Also include 24/7 pharmacies as always on duty
    const open24 = await db.pharmacy.findMany({
      where: { isOpen24h: true, NOT: { id: { in: duties.map((d) => d.pharmacyId) } } },
    });

    for (const p of open24) {
      result.push({
        id: `static-${p.id}`,
        date: today,
        startTime: "00:00",
        endTime: "23:59",
        isDay: true,
        pharmacy: {
          id: p.id,
          name: p.name,
          phone: p.phone,
          whatsapp: p.whatsapp,
          address: p.address,
          city: p.city,
          district: p.district,
          openingHours: p.openingHours,
          isOpen24h: p.isOpen24h,
        },
      });
    }

    return NextResponse.json({ date: today, duties: result, total: result.length });
  } catch (err: any) {
    console.error("[duty] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
