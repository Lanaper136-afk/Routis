// Service worker for Routis — cache-first offline support.
// Bump CACHE_VERSION on every deploy that changes any cached file so old
// caches get cleaned up and users are not stuck on a stale version.
const CACHE_VERSION = "routis-v31";
const CACHE_NAME = CACHE_VERSION;

// Every file needed to fully use the site offline. Paths are relative to
// the service worker's own scope (the site root), so they resolve the same
// whether the site is served at "/" or from a sub-path.
const PRECACHE_URLS = [
  "index.html",
  "fiches.html",
  "assets/i18n-pages.js",
  "cours.html",
  "autoroute.html",
  "depassement.html",
  "intersections-ronds-points.html",
  "conduite-nuit-mauvais-temps.html",
  "stationnement.html",
  "vitesse.html",
  "permis-a-points.html",
  "alcool-stupefiants.html",
  "premiers-secours.html",
  "securite-enfants.html",
  "equipements-obligatoires.html",
  "examen-du-code.html",
  "demarches-permis.html",
  "fiches-memo.html",
  "assets/memos-data.js",
  "vehicules-prioritaires.html",
  "partager-la-route.html",
  "controle-du-vehicule.html",
  "assets/img/cours-prioritaires.svg",
  "assets/img/cours-controle.svg",
  "assets/img/cours-partager.svg",
  "marquages-au-sol.html",
  "types-de-routes.html",
  "feux-tricolores.html",
  "manoeuvres.html",
  "voyants-tableau-de-bord.html",
  "trottinettes-edpm.html",
  "prendre-quitter-son-vehicule.html",
  "assets/img/cours-edpm.svg",
  "assets/img/cours-feux.svg",
  "assets/img/cours-fleches.svg",
  "assets/img/cours-ligne-continue.svg",
  "assets/img/cours-ligne-discontinue.svg",
  "assets/img/cours-ligne-jaune.svg",
  "assets/img/cours-ligne-mixte.svg",
  "assets/img/cours-manoeuvres.svg",
  "assets/img/cours-marquages.svg",
  "assets/img/cours-passage-pieton.svg",
  "assets/img/cours-prendre.svg",
  "assets/img/cours-routes.svg",
  "assets/img/cours-voyants.svg",
  "assets/img/cours-zebras.svg",
  "assets/img/permis-hero.jpg",
  "assets/img/permis-route.jpg",
  "assets/img/permis-papiers.svg",
  "assets/img/permis-choisir.svg",
  "assets/img/permis-code.svg",
  "assets/img/permis-conduite.svg",
  "assets/img/permis-examen.svg",
  "assets/img/permis-probatoire.svg",
  "assets/img/permis-budget.svg",
  "assets/img/permis-reussite.svg",
  "assets/img/permis-delais.svg",
  "permis-am.html",
  "permis-moto.html",
  "assurance-accident.html",
  "eco-conduite.html",
  "poids-lourds.html",
  "conduite-montagne.html",
  "quiz-permis.html",
  "assets/other-data.js",
  "remorque-b96-be.html",
  "distances-d-arret.html",
  "examens.html",
  "progression.html",
  "panneaux.html",
  "simulations.html",
  "jeux.html",
  "installer.html",
  "jeu-vrai-faux.html",
  "jeu-memoire.html",
  "jeu-dangers.html",
  "mentions-legales.html",
  "confidentialite.html",
  "reglages.html",
  "manifest.json",
  "favicon.svg",
  "assets/style.css",
  "assets/signs-data.js",
  "assets/questions-data.js",
  "assets/scenes.js",
  "assets/i18n.js",
  "assets/common.js",
  "assets/stats.js",
  "assets/badges.js",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-180.png",
  "icons/icon-maskable-512.png",
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
