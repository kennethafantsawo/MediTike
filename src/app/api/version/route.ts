import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * GET /api/version
 *
 * Retourne les métadonnées de la dernière version de l'APK MediTike
 * (contenu de /public/version.json).
 *
 * - Pas d'auth requise (public).
 * - Cache-Control: no-cache — l'app doit toujours récupérer la dernière version.
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "version.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err: any) {
    console.error("[api/version] erreur:", err);
    return NextResponse.json(
      { error: err?.message || "Impossible de lire version.json" },
      { status: 500 }
    );
  }
}
