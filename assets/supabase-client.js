// assets/supabase-client.js
//
// Charge le SDK Supabase (v2) depuis un CDN qui sert des builds ESM prêts à
// l'emploi, initialise un client et l'expose globalement en
// `window.supabaseClient` pour que les scripts classiques du site
// (auth-ui.js, sync.js) puissent l'utiliser sans être eux-mêmes des modules
// ES.
//
// CDN utilisé : esm.sh (https://esm.sh/@supabase/supabase-js@2). C'est un
// CDN public fiable, pensé justement pour importer des paquets npm en ESM
// directement dans un <script type="module">, sans bundler.
// Alternative équivalente si besoin : https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm
//
// Ce fichier doit être chargé avec <script type="module" src="assets/supabase-client.js"></script>,
// APRÈS assets/common.js et AVANT assets/auth-ui.js / assets/sync.js (ces
// deux derniers sont chargés avec l'attribut `defer` pour s'exécuter après
// ce module, comme l'exige l'ordre d'exécution des scripts par le
// navigateur : un <script type="module"> est toujours différé, donc un
// <script> classique placé après lui dans le HTML doit lui aussi être
// `defer` pour être garanti de s'exécuter après).
//
// Important : ce fichier ne doit JAMAIS casser le site si le réseau est
// indisponible (mode hors-ligne PWA) ou si le CDN est injoignable. Toute
// erreur est capturée, `window.supabaseClient` reste `null` dans ce cas, et
// un évènement `supabase:ready` est quand même envoyé (avec `ok: false`)
// pour que les autres scripts sachent qu'ils doivent rester en mode
// "local uniquement".

(function () {
  // Ces valeurs sont volontairement publiques : la clé "publishable" de
  // Supabase est conçue pour être exposée côté client (voir
  // supabase-setup.sql pour la protection réelle des données via RLS).
  var SUPABASE_URL = "https://wzsfwejmfxuuzljjavdb.supabase.co";
  var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7vJT0UV984mM983Iaiv3wg_xnQQul8i";

  async function initSupabase() {
    try {
      var mod = await import("https://esm.sh/@supabase/supabase-js@2");
      var createClient = mod.createClient;
      var client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });

      window.supabaseClient = client;

      client.auth.onAuthStateChange(function (event, session) {
        window.dispatchEvent(
          new CustomEvent("supabase:auth-changed", { detail: { event: event, session: session } })
        );
      });

      window.dispatchEvent(new CustomEvent("supabase:ready", { detail: { ok: true } }));
    } catch (err) {
      // Hors-ligne, CDN injoignable, navigateur trop ancien pour les modules
      // dynamiques... Le site continue de fonctionner en localStorage
      // uniquement dans ce cas, comme avant l'ajout des comptes.
      window.supabaseClient = null;
      window.dispatchEvent(new CustomEvent("supabase:ready", { detail: { ok: false, error: err } }));
    }
  }

  initSupabase();
})();
