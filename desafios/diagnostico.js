/* Diagnóstico RH · Jornada do Colaborador
   Cada resposta vale de 1 a 4 pontos (a alternativa mais estruturada vale 4).
   As alternativas aparecem embaralhadas, para ninguém "descobrir" que a A é sempre a melhor. */
(function () {
  const WA = "5586981251547";
  const SLUG = "diagnostico-jornada";
  const CODE = "Diagnóstico RH";
  const card = document.getElementById("quiz");

  /* ---------- Áreas da jornada ---------- */
  const AREAS = {
    rs:   { name: "Recrutamento e Seleção",     short: "recrutamento",   step: "Recrutar" },
    adm:  { name: "Admissão",                   short: "admissão",                 step: "Admitir" },
    int:  { name: "Integração",                 short: "integração",               step: "Integrar" },
    cult: { name: "Cultura",                    short: "cultura",                  step: "Cultura" },
    cond: { name: "Conduta e Regras",           short: "conduta",                  step: "Conduta" },
    com:  { name: "Comunicação Interna",        short: "comunicação interna",      step: "Comunicar" },
    lid:  { name: "Liderança e Feedback",       short: "liderança",    step: "Liderar" },
    dev:  { name: "Desenvolvimento",            short: "desenvolvimento",          step: "Desenvolver" },
    exp:  { name: "Experiência do Colaborador", short: "experiência do colaborador", step: "Engajar" },
    ret:  { name: "Retenção e Desligamento",    short: "retenção", step: "Reter" }
  };
  const AREA_KEYS = Object.keys(AREAS);

  const LEVELS = [
    { min: 3.5, key: "forte", label: "Ponto forte" },
    { min: 2.5, key: "dev",   label: "Em desenvolvimento" },
    { min: 1.5, key: "opo",   label: "Oportunidade de melhoria" },
    { min: 0,   key: "pri",   label: "Prioridade" }
  ];
  const level = s => LEVELS.find(l => s >= l.min);

  /* ---------- Perguntas (options em ordem: 4, 3, 2, 1 pontos) ---------- */
  const QUESTIONS = [
    { area: "rs", stage: "Recrutamento",
      text: "Quando sua empresa precisa contratar, como normalmente acontece o processo?",
      options: [
        "Existe uma descrição clara da vaga, com perfil desejado, critérios e etapas definidas.",
        "Alguns critérios são definidos, mas o processo varia de acordo com a vaga.",
        "O perfil vai sendo definido durante o processo e muitas decisões são informais.",
        "A prioridade é preencher a vaga rápido, sem um processo estruturado."
      ] },
    { area: "rs", stage: "Critérios de seleção",
      text: "Na hora de escolher entre os candidatos, como a empresa decide quem contratar?",
      options: [
        "Com critérios definidos antes: competências, experiência, comportamento e aderência à função.",
        "Existem alguns critérios, mas a decisão ainda depende bastante da percepção do gestor.",
        "Experiência e disponibilidade do candidato pesam mais do que critérios estruturados.",
        "A decisão costuma ser subjetiva ou guiada pela urgência da contratação."
      ] },
    { area: "adm", stage: "Admissão",
      text: "Depois que o candidato é aprovado, como acontece a admissão?",
      options: [
        "Existe um fluxo organizado, com checklist, documentos, responsáveis e acompanhamento das etapas.",
        "Existe um processo, mas algumas etapas ainda dependem de organização manual.",
        "A admissão vai acontecendo conforme as demandas surgem.",
        "É comum ter dúvidas, atrasos ou documentos que precisam ser pedidos de novo."
      ] },
    { area: "int", stage: "Primeiro dia e integração",
      text: "Como um novo colaborador é recebido nos primeiros dias?",
      options: [
        "Com uma integração estruturada: empresa, equipe, função, regras, cultura e rotinas.",
        "Ele recebe as principais informações, mas a integração não segue um padrão.",
        "Cada gestor ou setor recebe o novo colaborador de um jeito diferente.",
        "Ele começa a trabalhar e vai aprendendo conforme as situações aparecem."
      ] },
    { area: "cult", stage: "Cultura",
      text: "O quanto os colaboradores conhecem e entendem a cultura da empresa?",
      options: [
        "Os valores são claros e são apresentados, praticados e reforçados no dia a dia.",
        "Os valores estão definidos, mas nem sempre se traduzem na rotina.",
        "A cultura aparece principalmente no jeito como cada gestor conduz o trabalho.",
        "A cultura ainda não está claramente definida nem comunicada."
      ] },
    { area: "cond", stage: "Conduta e regras",
      text: "Como a empresa orienta os colaboradores sobre comportamento, responsabilidades e regras internas?",
      options: [
        "As regras e expectativas estão organizadas, são comunicadas e há um padrão para lidar com problemas de conduta.",
        "Existem regras, mas parte delas é passada só verbalmente.",
        "As orientações acontecem principalmente quando surge algum problema.",
        "Muitas situações são resolvidas caso a caso, sem critérios definidos antes."
      ] },
    { area: "com", stage: "Comunicação interna",
      text: "Como as informações importantes chegam aos colaboradores?",
      options: [
        "Por canais e rotinas definidos, de maneira organizada.",
        "A comunicação funciona, mas depende bastante de cada gestor ou setor.",
        "Boa parte das informações circula informalmente ou por mensagens soltas.",
        "É comum ter informação desencontrada, ruído e dúvidas que se repetem."
      ] },
    { area: "lid", stage: "Liderança e feedback",
      text: "Como os líderes acompanham e desenvolvem suas equipes?",
      options: [
        "Com conversas de acompanhamento e feedbacks frequentes e estruturados.",
        "Os líderes dão feedback, mas geralmente de forma pontual.",
        "O feedback aparece principalmente quando existe um problema ou erro.",
        "O acompanhamento é raro e não existe uma rotina de feedback."
      ] },
    { area: "dev", stage: "Desenvolvimento",
      text: "Como a empresa identifica e trabalha o desenvolvimento dos colaboradores?",
      options: [
        "Com ações estruturadas: treinamentos, acompanhamento de competências ou PDI.",
        "Com algumas ações de desenvolvimento, mas sem frequência ou método definidos.",
        "Os treinamentos acontecem principalmente quando surge uma necessidade urgente.",
        "O desenvolvimento das pessoas ainda não faz parte da rotina."
      ] },
    { area: "exp", stage: "Experiência do colaborador",
      text: "Como a empresa percebe se os colaboradores estão satisfeitos, engajados ou com dificuldades?",
      options: [
        "Acompanhando de forma contínua, com conversas, pesquisas, indicadores ou outras ferramentas.",
        "Os gestores conversam com as equipes, mas sem um método definido.",
        "Os problemas aparecem principalmente quando surgem reclamações ou conflitos.",
        "Não existe acompanhamento da experiência dos colaboradores."
      ] },
    { area: "ret", stage: "Retenção e desligamento",
      text: "Quando um colaborador sai da empresa, o que normalmente acontece?",
      options: [
        "A empresa busca entender os motivos e usa essas informações para melhorar.",
        "Há uma conversa com o colaborador, mas os motivos nem sempre são registrados ou analisados.",
        "O foco é fazer o desligamento e substituir a pessoa.",
        "A saída é tratada apenas como uma questão operacional."
      ] },
    { area: null, stage: "Visão da jornada",
      text: "Pensando em toda a trajetória do colaborador, do recrutamento ao desligamento, como você avalia sua empresa hoje?",
      options: [
        "Temos processos estruturados, responsáveis definidos e acompanhamos a jornada.",
        "Temos uma boa estrutura, mas algumas etapas ainda precisam ser padronizadas.",
        "Temos boas práticas, mas muita coisa depende das pessoas e da rotina de cada setor.",
        "Precisamos estruturar boa parte da jornada do colaborador."
      ] }
  ];

  /* ---------- Resultado geral (pontuação de 12 a 48) ---------- */
  const BANDS = [
    { min: 42, key: "forte", tone: "Jornada estruturada", emoji: "🌿",
      body: "<p>Sua empresa tem uma estrutura consistente na gestão da jornada do colaborador, com processos e práticas que mostram organização da contratação ao acompanhamento das pessoas.</p><p>O próximo passo é descobrir onde essa estrutura pode ganhar ainda mais consistência e estratégia.</p>",
      strongTitle: "Seus pontos fortes", weakTitle: "Oportunidades de melhoria" },
    { min: 33, key: "dev", tone: "Jornada em desenvolvimento", emoji: "🌱",
      body: "<p>Sua empresa já tem boas práticas de gestão de pessoas, mas algumas etapas ainda dependem muito das pessoas, da rotina ou do jeito de cada gestor.</p><p><b>Existe uma boa base.</b> O desafio agora é transformar boas práticas em processos claros e consistentes.</p>",
      strongTitle: "Você está melhor em", weakTitle: "Oportunidades de melhoria" },
    { min: 24, key: "opo", tone: "Jornada com pontos de atenção", emoji: "🔎",
      body: "<p>Sua empresa tem práticas importantes, mas algumas etapas da jornada podem estar acontecendo de maneira informal ou sem um padrão.</p><p>Isso costuma gerar retrabalho, ruído na comunicação, integrações difíceis e decisões que dependem demais de pessoas específicas. <b>O momento é de organizar, padronizar e estruturar.</b></p>",
      strongTitle: "Áreas mais estruturadas", weakTitle: "Principais oportunidades" },
    { min: 0, key: "pri", tone: "Jornada pouco estruturada", emoji: "🧭",
      body: "<p>O diagnóstico mostra oportunidades importantes de estruturação na jornada do colaborador.</p><p>Antes de pensar em contratar mais gente ou cobrar mais resultado, vale olhar para os processos que sustentam a experiência de quem trabalha na empresa. <b>A boa notícia: tudo isso pode ser organizado, passo a passo.</b></p>",
      strongTitle: "Já apresentam alguma estrutura", weakTitle: "Prioridades identificadas" }
  ];

  /* ---------- Serviços ligados a cada área ---------- */
  const SERVICES = {
    kitRS: { name: "Kit Recrutamento e Seleção", desc: "Da requisição da vaga ao retorno ao candidato, com a sua marca." },
    kitAI: { name: "Kit Admissão e Integração", desc: "Do primeiro documento ao primeiro dia do colaborador." },
    kitCC: { name: "Kit Cultura e Conduta", desc: "Código de conduta, políticas internas e valores que saem do papel." },
    pdi:   { name: "Desenvolve (PDI)", desc: "Um plano de desenvolvimento para cada colaborador, com acompanhamento por 3 meses." },
    diag:  { name: "Reunião de diagnóstico", desc: "Uma conversa para olhar comunicação, clima e retenção de perto e definir o plano." }
  };
  const AREA_SERVICE = { rs: "kitRS", adm: "kitAI", int: "kitAI", cult: "kitCC", cond: "kitCC", lid: "pdi", dev: "pdi", com: "diag", exp: "diag", ret: "diag" };

  /* ---------- utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; };
  const num = n => String(Math.round(n * 10) / 10).replace(".", ",");
  const list = a => a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(", ") + " e " + a[a.length - 1];
  const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = (what, title) => { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: `${SLUG}/${what}`, title: `${CODE}: ${title}`, event: true }); } catch (e) {} };

  let order = [], answers = [], i = 0, started = false, busy = false;

  let first = true;
  function render(html) {
    card.innerHTML = `<div class="screen">${html}</div>`;
    const h = card.querySelector("h1,h2,.qt");
    if (first) { first = false; return; }
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    const top = card.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: Math.max(0, top + window.scrollY - 16), behavior: reduced ? "auto" : "smooth" });
  }

  /* ---------- Tela inicial ---------- */
  function intro() {
    const steps = ["Recrutar", "Admitir", "Integrar", "Engajar", "Desenvolver", "Reter"];
    render(`<div class="intro">
      <img class="logo" src="../../assets/logo.png" alt="">
      <p class="eyebrow">${CODE} · Gratuito</p>
      <h1>Como está a <em>jornada do colaborador</em> na sua empresa?</h1>
      <p>Do primeiro contato com um candidato até o dia em que alguém sai da empresa, cada etapa influencia resultado, clima e retenção.</p>
      <p>Responda 12 perguntas e receba o <b>raio-x da sua empresa</b>: onde ela já é forte e o que merece atenção agora.</p>
      <ol class="journey" aria-label="Etapas avaliadas">${steps.map(s => `<li>${s}</li>`).join("")}</ol>
      <div class="chips"><span>12 perguntas</span><span>3 minutos</span><span>Resultado na hora</span></div>
      <button class="btn" id="start">Começar o diagnóstico →</button>
      <p class="by">Não existe resposta certa: responda pensando no que acontece <i>hoje</i>, não no ideal.</p></div>`);
    document.getElementById("start").onclick = start;
  }

  function start() {
    track(started ? "refez" : "comecou", started ? "refez o diagnóstico" : "começou");
    started = true;
    i = 0; answers = new Array(QUESTIONS.length).fill(null);
    order = QUESTIONS.map(q => ({ ...q, opts: shuffle(q.options.map((t, k) => ({ t, pts: 4 - k, letter: "ABCD"[k] }))) }));
    question();
  }

  /* ---------- Pergunta ---------- */
  function question() {
    busy = false;
    const q = order[i], n = order.length, sel = answers[i];
    const dots = order.map((_, k) => `<i class="${k < i ? "done" : k === i ? "now" : ""}"></i>`).join("");
    const opts = q.opts.map((o, k) => `<button class="opt${sel === k ? " sel" : ""}" data-k="${k}" aria-pressed="${sel === k}"><span class="let">${"ABCD"[k]}</span><span>${esc(o.t)}</span></button>`).join("");
    render(`<div class="prog">
        <div class="prog-top"><span>Pergunta ${i + 1} de ${n}</span>${i > 0 ? `<button class="prev" id="prev">← Voltar</button>` : `<span>${CODE}</span>`}</div>
        <div class="track" aria-hidden="true">${dots}</div>
      </div>
      <p class="stage"><span>${String(i + 1).padStart(2, "0")}</span> ${esc(q.stage)}</p>
      <p class="qt">${esc(q.text)}</p>
      <div class="opts" role="group" aria-label="Alternativas">${opts}</div>
      <p class="hint">Escolha a opção que mais se parece com a realidade da sua empresa.</p>`);
    card.querySelectorAll(".opt").forEach(b => b.onclick = () => choose(+b.dataset.k));
    const p = document.getElementById("prev");
    if (p) p.onclick = () => { if (!busy) { i--; question(); } };
  }

  function choose(k) {
    if (busy) return;
    busy = true;
    answers[i] = k;
    const o = order[i].opts[k];
    track(`p${String(i + 1).padStart(2, "0")}-${o.letter}`, `pergunta ${i + 1}: ${o.letter} (${o.pts} pts)`);
    card.querySelectorAll(".opt").forEach((b, j) => {
      b.classList.toggle("sel", j === k);
      b.setAttribute("aria-pressed", j === k);
      if (j !== k) b.classList.add("dim");
    });
    setTimeout(() => { i++; i < order.length ? question() : loading(); }, reduced ? 120 : 480);
  }

  document.addEventListener("keydown", e => {
    if (!card.querySelector(".opt") || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "abcd".indexOf(e.key.toLowerCase());
    if (k >= 0 && k < order[i].opts.length) choose(k);
  });

  /* ---------- "Montando o raio-x" ---------- */
  function loading() {
    render(`<div class="loading" role="status">
      <div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <h2>Montando o raio-x da sua <em>jornada</em>…</h2>
      <p>Cruzando suas 12 respostas, etapa por etapa.</p></div>`);
    setTimeout(result, reduced ? 300 : 1600);
  }

  /* ---------- Cálculo ---------- */
  function compute() {
    const pts = order.map((q, k) => q.opts[answers[k]].pts);
    const total = pts.reduce((a, b) => a + b, 0);
    const sums = {}, counts = {};
    order.forEach((q, k) => { if (!q.area) return; sums[q.area] = (sums[q.area] || 0) + pts[k]; counts[q.area] = (counts[q.area] || 0) + 1; });
    const areas = AREA_KEYS.map((key, idx) => ({ key, idx, ...AREAS[key], score: sums[key] / counts[key] }));
    areas.forEach(a => a.level = level(a.score));
    const band = BANDS.find(b => total >= b.min);

    const max = Math.max(...areas.map(a => a.score)), min = Math.min(...areas.map(a => a.score));
    const desc = areas.slice().sort((a, b) => b.score - a.score || a.idx - b.idx);
    const asc = areas.slice().sort((a, b) => a.score - b.score || a.idx - b.idx);

    let strong = desc.filter(a => a.score >= 3.5);
    if (!strong.length && max > min) strong = desc.filter(a => a.score === max);
    let weak = asc.filter(a => a.score <= 2);
    if (!weak.length && max > min) weak = asc.filter(a => a.score === min);
    strong = strong.filter(a => !weak.includes(a));

    const journeyAvg = areas.reduce((a, b) => a + b.score, 0) / areas.length;
    const self = pts[pts.length - 1];
    return { pts, total, areas, band, strong, weak, max, min, journeyAvg, self, letters: order.map((q, k) => q.opts[answers[k]].letter) };
  }

  function summary(r) {
    const s = r.strong.slice(0, 3).map(a => a.short), w = r.weak.slice(0, 3).map(a => a.short);
    if (r.max === r.min) {
      return r.max >= 3.5 ? "Todas as etapas da jornada aparecem bem estruturadas na sua empresa."
        : `Todas as etapas da jornada estão no mesmo nível hoje: <b>${r.areas[0].level.label.toLowerCase()}</b>.`;
    }
    if (r.band.key === "forte" && r.weak.some(a => a.score <= 2))
      return `Sua estrutura geral é forte, mas <b>${list(w)}</b> aparece${w.length > 1 ? "m" : ""} como oportunidade${w.length > 1 ? "s" : ""} de melhoria.`;
    if (s.length && w.length) return `Sua empresa é forte em <b>${list(s)}</b>, mas apresenta oportunidades de melhoria em <b>${list(w)}</b>.`;
    if (s.length) return `Sua empresa é forte em <b>${list(s)}</b>.`;
    return `As prioridades da sua empresa hoje são <b>${list(w)}</b>.`;
  }

  function perception(r) {
    const d = r.self - r.journeyAvg;
    if (d >= 0.75) return { icon: "👀", title: "Sua percepção está acima das respostas",
      text: `Você deu ${r.self}/4 para a jornada como um todo, mas a média das etapas ficou em ${num(r.journeyAvg)}/4. É muito comum: quem está dentro da rotina se acostuma com o improviso e deixa de enxergar o que falta.` };
    if (d <= -0.75) return { icon: "💡", title: "Você foi mais exigente que as respostas",
      text: `Você deu ${r.self}/4 para a jornada como um todo, mas a média das etapas ficou em ${num(r.journeyAvg)}/4. Existe mais estrutura do que parece: dá para partir do que já funciona.` };
    return { icon: "🎯", title: "Sua percepção bate com as respostas",
      text: `Você deu ${r.self}/4 para a jornada como um todo e a média das etapas ficou em ${num(r.journeyAvg)}/4. Bom sinal: você conhece bem a realidade da sua empresa.` };
  }

  function nextSteps(r) {
    const picks = [];
    r.areas.slice().sort((a, b) => a.score - b.score || a.idx - b.idx).forEach(a => {
      const s = AREA_SERVICE[a.key];
      if (a.score < 3.5 && !picks.some(p => p.id === s)) picks.push({ id: s, ...SERVICES[s], from: [] });
      const p = picks.find(p => p.id === s);
      if (p && a.score < 3.5) p.from.push(a.name);
    });
    return picks.length ? picks.slice(0, 2) : [{ id: "diag", ...SERVICES.diag, desc: "Sua jornada está bem estruturada. Uma conversa ajuda a encontrar onde ela pode ganhar ainda mais consistência.", from: [] }];
  }

  /* ---------- Resultado ---------- */
  function result() {
    const r = compute(), b = r.band, p = perception(r), steps = nextSteps(r);
    track(`terminou-${b.key}-${r.total}`, `terminou: ${b.tone} (${r.total}/48)`);
    track(`respostas-${r.letters.join("")}`, `respostas ${r.letters.join("")}`);

    const chips = arr => arr.map(a => `<span class="chip lv-${a.level.key}">${esc(a.name)}</span>`).join("");
    const xray = r.areas.map(a => `<li class="lv-${a.level.key}">
        <div class="x-top"><span class="x-name">${esc(a.name)}</span><span class="x-score">${num(a.score)}<small>/4</small></span></div>
        <div class="x-bar"><i data-w="${(a.score / 4) * 100}"></i></div>
        <span class="x-lv">${a.level.label}</span></li>`).join("");

    const msg = [
      "Oi, Luana! Fiz o Diagnóstico da Jornada do Colaborador e quero analisar meu resultado.",
      "",
      `📊 Resultado: ${r.total}/48 · ${b.tone}`,
      r.strong.length ? `✅ ${b.strongTitle}: ${r.strong.map(a => a.name).join(", ")}` : "",
      r.weak.length ? `⚠️ ${b.weakTitle}: ${r.weak.map(a => a.name).join(", ")}` : "",
      "",
      "Raio-X:",
      ...r.areas.map(a => `• ${a.name}: ${num(a.score)}/4`),
      `• Minha avaliação geral: ${r.self}/4`
    ].filter((l, k, arr) => !(l === "" && arr[k - 1] === "")).join("\n");

    render(`<div class="res">
      <div class="res-head">
        <p class="eyebrow">Seu diagnóstico</p>
        <div class="score" aria-label="${r.total} de 48 pontos">${r.total}<small>/48</small></div>
      </div>
      <h2 class="lv-${b.key}"><span aria-hidden="true">${b.emoji}</span> ${esc(b.tone)}</h2>
      <p class="summary">${summary(r)}</p>
      ${b.body}

      <section class="block">
        <h3>📊 Seu raio-x da <em>jornada</em></h3>
        <ul class="xray">${xray}</ul>
        <ul class="legend" aria-label="Legenda">${LEVELS.map(l => `<li class="lv-${l.key}"><b></b>${l.label}</li>`).join("")}</ul>
      </section>

      ${r.strong.length || r.weak.length ? `<section class="block groups">
        ${r.strong.length ? `<div><h4>${b.strongTitle}</h4><div class="chips-l">${chips(r.strong)}</div></div>` : ""}
        ${r.weak.length ? `<div><h4>${b.weakTitle}</h4><div class="chips-l">${chips(r.weak)}</div></div>` : ""}
      </section>` : ""}

      <section class="block persp">
        <span class="p-ico" aria-hidden="true">${p.icon}</span>
        <div><h4>${p.title}</h4><p>${p.text}</p></div>
      </section>

      <section class="block cta">
        <p class="eyebrow">E agora?</p>
        <h3>O que fazer com <em>esse diagnóstico?</em></h3>
        <p>Identificar uma oportunidade é o primeiro passo. Transformar em melhoria é o próximo. Pelas suas respostas, eu começaria por aqui:</p>
        <ol class="steps">${steps.map(s => `<li><b>${esc(s.name)}</b><span>${esc(s.desc)}</span>${s.from.length ? `<small>Para: ${esc(s.from.join(" · "))}</small>` : ""}</li>`).join("")}</ol>
        <a class="btn gold" id="wa" href="${wa(msg)}" target="_blank" rel="noopener">Quero analisar meu resultado</a>
        <p class="note">Seu raio-x vai junto na mensagem. Vamos marcar uma conversa e ver quais ações fazem sentido para a realidade da sua empresa.</p>
      </section>

      <div class="actions"><button class="link" id="again">↺ Refazer o diagnóstico</button><button class="link" id="share">↗ Compartilhar</button></div>
      <p class="toast" id="toast" aria-live="polite"></p>
    </div>`);

    requestAnimationFrame(() => setTimeout(() => card.querySelectorAll(".x-bar i").forEach((el, k) => {
      el.style.transitionDelay = reduced ? "0s" : k * 70 + "ms";
      el.style.width = el.dataset.w + "%";
    }), 60));
    document.getElementById("again").onclick = start;
    document.getElementById("wa").addEventListener("click", () => track(`whatsapp-${b.key}`, `clicou no WhatsApp (${b.tone})`));
    document.getElementById("share").onclick = share;
  }

  async function share() {
    track("compartilhou", "clicou em compartilhar");
    const url = location.href.split("#")[0].split("?")[0];
    const text = "Fiz o diagnóstico da jornada do colaborador da Luana Carvalho RH e recebi o raio-x da minha empresa. Como está a sua? 👇";
    const t = document.getElementById("toast");
    if (navigator.share) { try { await navigator.share({ title: CODE, text, url }); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(`${text} ${url}`); t.textContent = "Link copiado! É só colar onde quiser."; }
    catch (e) { t.textContent = url; }
  }

  intro();
})();
