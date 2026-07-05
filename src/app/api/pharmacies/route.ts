import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GET /api/pharmacies — list all pharmacies, optional ?city= filter */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const district = searchParams.get("district");
    const q = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    const where: any = {};
    if (city && city !== "all") where.city = { contains: city };
    if (district && district !== "all") where.district = { contains: district };
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { address: { contains: q } },
        { district: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const pharmacies = await db.pharmacy.findMany({
      where,
      take: limit,
      orderBy: [{ isOpen24h: "desc" }, { name: "asc" }],
      include: {
        _count: { select: { stocks: { where: { inStock: true } } } },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dutyMap = new Map<string, { isDay: boolean; startTime: string; endTime: string }>();
    const duties = await db.dutySchedule.findMany({ where: { date: today } });
    for (const d of duties) {
      dutyMap.set(d.pharmacyId, { isDay: d.isDay, startTime: d.startTime, endTime: d.endTime });
    }

    const result = pharmacies.map((p) => {
      const duty = dutyMap.get(p.id);
      return {
        id: p.id,
        name: p.name,
        phone: p.phone,
        whatsapp: p.whatsapp,
        address: p.address,
        city: p.city,
        district: p.district,
        latitude: p.latitude,
        longitude: p.longitude,
        openingHours: p.openingHours,
        isOpen24h: p.isOpen24h,
        inStockCount: (p as any)._count?.stocks || 0,
        onDuty: !!duty,
        dutyShift: duty,
      };
    });

    return NextResponse.json({ pharmacies: result, total: result.length });
  } catch (err: any) {
    console.error("[pharmacies] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
