import { NextResponse } from "next/server";
import { getSession } from "@/lib/meditike/session";

/**
 * GET /api/admin-redirect
 *
 * Redirige vers l'URL admin secrète si l'utilisateur connecté est admin.
 * L'URL admin n'est JAMAIS exposée côté client (dans le JS).
 * Seul le serveur connaît l'URL et fait la redirection.
 */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL || "https://medi-tike.vercel.app"));
  }

  const adminPath = process.env.MEDITIKE_ADMIN_PATH || "admin-secret-dev-2024";
  const baseUrl = process.env.NEXTAUTH_URL || "https://medi-tike.vercel.app";

  // Redirection 302 vers l'URL admin (l'URL n'apparaît pas dans le JS client)
  return NextResponse.redirect(`${baseUrl}/${adminPath}`);
}
