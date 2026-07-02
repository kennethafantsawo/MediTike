import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware MediTike — gère l'URL admin secrète.
 *
 * Au lieu d'avoir un chemin admin fixe (devinable), on utilise une variable
 * d'environnement MEDITIKE_ADMIN_PATH qui contient un chemin aléatoire.
 *
 * Le middleware intercepte toutes les requêtes et, si le chemin correspond
 * à /{MEDITIKE_ADMIN_PATH}, rewrite vers /__admin (route interne).
 *
 * L'admin reste donc accessible uniquement via l'URL secrète, configurée
 * via la variable d'environnement.
 *
 * En dev (sans variable), on utilise un chemin par défaut.
 */
const ADMIN_PATH = process.env.MEDITIKE_ADMIN_PATH || "admin-secret-dev-2024";
const INTERNAL_ADMIN_ROUTE = "/admin-internal-9k3m2x7p";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si le chemin correspond exactement à l'URL admin secrète
  if (pathname === `/${ADMIN_PATH}`) {
    const url = request.nextUrl.clone();
    url.pathname = INTERNAL_ADMIN_ROUTE;
    return NextResponse.rewrite(url);
  }

  // Si le chemin commence par l'URL admin secrète (sous-routes)
  if (pathname.startsWith(`/${ADMIN_PATH}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(`/${ADMIN_PATH}`, INTERNAL_ADMIN_ROUTE);
    return NextResponse.rewrite(url);
  }

  // Bloquer l'accès direct à la route interne (on doit passer par l'URL secrète)
  if (pathname === INTERNAL_ADMIN_ROUTE || pathname.startsWith(`${INTERNAL_ADMIN_ROUTE}/`)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // Exclure les routes API et fichiers statiques
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|manifest.json|exemple-import-garde.json|sw.js).*)",
  ],
};
