import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/meditike/admin-guard";
import { getMondayUTC } from "@/lib/meditike/helpers";

/**
 * API d'administration des pharmacies de garde.
 *
 * Routes:
 * - GET    /api/admin/duty?week=YYYY-MM-DD
 *          → Liste les pharmacies de garde pour une semaine donnée (lundi).
 *            Si `week` est absent, utilise la semaine courante.
 *            Inclut les semaines disponibles pour la navigation.
 *
 * - POST   /api/admin/duty
 *          Body: { name, address?, phone1?, phone2?, weekStart (YYYY-MM-DD) }
 *          → Ajoute manuellement une pharmacie de garde pour la semaine.
 *            weekEnd = weekStart + 7 jours (lundi suivant).
 *            Si `weekStart` n'est pas un lundi, on remonte au lundi de cette semaine.
 *
 * - DELETE /api/admin/duty?id=xxx
 *          → Supprime une entrée de garde spécifique.
 *
 * Toutes les routes requièrent un compte admin connecté.
 */

/**
 * Convertit une date quelconque en "lundi 00:00 UTC" de la même semaine.
 * @param input date à normaliser
 * @returns lundi 00:00 UTC
 */
function normalizeToMondayUTC(input: Date): Date {
  const d = new Date(
    Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate())
  );
  const dayOfWeek = d.getUTCDay(); // 0 = dimanche, 1 = lundi
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

/** Parse une chaîne "YYYY-MM-DD" en Date UTC, ou null si invalide. */
function parseDateParam(s: string | null): Date | null {
  if (!s) return null;
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const d = new Date(Date.UTC(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])));
  if (isNaN(d.getTime())) return null;
  return d;
}

/** Formate une Date en YYYY-MM-DD (UTC). */
function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * GET /api/admin/duty?week=YYYY-MM-DD
 * Retourne les pharmacies de garde d'une semaine + les semaines disponibles.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const weekParam = req.nextUrl.searchParams.get("week");
    const parsed = parseDateParam(weekParam);
    const weekStart = parsed ? normalizeToMondayUTC(parsed) : getMondayUTC();

    // Pharmacies de garde pour cette semaine
    const duties = await db.pharmacyDuty.findMany({
      where: { weekStart },
      orderBy: [{ name: "asc" }],
    });

    // Liste des semaines disponibles pour la navigation admin
    const availableWeeks = await db.pharmacyDuty.groupBy({
      by: ["weekStart"],
      orderBy: { weekStart: "asc" },
      take: 52,
    });

    // Détail par semaine (compte) pour faciliter l'affichage admin
    const weekCounts = await db.pharmacyDuty.groupBy({
      by: ["weekStart"],
      _count: { id: true },
      orderBy: { weekStart: "asc" },
      take: 52,
    });

    return NextResponse.json({
      weekStart: toISODate(weekStart),
      duties: duties.map((d) => ({
        id: d.id,
        name: d.name,
        address: d.address,
        phone1: d.phone1,
        phone2: d.phone2,
        weekStart: toISODate(d.weekStart),
        weekEnd: toISODate(d.weekEnd),
        sourceFile: d.sourceFile,
        importedAt: d.importedAt,
        pharmacyId: d.pharmacyId,
      })),
      total: duties.length,
      availableWeeks: availableWeeks.map((w) => toISODate(w.weekStart)),
      weekCounts: weekCounts.map((w) => ({
        weekStart: toISODate(w.weekStart),
        count: w._count.id,
      })),
    });
  } catch (err: any) {
    console.error("[admin duty GET] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/duty
 * Body: { name, address?, phone1?, phone2?, weekStart (YYYY-MM-DD) }
 * Ajoute une pharmacie de garde manuellement.
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await req.json();
    const { name, address, phone1, phone2, weekStart } = body as {
      name?: string;
      address?: string;
      phone1?: string;
      phone2?: string;
      weekStart?: string;
    };

    // Validations
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Le nom de la pharmacie est requis." },
        { status: 400 }
      );
    }
    if (!weekStart || !weekStart.trim()) {
      return NextResponse.json(
        { error: "La semaine de garde est requise." },
        { status: 400 }
      );
    }

    const parsedStart = parseDateParam(weekStart);
    if (!parsedStart) {
      return NextResponse.json(
        { error: "Format de semaine invalide. Attendu : YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const weekStartDate = normalizeToMondayUTC(parsedStart);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setUTCDate(weekStartDate.getUTCDate() + 7);

    // Essayer de lier à une pharmacie enregistrée (par nom, insensible à la casse)
    const existing = await db.pharmacy.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" } },
    });

    // Vérifier qu'une entrée n'existe pas déjà pour cette pharmacie + cette semaine
    const duplicate = await db.pharmacyDuty.findUnique({
      where: {
        name_weekStart: { name: name.trim(), weekStart: weekStartDate },
      },
    });
    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "Cette pharmacie est déjà enregistrée comme pharmacie de garde pour cette semaine.",
        },
        { status: 409 }
      );
    }

    const created = await db.pharmacyDuty.create({
      data: {
        pharmacyId: existing?.id || null,
        name: name.trim(),
        address: address?.trim() || null,
        phone1: phone1?.trim() || null,
        phone2: phone2?.trim() || null,
        weekStart: weekStartDate,
        weekEnd: weekEndDate,
        sourceFile: "ajout-manuel",
      },
    });

    await logAdminAction(
      guard.session.userId,
      "duty_manual_add",
      {
        dutyId: created.id,
        pharmacyName: created.name,
        weekStart: toISODate(weekStartDate),
        linkedPharmacyId: existing?.id || null,
      },
      req
    );

    return NextResponse.json({
      ok: true,
      duty: {
        id: created.id,
        name: created.name,
        address: created.address,
        phone1: created.phone1,
        phone2: created.phone2,
        weekStart: toISODate(created.weekStart),
        weekEnd: toISODate(created.weekEnd),
        sourceFile: created.sourceFile,
        importedAt: created.importedAt,
        pharmacyId: created.pharmacyId,
      },
    });
  } catch (err: any) {
    console.error("[admin duty POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/duty?id=xxx
 * Supprime une entrée de garde spécifique.
 */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID de l'entrée de garde requis." },
        { status: 400 }
      );
    }

    const existing = await db.pharmacyDuty.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Entrée de garde introuvable." },
        { status: 404 }
      );
    }

    await db.pharmacyDuty.delete({ where: { id } });

    await logAdminAction(
      guard.session.userId,
      "duty_manual_delete",
      {
        dutyId: id,
        pharmacyName: existing.name,
        weekStart: toISODate(existing.weekStart),
      },
      req
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[admin duty DELETE] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
