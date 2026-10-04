// Service worker for Routis — cache-first offline support.
// Bump CACHE_VERSION on every deploy that changes any cached file so old
// caches get cleaned up and users are not stuck on a stale version.
const CACHE_VERSION = "routis-v2";
const CACHE_NAME = CACHE_VERSION;

// Every file needed to fully use the site offline. Paths are relative to
// the service worker's own scope (the site root), so they resolve the same
// whether the site is served at "/" or from a sub-path.
const PRECACHE_URLS = [
  "index.html",
  "fiches.html",
  "examens.html",
  "progression.html",
  "panneaux.html",
  "simulations.html",
  "jeux.html",
  "manifest.json",
  "favicon.svg",
  "assets/style.css",
  "assets/signs-data.js",
  "assets/questions-data.js",
  "assets/i18n.js",
  "assets/common.js",
  "assets/stats.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-180.png",
];

const OFFLINE_FALLBACK = "index.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept cross-origin requests (Google Tag Manager, future
  // Supabase calls, etc.) — let the browser handle those normally.
  if (url.origin !== self.location.origin) return;

  // Navigations (typing a URL, following a link, reloading a page):
  // try the network first is unnecessary here since content is static,
  // so go cache-first and fall back to the cached index.html offline.
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => caches.match(OFFLINE_FALLBACK));
      })
    );
    return;
  }

  // Static assets: cache-first, network as fallback, and top up the cache
  // with whatever we fetch so future loads stay offline-capable.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Last resort for a document-like request that isn't a
          // navigation (e.g. fetched via JS): fall back to index.html.
          if (request.headers.get("accept") && request.headers.get("accept").includes("text/html")) {
            return caches.match(OFFLINE_FALLBACK);
          }
          return undefined;
        });
    })
  );
});
