import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deletePhoto } from "@/lib/meditike/photo-storage";

/**
 * GET /api/cron/cleanup
 * Cron de nettoyage quotidien:
 * - Supprime physiquement les photos dont deleteAt < now
 * - Marque les demandes "open" de plus de 7 jours comme "expired"
 * - Supprime les drafts orphelins de plus de 24h
 *
 * Sécurité: nécessite un secret partagé (CRON_SECRET) en header.
 * Configurez ce cron pour s'exécuter chaque heure via Vercel Cron (vercel.json)
 * ou votre crontab:
 *   0 * * * *  curl -H "Authorization: Bearer $CRON_SECRET" https://votre-domaine.com/api/cron/cleanup
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET || "meditike-cron-secret-dev";
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const now = new Date();
    const results = {
      photosDeleted: 0,
      requestsExpired: 0,
      draftsDeleted: 0,
      errors: [] as string[],
    };

    // 1. Supprimer physiquement les photos dont deleteAt < now
    const photosToDelete = await db.photo.findMany({
      where: { deleteAt: { lt: now }, deletedAt: null },
      take: 200,
    });

    for (const photo of photosToDelete) {
      try {
        await deletePhoto(photo.filename); // Supabase Storage ou local
        await db.photo.update({
          where: { id: photo.id },
          data: { deletedAt: now },
        });
        results.photosDeleted++;
      } catch (e: any) {
        results.errors.push(`Photo ${photo.id}: ${e.message}`);
      }
    }

    // 2. Marquer les demandes "open" de plus de 7 jours comme "expired"
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const expiredResult = await db.productRequest.updateMany({
      where: {
        status: "open",
        createdAt: { lt: sevenDaysAgo },
      },
      data: { status: "expired" },
    });
    results.requestsExpired = expiredResult.count;

    // 3. Supprimer les drafts orphelins de plus de 24h (et leurs photos)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oldDrafts = await db.productRequest.findMany({
      where: {
        status: "draft",
        createdAt: { lt: oneDayAgo },
      },
      include: { photos: true },
    });

    for (const draft of oldDrafts) {
      // Supprimer les fichiers photo du stockage
      for (const photo of draft.photos) {
        await deletePhoto(photo.filename);
      }
      // Supprimer la demande draft (cascade supprimera les photos en DB)
      await db.productRequest.delete({ where: { id: draft.id } });
      results.draftsDeleted++;
    }

    return NextResponse.json({
      ok: true,
      timestamp: now,
      results,
    });
  } catch (err: any) {
    console.error("[cron cleanup] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
