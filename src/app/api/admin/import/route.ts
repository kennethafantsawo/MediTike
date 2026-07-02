import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, logAdminAction } from "@/lib/meditike/admin-guard";
import { parseDutyFile, ParsedDutyFile } from "@/lib/meditike/duty-parser";
import { UPLOADS_DIR } from "@/lib/meditike/config";
import fs from "fs/promises";
import path from "path";

/**
 * POST /api/admin/import — importe un fichier xlsx ou json de pharmacies de garde
 * Body: multipart/form-data avec champ "file"
 *
 * Le fichier est:
 * - Sauvegardé dans /uploads/duty/ pour archive
 * - Parsé (xlsx ou json selon l'extension)
 * - Toutes les semaines sont insérées en DB (upsert par [name, weekStart])
 *
 * Réponse: { ok, fileName, weeksImported, pharmaciesImported, errors[] }
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Validation extension
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".xlsx") && !lower.endsWith(".xls") && !lower.endsWith(".json")) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez .xlsx, .xls ou .json" },
        { status: 400 }
      );
    }

    // Sauvegarder le fichier pour archive
    const archiveDir = path.join(UPLOADS_DIR, "duty");
    await fs.mkdir(archiveDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const archiveName = `${timestamp}_${file.name.replace(/[^\w.-]/g, "_")}`;
    const archivePath = path.join(archiveDir, archiveName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(archivePath, buffer);

    // Parser le fichier
    let parsed: ParsedDutyFile;
    try {
      parsed = parseDutyFile(archivePath, file.name);
    } catch (e: any) {
      return NextResponse.json(
        { error: `Erreur de parsing: ${e.message}` },
        { status: 400 }
      );
    }

    if (parsed.weeks.length === 0) {
      return NextResponse.json(
        { error: "Aucune semaine détectée dans le fichier." },
        { status: 400 }
      );
    }

    // Insérer en DB
    let weeksImported = 0;
    let pharmaciesImported = 0;
    const errors: string[] = [];

    for (const week of parsed.weeks) {
      try {
        // Supprimer les entrées existantes pour cette semaine (remplacement)
        await db.pharmacyDuty.deleteMany({
          where: { weekStart: week.weekStart },
        });

        // Insérer les pharmacies
        for (const pharma of week.pharmacies) {
          // Essayer de lier à une pharmacie enregistrée par nom
          const existing = await db.pharmacy.findFirst({
            where: { name: { equals: pharma.name, mode: "insensitive" } },
          });

          await db.pharmacyDuty.create({
            data: {
              pharmacyId: existing?.id || null,
              name: pharma.name,
              address: pharma.address,
              phone1: pharma.phone1,
              phone2: pharma.phone2,
              weekStart: week.weekStart,
              weekEnd: week.weekEnd,
              sourceFile: file.name,
            },
          });
          pharmaciesImported++;
        }
        weeksImported++;
      } catch (e: any) {
        errors.push(`Semaine ${week.weekLabel}: ${e.message}`);
      }
    }

    await logAdminAction(
      guard.session.userId,
      "import_duty",
      {
        fileName: file.name,
        weeksImported,
        pharmaciesImported,
        errorsCount: errors.length,
      },
      req
    );

    return NextResponse.json({
      ok: true,
      fileName: file.name,
      archiveName,
      weeksImported,
      pharmaciesImported,
      errors,
      parsed: {
        fileName: parsed.fileName,
        importedAt: parsed.importedAt,
        totalPharmacies: parsed.totalPharmacies,
        weeksPreview: parsed.weeks.map((w) => ({
          weekStart: w.weekStart,
          weekEnd: w.weekEnd,
          weekLabel: w.weekLabel,
          pharmaciesCount: w.pharmacies.length,
        })),
      },
    });
  } catch (err: any) {
    console.error("[admin import] error:", err);
    return NextResponse.json(
      { error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
