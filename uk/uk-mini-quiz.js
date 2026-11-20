// Mini quiz de fin de cours : 3 questions du thème, tirées de la banque UK.
(function () {
  var box = document.getElementById("mq");
  if (!box || typeof ukQuestions === "undefined") return;
  var theme = box.getAttribute("data-theme");
  var pool = ukQuestions.filter(function (q) { return q.theme === theme; });
  if (pool.length < 3) pool = ukQuestions.slice();
  var qs = pool.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 3);
  var score = 0, answered = 0;
  var result = document.createElement("p"); result.className = "uk-score";
  qs.forEach(function (q) {
    var d = document.createElement("div"); d.className = "uk-q";
    var t = document.createElement("strong"); t.textContent = q.question; d.appendChild(t);
    var why = document.createElement("p"); why.className = "why";
    why.textContent = q.explanation + (q.rule ? " (" + q.rule + ")" : "");
    q.options.forEach(function (o, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.textContent = o;
      b.addEventListener("click", function () {
        if (d.classList.contains("done")) return;
        d.classList.add("done");
        d.querySelectorAll(".opt").forEach(function (x, j) { x.disabled = true; if (j === q.correctIndex) x.classList.add("ok"); });
        if (i === q.correctIndex) score++; else b.classList.add("bad");
        answered++;
        if (answered === qs.length) result.textContent = "Score: " + score + " / " + qs.length;
      });
      d.appendChild(b);
    });
    d.appendChild(why); box.appendChild(d);
  });
  box.appendChild(result);
})();
