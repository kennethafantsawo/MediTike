import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/pharmacies-list — liste publique des pharmacies actives.
 *
 * Utilisée par le formulaire de connexion pharmacien pour proposer la liste
 * déroulante des pharmacies. Aucune authentification requise : seules les
 * informations non sensibles (id, nom, téléphone) sont renvoyées.
 */
export async function GET() {
  try {
    const pharmacies = await db.pharmacy.findMany({
      where: { isActive: true },
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        phone1: true,
      },
    });

    return NextResponse.json({ pharmacies });
  } catch (err: any) {
    console.error("[pharmacies-list GET] error:", err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
