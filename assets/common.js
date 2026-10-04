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
