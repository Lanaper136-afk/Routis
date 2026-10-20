// Badges: computed from the progress data that is already synced
// (examHistory, qStats, signStats, signStatus, streak), so they follow the
// account automatically. Earned badges are also remembered locally
// ("badgesEarned") so a badge is never lost, and "badgesSeen" avoids showing
// the same pop-up twice. Needs common.js, i18n.js, stats.js.
(function () {
  var THEMES = ["circulation", "conducteur", "route", "usagers", "reglementation", "environnement", "notions", "securite_passagers", "prendre_quitter", "equipements", "secours"];

  function dayKey(d) {
    var x = d || new Date();
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }

  function recordActiveDay() {
    var days = safeGetJSON("activeDays", []);
    var k = dayKey();
    if (days.indexOf(k) === -1) {
      days.push(k);
      safeSetJSON("activeDays", days.slice(-90));
    }
  }

  function longestDayRun() {
    var set = {};
    safeGetJSON("activeDays", []).forEach(function (k) { set[k] = 1; });
    safeGetJSON("examHistory", []).forEach(function (h) {
      var d = new Date(h.date);
      if (!isNaN(d.getTime())) set[dayKey(d)] = 1;
    });
    var keys = Object.keys(set).sort();
    var best = 0, run = 0, prev = null;
    keys.forEach(function (k) {
      var cur = new Date(k + "T12:00:00");
      if (prev && Math.round((cur - prev) / 86400000) === 1) run += 1; else run = 1;
      if (run > best) best = run;
      prev = cur;
    });
    return best;
  }

  function stats() {
    var hist = safeGetJSON("examHistory", []);
    var q = safeGetJSON("qStats", {});
    var s = safeGetJSON("signStats", {});
    var status = safeGetJSON("signStatus", {});
    var answered = 0, mastered = 0, themes = {};
    Object.keys(q).forEach(function (id) {
      var e = q[id];
      answered += (e.correct || 0) + (e.wrong || 0);
      if ((e.box || 1) >= 5) mastered += 1;
      var g = e.group || "autre";
      if (!themes[g]) themes[g] = { c: 0, n: 0 };
      themes[g].c += e.correct || 0;
      themes[g].n += (e.correct || 0) + (e.wrong || 0);
    });
    Object.keys(s).forEach(function (id) {
      answered += (s[id].correct || 0) + (s[id].wrong || 0);
    });
    var learned = Object.keys(status).filter(function (k) { return status[k] === "appris"; }).length;
    return { hist: hist, answered: answered, mastered: mastered, themes: themes, learned: learned,
      streak: safeGetNumber("streak", 0), days: longestDayRun(),
      errorsSessions: safeGetNumber("errorsSessions", 0),
      signTotal: typeof signs !== "undefined" ? signs.length : 148 };
  }

  var BADGES = [
    { id: "first_exam", icon: "🎓", test: function (s) { return s.hist.length >= 1; } },
    { id: "first_pass", icon: "✅", test: function (s) { return s.hist.some(function (h) { return h.passed; }); } },
    { id: "perfect", icon: "💯", test: function (s) { return s.hist.some(function (h) { return h.score === h.total && h.total >= 40; }); } },
    { id: "five_exams", icon: "📝", test: function (s) { return s.hist.length >= 5; } },
    { id: "signs_25", icon: "🚸", test: function (s) { return s.learned >= 25; } },
    { id: "signs_100", icon: "🛑", test: function (s) { return s.learned >= 100; } },
    { id: "signs_all", icon: "🏅", test: function (s) { return s.learned >= s.signTotal && s.signTotal > 0; } },
    { id: "q_100", icon: "🧠", test: function (s) { return s.answered >= 100; } },
    { id: "q_500", icon: "📚", test: function (s) { return s.answered >= 500; } },
    { id: "q_1000", icon: "🚀", test: function (s) { return s.answered >= 1000; } },
    { id: "streak_10", icon: "🔥", test: function (s) { return s.streak >= 10; } },
    { id: "theme_master", icon: "⭐", test: function (s) {
      return THEMES.some(function (th) { var x = s.themes[th]; return x && x.n >= 20 && x.c / x.n >= 0.85; });
    } },
    { id: "all_themes", icon: "🌍", test: function (s) {
      return THEMES.every(function (th) { var x = s.themes[th]; return x && x.n >= 10 && x.c / x.n >= 0.7; });
    } },
    { id: "mastered_50", icon: "🏆", test: function (s) { return s.mastered >= 50; } },
    { id: "days_7", icon: "📅", test: function (s) { return s.days >= 7; } },
    { id: "errors_session", icon: "🔁", test: function (s) { return s.errorsSessions >= 1; } },
    { id: "errors_zero", icon: "✨", test: function (s) { return s.answered >= 50 && typeof countMissedItems === "function" && countMissedItems() === 0; } }
  ];

  function evaluate() {
    var s = stats();
    var stored = safeGetJSON("badgesEarned", {});
    var changed = false;
    var result = BADGES.map(function (b) {
      var ok = false;
      try { ok = !!b.test(s); } catch (e) {}
      if (ok && !stored[b.id]) { stored[b.id] = new Date().toISOString(); changed = true; }
      return { id: b.id, icon: b.icon, earned: !!stored[b.id], date: stored[b.id] || null };
    });
    if (changed) safeSetJSON("badgesEarned", stored);
    return result;
  }

  function toast(text) {
    var box = document.getElementById("badge-toasts");
    if (!box) {
      box = document.createElement("div");
      box.id = "badge-toasts";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      box.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:92vw";
      document.body.appendChild(box);
    }
    var el = document.createElement("div");
    el.style.cssText = "background:#0b2a5b;color:#fff;padding:12px 16px;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.25);font:600 15px/1.3 system-ui,sans-serif";
    el.textContent = text;
    box.appendChild(el);
    setTimeout(function () { el.remove(); }, 6500);
  }

  var running = false;
  function check() {
    if (running) return;
    running = true;
    try {
      var first = localStorage.getItem("badgesSeen") === null;
      var seen = safeGetJSON("badgesSeen", []);
      var list = evaluate();
      var fresh = list.filter(function (b) { return b.earned && seen.indexOf(b.id) === -1; });
      if (fresh.length) {
        safeSetJSON("badgesSeen", seen.concat(fresh.map(function (b) { return b.id; })));
        if (!first) {
          if (fresh.length > 2) toast("🏅 " + t("badge_many", { n: fresh.length }));
          else fresh.forEach(function (b) { toast(b.icon + " " + t("badge_unlocked") + " " + t("badge_" + b.id + "_t")); });
        }
      } else if (first) {
        safeSetJSON("badgesSeen", []);
      }
    } catch (e) {}
    running = false;
  }

  window.RoutisBadges = { evaluate: evaluate, check: check, list: BADGES };
  window.addEventListener("progress:changed", function (e) {
    var k = e && e.detail && e.detail.key;
    if (k === "qStats" || k === "signStats" || k === "examHistory") recordActiveDay();
    setTimeout(check, 300);
  });
  window.addEventListener("load", function () { setTimeout(check, 600); });
})();
