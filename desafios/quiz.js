/* Motor dos Desafios RH. Cada quiz define window.QUIZ antes de carregar este arquivo. */
(function () {
  const Q = window.QUIZ;
  const WA = "5586981251547";
  const card = document.getElementById("quiz");
  let order = [], i = 0, score = 0;

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; };
  const pick = (a, d) => (a && a.length ? a[Math.floor(Math.random() * a.length)] : d);
  const slug = Q.slug || "desafio";
  const track = (what, title) => { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: `${slug}/${what}`, title: `${Q.code}: ${title}`, event: true }); } catch (e) {} };
  const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  let first = true;
  function render(html, special) {
    card.classList.toggle("special", !!special);
    card.innerHTML = `<div class="screen">${html}</div>`;
    const h = card.querySelector("h1,h2,.qt");
    if (first) { first = false; return; }
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function intro() {
    render(`<div class="intro">
      <img class="logo" src="../../assets/logo.png" alt="">
      <p class="eyebrow">${esc(Q.code)}</p>
      <h1>${Q.titleHtml}</h1>
      <p>${esc(Q.intro)}</p>
      <div class="chips">${(Q.chips || [Q.questions.length + " perguntas", "1 minuto", "Resultado na hora"]).map(c => `<span>${esc(c)}</span>`).join("")}</div>
      <button class="btn" id="start">Começar o desafio →</button>
      <p class="by">por Luana Carvalho · Recursos Humanos</p></div>`);
    document.getElementById("start").onclick = start;
  }

  function start() {
    track(i || score ? "refez" : "comecou", i || score ? "refez o desafio" : "começou");
    i = 0; score = 0;
    order = Q.questions.map(q => {
      const opts = q.options.map((t, k) => ({ t, right: k === q.answer, trap: k === q.trap }));
      return { ...q, opts: q.trueFalse ? opts : shuffle(opts) };
    });
    question();
  }

  function question() {
    const q = order[i], n = order.length;
    const opts = q.opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="let">${q.trueFalse ? o.t[0] : "ABCD"[k]}</span><span>${esc(o.t)}</span></button>`).join("");
    render(`<div class="prog"><div class="prog-top"><span>Pergunta ${i + 1} de ${n}</span><span>${Q.code}</span></div><div class="bar"><i style="width:${(i / n) * 100}%"></i></div></div>
      <p class="qt">${esc(q.text)}</p>
      <div class="opts ${q.trueFalse ? "tf" : ""}" role="group" aria-label="Alternativas">${opts}</div>
      <div id="after" aria-live="polite"></div>`);
    requestAnimationFrame(() => { const b = card.querySelector(".bar i"); if (b) b.style.width = ((i + 1) / n) * 100 + "%"; });
    card.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.k));
  }

  function answer(k) {
    const q = order[i], right = q.opts[k].right;
    if (right) score++;
    card.querySelectorAll(".opt").forEach((b, j) => {
      b.disabled = true;
      const o = q.opts[j], let_ = b.querySelector(".let");
      if (o.right) { b.classList.add("ok"); let_.textContent = "✓"; }
      else if (j === k) { b.classList.add("no"); let_.textContent = "✕"; }
      else b.classList.add("dim");
    });
    const last = i === order.length - 1;
    document.getElementById("after").innerHTML = `<div class="fb ${right ? "good" : "bad"}"><strong>${esc(right ? pick(Q.rightLines, "Isso mesmo! ✓") : (q.opts[k].trap && q.trapLine) || pick(Q.wrongLines, "Quase! A resposta certa está em verde."))}</strong>${esc(q.why)}</div>
      <button class="btn next" id="next">${last ? "Ver meu resultado" : "Próxima pergunta"} →</button>`;
    const nx = document.getElementById("next");
    nx.onclick = () => { i++; last ? result() : question(); };
    nx.focus({ preventScroll: true });
    nx.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function result() {
    const n = order.length;
    const r = Q.results.find(r => score >= r.min && score <= r.max);
    track(`terminou-${score}-de-${n}`, `terminou com ${score} de ${n}`);
    const msg = r.whatsapp.replace("{score}", score).replace("{total}", n);
    const tail = `<a class="btn ${r.special ? "gold" : ""}" id="wa" href="${wa(msg)}" target="_blank" rel="noopener">${esc(r.button)}</a>
      <div class="actions"><button class="link" id="again">↺ Refazer o desafio</button><button class="link" id="share">↗ Compartilhar</button></div>
      <p class="toast" id="toast" aria-live="polite"></p>`;
    if (r.special) {
      render(`<div class="res"><div class="score">${score}<small>/${n}</small></div><div class="emoji" aria-hidden="true">${r.emoji}</div>
        <p class="unlock">${esc(r.lead)}</p><h2 class="mode">${esc(r.title)}</h2>${tail}</div>`, true);
    } else {
      render(`<div class="res"><div class="res-head"><div class="emoji" aria-hidden="true">${r.emoji}</div><div class="score">${score}<small>/${n}</small></div></div>
        <h2>${esc(r.title)}</h2>${r.bodyHtml}${tail}</div>`);
    }
    document.getElementById("again").onclick = start;
    document.getElementById("wa").addEventListener("click", () => track(`whatsapp-${score}-de-${n}`, `clicou no WhatsApp (${score} de ${n})`));
    document.getElementById("share").onclick = () => share(score, n);
  }

  async function share(s, n) {
    track("compartilhou", "clicou em compartilhar");
    const url = location.href.split("#")[0].split("?")[0];
    const text = `Fiz o ${Q.code} da Luana Carvalho RH e acertei ${s} de ${n}. Você saberia decidir? 👇`;
    const t = document.getElementById("toast");
    if (navigator.share) { try { await navigator.share({ title: Q.code, text, url }); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(`${text} ${url}`); t.textContent = "Link copiado! É só colar onde quiser."; }
    catch (e) { t.textContent = url; }
  }

  intro();
})();
