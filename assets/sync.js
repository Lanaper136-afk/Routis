// assets/sync.js
//
// Synchronisation de la progression (signStatus, streak, bestScore,
// sliceBestScore, examHistory, qStats, signStats) avec la table Supabase
// `progress`, quand un utilisateur est connecté. Voir supabase-setup.sql
// pour le schéma et les policies RLS correspondantes.
//
// Chargé avec `defer`, après assets/supabase-client.js (module) et
// assets/common.js.
//
// Comportement :
// - Pas d'utilisateur connecté => ce script ne fait strictement rien
//   (aucun appel réseau), le site se comporte exactement comme avant.
// - À la connexion : on récupère la ligne serveur (si elle existe) et on la
//   compare à un horodatage local `localUpdatedAt` (mis à jour par
//   common.js à chaque écriture de progression). La copie la plus récente
//   gagne. S'il n'existe encore aucune ligne serveur (premier login), on
//   pousse les données locales actuelles pour ne rien perdre.
// - À chaque écriture locale de progression (évènement `progress:changed`
//   émis par common.js), on programme un envoi vers Supabase avec un
//   debounce (pour ne pas spammer l'API à chaque clic).
// - Hors-ligne : les erreurs réseau sont avalées silencieusement, un
//   nouveau tour est retenté automatiquement au retour de `online`.

(function () {
  var PROGRESS_TABLE = "progress";
  var DEBOUNCE_MS = 2500;

  var client = null;
  var currentSession = null;
  var debounceTimer = null;
  var pushInFlight = false;
  var retryPending = false;

  function setSyncStatus(state) {
    try {
      window.dispatchEvent(new CustomEvent("sync:status", { detail: { state: state } }));
    } catch (e) {
      // Ignore silently — status is purely informational (e.g. for a future
      // "syncing…" indicator in the UI) and never required for correctness.
    }
    var statusEl = document.getElementById("auth-sync-status");
    if (!statusEl) return;
    if (state === "syncing") statusEl.textContent = t("auth_sync_syncing");
    else if (state === "done") statusEl.textContent = t("auth_sync_done");
    else if (state === "error") statusEl.textContent = t("auth_sync_error");
    else statusEl.textContent = "";
  }

  function collectLocalProgress() {
    return {
      sign_status: safeGetJSON("signStatus", {}),
      streak: safeGetNumber("streak", 0),
      best_score: safeGetNumber("bestScore", 0),
      slice_best_score: safeGetNumber("sliceBestScore", 0),
      exam_history: safeGetJSON("examHistory", []),
      q_stats: safeGetJSON("qStats", {}),
      sign_stats: safeGetJSON("signStats", {})
    };
  }

  // Applies a server row to localStorage without re-triggering a push back
  // to the server for each field (safeSet* would otherwise mark local data
  // as "just changed" and cause us to immediately re-upload what we just
  // downloaded).
  function applyServerProgress(row) {
    if (!row) return;
    safeSetJSON("signStatus", row.sign_status || {});
    safeSetNumber("streak", row.streak || 0);
    safeSetNumber("bestScore", row.best_score || 0);
    safeSetNumber("sliceBestScore", row.slice_best_score || 0);
    safeSetJSON("examHistory", row.exam_history || []);
    safeSetJSON("qStats", row.q_stats || {});
    safeSetJSON("signStats", row.sign_stats || {});
    try {
      var ts = row.updated_at ? new Date(row.updated_at).getTime() : Date.now();
      if (!isNaN(ts)) localStorage.setItem("localUpdatedAt", String(ts));
    } catch (e) {
      // localStorage unavailable: nothing more we can do, in-memory state
      // for this page load is already correct.
    }
  }

  function getLocalUpdatedAt() {
    return safeGetNumber("localUpdatedAt", 0);
  }

  async function pushToServer(userId) {
    if (!client || !userId) return;
    pushInFlight = true;
    setSyncStatus("syncing");
    var payload = collectLocalProgress();
    payload.user_id = userId;
    payload.updated_at = new Date().toISOString();
    try {
      var result = await client.from(PROGRESS_TABLE).upsert(payload, { onConflict: "user_id" });
      pushInFlight = false;
      if (result.error) {
        setSyncStatus("error");
        retryPending = true;
        return;
      }
      try {
        localStorage.setItem("localUpdatedAt", String(new Date(payload.updated_at).getTime()));
      } catch (e) {}
      setSyncStatus("done");
    } catch (err) {
      // Réseau indisponible (hors-ligne) le plus souvent.
      pushInFlight = false;
      setSyncStatus("error");
      retryPending = true;
    }
  }

  function debouncedPush() {
    if (!currentSession || !currentSession.user) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    var userId = currentSession.user.id;
    debounceTimer = setTimeout(function () {
      pushToServer(userId);
    }, DEBOUNCE_MS);
  }

  async function reconcile(session) {
    if (!client || !session || !session.user) return;
    setSyncStatus("syncing");
    try {
      var result = await client
        .from(PROGRESS_TABLE)
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (result.error) {
        setSyncStatus("error");
        retryPending = true;
        return;
      }

      var row = result.data;
      if (!row) {
        // Aucune ligne serveur pour ce compte: premier login, on pousse les
        // données locales actuelles pour ne rien perdre.
        await pushToServer(session.user.id);
        return;
      }

      var serverTime = row.updated_at ? new Date(row.updated_at).getTime() : 0;
      var localTime = getLocalUpdatedAt();

      if (serverTime > localTime) {
        applyServerProgress(row);
        setSyncStatus("done");
      } else if (localTime > serverTime) {
        await pushToServer(session.user.id);
      } else {
        setSyncStatus("done");
      }
    } catch (err) {
      // Hors-ligne: on ne bloque rien, on retentera au retour du réseau ou
      // à la prochaine modification locale.
      setSyncStatus("error");
      retryPending = true;
    }
  }

  window.addEventListener("progress:changed", function () {
    if (!currentSession || !currentSession.user) return;
    debouncedPush();
  });

  window.addEventListener("online", function () {
    if (!currentSession || !currentSession.user) return;
    if (retryPending && !pushInFlight) {
      retryPending = false;
      pushToServer(currentSession.user.id);
    }
  });

  window.addEventListener("supabase:auth-changed", function (evt) {
    var session = (evt.detail && evt.detail.session) || null;
    var hadSession = !!(currentSession && currentSession.user);
    currentSession = session;
    if (session && session.user && !hadSession) {
      reconcile(session);
    }
    if (!session) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      retryPending = false;
      setSyncStatus("idle");
    }
  });

  window.addEventListener("supabase:ready", function (evt) {
    client = window.supabaseClient || null;
    // Pas de client (hors-ligne/CDN injoignable) : ce script reste inactif,
    // aucun appel réseau n'est jamais tenté.
  });

  if (window.supabaseClient) client = window.supabaseClient;
})();
