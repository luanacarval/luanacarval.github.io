/* Desafio RH #02 · Sua empresa está organizada ou sobrevivendo no improviso?
   8 perguntas (2 por área) + um espaço para a pessoa contar o problema.
   Nada do que a pessoa escreve é salvo no site: o texto só sai daqui se ela enviar pelo WhatsApp. */
(function () {
  const WA = "5586981251547";
  const CODE = "Desafio RH #02";
  const SLUG = "desafio-02";
  const card = document.getElementById("quiz");

  /* ---------- Áreas (perfis) ---------- */
  const AREAS = {
    bomb: { name: "Dono no centro de tudo", short: "tudo depende do dono" },
    rec:  { name: "Contratação e chegada",  short: "contratação e integração" },
    eq:   { name: "Equipe e comunicação",   short: "comunicação e feedback" },
    org:  { name: "Escala e documentos",    short: "escala e documentos" }
  };
  const AREA_ORDER = ["org", "bomb", "rec", "eq"]; // desempate: a escala nova vem primeiro
  const SIGNAL = [
    { key: "ok",   label: "Tranquilo" },
    { key: "warn", label: "Atenção" },
    { key: "fire", label: "Pegando fogo" }
  ];

  /* ---------- Perguntas: a primeira opção de cada uma é a "organizada" ---------- */
  const QUESTIONS = [
    { area: "bomb",
      text: "Se você ficar 3 dias longe da empresa, o que acontece?",
      options: [
        ["Tudo funciona. Até estranham a minha ausência.", "Olha só! Pode tirar férias sem levar o notebook. 🏖️"],
        ["Me ligam só pra tirar umas dúvidas… umas 47.", "47 ligações é carinho ou é falta de processo? 😅"],
        ["O grupo da empresa vira o SAC do proprietário.", "Atendimento 24h, sem folga e sem salário extra. Clássico."],
        ["Melhor nem testar esse experimento.", "Entendi. A empresa é você, e você não descansa desde 2019."]
      ] },
    { area: "org",
      text: "A escala 6x1 acabou: a nova regra prevê no máximo 42 horas por semana e duas folgas, com prazo até 15 de dezembro. Na sua empresa…",
      options: [
        ["Já refizemos a escala e conversamos com a equipe.", "Adiantado(a)! Dezembro vai ser tranquilo por aí. 👏"],
        ["Vimos a notícia… e ficou por isso mesmo.", "Dezembro chega rápido. Bora olhar isso com calma antes?"],
        ["Achei que era fake news do grupo da família.", "Dessa vez era verdade. A emenda já foi promulgada. 😬"],
        ["Isso é com o contador. Né? …Né?", "O contador ajuda na lei. Mas quem reorganiza a escala da equipe?"]
      ] },
    { area: "rec",
      text: "Abriu uma vaga. Como funciona a seleção por aí?",
      options: [
        ["Perfil definido, etapas e critérios claros.", "Isso é recrutamento de verdade. Aplausos. 👏"],
        ["Post no Instagram e muita fé.", "A fé move montanhas, mas não faz entrevista estruturada."],
        ["Indicação do primo do vizinho.", "Indicação ajuda, mas sem critério vira loteria. 🎲"],
        ["Contrata quem chegar primeiro. A vaga era pra ontem!", "Contratação na pressa costuma virar demissão na pressa."]
      ] },
    { area: "rec",
      text: "Primeiro dia do funcionário novo. Como ele é recebido?",
      options: [
        ["Integração: empresa, regras, equipe e função.", "Primeira impressão nota 10. Ele vai ficar. ✨"],
        ["“Senta ali e observa o Fulano.”", "E se o Fulano tiver os vícios dele… o novo aprende todos."],
        ["Ele descobre as regras quando quebra uma.", "Aprendizado na marra: rápido, mas caro."],
        ["Ninguém lembrava que ele começava hoje.", "Ele também vai esquecer de voltar amanhã. 👀"]
      ] },
    { area: "org",
      text: "Se eu pedir a descrição dos cargos da sua empresa, eu recebo…",
      options: [
        ["Documentos atualizados, prontinhos.", "Uau. Posso mostrar essa resposta pros outros? 😍"],
        ["Um arquivo de 2019 que ninguém abre.", "Pelo menos existe! Já é um começo."],
        ["Um “depois a gente vê”.", "O famoso “depois” que nunca chega."],
        ["“Descrição de quê?”", "Tudo bem, a gente começa do zero. Eu sei fazer isso. 😉"]
      ] },
    { area: "eq",
      text: "Como um aviso importante chega até a equipe?",
      options: [
        ["Canal oficial e uma reunião rápida.", "Comunicação clara. Ninguém pode dizer que não sabia."],
        ["Áudio de 7 minutos no grupo.", "Metade ouviu em 2x, a outra metade não ouviu. 🎧"],
        ["Boca a boca. Cada um conta uma versão.", "Telefone sem fio corporativo: sempre dá errado."],
        ["A equipe descobre quando já aconteceu.", "Surpresa! Só que ninguém gosta desse tipo. 😬"]
      ] },
    { area: "eq",
      text: "O funcionário sabe como está o desempenho dele?",
      options: [
        ["Sabe: tem feedback frequente.", "Equipe que sabe onde está, sabe pra onde ir. 🎯"],
        ["Só quando ele erra.", "Feedback só no erro vira bronca, não desenvolvimento."],
        ["Descobre no dia da demissão.", "Aí já não dá mais tempo de melhorar, né?"],
        ["Feedback aqui é “tá bom, continua”.", "Simpático, mas não ajuda ninguém a crescer."]
      ] },
    { area: "bomb",
      text: "Quem decide tudo, do cliente novo ao papel higiênico?",
      options: [
        ["Cada um decide dentro da sua função.", "Delegar é arte, e você domina. 🎨"],
        ["Eu, mas estou aprendendo a delegar.", "Reconhecer já é metade do caminho. Bora pra outra metade?"],
        ["Eu. Sempre eu.", "Você é o RH, o financeiro, o comercial e o estoque? 🧯"],
        ["Eu, e ainda dizem que eu centralizo.", "Será que dizem por quê? 😂"]
      ] }
  ];

  const CHIPS = [
    "A nova escala 5x2", "Contratar a pessoa certa", "Gente que sai rápido",
    "Faltas e atrasos", "Conflitos na equipe", "Tudo depende de mim", "Falta de regras claras"
  ];

  /* ---------- Perfis de resultado ---------- */
  const PROFILES = {
    bomb: { emoji: "🧯", title: "O Empresário Bombeiro",
      lead: "Você passa o dia apagando incêndio, e a empresa gira em torno de você.",
      body: "Tudo depende do dono: as dúvidas, as decisões e até o que já deveria estar resolvido. As demandas se acumulam e os problemas são resolvidos na urgência. Não é falta de esforço, é falta de estrutura.",
      help: "Organizar funções, responsabilidades e rotinas para a empresa andar sem precisar de você em cada detalhe." },
    rec: { emoji: "🎲", title: "O Recrutador no Improviso",
      lead: "A empresa contrata… e torce para dar certo.",
      body: "A vaga abre com pressa, a seleção depende da sorte e o novo funcionário chega sem uma recepção de verdade. O resultado costuma ser gente que não fica, e o ciclo recomeça.",
      help: "Um processo de recrutamento com perfil e critérios, e uma integração que faz a pessoa querer ficar." },
    eq: { emoji: "🎧", title: "A Banda Desafinada",
      lead: "Tem gente boa, mas cada um toca uma música diferente.",
      body: "Os avisos se perdem, o feedback só aparece quando dá problema e ninguém sabe muito bem como está indo. Aí surgem os ruídos, os conflitos e a sensação de que a equipe não rende o que poderia.",
      help: "Alinhamento, rotina de feedback e um plano de desenvolvimento para cada pessoa da equipe." },
    org: { emoji: "🗓️", title: "O Calendário em Pânico",
      lead: "A escala nova vem aí, e os documentos estão… em algum lugar.",
      body: "Jornada, folgas, cargos e regras ainda vivem na cabeça de alguém ou num arquivo esquecido. Com a escala 5x2 chegando, isso deixa de ser detalhe: é hora de reorganizar a rotina antes que ela te reorganize.",
      help: "Reorganizar escalas e rotinas para a nova jornada, com regras e documentos claros. A parte jurídica, alinhamos com o seu contador ou advogado." },
    top: { emoji: "🏆", title: "A Empresa Redondinha",
      lead: "Pode emoldurar esse resultado e pendurar na recepção.",
      body: "Processos claros, equipe alinhada e um dono que consegue tirar férias. Raro, viu? O desafio agora é manter tudo isso funcionando enquanto a empresa cresce (e enquanto a escala muda).",
      help: "Uma conversa para encontrar o que ainda dá para lapidar, antes que vire problema." }
  };

  /* ---------- utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; } return a; };
  const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const track = (what, title) => { try { if (window.goatcounter && goatcounter.count) goatcounter.count({ path: `${SLUG}/${what}`, title: `${CODE}: ${title}`, event: true }); } catch (e) {} };

  let order = [], picks = [], i = 0, started = false;
  let problem = "", name = "", chosen = [];

  let first = true;
  function render(html) {
    card.innerHTML = `<div class="screen">${html}</div>`;
    const h = card.querySelector("h1,h2,.qt");
    if (first) { first = false; return; }
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    const t = card.getBoundingClientRect().top;
    if (t < 0) window.scrollTo({ top: Math.max(0, t + window.scrollY - 16), behavior: reduced ? "auto" : "smooth" });
  }

  /* ---------- Abertura ---------- */
  function intro() {
    render(`<div class="intro">
      <img class="logo" src="../../assets/logo.png" alt="">
      <p class="eyebrow">${CODE}</p>
      <h1>Sua empresa está organizada ou <em>sobrevivendo no improviso?</em></h1>
      <p>Uma brincadeira rápida, mas que pode revelar onde sua empresa está perdendo tempo, dinheiro e energia. Responda com sinceridade: ninguém vai ver suas respostas. 🤫</p>
      <div class="chips"><span>8 perguntas</span><span>Tem a escala nova 🗓️</span><span>Resultado na hora</span></div>
      <button class="btn" id="start">Bora descobrir →</button>
      <p class="by">por Luana Carvalho · Recursos Humanos</p></div>`);
    document.getElementById("start").onclick = start;
  }

  function start() {
    track(started ? "refez" : "comecou", started ? "refez o desafio" : "começou");
    started = true;
    i = 0; picks = [];
    order = QUESTIONS.map(q => ({ ...q, opts: shuffle(q.options.map(([t, r], k) => ({ t, r, ok: k === 0, k }))) }));
    question();
  }

  /* ---------- Pergunta ---------- */
  function question() {
    const q = order[i], n = order.length;
    const opts = q.opts.map((o, k) => `<button class="opt" data-k="${k}"><span class="let">${"ABCD"[k]}</span><span>${esc(o.t)}</span></button>`).join("");
    render(`<div class="prog"><div class="prog-top"><span>Pergunta ${i + 1} de ${n}</span><span>${CODE}</span></div><div class="bar"><i style="width:${(i / (n + 1)) * 100}%"></i></div></div>
      <p class="qt">${esc(q.text)}</p>
      <div class="opts" role="group" aria-label="Alternativas">${opts}</div>
      <div id="after" aria-live="polite"></div>`);
    requestAnimationFrame(() => { const b = card.querySelector(".bar i"); if (b) b.style.width = ((i + 1) / (n + 1)) * 100 + "%"; });
    card.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.k));
  }

  function answer(k) {
    const q = order[i], o = q.opts[k];
    picks[i] = o;
    track(`p${i + 1}-${"abcd"[o.k]}`, `pergunta ${i + 1}: opção ${"ABCD"[o.k]}`);
    card.querySelectorAll(".opt").forEach((b, j) => {
      b.disabled = true;
      if (j === k) b.classList.add("pick"); else b.classList.add("dim");
    });
    const last = i === order.length - 1;
    document.getElementById("after").innerHTML = `<div class="react ${o.ok ? "good" : ""}"><span class="react-ico" aria-hidden="true">${o.ok ? "✓" : "💬"}</span><p>${esc(o.r)}</p></div>
      <button class="btn next" id="next">${last ? "Quase lá →" : "Próxima pergunta →"}</button>`;
    const nx = document.getElementById("next");
    nx.onclick = () => { i++; last ? problemStep() : question(); };
    nx.focus({ preventScroll: true });
    nx.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }

  /* ---------- Espaço para contar o problema ---------- */
  function problemStep() {
    const n = order.length;
    render(`<div class="prog"><div class="prog-top"><span>Última etapa</span><span>${CODE}</span></div><div class="bar"><i style="width:${(n / (n + 1)) * 100}%"></i></div></div>
      <p class="eyebrow tight">Agora é sério (só um pouquinho)</p>
      <h2 class="ask">Qual problema está <em>tirando o seu sono</em> na empresa?</h2>
      <p class="sub">Toque em um ou mais temas e, se quiser, conte com as suas palavras. É o que eu vou ler primeiro quando você me chamar.</p>
      <div class="pchips" role="group" aria-label="Temas">${CHIPS.map(c => `<button class="pchip${chosen.includes(c) ? " on" : ""}" aria-pressed="${chosen.includes(c)}">${esc(c)}</button>`).join("")}</div>
      <label class="fl" for="prob">O que está acontecendo? <span>(opcional)</span></label>
      <textarea id="prob" maxlength="500" rows="4" placeholder="Ex.: contratei 3 pessoas para a mesma vaga este ano e nenhuma ficou.">${esc(problem)}</textarea>
      <div class="count" id="cnt" aria-live="polite">${problem.length}/500</div>
      <label class="fl" for="nome">Seu nome <span>(opcional)</span></label>
      <input id="nome" type="text" maxlength="60" autocomplete="given-name" value="${esc(name)}" placeholder="Como posso te chamar?">
      <p class="priv">🔒 Nada disso fica salvo no site. Só chega até mim se você enviar pelo WhatsApp no final.</p>
      <button class="btn next" id="see">Ver meu resultado →</button>`);
    card.querySelectorAll(".pchip").forEach(b => b.onclick = () => {
      const c = b.textContent;
      chosen = chosen.includes(c) ? chosen.filter(x => x !== c) : chosen.concat(c);
      b.classList.toggle("on"); b.setAttribute("aria-pressed", chosen.includes(c));
    });
    const ta = document.getElementById("prob"), cnt = document.getElementById("cnt");
    ta.oninput = () => { problem = ta.value; cnt.textContent = `${ta.value.length}/500`; };
    document.getElementById("nome").oninput = e => { name = e.target.value; };
    document.getElementById("see").onclick = () => {
      problem = ta.value.trim(); name = document.getElementById("nome").value.trim();
      track(problem ? "contou-problema" : "sem-problema", problem ? "escreveu o problema" : "não escreveu o problema");
      chosen.forEach(c => track(`tema-${c.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`, `tema: ${c}`));
      loading();
    };
  }

  function loading() {
    render(`<div class="loading" role="status">
      <div class="spin" aria-hidden="true">🧐</div>
      <h2>Analisando o nível de <em>improviso</em>…</h2>
      <p>Prometo não contar pra ninguém.</p></div>`);
    setTimeout(result, reduced ? 300 : 1500);
  }

  /* ---------- Resultado ---------- */
  function result() {
    const counts = { bomb: 0, rec: 0, eq: 0, org: 0 };
    let ok = 0;
    order.forEach((q, k) => { if (picks[k].ok) ok++; else counts[q.area]++; });
    const max = Math.max(...Object.values(counts));
    const mainKey = ok >= 7 ? "top" : AREA_ORDER.find(a => counts[a] === max);
    const second = mainKey === "top" ? null : AREA_ORDER.filter(a => a !== mainKey && counts[a] > 0).sort((a, b) => counts[b] - counts[a])[0];
    const p = PROFILES[mainKey];
    track(`resultado-${mainKey}`, `resultado: ${p.title} (${ok}/8 organizadas)`);

    const meters = AREA_ORDER.map(a => { const s = SIGNAL[counts[a]]; return `<li class="sg-${s.key}">
      <span class="m-name">${AREAS[a].name}</span>
      <span class="m-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="m-lv">${s.label}</span></li>`; }).join("");

    const topics = chosen.length ? chosen.join(", ") : "";
    const lines = [
      `Oi, Luana!${name ? ` Aqui é ${name}.` : ""} Fiz o ${CODE} e deu: ${p.title} ${p.emoji}`,
      second ? `E com um pezinho em: ${PROFILES[second].title}.` : "",
      "",
      topics ? `O que mais pega aqui: ${topics}.` : "",
      problem ? `O que está acontecendo: "${problem}"` : "",
      "",
      mainKey === "top" ? "Quero manter a empresa redondinha. Vamos conversar?" : "Pode me ajudar a resolver isso?"
    ].filter((l, k, arr) => !(l === "" && (k === 0 || arr[k - 1] === ""))).join("\n").trim();

    render(`<div class="res">
      <div class="res-top">
        <div class="emoji" aria-hidden="true">${p.emoji}</div>
        <div><p class="eyebrow tight">Seu perfil é</p><h2>${esc(p.title)}</h2></div>
      </div>
      <p class="lead2">${esc(p.lead)}</p>
      <p>${esc(p.body)}</p>
      ${second ? `<p class="also">E com um pezinho em: <b>${esc(PROFILES[second].title)}</b> ${PROFILES[second].emoji}</p>` : ""}

      <section class="meter">
        <h3>Onde a empresa <em>mais sente</em></h3>
        <ul>${meters}</ul>
      </section>

      ${problem || topics ? `<section class="note">
        <p class="eyebrow tight">Anotei aqui ✍️</p>
        ${topics ? `<div class="note-tags">${chosen.map(c => `<span>${esc(c)}</span>`).join("")}</div>` : ""}
        ${problem ? `<blockquote>“${esc(problem)}”</blockquote>` : ""}
        <p class="note-tail">${problem ? "Isso tem solução, e é exatamente o tipo de coisa que eu ajudo a resolver." : "Me conta mais sobre isso no WhatsApp?"}</p>
      </section>` : ""}

      <section class="cta">
        <p class="eyebrow">E agora?</p>
        <h3>O diagnóstico acabou. <em>Os problemas podem esperar?</em></h3>
        <p>Você não precisa resolver tudo de uma vez. Meu trabalho é entender a realidade do seu negócio, definir as prioridades e transformar problemas que se repetem em processos organizados.</p>
        <p class="how"><b>Como eu te ajudo:</b> ${esc(p.help)}</p>
        <a class="btn gold" id="wa" href="${wa(lines)}" target="_blank" rel="noopener">${mainKey === "top" ? "Bora conversar sobre seu RH" : "Quero resolver isso com a Luana"}</a>
        <p class="hint2">${problem ? "Seu perfil e o problema que você contou já vão escritos na mensagem." : "Seu perfil já vai escrito na mensagem. É só enviar."}</p>
      </section>

      <div class="actions"><button class="link" id="again">↺ Refazer o desafio</button><button class="link" id="share">↗ Desafiar um amigo empresário</button></div>
      <p class="toast" id="toast" aria-live="polite"></p>
    </div>`);
    document.getElementById("again").onclick = start;
    document.getElementById("wa").addEventListener("click", () => track(`whatsapp-${mainKey}`, `clicou no WhatsApp (${p.title}${problem ? ", com problema" : ""})`));
    document.getElementById("share").onclick = () => share(p);
  }

  async function share(p) {
    track("compartilhou", "clicou em compartilhar");
    const url = location.href.split("#")[0].split("?")[0];
    const text = `Fiz o ${CODE} da Luana Carvalho RH e minha empresa é "${p.title}" ${p.emoji} Duvido você ter coragem de fazer. 👇`;
    const t = document.getElementById("toast");
    if (navigator.share) { try { await navigator.share({ title: CODE, text, url }); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(`${text} ${url}`); t.textContent = "Link copiado! É só colar onde quiser."; }
    catch (e) { t.textContent = url; }
  }

  intro();
})();
