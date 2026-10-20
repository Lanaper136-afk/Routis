// Choix du pays (France / Royaume-Uni / Canada-Québec).
// - Visiteur dont le navigateur est en français : rien ne change (France par défaut).
// - Visiteur dont le navigateur est en anglais, sans choix mémorisé : un écran propose
//   les pays disponibles ; "France" est proposé en petit, au cas où.
// - Le choix est mémorisé sur l'appareil (localStorage "routis_country"). Il ne se
//   change plus que dans la page Réglages.
// - Les robots (Google...) ne voient jamais d'écran de choix ni de redirection.
var ROUTIS_UK_LIVE = true;
(function () {
  function get() { try { return localStorage.getItem("routis_country"); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem("routis_country", v); } catch (e) {} }
  window.routisCountry = { get: get, set: set, ukLive: ROUTIS_UK_LIVE };

  var ua = navigator.userAgent || "";
  var isBot = navigator.webdriver || /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|facebookexternalhit|whatsapp|telegram|discord|slack|curl|wget|python|node-fetch/i.test(ua);
  if (isBot || !ROUTIS_UK_LIVE) return;

  // Page d'accueil seulement : un visiteur qui a choisi le Royaume-Uni est renvoyé vers son accueil.
  var path = location.pathname.replace(/\/+$/, "");
  var isHome = path === "" || /\/index\.html$/.test(path) || path === "/";
  if (!isHome) return;
  if (get() === "uk" && !/[?&]stay=1/.test(location.search)) { location.replace("uk/index.html"); return; }
  if (get() === "qc" && !/[?&]stay=1/.test(location.search)) { location.replace("qc/index.html"); return; }
  if (get()) return;

  var lang = ((navigator.languages && navigator.languages[0]) || navigator.language || "fr").toLowerCase();
  if (lang.indexOf("en") !== 0) return;

  function show() {
    var d = document.createElement("dialog");
    d.id = "country-dialog";
    d.style.cssText = "border:0;border-radius:18px;padding:26px 22px 18px;max-width:420px;width:calc(100% - 32px);box-shadow:0 20px 60px rgba(10,20,40,.35);font-family:inherit;color:#16212f";
    d.innerHTML = '<h2 style="margin:0 0 6px;font-size:1.35rem">Choose your country</h2>' +
      '<p style="margin:0 0 16px;color:#607086">Driving rules and road signs are different in each country. Pick the one you want to learn.</p>' +
      '<button type="button" id="pick-uk" style="display:block;width:100%;padding:14px;border:0;border-radius:12px;background:#1769e0;color:#fff;font:inherit;font-weight:800;font-size:1.05rem;cursor:pointer">United Kingdom</button>' +
      '<button type="button" id="pick-qc" style="display:block;width:100%;margin-top:10px;padding:14px;border:0;border-radius:12px;background:#1769e0;color:#fff;font:inherit;font-weight:800;font-size:1.05rem;cursor:pointer">Canada (Québec) <small style="font-weight:600">· content in French</small></button>' +
      '<p style="margin:10px 0 0;color:#607086;font-size:.85rem;text-align:center">More countries coming soon.</p>' +
      '<p style="margin:14px 0 0;text-align:center"><button type="button" id="pick-fr" style="border:0;background:none;color:#607086;font:inherit;font-size:.75rem;text-decoration:underline;cursor:pointer;padding:4px">France</button></p>';
    document.body.appendChild(d);
    d.querySelector("#pick-uk").onclick = function () { set("uk"); location.href = "uk/index.html"; };
    d.querySelector("#pick-qc").onclick = function () { set("qc"); location.href = "qc/index.html"; };
    d.querySelector("#pick-fr").onclick = function () { set("fr"); d.close(); d.remove(); };
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show); else show();
})();
