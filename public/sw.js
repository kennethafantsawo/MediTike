/**
 * Service Worker MediTike — cache offline pour PWA installable.
 *
 * Stratégies de cache :
 *  - Pages HTML (/, /a-propos)              → network-first (freshness) + fallback cache
 *  - Assets statiques (logo, manifest, _next) → cache-first (vitesse)
 *  - API GET /api/duty                       → network-first + fallback cache (consultation offline)
 *
 * Au activate : on supprime tous les caches des versions précédentes.
 */
const CACHE_VERSION = "v2";
const CACHE_NAME = `meditike-${CACHE_VERSION}`;
const PAGES_CACHE = `${CACHE_NAME}-pages`;
const ASSETS_CACHE = `${CACHE_NAME}-assets`;
const API_CACHE = `${CACHE_NAME}-api`;

// Ressources préchargées au moment de l'installation.
const PRECACHE_URLS = [
  "/",
  "/a-propos",
  "/logo.svg",
  "/manifest.json",
];

// Motifs d'URL considérés comme des assets statiques (cache-first).
const ASSET_PATTERNS = [
  /\/logo\.svg$/,
  /\/manifest\.json$/,
  /\/_next\/static\//,
  /\/_next\/image\//,
  /\.(?:svg|png|jpe?g|webp|gif|ico|woff2?|ttf|css|js)$/i,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {
        // L'échec d'un precache ne doit pas casser l'installation.
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_NAME))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // On ne met en cache que les requêtes GET same-origin.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1. API /api/duty : network-first + fallback cache (consultation offline).
  if (url.pathname === "/api/duty") {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // On ne cache pas les autres API (auth, requests, photos, etc.).
  if (url.pathname.startsWith("/api/")) return;

  // 2. Assets statiques : cache-first.
  if (ASSET_PATTERNS.some((re) => re.test(url.pathname))) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
    return;
  }

  // 3. Pages HTML (navigations) : network-first avec fallback offline sur "/".
  if (
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html")
  ) {
    event.respondWith(networkFirst(request, PAGES_CACHE, "/"));
    return;
  }

  // 4. Autres requêtes GET : network-first générique.
  event.respondWith(networkFirst(request, CACHE_NAME));
});

/**
 * Cache-first : sert la ressource depuis le cache si présente,
 * sinon effectue la requête réseau et met en cache la réponse.
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response("Hors-ligne", {
      status: 503,
      statusText: "Offline",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/**
 * Network-first : tente d'abord le réseau, met à jour le cache en cas de
 * succès, et bascule sur le cache (ou fallbackUrl) en cas d'échec réseau.
 */
async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) return fallback;
    }
    return new Response("Hors-ligne", {
      status: 503,
      statusText: "Offline",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
