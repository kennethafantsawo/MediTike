/**
 * Service Worker MediTike — Notifications push + cache offline
 *
 * Fonctionnalités :
 * - Cache offline (pages + assets + API duty)
 * - Affichage des notifications système (comme WhatsApp)
 * - Clic sur notification → ouvre l'app
 */

const CACHE_VERSION = "meditike-v3";
const CACHE_PAGES = `${CACHE_VERSION}-pages`;
const CACHE_ASSETS = `${CACHE_VERSION}-assets`;
const CACHE_API = `${CACHE_VERSION}-api`;

const PRECACHE_URLS = ["/", "/a-propos", "/logo.svg", "/manifest.json", "/MediTike.apk"];

// ─── INSTALL : pré-cache ───────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_PAGES).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

// ─── ACTIVATE : nettoyage anciens caches ───────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(CACHE_VERSION))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── FETCH : stratégies de cache ───────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.url.includes("/api/")) {
    // API : network-first (sauf /api/duty en cache-first)
    if (request.url.includes("/api/duty") && request.method === "GET") {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_API).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => caches.match(request))
      );
    }
    return; // autres API : toujours réseau
  }

  if (request.method === "GET") {
    if (request.mode === "navigate") {
      // Pages : network-first avec fallback offline
      event.respondWith(
        fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_PAGES).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => caches.match(request).then((r) => r || caches.match("/")))
      );
    } else {
      // Assets : cache-first
      event.respondWith(
        caches.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok && response.type === "basic") {
              const clone = response.clone();
              caches.open(CACHE_ASSETS).then((cache) => cache.put(request, clone));
            }
            return response;
          });
        })
      );
    }
  }
});

// ─── PUSH : recevoir et afficher les notifications ─────────────
self.addEventListener("push", (event) => {
  let data = { title: "MediTike", body: "Nouvelle notification", url: "/" };
  try {
    if (event.data) data = JSON.parse(event.data.text());
  } catch {
    if (event.data) data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: "/logo.svg",
    badge: "/logo.svg",
    vibrate: [200, 100, 200],
    data: { url: data.url || "/" },
    requireInteraction: false,
    tag: data.tag || "meditike-notification",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ─── NOTIFICATION CLICK : ouvrir l'app ─────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Si l'app est déjà ouverte, la focus
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ─── MESSAGE : recevoir messages du client (pour notifications locales) ─
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, url, tag } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: "/logo.svg",
      badge: "/logo.svg",
      vibrate: [200, 100, 200],
      data: { url: url || "/" },
      tag: tag || "meditike-notification",
    });
  }
});
