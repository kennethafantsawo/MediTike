import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/meditike/admin-guard";
import { getMondayUTC } from "@/lib/meditike/helpers";

/**
 * GET /api/admin/stats — tableau de bord admin
 * - Compteurs globaux (clients, pharmaciens, pharmacies, demandes, réponses)
 * - Demandes par statut
 * - Demandes 7 derniers jours
 * - Stockage photos
 */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const [
    clientsCount,
    pharmacistsCount,
    pharmaciesCount,
    activePharmaciesCount,
    requestsOpen,
    requestsResponded,
    requestsExpired,
    requestsClosed,
    responsesCount,
    photosActive,
    photosDeleted,
    dutyWeeksCount,
    currentWeekDutyCount,
    auditLogsCount,
  ] = await Promise.all([
    db.user.count({ where: { role: "client" } }),
    db.user.count({ where: { role: "pharmacist" } }),
    db.pharmacy.count(),
    db.pharmacy.count({ where: { isActive: true } }),
    db.productRequest.count({ where: { status: "open" } }),
    db.productRequest.count({ where: { status: "responded" } }),
    db.productRequest.count({ where: { status: "expired" } }),
    db.productRequest.count({ where: { status: "closed" } }),
    db.productResponse.count(),
    db.photo.count({ where: { deletedAt: null } }),
    db.photo.count({ where: { deletedAt: { not: null } } }),
    db.pharmacyDuty.groupBy({ by: ["weekStart"] }),
    db.pharmacyDuty.count({ where: { weekStart: getMondayUTC() } }),
    db.auditLog.count(),
  ]);

  // Demandes 7 derniers jours (par jour)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentRequests = await db.productRequest.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: { not: "draft" },
    },
    select: { createdAt: true, status: true },
  });

  const byDay: Record<string, { total: number; open: number; responded: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    byDay[key] = { total: 0, open: 0, responded: 0 };
  }
  for (const r of recentRequests) {
    const key = r.createdAt.toISOString().slice(0, 10);
    if (byDay[key]) {
      byDay[key].total++;
      if (r.status === "open") byDay[key].open++;
      if (r.status === "responded") byDay[key].responded++;
    }
  }

  // Top 5 pharmacies par nombre de réponses
  const topPharmacies = await db.pharmacy.findMany({
    take: 5,
    orderBy: { productResponses: { _count: "desc" } },
    include: { _count: { select: { productResponses: true } } },
  });

  // Derniers audit logs
  const recentAuditLogs = await db.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { admin: { select: { fullName: true, phone: true } } },
  });

  return NextResponse.json({
    counts: {
      clients: clientsCount,
      pharmacists: pharmacistsCount,
      pharmacies: pharmaciesCount,
      activePharmacies: activePharmaciesCount,
      responses: responsesCount,
      dutyWeeks: dutyWeeksCount.length,
      currentWeekDuty: currentWeekDutyCount,
      auditLogs: auditLogsCount,
    },
    requestsByStatus: {
      open: requestsOpen,
      responded: requestsResponded,
      expired: requestsExpired,
      closed: requestsClosed,
    },
    photos: {
      active: photosActive,
      deleted: photosDeleted,
    },
    requestsLast7Days: Object.entries(byDay).map(([date, v]) => ({ date, ...v })),
    topPharmacies: topPharmacies.map((p) => ({
      id: p.id,
      name: p.name,
      responsesCount: (p as any)._count?.productResponses || 0,
    })),
    recentAuditLogs,
  });
}
