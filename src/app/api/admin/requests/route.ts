import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/meditike/admin-guard";

/**
 * DELETE /api/admin/requests?id=xxx
 * Supprime une demande (ProductRequest) de la base.
 *
 * Cascade automatique (gérée par Prisma `onDelete: Cascade`) :
 *   - ProductResponse (réponses des pharmaciens)
 *   - Photo (photos attachées à la demande)
 *
 * L'action est journalisée dans AuditLog.
 */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("id");
    if (!requestId) {
      return NextResponse.json({ error: "ID demande requis" }, { status: 400 });
    }

    const request = await db.productRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        productName: true,
        clientId: true,
        clientPhone: true,
        status: true,
        _count: {
          select: { responses: true, photos: true },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    // La suppression en cascade supprime automatiquement :
    //   - les ProductResponse (réponses liées)
    //   - les Photo (photos liées)
    await db.productRequest.delete({ where: { id: requestId } });

    await logAdminAction(
      guard.session.userId,
      "delete_request",
      {
        requestId: request.id,
        productName: request.productName,
        clientId: request.clientId,
        clientPhone: request.clientPhone,
        status: request.status,
        responsesCount: request._count.responses,
        photosCount: request._count.photos,
      },
      req
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[admin requests DELETE] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
