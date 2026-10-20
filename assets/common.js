// Shared helpers: safe localStorage access used across all pages of the site.
// Wrapped in try/catch because localStorage can throw (private browsing, blocked
// site data, disabled storage, quota exceeded...) and the site must keep working.

// Keys that represent a user's "progress" and are worth syncing to Supabase
// (see assets/sync.js) when the person is signed in. Kept in one place so
// sync.js and common.js agree on exactly what counts as progress.
const SYNCED_PROGRESS_KEYS = [
  "signStatus",
  "streak",
  "bestScore",
  "sliceBestScore",
  "examHistory",
  "qStats",
  "signStats"
];

// Called after every successful write to a progress key: stamps a local
// "last changed" timestamp (used by sync.js to decide which of the local
// vs. server copy is newer) and fires an event so sync.js can debounce a
// push to Supabase, without common.js needing to know sync.js exists.
function markLocalProgressUpdated(key) {
  if (SYNCED_PROGRESS_KEYS.indexOf(key) === -1) return;
  try {
    localStorage.setItem("localUpdatedAt", String(Date.now()));
  } catch (e) {
    // Ignore — worst case sync.js falls back to "always push" behaviour.
  }
  try {
    window.dispatchEvent(new CustomEvent("progress:changed", { detail: { key } }));
  } catch (e) {
    // CustomEvent unsupported or dispatch blocked: sync simply won't be
    // triggered automatically from this write, local storage still works.
  }
}

function safeGetItem(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null || value === undefined ? fallback : value;
  } catch (e) {
    return fallback;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    markLocalProgressUpdated(key);
    return true;
  } catch (e) {
    return false;
  }
}

function safeGetJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
}

function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    markLocalProgressUpdated(key);
    return true;
  } catch (e) {
    return false;
  }
}

function safeGetNumber(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    const num = Number(raw);
    return Number.isNaN(num) ? fallback : num;
  } catch (e) {
    return fallback;
  }
}

function safeSetNumber(key, value) {
  try {
    localStorage.setItem(key, String(value));
    markLocalProgressUpdated(key);
    return true;
  } catch (e) {
    return false;
  }
}

// Renders a sign's SVG artwork (shape + inline icon) based on its family.
// Shared by every page that displays sign cards (panneaux, examens, fiches,
// progression, simulations, jeux...).
function signSvg(sign) {
  const icon = icons[sign.icon] || icons.bang;
  if (sign.shape === "zfe") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><rect x="10" y="24" width="100" height="72" rx="6" fill="#fff" stroke="#d62430" stroke-width="6"/><text x="60" y="52" text-anchor="middle" font-size="20" font-weight="900" fill="#111">ZFE</text><circle cx="38" cy="75" r="11" fill="#7bb53b"/><circle cx="60" cy="75" r="11" fill="#8a4fa3"/><circle cx="82" cy="75" r="11" fill="#f2c200"/></svg></div>`;
  }
  if (sign.shape === "endsquare") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><rect x="12" y="12" width="96" height="96" rx="8" fill="#fff" stroke="#111" stroke-width="5"/><g>${icon}</g></svg></div>`;
  }
  if (sign.family === "danger") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><polygon points="60,8 112,104 8,104" fill="#fff" stroke="#d62430" stroke-width="10" join="round"/><g>${icon}</g></svg></div>`;
  }
  if (sign.family === "interdiction") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><circle cx="60" cy="60" r="49" fill="#fff" stroke="#d62430" stroke-width="10"/><g>${icon}</g></svg></div>`;
  }
  if (sign.family === "obligation") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><circle cx="60" cy="60" r="52" fill="#1769e0"/><g fill="#fff" stroke="#fff">${icon}</g></svg></div>`;
  }
  if (sign.icon === "yield") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><polygon points="60,106 112,16 8,16" fill="#fff" stroke="#d62430" stroke-width="10" join="round"/></svg></div>`;
  }
  if (sign.icon === "stop") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><polygon points="38,8 82,8 112,38 112,82 82,112 38,112 8,82 8,38" fill="#d62430"/><text x="60" y="68" text-anchor="middle" font-size="27" font-weight="900" fill="#fff">STOP</text></svg></div>`;
  }
  // AB1, AB3b, AB5 and AB25 are triangular signs (red border), not diamonds.
  if (sign.id === "ab1" || sign.id === "ab3b" || sign.id === "ab5" || sign.id === "ab25") {
    const symbols = {
      ab1: `<path d="M44 52 L76 88 M76 52 L44 88" stroke="#111" stroke-width="10" stroke-linecap="round"/>`,
      ab3b: `<polygon points="43,50 77,50 60,82" fill="#fff" stroke="#d62430" stroke-width="6" stroke-linejoin="round"/>`,
      ab5: `<polygon points="50,52 70,52 80,62 80,82 70,92 50,92 40,82 40,62" fill="#d62430"/><text x="60" y="76" text-anchor="middle" font-size="9" font-weight="900" fill="#fff">STOP</text>`,
      ab25: `<path d="M65.8 56.0A17 17 0 0 0 46.6 61.5" fill="none" stroke="#111" stroke-width="5.5"/><polygon points="41.5,57.5 41.1,68.6 51.7,65.5" fill="#111"/><path d="M70.9 85.0A17 17 0 0 0 75.8 65.6" fill="none" stroke="#111" stroke-width="5.5"/><polygon points="81.8,63.2 72.4,57.3 69.7,68.1" fill="#111"/><path d="M43.3 75.0A17 17 0 0 0 57.6 88.8" fill="none" stroke="#111" stroke-width="5.5"/><polygon points="56.7,95.3 66.5,90.1 58.5,82.4" fill="#111"/>`
    };
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><polygon points="60,8 112,104 8,104" fill="#fff" stroke="#d62430" stroke-width="10" join="round"/><g>${symbols[sign.id]}</g></svg></div>`;
  }
  if (sign.family === "priorite") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><rect x="22" y="22" width="76" height="76" transform="rotate(45 60 60)" fill="#fff" stroke="#111" stroke-width="4"/><g>${icon}</g></svg></div>`;
  }
  if (sign.family === "panonceau") {
    return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><rect x="12" y="40" width="96" height="40" rx="4" fill="#fff" stroke="#111" stroke-width="6"/><g>${icon}</g></svg></div>`;
  }
  return `<div class="sign-art" aria-hidden="true"><svg viewBox="0 0 120 120" role="img"><rect x="10" y="10" width="100" height="100" rx="8" fill="#1769e0"/><g fill="#fff" stroke="#fff">${icon}</g></svg></div>`;
}

// Registers the offline service worker. Wrapped so a failure (unsupported
// browser, strict private browsing, blocked storage...) never blocks the
// rest of the site.
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  } catch (e) {
    // Registration itself can throw synchronously in some locked-down
    // environments — ignore and keep the site usable online-only.
  }
}

// Shows a small discreet badge while the user is offline, so they know
// the site keeps working from its local cache/data. Reused on every page.
function initOfflineIndicator() {
  let badge = null;

  function ensureBadge() {
    if (badge) return badge;
    badge = document.createElement("div");
    badge.className = "offline-badge";
    badge.setAttribute("role", "status");
    badge.setAttribute("aria-live", "polite");
    badge.textContent = "Hors ligne — mode révision local actif";
    document.body.appendChild(badge);
    return badge;
  }

  function updateStatus() {
    if (navigator.onLine) {
      if (badge) badge.classList.remove("is-visible");
    } else {
      ensureBadge().classList.add("is-visible");
    }
  }

  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);

  if (document.body) {
    updateStatus();
  } else {
    document.addEventListener("DOMContentLoaded", updateStatus);
  }
}

registerServiceWorker();
initOfflineIndicator();

// Visit notification (sent to the owner through a Netlify serverless function).
// Telegram credentials are never exposed to the browser.
// Rules, to avoid useless or misleading notifications:
//  - never for the site owner (device marked once with ?owner=1 in the address),
//  - never for robots or automated browsers,
//  - never while the page is hidden (background tab restored by the browser,
//    preloaded page, etc.): the notification waits until the page is really
//    visible, and is dropped if it never becomes visible,
function notifyRoutisVisit() {
  try {
    // Mark / unmark this device as belonging to the owner: ?owner=1 or ?owner=0
    try {
      const q = new URLSearchParams(window.location.search).get("owner");
      if (q === "1") localStorage.setItem("routis_owner", "1");
      if (q === "0") localStorage.removeItem("routis_owner");
    } catch (e) { /* storage unavailable */ }

    let isOwner = false;
    try {
      isOwner = localStorage.getItem("routis_owner") === "1";
    } catch (e) { /* storage unavailable: treated as a normal visitor */ }
    if (isOwner) return;

    const ua = navigator.userAgent || "";
    if (navigator.webdriver || /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|facebookexternalhit|whatsapp|telegram|discord|slack|curl|wget|python|node-fetch/i.test(ua)) return;

    let sent = false;
    const send = () => {
      if (sent) return;
      sent = true;
      fetch("/.netlify/functions/notify-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        }),
        keepalive: true
      }).catch(() => {});
    };

    if (document.visibilityState === "visible") {
      setTimeout(() => { if (document.visibilityState === "visible") send(); }, 500);
    } else {
      document.addEventListener("visibilitychange", function onVisible() {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVisible);
          setTimeout(() => { if (document.visibilityState === "visible") send(); }, 500);
        }
      });
    }
  } catch (e) {
    // Notification failure must never affect the site itself.
  }
}

notifyRoutisVisit();


// ---- Consentement (Google Tag Manager) -------------------------------------
// GTM n'est chargé qu'après un "Accepter" explicite. Le choix est gardé 6 mois.
function routisConsent() {
  try {
    const c = JSON.parse(localStorage.getItem("routis_consent") || "null");
    if (c && (c.v === "granted" || c.v === "denied") && Date.now() - c.t < 15552000000) return c.v;
  } catch (e) {}
  return null;
}
function routisSetConsent(v) {
  try { localStorage.setItem("routis_consent", JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  const b = document.getElementById("cookie-banner");
  if (b) b.remove();
  if (v === "granted") {
    if (window.routisLoadGTM) window.routisLoadGTM();
  } else if (window.__gtmLoaded) {
    window.location.reload();
  }
}
function routisShowConsentBanner() {
  if (document.getElementById("cookie-banner")) return;
  const b = document.createElement("div");
  b.id = "cookie-banner";
  b.setAttribute("role", "dialog");
  b.setAttribute("aria-label", "Cookies et mesure d'audience");
  b.innerHTML = '<p>Routis aimerait mesurer son audience avec Google Tag Manager (statistiques anonymes de fréquentation) pour améliorer le site. Cela dépose des cookies sur votre appareil seulement si vous acceptez. Le site fonctionne pareil dans les deux cas. <a href="confidentialite.html">En savoir plus</a></p><div class="cookie-actions"><button type="button" class="cookie-refuse">Refuser</button><button type="button" class="cookie-accept">Accepter</button></div>';
  b.querySelector(".cookie-refuse").addEventListener("click", function () { routisSetConsent("denied"); });
  b.querySelector(".cookie-accept").addEventListener("click", function () { routisSetConsent("granted"); });
  document.body.appendChild(b);
}
function initRoutisConsent() {
  const m = document.getElementById("cookie-manage");
  if (m) m.addEventListener("click", routisShowConsentBanner);
  if (routisConsent() === null) routisShowConsentBanner();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initRoutisConsent);
else initRoutisConsent();

// ---- Invitation à installer Routis sur l'écran d'accueil (mobile, une seule fois) ----
(function () {
  var KEY = "routis_install_seen";
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; });
  function mobile() { return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || ""); }
  function standalone() {
    try { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true; } catch (e) { return false; }
  }
  function seen() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return true; } }
  function mark() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }
  function show() {
    if (document.getElementById("install-banner") || seen() || standalone() || !mobile()) return;
    if (/installer\.html|jeu-dangers\.html/.test(location.pathname)) return;
    if (document.getElementById("cookie-banner")) return;
    var en = typeof getLang === "function" && getLang() === "en";
    var b = document.createElement("div");
    b.id = "install-banner"; b.setAttribute("role", "dialog");
    b.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:9998;background:#fff;border:1px solid #d9e0ec;border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,.18);padding:14px 16px;font-size:.92rem;line-height:1.4";
    b.innerHTML = '<p style="margin:0 0 10px"></p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="ib-go" style="padding:9px 14px;border:0;border-radius:9px;background:#1769e0;color:#fff;font:inherit;font-weight:800;cursor:pointer"></button><button type="button" class="ib-no" style="padding:9px 14px;border:1px solid #d9e0ec;border-radius:9px;background:#fff;font:inherit;font-weight:700;cursor:pointer"></button></div>';
    b.querySelector("p").textContent = en ? "Add Routis to your home screen to study like an app, even offline." : "Ajoute Routis à ton écran d'accueil pour réviser comme une appli, même sans connexion.";
    b.querySelector(".ib-go").textContent = deferred ? (en ? "Install" : "Installer") : (en ? "How to?" : "Comment faire ?");
    b.querySelector(".ib-no").textContent = en ? "Close" : "Fermer";
    b.querySelector(".ib-go").addEventListener("click", function () {
      mark(); b.remove();
      if (deferred) { deferred.prompt(); } else { location.href = "installer.html"; }
    });
    b.querySelector(".ib-no").addEventListener("click", function () { mark(); b.remove(); });
    document.body.appendChild(b);
  }
  function init() { setTimeout(show, 4000); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
