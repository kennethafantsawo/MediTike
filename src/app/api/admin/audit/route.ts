import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/meditike/admin-guard";

/**
 * GET /api/admin/audit — journal d'audit complet (paginé)
 * Query: ?page=1&limit=50
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const offset = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        admin: { select: { fullName: true, phone: true } },
      },
    }),
    db.auditLog.count(),
  ]);

  return NextResponse.json({
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
