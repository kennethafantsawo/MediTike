import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizeSearch } from "@/lib/meditike/helpers";

/**
 * GET /api/medications?q=...&category=...
 * Returns medications matching the query (or all if no query).
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 100);

    const where: any = {};
    if (q) {
      const nq = normalizeSearch(q);
      where.OR = [
        { normalizedName: { contains: nq } },
        { genericName: { contains: nq } },
        { name: { contains: q } },
      ];
    }
    if (category && category !== "all") {
      where.category = category;
    }

    const medications = await db.medication.findMany({
      where,
      take: limit,
      orderBy: { name: "asc" },
    });

    // Distinct categories for filters
    const categories = await db.medication.findMany({
      distinct: ["category"],
      select: { category: true },
      where: { category: { not: null } },
    });

    return NextResponse.json({
      medications,
      categories: categories.map((c) => c.category).filter(Boolean),
      total: medications.length,
    });
  } catch (err: any) {
    console.error("[medications] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}

/**
 * POST /api/medications/search
 * Body: { query: string }
 * Returns: list of pharmacies with their stock status for medications matching the query.
 */
export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: "Veuillez saisir un médicament à rechercher." }, { status: 400 });
    }

    const nq = normalizeSearch(query);

    // Find matching medications
    const matches = await db.medication.findMany({
      where: {
        OR: [
          { normalizedName: { contains: nq } },
          { genericName: { contains: nq } },
          { name: { contains: query } },
        ],
      },
      take: 20,
    });

    if (matches.length === 0) {
      return NextResponse.json({
        query,
        medications: [],
        pharmacies: [],
        message: "Aucun médicament ne correspond à votre recherche.",
      });
    }

    const medIds = matches.map((m) => m.id);

    // Find all stock entries for those medications, joined with pharmacies
    const stocks = await db.pharmacyStock.findMany({
      where: { medicationId: { in: medIds }, inStock: true },
      include: { pharmacy: true, medication: true },
    });

    // Group by pharmacy
    const pharmacyMap = new Map<string, any>();
    for (const s of stocks) {
      if (!pharmacyMap.has(s.pharmacyId)) {
        pharmacyMap.set(s.pharmacyId, {
          pharmacy: {
            id: s.pharmacy.id,
            name: s.pharmacy.name,
            phone: s.pharmacy.phone,
            whatsapp: s.pharmacy.whatsapp,
            address: s.pharmacy.address,
            city: s.pharmacy.city,
            district: s.pharmacy.district,
            openingHours: s.pharmacy.openingHours,
            isOpen24h: s.pharmacy.isOpen24h,
          },
          matches: [],
        });
      }
      pharmacyMap.get(s.pharmacyId)!.matches.push({
        medication: {
          id: s.medication.id,
          name: s.medication.name,
          genericName: s.medication.genericName,
          category: s.medication.category,
          form: s.medication.form,
          dosage: s.medication.dosage,
        },
        price: s.price,
        lastVerified: s.lastVerified,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const duties = await db.dutySchedule.findMany({ where: { date: today } });
    const dutySet = new Set(duties.map((d) => d.pharmacyId));

    const pharmaciesArr = Array.from(pharmacyMap.values()).map((p) => ({
      ...p,
      onDuty: dutySet.has(p.pharmacy.id),
    }));

    // Sort: on duty first, then 24h, then alphabetical
    pharmaciesArr.sort((a, b) => {
      if (a.onDuty !== b.onDuty) return a.onDuty ? -1 : 1;
      if (a.pharmacy.isOpen24h !== b.pharmacy.isOpen24h) return a.pharmacy.isOpen24h ? -1 : 1;
      return a.pharmacy.name.localeCompare(b.pharmacy.name);
    });

    return NextResponse.json({
      query,
      medications: matches,
      pharmacies: pharmaciesArr,
      totalMatches: pharmaciesArr.length,
    });
  } catch (err: any) {
    console.error("[medications/search] error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
