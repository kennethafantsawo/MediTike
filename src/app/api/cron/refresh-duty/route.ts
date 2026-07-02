import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMondayUTC } from "@/lib/meditike/helpers";

/**
 * GET /api/cron/refresh-duty
 * Cron hebdomadaire (chaque lundi 7h00 UTC) qui :
 * - Vérifie que la liste des pharmacies de garde pour la semaine courante est bien en base
 * - Si non, log une alerte (l'admin doit importer le nouveau fichier xlsx)
 * - Calcule des statistiques sur la semaine à venir
 *
 * Sécurité : nécessite CRON_SECRET en header Authorization: Bearer.
 * Configurez ce cron dans vercel.json (déjà fait) ou votre crontab :
 *   0 7 * * 1  curl -H "Authorization: Bearer $CRON_SECRET" https://votre-domaine.com/api/cron/refresh-duty
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET || "meditike-cron-secret-dev";
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const currentMonday = getMondayUTC();
    const nextMonday = new Date(currentMonday.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [currentWeekCount, nextWeekCount] = await Promise.all([
      db.pharmacyDuty.count({ where: { weekStart: currentMonday } }),
      db.pharmacyDuty.count({ where: { weekStart: nextMonday } }),
    ]);

    const result = {
      ok: true,
      timestamp: new Date().toISOString(),
      currentWeek: {
        monday: currentMonday.toISOString().slice(0, 10),
        pharmacyCount: currentWeekCount,
        status: currentWeekCount > 0 ? "OK" : "MISSING_DATA",
      },
      nextWeek: {
        monday: nextMonday.toISOString().slice(0, 10),
        pharmacyCount: nextWeekCount,
        status: nextWeekCount > 0 ? "OK" : "ALERT_IMPORT_NEEDED",
      },
      alert:
        nextWeekCount === 0
          ? `⚠️ ALERTE: Aucune pharmacie de garde pour la semaine du ${nextMonday.toISOString().slice(0, 10)}. Importez le nouveau fichier xlsx du Ministère via l'espace admin.`
          : null,
    };

    console.log("[cron refresh-duty]", JSON.stringify(result));
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[cron refresh-duty] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
