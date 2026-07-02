/**
 * Service Worker MediTike — cache offline basique.
 *
 * Permet à l'app de fonctionner hors-ligne pour les visites répétées
 * (PWA installable + build APK/iOS via Capacitor).
 */
const CACHE_NAME = "meditike-v1";
const PRECACHE = [
  "/",
  "/logo.svg",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Ne pas cacher les API (toujours réseau)
  if (request.url.includes("/api/")) return;

  // Strategy: network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.method === "GET") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match("/")))
  );
});
