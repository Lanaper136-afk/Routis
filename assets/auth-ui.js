// assets/auth-ui.js
//
// UI de connexion / inscription (bouton "Se connecter" + modale) branchée
// sur le client Supabase exposé par assets/supabase-client.js.
//
// Ce script est un <script> classique chargé avec l'attribut `defer` : les
// scripts `defer` et les <script type="module"> s'exécutent tous après le
// parsing du HTML, dans leur ordre d'apparition dans le document — donc ce
// fichier s'exécute bien APRÈS assets/supabase-client.js tant qu'il est
// placé après lui dans le HTML (voir les 7 pages).
//
// Ce script doit rester totalement silencieux et inoffensif si Supabase
// n'est pas disponible (pas de réseau, CDN injoignable...) : dans ce cas le
// bouton "Se connecter" reste affiché mais désactivé, avec une infobulle
// explicative, et le reste du site continue de fonctionner en local.

(function () {
  var client = null;
  var session = null;
  var mode = "login"; // "login" | "signup" | "forgot"

  function $(id) {
    return document.getElementById(id);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  function clearMessages() {
    var err = $("auth-error");
    if (err) {
      err.hidden = true;
      err.textContent = "";
    }
    var ok = $("auth-success");
    if (ok) {
      ok.hidden = true;
      ok.textContent = "";
    }
  }

  function showError(msg) {
    var err = $("auth-error");
    if (err) {
      err.textContent = msg;
      err.hidden = false;
    }
    var ok = $("auth-success");
    if (ok) ok.hidden = true;
  }

  function showSuccess(msg) {
    var ok = $("auth-success");
    if (ok) {
      ok.textContent = msg;
      ok.hidden = false;
    }
    var err = $("auth-error");
    if (err) err.hidden = true;
  }

  function mapAuthError(error) {
    var msg = String((error && error.message) || "").toLowerCase();
    if (msg.indexOf("invalid login credentials") !== -1) return t("auth_err_bad_credentials");
    if (msg.indexOf("email") !== -1 && msg.indexOf("invalid") !== -1) return t("auth_err_invalid_email");
    if (msg.indexOf("password") !== -1 && (msg.indexOf("least") !== -1 || msg.indexOf("short") !== -1 || msg.indexOf("characters") !== -1)) {
      return t("auth_err_short_password");
    }
    return t("auth_err_generic");
  }

  function setMode(nextMode) {
    mode = nextMode;
    clearMessages();
    var passwordField = $("auth-password-field");
    var intro = $("auth-intro");
    var submit = $("auth-submit");
    var forgotLink = $("auth-forgot");
    var tabsActiveMode = mode === "forgot" ? "login" : mode;

    document.querySelectorAll(".auth-tab").forEach(function (tab) {
      tab.classList.toggle("active", tab.dataset.mode === tabsActiveMode);
    });

    if (passwordField) passwordField.hidden = mode === "forgot";
    if (intro) intro.textContent = t("auth_intro_" + mode);
    if (submit) submit.textContent = t("auth_submit_" + mode);
    if (forgotLink) forgotLink.textContent = mode === "forgot" ? t("auth_back_link") : t("auth_forgot_link");
  }

  function updateButtonLabel() {
    var btn = $("auth-button");
    if (!btn) return;
    if (session && session.user) {
      btn.textContent = session.user.email || t("auth_account_btn");
    } else {
      btn.textContent = t("auth_login_btn");
    }
  }

  function openDialog() {
    var dialog = $("auth-dialog");
    if (!dialog) return;
    clearMessages();
    var loggedOut = $("auth-logged-out");
    var loggedIn = $("auth-logged-in");
    if (session && session.user) {
      if (loggedOut) loggedOut.hidden = true;
      if (loggedIn) loggedIn.hidden = false;
      var emailEl = $("auth-account-email");
      if (emailEl) emailEl.textContent = session.user.email || "";
      var statusEl = $("auth-sync-status");
      if (statusEl) statusEl.textContent = "";
    } else {
      if (loggedOut) loggedOut.hidden = false;
      if (loggedIn) loggedIn.hidden = true;
      setMode("login");
    }
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog() {
    var dialog = $("auth-dialog");
    if (dialog && typeof dialog.close === "function") dialog.close();
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();

    if (!client) {
      showError(t("auth_err_unavailable"));
      return;
    }

    var emailInput = $("auth-email");
    var passwordInput = $("auth-password");
    var email = emailInput ? emailInput.value.trim() : "";
    var password = passwordInput ? passwordInput.value : "";

    if (!isValidEmail(email)) {
      showError(t("auth_err_invalid_email"));
      return;
    }
    if (mode !== "forgot" && password.length < 6) {
      showError(t("auth_err_short_password"));
      return;
    }

    var submitBtn = $("auth-submit");
    if (submitBtn) submitBtn.disabled = true;

    try {
      if (mode === "login") {
        var loginResult = await client.auth.signInWithPassword({ email: email, password: password });
        if (loginResult.error) {
          showError(mapAuthError(loginResult.error));
        } else {
          closeDialog();
        }
      } else if (mode === "signup") {
        var signupResult = await client.auth.signUp({ email: email, password: password });
        if (signupResult.error) {
          showError(mapAuthError(signupResult.error));
        } else {
          showSuccess(t("auth_success_signup"));
        }
      } else if (mode === "forgot") {
        var resetResult = await client.auth.resetPasswordForEmail(email);
        if (resetResult.error) {
          showError(mapAuthError(resetResult.error));
        } else {
          showSuccess(t("auth_success_forgot"));
        }
      }
    } catch (err) {
      // Le plus souvent : pas de réseau (mode hors-ligne PWA).
      showError(t("auth_err_generic"));
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  async function handleLogout() {
    if (!client) {
      closeDialog();
      return;
    }
    try {
      await client.auth.signOut();
    } catch (err) {
      // Hors-ligne: on ne peut pas prévenir le serveur, mais on peut quand
      // même effacer la session locale du SDK pour refléter l'intention de
      // l'utilisateur; le SDK gère lui-même ce cas en pratique.
    }
    closeDialog();
  }

  function bindEvents() {
    var authButton = $("auth-button");
    if (authButton) authButton.addEventListener("click", openDialog);

    var form = $("auth-form");
    if (form) form.addEventListener("submit", handleSubmit);

    document.querySelectorAll(".auth-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        setMode(tab.dataset.mode);
      });
    });

    var forgotLink = $("auth-forgot");
    if (forgotLink) {
      forgotLink.addEventListener("click", function () {
        setMode(mode === "forgot" ? "login" : "forgot");
      });
    }

    var logoutBtn = $("auth-logout");
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

    // Garde les textes générés en JS (intro, bouton d'action, lien "mot de
    // passe oublié", libellé du bouton compte) à jour quand la langue change,
    // en plus de la traduction automatique des éléments [data-i18n].
    document.querySelectorAll(".lang-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setMode(mode);
        updateButtonLabel();
      });
    });
  }

  window.addEventListener("supabase:ready", function (evt) {
    client = window.supabaseClient || null;
    var authButton = $("auth-button");
    if (!client && authButton) {
      authButton.disabled = true;
      authButton.title = t("auth_err_unavailable");
    }
  });

  window.addEventListener("supabase:auth-changed", function (evt) {
    session = (evt.detail && evt.detail.session) || null;
    updateButtonLabel();
  });

  if (window.supabaseClient) client = window.supabaseClient;

  bindEvents();
  updateButtonLabel();
})();
