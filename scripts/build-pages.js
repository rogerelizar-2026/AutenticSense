#!/usr/bin/env node
/**
 * scripts/build-pages.js — Gera index.html, hebraico-aramaico.html, grego-koine.html e
 * caixa-de-ferramentas.html a partir de modelos compartilhados + conteúdo canônico.
 * O HTML resultante é estático e legível SEM JavaScript (estudo renderizado como HTML).
 * Tabelas de métodos/ranking são derivadas de data/metodos.js (fonte única dos números).
 */
const fs = require('fs');
const path = require('path');

// ---- carrega data/metodos.js (ESM -> CJS em build local, sem dependências) ----
const metodosSrc = fs.readFileSync(path.join(__dirname, '../data/metodos.js'), 'utf8');
let METODOS, rankingFn;
{
  const body = metodosSrc
    .replace(/^export const /gm, 'const ')
    .replace(/^export function /gm, 'function ');
  const mod = new Function(body + '\n; return { METODOS, ranking };')();
  METODOS = mod.METODOS; rankingFn = mod.ranking;
}
const RANKING = rankingFn();

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ========================= CHROME COMPARTILHADO ========================= */

function header(active) {
  return `
<a class="skip-link" href="#main-content">Pular para o conteúdo principal</a>
<header class="site-header" role="banner">
  <button type="button" class="icon-btn sidebar-toggle" aria-controls="page-sidebar" aria-expanded="false" aria-label="Abrir índice desta página">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
  </button>
  <a class="brand" href="index.html">
    <span class="brand-mark" aria-hidden="true">א</span>
    <span class="brand-name">O Sentido Autêntico</span>
  </a>
  <div class="header-actions">
    <button type="button" id="theme-toggle" class="icon-btn" aria-label="Alternar tema">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <span class="visually-hidden theme-label">Tema</span>
    </button>
  </div>
</header>`;
}

function bottomNav() {
  return `
<nav class="bottom-nav" aria-label="Navegação principal">
  <a href="index.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>
    <span>Início</span>
  </a>
  <a href="hebraico-aramaico.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 20L12 4l6 16"/><path d="M8.5 14h7"/></svg>
    <span>Hebraico</span>
  </a>
  <a href="grego-koine.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 4h7a4 4 0 0 1 0 8H7z"/><path d="M7 12v8"/></svg>
    <span>Grego</span>
  </a>
  <a href="caixa-de-ferramentas.html">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2.3-.6-.6-2.3z"/></svg>
    <span>Ferramentas</span>
  </a>
</nav>`;
}

function footer({ withTermsSections = false } = {}) {
  return `
<footer class="site-footer" role="contentinfo">
  <div class="container">
    <p><strong>O Sentido Autêntico</strong> — Tecnologia e profundidade histórica para conectar você ao sopro original de Deus.</p>
    <p>Idealizador e Curador do Projeto: Rogério Ramão Lopes — contato: <a href="mailto:rogerelizar@gmail.com">rogerelizar@gmail.com</a></p>
    <p>Licenciado sob os termos da licença internacional Creative Commons (Atribuição-Uso Não Comercial-Compartilhamento pela mesma Licença 4.0):
      <a rel="noopener noreferrer external" target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br">creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br</a>.
      Nota sinalizada para revisão do proprietário: o texto "Todos os direitos reservados" convive com a licença CC sem alinhamento definitivo.
    </p>
    <p><em>Aviso educacional:</em> este é material de estudo pessoal; não substitui formação acadêmica formal, mentoria qualificada ou acompanhamento espiritual. Explicações geradas com apoio de IA assistiva <strong>não constituem erudição autoritativa</strong>.</p>
    ${withTermsSections ? `<p><a href="index.html#port-proposito">Propósito e isenção de responsabilidade</a> · <a href="index.html#port-licenca">Licença e direitos autorais</a></p>` : ''}
    <p>© 2026 Rogério Ramão Lopes. Todos os direitos reservados; ver também nota Creative Commons acima.</p>
  </div>
</footer>`;
}

function updateBanner() {
  return `
<div id="update-banner" class="terms-bar" hidden role="status">
  <p>Nova versão disponível<span id="update-version"></span><span id="update-version-code" hidden>2026.09.1</span></p>
  <span style="display:flex;gap:8px;flex-wrap:wrap">
    <button type="button" id="update-apply" class="btn btn-accent">Atualizar</button>
    <button type="button" id="update-dismiss" class="btn">Depois</button>
  </span>
</div>`;
}

function installNotes() {
  return `
<div id="ios-install-note" class="callout" hidden>
  <p style="margin:0"><strong>Para instalar no iPhone/iPad (Safari):</strong> toque no botão Compartilhar e escolha "Adicionar à Tela de Início". O modo offline funciona para as páginas já visitadas.</p>
</div>`;
}

function termsDialog() {
  return `
<dialog id="terms-dialog" class="modal" aria-labelledby="terms-title" aria-describedby="terms-desc">
  <form method="dialog" id="terms-form">
    <div class="modal-head">
      <h2 id="terms-title">Antes de começar: propósito e diretrizes</h2>
    </div>
    <div class="modal-body" id="terms-desc">
      <p>Bem-vindo(a) à sua jornada. Leia com atenção: o texto completo abaixo dispensa rolagem para operar a confirmação — a caixa de seleção e os botões ficam fixos nesta janela.</p>
      <h3>Propósito e Isenção de Responsabilidade</h3>
      <p>Este material <strong>NÃO</strong> tem o propósito de:</p>
      <ul>
        <li>Formar hermeneutas ou exegetas profissionais</li>
        <li>Substituir formação acadêmica formal em teologia ou línguas bíblicas</li>
        <li>Fornecer certificação ou credenciamento acadêmico</li>
        <li>Estabelecer doutrinas ou interpretações teológicas definitivas</li>
        <li>Substituir o acompanhamento de professores qualificados ou mentores espirituais</li>
      </ul>
      <p>Este material <strong>TEM</strong> o propósito de:</p>
      <ul>
        <li>Oferecer um recurso imparcial e abrangente para o início do aprendizado</li>
        <li>Apresentar diferentes métodos e abordagens de forma organizada</li>
        <li>Auxiliar na escolha de recursos adequados ao perfil de cada aprendiz</li>
        <li>Facilitar o acesso a informações sobre o estudo dessas línguas</li>
        <li>Encorajar o estudo pessoal das Escrituras em seus idiomas originais</li>
      </ul>
      <p>O estudo das línguas bíblicas é um complemento valioso à leitura das traduções, mas não substitui a orientação espiritual, o discipulado comunitário e a busca por sabedoria divina. Use estes recursos com humildade, respeito e discernimento.</p>
      <h3>Licença e Direitos Autorais</h3>
      <p>Este projeto foi idealizado e desenvolvido sob a curadoria teológica e acadêmica de Rogério Ramão Lopes em Setembro de 2026.<br>
      Todos os direitos reservados. Licenciado sob os termos da licença internacional Creative Commons. Você está livre para compartilhar e adaptar o material, desde que atribua o crédito apropriado ao autor, não o utilize para fins comerciais e distribua suas contribuições sob a mesma licença.</p>
      <div class="callout warn">
        <p style="margin:0"><span class="flag">Sinalizado para revisão do proprietário:</span> os textos "Todos os direitos reservados" e Creative Commons convivem — aguardando alinhamento; nenhuma resolução automática foi aplicada.</p>
      </div>
      <label class="checkbox-row" for="terms-checkbox" style="margin-top:16px">
        <input type="checkbox" id="terms-checkbox" name="terms-checkbox">
        <span>Compreendo e aceito o propósito, as isenções de responsabilidade e as diretrizes de estudo pessoal.</span>
      </label>
    </div>
    <div class="modal-foot">
      <button type="button" id="terms-later" class="btn btn-ghost">Ler depois</button>
      <button type="button" id="terms-cancel" class="btn">Fechar sem aceitar</button>
      <button type="submit" id="terms-accept" class="btn btn-primary" disabled>Aceitar e continuar</button>
    </div>
  </form>
</dialog>`;
}

function pageShell({ file, title, desc, canonicalId, sections, content, extraHead = '', pageId, hasSidebar = true }) {
  const sideLinks = sections.map(s => `<a href="#${s.id}">${esc(s.title)}</a>`).join('\n        ');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="https://rogerelizar.github.io/o_sentido_autentico/${file}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="https://rogerelizar.github.io/o_sentido_autentico/${file}">
<meta property="og:image" content="https://rogerelizar.github.io/o_sentido_autentico/assets/img/og-cover.svg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0F3731">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="assets/icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/icons/app-icon-192.png">
<script src="js/base-path.js"></script>
<script src="js/theme-bootstrap.js"></script>
<link rel="preload" href="assets/fonts/inter/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/base.css">
${extraHead}
</head>
<body class="page-body ${hasSidebar ? 'has-sidebar' : ''}" data-page="${pageId}">
${header()}
<div id="sidebar-backdrop" class="sidebar-backdrop" hidden></div>
<div class="container layout">
  ${hasSidebar ? `
  <aside class="sidebar" id="page-sidebar" aria-label="Índice de seções desta página">
    <div class="side-head">
      <h2>Nesta página</h2>
      <button type="button" class="icon-btn close-side" aria-label="Fechar índice">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <nav>
        ${sideLinks}
    </nav>
    <div style="padding:0 16px 16px">
      <h2 style="font-size:1rem">Acessibilidade</h2>
      <div id="a11y-bar" class="chips-row" role="group" aria-label="Controles de acessibilidade">
        <button type="button" id="font-minus" class="chip" aria-label="Diminuir tamanho do texto">A−</button>
        <button type="button" id="font-plus" class="chip" aria-label="Aumentar tamanho do texto">A+</button>
        <button type="button" id="font-reset" class="chip">A reset</button>
        <button type="button" id="dys-toggle" class="chip" aria-pressed="false">Fonte p/ dislexia</button>
        <button type="button" id="contrast-toggle" class="chip" aria-pressed="false">Alto contraste</button>
        <button type="button" id="motion-toggle" class="chip" aria-pressed="false">Menos movimento</button>
        <button type="button" id="tts-read" class="chip" aria-pressed="false">Ler em voz alta</button>
        <button type="button" id="tts-stop" class="chip">Parar leitura</button>
      </div>
      <p id="a11y-status" role="status" aria-live="polite" class="note-editorial" style="min-height:1.2em;margin:8px 0 0"></p>
      <p class="note-editorial" style="margin:8px 0 0">Nota honesta: as vozes do sistema em português não pronunciam corretamente palavras em hebraico, aramaico ou grego.</p>
    </div>
  </aside>` : ''}
  <main id="main-content" tabindex="-1">
${content}
  </main>
</div>
${installNotes()}
${updateBanner()}
${footer({ withTermsSections: true })}
${termsDialog()}
<div id="toast-region" class="toast-region" role="status" aria-live="polite"></div>
${bottomNav()}
<script type="module" src="js/pages/${pageId}.js"></script>
</body>
</html>`;
}

/* ========================= TABELAS DERIVADAS DE data/metodos.js ========================= */

function methodsTableHTML(langLabel) {
  const rows = METODOS.map((m, i) => `
      <tr>
        <td>${i + 1}</td>
        <th scope="row">${esc(m.nome)}</th>
        <td>${m.grupo === 'professor' ? 'Centrado no professor' : m.grupo === 'aluno' ? 'Centrado no aluno' : 'Centrado no texto'}</td>
        <td>${m.foco.map(esc).join(', ')}</td>
        <td>${m.eficacia}</td>
        <td>${m.tempoSemanal}</td>
        <td>${m.complexidade}</td>
      </tr>`).join('');
  return `
  <div class="table-scroll" role="region" tabindex="0" aria-label="Tabela dos 25 métodos analisados para ${langLabel}">
    <table class="data">
      <caption>Os 25 métodos analisados — ${langLabel}. Eficácia (0–10), tempo semanal (h) e complexidade (1–10) são ESTIMATIVAS EDITORIAIS do curador, não medidas científicas.</caption>
      <thead>
        <tr><th scope="col">#</th><th scope="col">Método</th><th scope="col">Abordagem</th><th scope="col">Foco principal</th><th scope="col">Eficácia*</th><th scope="col">Tempo/sem (h)*</th><th scope="col">Complexidade*</th></tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>
  </div>
  <p class="note-editorial">* Estimativa editorial (0–10 / horas semanais estimadas pelo curador para progresso consistente).</p>`;
}

function didacticGroupsHTML() {
  const g = (k) => METODOS.filter(m => m.grupo === k);
  const li = (arr) => arr.map(m => `<li><strong>${esc(m.nome)}:</strong> foco em ${m.foco.map(esc).join(', ')}; eficácia estimada ${m.eficacia}/10.</li>`).join('\n');
  return `
  <details class="acc" open>
    <summary>Centrados no professor</summary>
    <div class="acc-body"><ul>${li(g('professor'))}</ul>
      <p>Vantagem: sequência segura e correção experiente. Risco: passividade do aluno e custo. Para uso doméstico, vídeo-cursos bem estruturados reproduzem parte desse papel.</p></div>
  </details>
  <details class="acc">
    <summary>Centrados no aluno</summary>
    <div class="acc-body"><ul>${li(g('aluno'))}</ul>
      <p>Vantagem: autonomia e rotina possível (30–60 min/dia). Risco: vícios fossilizados sem correção externa; combine com feedback pontual (coaching ou comunidade).</p></div>
  </details>
  <details class="acc">
    <summary>Centrados no texto</summary>
    <div class="acc-body"><ul>${li(g('texto'))}</ul>
      <p>Vantagem: contato direto com o texto bíblico desde cedo — o objetivo final do estudo. Risco: frustração inicial se o aluno começar sem fundação de alfabeto e formas básicas.</p></div>
  </details>`;
}

function rankingTableHTML(id) {
  const rows = RANKING.map((m, i) => `
      <tr>
        <td>${i + 1}</td>
        <th scope="row">${esc(m.nome)}</th>
        <td>${m.eficacia}</td><td>${m.aplicacao}</td><td>${m.sustentabilidade}</td><td>${m.facilidade}</td>
        <td>${m.score.toFixed(2)}</td>
      </tr>`).join('');
  return `
  <div class="table-scroll" role="region" tabindex="0" aria-label="Ranking de eficácia dos métodos" id="${id}-rank-region">
    <table class="data">
      <caption>Ranking derivado dos critérios da tabela anterior. Fórmula transparente: 0,35×eficácia + 0,30×aplicação ao texto + 0,20×sustentabilidade + 0,15×facilidade de início (todos estimativas editoriais).</caption>
      <thead>
        <tr><th scope="col">#</th><th scope="col">Método</th><th scope="col">Eficácia</th><th scope="col">Aplicação</th><th scope="col">Sustentab.</th><th scope="col">Facilidade</th><th scope="col">Score</th></tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>
  </div>`;
}

function chartsBlockHTML(prefix) {
  return `
  <p><button type="button" id="${prefix}-charts-btn" class="btn btn-primary">Mostrar gráficos</button>
     <span id="${prefix}-charts-status" role="status" aria-live="polite" class="note-editorial" style="margin-left:8px">Os gráficos carregam a biblioteca local somente quando você aciona o botão. As tabelas acima contêm exatamente os mesmos dados.</span></p>
  <div id="${prefix}-charts" class="grid" hidden>
    <div class="card chart-block">
      <h3>Complexidade × tempo semanal (bolhas = eficácia)</h3>
      <div style="position:relative;height:320px"><canvas data-chart="scatter" role="img" aria-label="Gráfico de bolhas: complexidade versus tempo semanal dos 25 métodos; os valores exatos estão na tabela de métodos."></canvas></div>
    </div>
    <div class="card chart-block">
      <h3>Radar — 4 primeiros do ranking</h3>
      <div style="position:relative;height:320px"><canvas data-chart="radar" role="img" aria-label="Gráfico radar dos cinco critérios dos quatro métodos melhor posicionados no ranking acima."></canvas></div>
    </div>
    <div class="card chart-block">
      <h3>Tempo médio semanal estimado</h3>
      <div style="position:relative;height:320px"><canvas data-chart="barras" role="img" aria-label="Gráfico de barras horizontais com o tempo semanal estimado de cada método, ordenado do menor ao maior."></canvas></div>
    </div>
    <div class="card chart-block">
      <h3>Híbrido recomendado × gramática-tradução</h3>
      <div style="position:relative;height:320px"><canvas data-chart="comparativo" role="img" aria-label="Comparação lado a lado entre a integração híbrida e a gramática-tradução nos quatro critérios."></canvas></div>
    </div>
  </div>`;
}

/* ========================= CONTEÚDO: INDEX ========================= */

const portSections = [
  { id: 'port-intro', title: 'Introdução e direcionamento' },
  { id: 'port-livros', title: 'Livros de referência' },
  { id: 'port-mounce-wallace', title: 'Combinação prática: Mounce vs. Wallace' },
  { id: 'port-apps', title: 'Central de aplicativos móveis' },
  { id: 'port-gemini', title: 'Metodologia de aceleração com IA' },
  { id: 'port-infografico', title: 'Mapa de aceleração metodológica' },
  { id: 'port-downloads', title: 'Central de downloads' },
  { id: 'port-instituicoes', title: 'Instituições recomendadas' },
  { id: 'port-cafezinho', title: 'Me paga um cafezinho?' },
  { id: 'port-proposito', title: 'Propósito e isenção de responsabilidade' },
  { id: 'port-licenca', title: 'Licença e direitos autorais' },
];

const indexContent = `
  <div class="orig-banner">
    <span lang="grc">Ἐν ἀρχῇ ἦν ὁ λόγος</span>
    <span class="sep" aria-hidden="true">|</span>
    <span lang="he" dir="rtl">בְּרֵאשִׁית בָּרָא אֱלֹהִים</span>
  </div>

  <section id="port-intro" aria-labelledby="h1-index">
    <h1 id="h1-index">Portal do Estudante — O Sentido Autêntico</h1>
    <p class="prose">Iniciar o estudo das línguas bíblicas originais é dar um passo profundo em direção ao conhecimento de Deus nas Escrituras. Essa caminhada repleta de descobertas e de desafios práticos transformará não apenas sua compreensão do texto sagrado, mas também a forma como você enxerga a vida e como viver melhor através dela. <em>("Bem vindo(a) à sua jornada")</em></p>
    <p><strong>Três passos simples para hoje:</strong></p>
    <ol class="prose">
      <li><strong>Escolha uma língua.</strong> Hebraico/Aramaico (Antigo Testamento) ou Grego Koiné (Novo Testamento). Uma por vez.</li>
      <li><strong>Comece pela fundação (Nível 1).</strong> Domine alfabeto, vogais/pontos e pronúncia antes de conjugações.</li>
      <li><strong>Estabeleça a rotina.</strong> 30–60 minutos por dia, com revisão espaçada (Anki) e contato textual diário, superam maratonas de fim de semana.</li>
    </ol>
    <p style="display:flex;gap:12px;flex-wrap:wrap">
      <a href="hebraico-aramaico.html#heb-curriculo" class="btn btn-primary" id="start-studies-btn" data-test="start-btn">Começar meus estudos</a>
      <a href="caixa-de-ferramentas.html" class="btn">Explorar a Caixa de Ferramentas</a>
    </p>
    <p id="continue-reading" hidden><a href="#" id="continue-reading-link" class="btn btn-ghost">Continuar de onde parei →</a></p>

    <div class="grid grid-3" style="margin-top:24px">
      <a class="dest-card card card-hover heb" href="hebraico-aramaico.html">
        <span class="dest-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 20L12 4l6 16"/><path d="M8.5 14h7"/></svg></span>
        <h3>Hebraico e Aramaico</h3>
        <p>Métodos, currículo de 5 níveis, gráficos comparativos e recursos gratuitos para o Antigo Testamento (inclui o aramaico bíblico).</p>
      </a>
      <a class="dest-card card card-hover grk" href="grego-koine.html">
        <span class="dest-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 4h7a4 4 0 0 1 0 8H7z"/><path d="M7 12v8"/></svg></span>
        <h3>Grego Koiné</h3>
        <p>Do alfabeto à sintaxe exegética: currículo espelhado, integração Rega + Wallace e prompts de estudo assistido.</p>
      </a>
      <a class="dest-card card card-hover tool" href="caixa-de-ferramentas.html">
        <span class="dest-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2.3-.6-.6-2.3z"/></svg></span>
        <h3>Ferramentas Bíblicas</h3>
        <p>Catálogo pesquisável com filtros, favoritos, coleção pessoal salva no dispositivo, importação/exportação e descoberta externa.</p>
      </a>
    </div>
  </section>

  <section id="port-livros">
    <h2>Livros de Referência</h2>
    <div class="table-scroll" role="region" tabindex="0" aria-label="Tabela de livros de referência">
      <table class="data">
        <caption>Quatro obras de referência recomendadas pelo curador e seus níveis indicados no plano de 5 níveis.</caption>
        <thead><tr><th scope="col">Obra</th><th scope="col">Autor(es)</th><th scope="col">Editora/linha</th><th scope="col">Níveis indicados</th><th scope="col">Foco didático</th></tr></thead>
        <tbody>
          <tr><th scope="row">Gramática do Hebraico Bíblico</th><td>Allen P. Ross</td><td>Vida</td><td>1–3</td><td>Linguística moderna + tradição filológica; alefato, niqqud e estado construto.</td></tr>
          <tr><th scope="row">Noções do Grego Bíblico</th><td>Lourenço Stelio Rega (e Bergmann, na linha Vida Nova)</td><td>Vida Nova</td><td>1–3</td><td>Didática indutiva, morfologia nominal e declinações, sem jargões excessivos.</td></tr>
          <tr><th scope="row">Basics of Biblical Greek (Mounce)</th><td>William D. Mounce</td><td>Vida Nova (ed. PT)</td><td>1–3</td><td>Sequência semanal clássica ("O que é"): paradigmas e formas, semanas 1–20.</td></tr>
          <tr><th scope="row">Gramática Grega: Sintaxe Exegética</th><td>Daniel B. Wallace</td><td>Batista Regular</td><td>4–5</td><td>Sintaxe exegética ("Por que importa teologicamente"), casos, artigo e tempos verbais.</td></tr>
        </tbody>
      </table>
    </div>
    <div class="grid grid-2" style="margin-top:16px">
      <figure class="card" style="text-align:center"><img src="assets/img/capa-ross.svg" width="220" height="300" alt="Capa ilustrativa (tipográfica, desenhada por este projeto) do livro Gramática do Hebraico Bíblico, de Allen P. Ross." loading="lazy"><figcaption class="note-editorial">capa ilustrativa</figcaption></figure>
      <figure class="card" style="text-align:center"><img src="assets/img/capa-rega.svg" width="220" height="300" alt="Capa ilustrativa (tipográfica, desenhada por este projeto) do livro Noções do Grego Bíblico, de Lourenço Stelio Rega." loading="lazy"><figcaption class="note-editorial">capa ilustrativa</figcaption></figure>
      <figure class="card" style="text-align:center"><img src="assets/img/capa-mounce.svg" width="220" height="300" alt="Capa ilustrativa (tipográfica, desenhada por este projeto) do livro Basics of Biblical Greek, de William D. Mounce." loading="lazy"><figcaption class="note-editorial">capa ilustrativa</figcaption></figure>
      <figure class="card" style="text-align:center"><img src="assets/img/capa-wallace.svg" width="220" height="300" alt="Capa ilustrativa (tipográfica, desenhada por este projeto) do livro Gramática Grega: Sintaxe Exegética, de Daniel B. Wallace." loading="lazy"><figcaption class="note-editorial">capa ilustrativa</figcaption></figure>
    </div>
  </section>

  <section id="port-mounce-wallace">
    <h2>Combinação Prática: Mounce vs. Wallace</h2>
    <div class="grid grid-2">
      <div class="card">
        <h3>Mounce / Rega — "O que é"</h3>
        <ul class="prose">
          <li>Morfologia nominal e verbal; paradigmas e formas.</li>
          <li>Sequência de semanas 1–20 → cobre os Níveis 1–3 do currículo.</li>
          <li>Exercícios de identificação e tradução controlada.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Wallace — "Por que importa teologicamente"</h3>
        <ul class="prose">
          <li>Sintaxe exegética: casos nominais, artigo definido, tempos e aspectos verbais.</li>
          <li>Uso a partir das semanas 21+ → Níveis 4–5.</li>
          <li>Da forma para a função, e da função para a nota exegética.</li>
        </ul>
      </div>
    </div>
    <h3>Ciclo de integração sugerido</h3>
    <ol class="prose">
      <li>Traduza o versículo com Rega/Mounce (forma + sentido básico).</li>
      <li>Faça o parsing morfológico completo de cada palavra relevante.</li>
      <li>Consulte Wallace na seção correspondente à construção encontrada.</li>
      <li>Registre uma nota exegética curta com a sua conclusão.</li>
    </ol>
  </section>

  <section id="port-apps">
    <h2>Central de Aplicativos Móveis</h2>
    <div class="card" style="margin-bottom:16px">
      <h3 style="margin-top:0">Destaque sem anúncios: Sofia App</h3>
      <p class="prose">Ferramenta técnica, limpa e 100% livre de propagandas; integra Strong, GK Codes e domínios semânticos de Louw-Nida. (<a rel="noopener noreferrer external" target="_blank" href="https://sofiaapp.com/">sofiaapp.com</a>)</p>
    </div>
    <ul class="prose">
      <li><strong>Ginoskos</strong> — gramática dinâmica, SRS e vocabulário ativo (hebraico, grego, aramaico, latim, siríaco). Pago.</li>
      <li><strong>Global Bible Tools</strong> — gratuito, sem anúncios, áudio sincronizado e suporte offline.</li>
      <li><strong>Apps populares com anúncios</strong> — úteis para consulta rápida, mas avalie distração e privacidade antes de adotá-los como rotina.</li>
    </ul>
    <p class="note-editorial">Disponibilidade e política de anúncios podem mudar: confirme na loja oficial do aplicativo. A lista completa e atualizável está na <a href="caixa-de-ferramentas.html">Caixa de Ferramentas</a>.</p>
  </section>

  <section id="port-gemini">
    <h2>Metodologia de Aceleração com o Notebook Gemini</h2>
    <div class="callout warn">
      <p style="margin:0"><strong>Regra de ouro:</strong> a IA assiste à prática; nunca substitui a leitura do texto nem produz afirmações autoritativas. Toda explicação de IA deve ser conferida na gramática e nos léxicos escolhidos.</p>
    </div>
    <div class="grid grid-3">
      <div class="card"><h3 style="margin-top:0">1. Ditados e Parsing Reverso</h3><p class="prose">Peça ditado de formas (com transliteração) e converta uma tradução de volta ao original, comparando depois com o texto real.</p></div>
      <div class="card"><h3 style="margin-top:0">2. Morfologia e Desvios</h3><p class="prose">Gere tabelas paradigmáticas e procure desvios irregulares; valide cada resposta na gramática de referência.</p></div>
      <div class="card"><h3 style="margin-top:0">3. Co-Mentoria Exegética</h3><p class="prose">Apresente primeiro a SUA análise; peça à IA objeções e perguntas — não respostas prontas.</p></div>
    </div>
    <p>Prompts prontos e copiáveis estão nas páginas <a href="hebraico-aramaico.html#heb-prompts">Hebraico</a> e <a href="grego-koine.html#grk-prompts">Grego</a>.</p>
  </section>

  <section id="port-infografico">
    <h2>Mapa de Aceleração Metodológica</h2>
    <figure>
      <img src="assets/img/mapa-aceleracao.svg" width="900" height="560" alt="Infográfico vetorial do plano de 5 níveis: Fundação (alfabeto e sons), Básico (formas e categorias), Intermediário (sintaxe essencial), Avançado (exegese com comentário crítico) e Fluência (manutenção com leitura e revisão espaçada), conectados por setas ascendentes." loading="lazy">
      <figcaption class="note-editorial">Infográfico SVG autoral gerado a partir do plano de 5 níveis deste site.</figcaption>
    </figure>
  </section>

  <section id="port-downloads">
    <h2>Central de Downloads</h2>
    <ul class="prose">
      <li><a href="assets/downloads/guia-hebraico-aramaico.svg" download="guia-hebraico-aramaico.svg">Guia rápido — Hebraico e Aramaico (SVG, 1 página)</a></li>
      <li><a href="assets/downloads/guia-grego-koine.svg" download="guia-grego-koine.svg">Guia rápido — Grego Koiné (SVG, 1 página)</a></li>
      <li><a href="assets/downloads/metodologia-ia.svg" download="metodologia-ia.svg">Metodologia de estudo assistido por IA (SVG, 1 página)</a></li>
      <li><a href="assets/downloads/ferramentas-digitais.svg" download="ferramentas-digitais.svg">Mapa de ferramentas digitais (SVG, 1 página)</a></li>
    </ul>
    <p class="note-editorial">Versões PDF: use "Imprimir → Salvar como PDF" do navegador em qualquer página; arquivos PDF adicionais ainda não disponíveis neste repositório.</p>
  </section>

  <section id="port-instituicoes">
    <h2>Instituições Recomendadas</h2>
    <p>Para quem deseja cursar teologia acadêmica formal e aprofundar-se nas línguas originais no Brasil:</p>
    <div class="table-scroll" role="region" tabindex="0" aria-label="Tabela de instituições recomendadas">
      <table class="data">
        <caption>Instituições indicadas pelo curador (lista de referência, não chancela deste projeto).</caption>
        <thead><tr><th scope="col">Instituição</th><th scope="col">UF</th><th scope="col">URL</th></tr></thead>
        <tbody>
          <tr><th scope="row">Faculdade Batista Logos</th><td>SP</td><td><a rel="noopener noreferrer external" target="_blank" href="https://faculdadebatistalogos.edu.br/">faculdadebatistalogos.edu.br</a></td></tr>
          <tr><th scope="row">Seminário Batista do Cariri</th><td>CE</td><td><a rel="noopener noreferrer external" target="_blank" href="https://isbc.com.br/">isbc.com.br</a></td></tr>
          <tr><th scope="row">SBRS — Seminário Batista do Sul</th><td>PR</td><td><a rel="noopener noreferrer external" target="_blank" href="https://sbrscuritiba.com/">sbrscuritiba.com</a></td></tr>
          <tr><th scope="row">AIBREB — Seminários</th><td>Nacional</td><td><a rel="noopener noreferrer external" target="_blank" href="http://aibreb.org.br/instituicoes_seminarios.html">aibreb.org.br/instituicoes_seminarios.html</a></td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="port-cafezinho">
    <h2>Me paga um cafezinho? ☕</h2>
    <p class="prose">O projeto é mantido de forma independente. Se ele ajuda sua caminhada, um apoio voluntário ajuda o projeto a continuar. Chave Pix (e-mail): <strong>rogerelizar@gmail.com</strong></p>
  </section>

  <section id="port-proposito">
    <h2>Propósito e Isenção de Responsabilidade</h2>
    <p>Este material <strong>NÃO</strong> tem o propósito de:</p>
    <ul><li>Formar hermeneutas ou exegetas profissionais</li><li>Substituir formação acadêmica formal em teologia ou línguas bíblicas</li><li>Fornecer certificação ou credenciamento acadêmico</li><li>Estabelecer doutrinas ou interpretações teológicas definitivas</li><li>Substituir o acompanhamento de professores qualificados ou mentores espirituais</li></ul>
    <p>Este material <strong>TEM</strong> o propósito de:</p>
    <ul><li>Oferecer um recurso imparcial e abrangente para o início do aprendizado</li><li>Apresentar diferentes métodos e abordagens de forma organizada</li><li>Auxiliar na escolha de recursos adequados ao perfil de cada aprendiz</li><li>Facilitar o acesso a informações sobre o estudo dessas línguas</li><li>Encorajar o estudo pessoal das Escrituras em seus idiomas originais</li></ul>
    <p class="prose">O estudo das línguas bíblicas é um complemento valioso à leitura das traduções, mas não substitui a orientação espiritual, o discipulado comunitário e a busca por sabedoria divina. Use estes recursos com humildade, respeito e discernimento.</p>
  </section>

  <section id="port-licenca">
    <h2>Licença e Direitos Autorais</h2>
    <p class="prose">Este projeto foi idealizado e desenvolvido sob a curadoria teológica e acadêmica de Rogério Ramão Lopes em Setembro de 2026.</p>
    <p class="prose">Todos os direitos reservados. Licenciado sob os termos da licença internacional Creative Commons. Você está livre para compartilhar e adaptar o material, desde que atribua o crédito apropriado ao autor, não o utilize para fins comerciais e distribua suas contribuições sob a mesma licença. (<a rel="noopener noreferrer external" target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br">CC BY-NC-SA 4.0 — versão em português</a>)</p>
    <div class="callout warn"><p style="margin:0"><span class="flag">Revisão pendente do proprietário:</span> os textos "Todos os direitos reservados" e Creative Commons convivem — sinalizado para alinhamento, sem resolução automática.</p></div>
  </section>
`;

/* ========================= CONTEÚDO: HEBRAICO ========================= */

function curriculoLevels(prefix, levels) {
  return levels.map(l => `
  <details class="acc"${l.open ? ' open' : ''}>
    <summary>${esc(l.titulo)}</summary>
    <div class="acc-body">
      <h3 style="margin-top:0">Objetivos</h3><ul class="prose">${l.objetivos.map(o => `<li>${o}</li>`).join('')}</ul>
      <h3>Materiais gratuitos</h3><ul class="prose">${l.materiais.map(o => `<li>${o}</li>`).join('')}</ul>
      <h3>Estratégias</h3><ul class="prose">${l.estrategias.map(o => `<li>${o}</li>`).join('')}</ul>
      <h3>Checkpoint (autoavaliação honesta)</h3><ul class="prose">${l.check.map(o => `<li>${o}</li>`).join('')}</ul>
    </div>
  </details>`).join('');
}

const hebLevels = [
  { open: true, titulo: 'Nível 1 — Fundação (semanas 1–8): alefato, niqqud e Gênesis 1',
    objetivos: ['Ler o alefato com e sem niqqud', 'Distinguer as sete vogais básicas e shewa', 'Ler Gênesis 1.1–2.3 pausadamente com auxílio de interlinear'],
    materiais: ['Tabelas de alefato impressas (este site)', 'Bible Hub Interlinear', 'Vídeos iniciais de Aleph with Beth', 'Anki (deck de sinais e letras)'],
    estrategias: ['15 min de leitura em voz alta por dia', 'Ditado de 5 palavras diárias', 'Uma ficha nova de som por dia no Anki'],
    check: ['Consigo ler todo o alefato em 2 minutos', 'Identifico vogais longas/curtas em palavras simples'] },
  { titulo: 'Nível 2 — Básico (semanas 9–20): substantivos, Qal perfeito/imperfeito e estado construto',
    objetivos: ['Dominar pronomes sufixos e possessivos', 'Conjugar Qal perfeito e imperfeito', 'Reconhecer estado construto e absouto'],
    materiais: ['Gramática de Ross (capítulos pares como revisão)', 'Sefaria (Texto Massorético + tradução)', 'Listas de frequência das 100 palavras mais comuns'],
    estrategias: ['Parsing diário de 3 versículos', 'Tradução reversa de frases curtas PT→HE', 'Rotina Anki: 10 cartões novos/dia no máximo'],
    check: ['Faço parsing de qualquer verbo Qal forte', 'Leio Jó 1.1–5 com apoio mínimo de dicionário'] },
  { titulo: 'Nível 3 — Intermediário (semanas 21–36): stems verbais, sintaxe essencial e aramaico bíblico',
    objetivos: ['Reconhecer Nifal, Piel/Pual, Hifil/Hofal, Hitpael', 'Ler sintaxe básica de clauses (we-qatal etc.)', 'Ler as seções aramaicas do cânon: Daniel/Esdras e trechos referenciados como leitura — Dt 2:25 (citação aramaica de referência territorial), Jr 10:11 e Et 3:15–4:8'],
    materiais: ['ETCBC (análise sintática interlinear)', 'Passagens aramaicas no Bible Hub Interlinear', 'HALOT em consultas guiadas'],
    estrategias: ['Um capítulo curto por semana sem dicionário (tolerância a ambiguidade)', 'Quadro comparativo de stems feito à mão', 'Co-mentoria com IA usando o prompt padrão deste site'],
    check: ['Identifico o stem de 8 em cada 10 verbos encontrados', 'Leio Jr 10:11 em aramaico com vocabulário próprio'] },
  { titulo: 'Nível 4 — Avançado (semanas 37–56): leitura extensiva e exegese',
    objetivos: ['Ler narrativa hebraica corrida (Jonas, Rute, Ester)', 'Produzir notas exegéticas curtas com aparato (BHS)', 'Usar crítica textual básica (MT × LXX × DSS)'],
    materiais: ['Dead Sea Scrolls Digital Library', 'Step Bible / Bible Hub para aparato', 'Gramática de Ioanescu-Muraoka como consulta'],
    estrategias: ['Projeto exegético mensal (1 perícope)', 'Comparar MT e LXX em Salmos selecionados', 'Apresentar a própria análise antes de pedir feedback'],
    check: ['Concluo uma nota exegética de 1 página por mês', 'Defendo escolhas de tradução com base no texto'] },
  { titulo: 'Nível 5 — Fluência (manutenção)',
    objetivos: ['Manter vocabulário ativo (~400+ formas frequentes)', 'Leitura devocional semanal direta do texto', 'Ensinar/revisar com alguém (consolidação)'],
    materiais: ['Tanakh completo (Sefaria)', 'Decks de manutenção no Anki', 'Comunidade de estudo ou mentor eventual'],
    estrategias: ['3 sessões semanais de 20–30 min', 'Rodízio de gêneros (Torá, Neviim, Ketuvim)', 'Revisão trimestral dos pontos fracos'],
    check: ['Retomo o texto após 2 semanas parado sem perder a base'] },
];

const hebSections = [
  { id: 'heb-intro', title: 'Introdução' },
  { id: 'heb-visao-geral', title: 'Visão geral e estatísticas' },
  { id: 'heb-metodos', title: 'Métodos de aprendizado (25)' },
  { id: 'heb-analise', title: 'Análise didática detalhada' },
  { id: 'heb-ranking', title: 'Ranking de eficácia' },
  { id: 'heb-graficos', title: 'Gráficos comparativos' },
  { id: 'heb-infografico', title: 'Infográfico do percurso' },
  { id: 'heb-gratuitos', title: 'Recursos gratuitos' },
  { id: 'heb-pagos', title: 'Recursos pagos (faixas de preço)' },
  { id: 'heb-metodo-vencedor', title: 'O método vencedor' },
  { id: 'heb-curriculo', title: 'Currículo de 5 níveis' },
  { id: 'heb-anki', title: 'Configuração do Anki' },
  { id: 'heb-prompts', title: 'Prompts de IA (copiáveis)' },
  { id: 'heb-rotina', title: 'Checklist diário e solução de problemas' },
];

const hebContent = `
  <h1 id="h1-heb">Hebraico e Aramaico Bíblico</h1>
  <div class="orig-banner">
    <span lang="he" dir="rtl">בְּרֵאשִׁית בָּרָא אֱלֹהִים</span>
    <span class="sep" aria-hidden="true">·</span>
    <span lang="arc" dir="rtl">מַלְכָּא אֲחַשְׁוֵרוֹשׁ</span>
  </div>

  <section id="heb-intro">
    <p class="prose"><strong>Esta página também cobre o aramaico bíblico.</strong> O aramaico aparece em porções de Esdras, Daniel e Ester e em uma frase em Jeremias 10.11; as mesmas habilidades de leitura, léxico comum e paradigma verbal servem às duas línguas — tratamos aqui como um único percurso "hebraico-aramaico".</p>
    <p class="prose">Objetivo desta seção: apresentar estratégias de estudo, comparar métodos de forma transparente e organizar um currículo pessoal de 5 níveis, sempre como complemento à leitura das traduções e ao discipulado.</p>
  </section>

  <section id="heb-visao-geral">
    <h2>Visão Geral e Estatísticas</h2>
    <ul class="prose">
      <li><strong>Família linguística:</strong> semítica ocidental (mesma família do aramaico, fenício, ugarítico e árabe). Raízes consonânticas de três letras formam famílias de palavras.</li>
      <li><strong>Escrita:</strong> 22 letras consoantes, da direita para a esquerda; cinco letras têm forma final. O sistema de pontos (niqqud) e a cantilação foram acrescentados pelos massoretas para preservar vocalização e entonação.</li>
      <li><strong>Texto:</strong> o Antigo Testamento é majoritariamente hebraico; porções em aramaico bíblico (Ed 4.8–6.18; 7.12–26; Jr 10.11; Dn 2.4b–7.28) compartilham alfabeto e grande parte do vocabulário.</li>
      <li><strong>Ordem de grandeza lexical:</strong> o léxico básico do hebraico bíblico costuma ser ensinado em torno de ~8.000 entradas; as palavras mais frequentes cobrem a maior parte do texto corrido — número arredondado, <em class="note-editorial">estimativa editorial</em>.</li>
    </ul>
    <p class="note-editorial">Sem contagens fabricadas: onde há número, ele vem de característica linguística conhecida ou está marcado como estimativa editorial.</p>
  </section>

  <section id="heb-metodos">
    <h2>Métodos de Aprendizado (25 Métodos Analisados)</h2>
    ${methodsTableHTML('hebraico e aramaico bíblicos')}
  </section>

  <section id="heb-analise">
    <h2>Análise Didática Detalhada</h2>
    ${didacticGroupsHTML()}
  </section>

  <section id="heb-ranking">
    <h2>Ranking de Eficácia</h2>
    <p class="prose">O ranking abaixo é <strong>derivado diretamente</strong> dos valores da tabela de métodos, com pesos declarados no caption da tabela. É uma ferramenta editorial de priorização, não uma medição empírica.</p>
    ${rankingTableHTML('heb')}
  </section>

  <section id="heb-graficos">
    <h2>Gráficos Comparativos</h2>
    ${chartsBlockHTML('heb')}
  </section>

  <section id="heb-infografico">
    <h2>Infográfico do Percurso</h2>
    <figure>
      <img src="assets/img/percurso-hebraico.svg" width="900" height="480" alt="Infográfico vetorial do percurso de hebraico: cinco degraus ascendentes — Fundação, Básico, Intermediário (com aramaico), Avançado e Fluência — com as semanas correspondentes e uma atividade-chave em cada degrau." loading="lazy">
      <figcaption class="note-editorial">SVG autoral gerado a partir do currículo desta página.</figcaption>
    </figure>
  </section>

  <section id="heb-gratuitos">
    <h2>Recursos Gratuitos</h2>
    <ul class="prose">
      <li><a rel="noopener noreferrer external" target="_blank" href="https://biblehub.com/interlinear">Bible Hub Interlinear</a> — interlinear hebraico com Strong/BDB/Gesenius.</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://stepbible.org/">Step Bible</a> — análise morfológica e léxica (Tyndale House).</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://biblicallanguagecenter.com/">Aleph with Beth</a> — curso imersivo-comunicativo (vídeo).</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://sefaria.org/">Sefaria</a> — Tanakh com traduções paralelas.</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://www.deadseascrolls.org.il/">Dead Sea Scrolls Digital Library</a> — manuscritos digitalizados.</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://etcbc.github.io/">ETCBC/VU Amsterdam</a> — texto massorético anotado sintaticamente.</li>
      <li><strong>Baralhos compartilhados do Anki</strong> — busque por "Biblical Hebrew vocabulary" no navegador oficial de decks compartilhados (ankiweb.net/shared/decks); avalie qualidade antes de adotar.</li>
    </ul>
  </section>

  <section id="heb-pagos">
    <h2>Recursos Pagos (por faixa de preço)</h2>
    <div class="table-scroll" role="region" tabindex="0" aria-label="Tabela de recursos pagos por faixa de preço">
      <table class="data">
        <caption>Faixas estimadas pelo curador; preços reais variam com promoções e câmbio — confirme nas lojas oficiais. Apenas obras listadas no catálogo canônico.</caption>
        <thead><tr><th scope="col">Faixa</th><th scope="col">Obra/Ferramenta</th><th scope="col">Papel no percurso</th></tr></thead>
        <tbody>
          <tr><th scope="row">Baixo</th><td>Noções do Grego Bíblico (para comparação didática) e reimpressões/secondhand de gramáticas introdutórias</td><td>Ponto de entrada econômico</td></tr>
          <tr><th scope="row">Médio</th><td>Gramática do Hebraico Bíblico — Allen P. Ross</td><td>Gramática principal dos Níveis 1–3</td></tr>
          <tr><th scope="row">Alto</th><td>Accordance Bible Software; HALOT</td><td>Ferramenta de pesquisa e léxico acadêmico (Níveis 3–5)</td></tr>
          <tr><th scope="row">Muito alto</th><td>Logos Bible Software (pacotes completos)</td><td>Biblioteca integrada para exegese avançada</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="heb-metodo-vencedor">
    <h2>O Método Vencedor: Integração Híbrida</h2>
    <p class="prose">Nenhum método isolado vence sozinho. A combinação recomendada une <strong>leitura direta + gramática ativa + Anki + coaching textual</strong>, sustentada por cinco princípios:</p>
    <ol class="prose">
      <li><strong>O texto é o laboratório:</strong> todo conceito novo é aplicado no mesmo dia a um versículo real.</li>
      <li><strong>Frequência bate intensidade:</strong> 30–60 min diários consistentes superam maratonas esporádicas.</li>
      <li><strong>Memorização distribuída:</strong> SRS cuida do vocabulário enquanto a mente trabalha sintaxe.</li>
      <li><strong>Correção externa periódica:</strong> mentor, comunidade ou co-mentoria por IA com salvaguardas.</li>
      <li><strong>Tolerância à ambiguidade:</strong> aprender a progredir sem entender 100% — competência, não defeito.</li>
    </ol>
  </section>

  <section id="heb-curriculo">
    <h2>Currículo dos 5 Níveis</h2>
    ${curriculoLevels('heb', hebLevels)}
    <h3>Notas de idioma e custo (estimativas editoriais)</h3>
    <ul class="prose">
      <li><strong>PT:</strong> melhores gramáticas traduzidas (Ross; linha Vida/Vida Nova) — custo médio-alto, um único investimento.</li>
      <li><strong>ES:</strong> boas gramáticas espanholas (costumam custar menos que as americanas) — alternativa econômica sólida.</li>
      <li><strong>EN:</strong> maior volume de materiais gratuitos online; livros-texto caros, mas edições anteriores usadas resolvem.</li>
    </ul>
  </section>

  <section id="heb-anki">
    <h2>Configuração do Anki</h2>
    <ol class="prose">
      <li>Crie uma conta gratuita em <a rel="noopener noreferrer external" target="_blank" href="https://ankiweb.net/">ankiweb.net</a> (opcional, só para sincronizar entre dispositivos).</li>
      <li>Crie um baralho "Hebraico Bíblico — Radicais" e outro "Hebraico Bíblico — Forma↔Sentido".</li>
      <li>Intervalos sugeridos para iniciantes: novo cartão/dia = 10; multiplicador = 2.3; intervalo máx. = 365 dias.</li>
      <li><strong>Subida de niqqud:</strong> frente com texto sem vocais (como o texto massorético impreso em muitas bíblias), verso com niqqud + transliteração + glossa.</li>
      <li><strong>Conectores:</strong> cartões dedicados a מֶ/שֶׁ/כִּי/עַל/אֶל com exemplos de contexto — eles aparecem em quase toda linha.</li>
      <li>Nunca cadastre a resposta de IA sem conferir no dicionário escolhido.</li>
    </ol>
  </section>

  <section id="heb-prompts">
    <h2>Prompts de IA (copiáveis)</h2>
    <p class="prose">Regra: apresente primeiro o seu trabalho; peça perguntas e correções, não soluções finais. Os blocos abaixo têm botão "Copiar".</p>
    ${[
      ['Tutor de hebraico', 'Você é um tutor de hebraico bíblico paciente. A partir da palavra/forma que eu enviar, faça 3 perguntas guiadas (radiz, binyan, função sintática) ANTES de revelar qualquer resposta. Corrija-me com base na gramática de Allen Ross e cite o capítulo. Nunca afirme autoridade doutrinária.'],
      ['Drill de vocabulário', 'Gere um ditado de 10 palavras frequentes do AT em ordem crescente de dificuldade. Mostre primeiro apenas a transliteração; depois, quando eu responder, revele a grafia com niqqud e o glossa PT. Marque meus erros para revisão amanhã.'],
      ['Revisão de parsing', 'Vou enviar meu parsing completo (raiz, binyan, tempo/aspecto, pessoa/gênero/número, função). Aponte apenas divergências plausíveis, explique a regra envolvida e sugira onde consultar na gramática. Não refaça o exercício inteiro por mim.'],
      ['Ditado reverso', 'Dê-me 5 frases curtas em português, fiéis ao vocabulário de Gênesis 1–3, para eu converter em hebraico. Depois compare minha versão com a estrutura esperada do MT, destacando concordância e estado construto.'],
      ['Co-mentoria exegética', 'Apresentarei minha nota exegética de [VERSÍCULO]. Atue como revisor socrático: liste 5 objeções ou lacunas, ordenadas por impacto, indicando quais ferramentas (léxico, aparato, sintaxe) usar para checar cada uma.'],
      ['Plano de estudo semanal', 'Monte um plano de 7 dias (30–60 min/dia) para meu nível atual ([NÍVEL]), combinando: leitura em voz alta, Anki (máx. 10 novos/dia), gramática (Ross cap. [CAP]) e um versículo de parsing. Inclua um domingo de revisão leve.'],
    ].map(([t, p], i) => `
    <div class="card" style="margin-bottom:12px">
      <h3 style="margin-top:0">${esc(t)}</h3>
      <pre id="heb-prompt-${i}" style="white-space:pre-wrap;background:var(--bg-inset);padding:12px;border-radius:10px;font-size:0.9rem">${esc(p)}</pre>
      <button type="button" class="btn copy-prompt" data-target="heb-prompt-${i}">Copiar prompt</button>
    </div>`).join('')}
  </section>

  <section id="heb-rotina">
    <h2>Checklist Diário e Solução de Problemas</h2>
    <ul class="prose" style="list-style:none;padding-inline-start:4px">
      <li>☐ 5 min — leitura em voz alta do texto da semana</li>
      <li>☐ 10–15 min — Anki (revisões + até 10 novos)</li>
      <li>☐ 15–25 min — gramática (1 seção pequena) + exercícios</li>
      <li>☐ 5 min — parsing de 1 versículo</li>
      <li>☐ 2 linhas de diário: o que travou hoje?</li>
    </ul>
    <div class="table-scroll" role="region" tabindex="0" aria-label="Tabela de solução de problemas comuns">
      <table class="data">
        <caption>Problemas comuns e antídotos práticos.</caption>
        <thead><tr><th scope="col">Sintoma</th><th scope="col">Causa provável</th><th scope="col">Antídoto</th></tr></thead>
        <tbody>
          <tr><th scope="row">"Leio mas esqueço tudo"</th><td>Reconhecimento passivo sem recuperação ativa</td><td>Anki diário + leitura em voz alta + parsing semanal</td></tr>
          <tr><th scope="row">Confundo ב/כ/פ com dagesh</th><td>Falta de treino fonético</td><td>Ditados mínimos pares (begadkefat) 5 min/dia por uma semana</td></tr>
          <tr><th scope="row">Travo no estado construto</th><td>Estudo só de formas isoladas</td><td>Caça ao construto: marcar 5 ocorrências por capítulo lido</td></tr>
          <tr><th scope="row">Aramaico parece "outro idioma"</th><td>Vocabulário sobreposto não explorado</td><td>Ler Jr 10.11 e Dn 2.4b comparando com hebraico cognato</td></tr>
          <tr><th scope="row">IA responde besteira</th><td>Prompt sem âncora de verificação</td><td>Sempre exigir capítulo de gramática e conferir no léxico cadastrado</td></tr>
        </tbody>
      </table>
    </div>
  </section>
`;

/* ========================= CONTEÚDO: GREGO ========================= */

const grkLevels = [
  { open: true, titulo: 'Nível 1 — Fundação (semanas 1–8): alfabeto, pronúncia e João 1',
    objetivos: ['Ler o alfabeto maiúsculo e minúsculo com espíritos e acentos', 'Pronunciar (método erasmiano/reuchliniano escolhido e constante)', 'Ler João 1.1–18 com interlinear'],
    materiais: ['Tabela de alfabeto deste site', 'Daily Dose of Greek (vídeos curtos)', 'Sofia App (grátis) para consulta', 'Anki: deck de letras e sílabas'],
    estrategias: ['Leitura em voz alta 10 min/dia', 'Ditado de 5 formas diárias', 'Sem decorar paradigmas ainda — só sons e formas'],
    check: ['Leio qualquer palavra transliterada em 1 minuto', 'Distingo os espíritos e acentos principais'] },
  { titulo: 'Nível 2 — Básico (semanas 9–20): morfologia nominal e os primitivos',
    objetivos: ['Os 5 casos e suas funções nucleares', '1ª e 2ª declinações; adjetivos de 2 terminações', 'Presente do indicativo ativo/médio (temas contractos)'],
    materiais: ['Rega, "Noções do Grego Bíblico" (ou Mounce, unidades 1–12)', 'Lista das ~133 palavras mais frequentes do NT', 'Step Bible para checagem de parsing'],
    estrategias: ['Parsing diário de 5 palavras', 'Tradução controlada de frases curtas', 'Flashcards: forma → função → glossa'],
    check: ['Declino λύω e λόγος de memória', 'Reconheço dativo plural em 3 gêneros'] },
  { titulo: 'Nível 3 — Intermediário (semanas 21–36): sistema verbal e aspecto',
    objetivos: ['Aoristo, futuro, perfeito, mais-que-perfeito (indic./subj./imp.)', 'Particípios e infinitivos', 'Aspecto verbal como categoria central (não só "tempo")'],
    materiais: ['Mounce semanas 21–36 / Rega capítulos médios', 'Global Bible Tools (áudio sincronizado)', 'NA28 online (academic-bible.com)'],
    estrategias: ['Um versículo por dia com análise aspectual', 'Cartões de aoristos irregulares', 'Reescrita: transformar indicativo em particípio e vice-versa'],
    check: ['Faço parsing verbal completo (modo/tempo/voz/pessoa/número)', 'Explico a diferença aspectual aoristo × imperfeito com exemplo'] },
  { titulo: 'Nível 4 — Avançado (semanas 37–56): partículas, artigo e sintaxe de Wallace',
    objetivos: ['Uso sintático do artigo (substantivação, anástrofe, TSI)', 'Partículas μέν/δέ/ἵνα/ὅτι/causais', 'Construções absolutas e estilo joanino/paulino'],
    materiais: ['Wallace, "Gramática Grega: Sintaxe Exegética"', 'BDAG (consulta orientada)', 'Logos/Accordance se disponíveis'],
    estrategias: ['Fluxo: traduzir → parsing → Wallace → nota exegética', 'Comparar variantes do aparato em 1 texto/semana', 'Debater a própria classificação com mentor ou co-mentoria IA'],
    check: ['Classifico construções com artigo conforme Wallace', 'Produzo nota exegética de 1 página com defesa sintática'] },
  { titulo: 'Nível 5 — Fluência (manutenção)',
    objetivos: ['Leitura corrida do NT grego (Evangelhos → Epístolas)', 'Vocabulário ativo ~500+ formas', 'Ensinar/revisar para iniciantes'],
    materiais: ['NA28/UBS5 impresso ou app', 'Septuaginta (LXX) para ecos do AT', 'Decks de manutenção'],
    estrategias: ['3 leituras semanais de 20–30 min', 'Leitura contínua programática (1 capítulo/dia)', 'Revisão trimestral de pontos frágeis'],
    check: ['Relo Marcos 4 sem dicionário entendendo o enredo gramatical'] },
];

const grkSections = [
  { id: 'grk-intro', title: 'Introdução' },
  { id: 'grk-visao-geral', title: 'Visão geral e estatísticas' },
  { id: 'grk-metodos', title: 'Métodos de aprendizado (25)' },
  { id: 'grk-analise', title: 'Análise didática detalhada' },
  { id: 'grk-ranking', title: 'Ranking de eficácia' },
  { id: 'grk-graficos', title: 'Gráficos comparativos' },
  { id: 'grk-infografico', title: 'Infográfico do percurso' },
  { id: 'grk-gratuitos', title: 'Recursos gratuitos' },
  { id: 'grk-pagos', title: 'Recursos pagos (faixas de preço)' },
  { id: 'grk-metodo-vencedor', title: 'O método vencedor: Rega + Wallace' },
  { id: 'grk-curriculo', title: 'Currículo de 5 níveis' },
  { id: 'grk-anki', title: 'Anki prático para grego' },
  { id: 'grk-prompts', title: 'Prompts de IA (copiáveis)' },
  { id: 'grk-dores', title: 'Pontos de dor e antídotos' },
];

const grkContent = `
  <h1 id="h1-grk">Grego Koiné</h1>
  <div class="orig-banner">
    <span lang="grc">Ἐν ἀρχῇ ἦν ὁ λόγος</span>
    <span class="sep" aria-hidden="true">·</span>
    <span lang="grc">τὰ δὲ ἔσχατα τοῦ λόγου</span>
  </div>

  <section id="grk-intro">
    <p class="prose">Página-espelho do percurso hebraico: visão geral, 25 métodos, ranking transparente, gráficos com tabelas alternativas, recursos gratuitos/pagos, currículo de 5 níveis, Anki, prompts e solução de dores específicas do grego.</p>
  </section>

  <section id="grk-visao-geral">
    <h2>Visão Geral e Estatísticas</h2>
    <ul class="prose">
      <li><strong>Alfabeto:</strong> 24 letras com espíritos (rough/smooth) e acentos politônicos herdados da prática alexandrina.</li>
      <li><strong>Família:</strong> indo-europeia, ramo helênico; o Koiné é a koinē diálektos do período helenístico — língua do NT e da LXX.</li>
      <li><strong>Morfologia rica:</strong> sistema de casos (nominativo, genitivo, dativo, acusativo + vestígios vocativo), três gêneros, número singular/plural ( dual já arcaico), e um sistema verbal organizado por ASPECTO (presente/aoristo/perfeito) combinado com tempo, modo e voz (ativa/média/passiva).</li>
      <li><strong>Extensão do corpus:</strong> NT grego ≈ 138.000 palavras (contagem tradicional de referência; varia levemente com a edição crítica usada — dado descritivo, não métrica de aprendizagem).</li>
    </ul>
  </section>

  <section id="grk-metodos">
    <h2>Métodos de Aprendizado (25 Métodos Analisados)</h2>
    ${methodsTableHTML('grego koiné')}
  </section>

  <section id="grk-analise">
    <h2>Análise Didática Detalhada</h2>
    ${didacticGroupsHTML()}
  </section>

  <section id="grk-ranking">
    <h2>Ranking de Eficácia</h2>
    <p class="prose">Mesmo conjunto de critérios da página de hebraico (mesma fonte de dados, pesos declarados no caption).</p>
    ${rankingTableHTML('grk')}
  </section>

  <section id="grk-graficos">
    <h2>Gráficos Comparativos</h2>
    ${chartsBlockHTML('grk')}
  </section>

  <section id="grk-infografico">
    <h2>Infográfico do Percurso</h2>
    <figure>
      <img src="assets/img/percurso-grego.svg" width="900" height="480" alt="Infográfico vetorial do percurso de grego: cinco degraus — Fundação, Básico, Intermediário, Avançado e Fluência — com as semanas e a atividade-chave de cada etapa, culminando em nota exegética." loading="lazy">
      <figcaption class="note-editorial">SVG autoral gerado a partir do currículo desta página.</figcaption>
    </figure>
  </section>

  <section id="grk-gratuitos">
    <h2>Recursos Gratuitos</h2>
    <ul class="prose">
      <li><a rel="noopener noreferrer external" target="_blank" href="https://sofiaapp.com/">Sofia App</a> — técnico, limpo, sem anúncios (Strong, GK, Louw-Nida).</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://stepbible.org/">Step Bible</a> — interlinear e parsing com dicionários integrados.</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://dailydoseofgreek.com/">Daily Dose of Greek</a> — um versículo dissecado por dia.</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://globalbibletools.com/">Global Bible Tools</a> — grátis, sem anúncios, offline-friendly.</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://www.academic-bible.com/en/online-bibles/septuagint">Septuaginta (LXX) online</a> — para estudos comparados MT × LXX.</li>
      <li><a rel="noopener noreferrer external" target="_blank" href="https://sefaria.org/">Sefaria</a> — textos judaicos e pano de fundo linguístico.</li>
    </ul>
  </section>

  <section id="grk-pagos">
    <h2>Recursos Pagos (por faixa de preço)</h2>
    <div class="table-scroll" role="region" tabindex="0" aria-label="Tabela de recursos pagos por faixa de preço (grego)">
      <table class="data">
        <caption>Faixas estimadas pelo curador; confirme preços nas editoras/lojas.</caption>
        <thead><tr><th scope="col">Faixa</th><th scope="col">Obra/Ferramenta</th><th scope="col">Papel no percurso</th></tr></thead>
        <tbody>
          <tr><th scope="row">Baixo/médio</th><td>Noções do Grego Bíblico — Rega (Vida Nova); Basics — Mounce</td><td>Base gramatical dos Níveis 1–3</td></tr>
          <tr><th scope="row">Alto</th><td>Gramática Grega: Sintaxe Exegética — Wallace; Ginoskos (assinatura)</td><td>Sintaxe exegética (4–5) e prática diária assistida</td></tr>
          <tr><th scope="row">Muito alto</th><td>BDAG; Logos; Accordance</td><td>Léxico padrão e ambientes profissionais de exegese</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="grk-metodo-vencedor">
    <h2>O Método Vencedor: Integração Rega + Wallace</h2>
    <ol class="prose">
      <li><strong>Traduzir</strong> o versículo com Rega/Mounce (sentido básico e morfologia).</li>
      <li><strong>Parsear</strong> cada forma relevante (caso/função; tempo/aspecto/voz/modo).</li>
      <li><strong>Consultar Wallace</strong> na categoria sintática encontrada (ex.: genitivo subjetivo, condicional de 1ª classe).</li>
      <li><strong>Redigir a nota exegética</strong>: o que a construção acrescenta ao sentido.</li>
    </ol>
    <p class="prose">Diferença nuclear: Mounce/Rega respondem "<em>o que é</em>" (formas e paradigmas, semanas 1–20); Wallace responde "<em>por que importa teologicamente</em>" (sintaxe exegética, semanas 21+). Usar um sem o outro é ficar ou só na superfície, ou sem base formal.</p>
  </section>

  <section id="grk-curriculo">
    <h2>Currículo dos 5 Níveis</h2>
    ${curriculoLevels('grk', grkLevels)}
  </section>

  <section id="grk-anki">
    <h2>Anki Prático para Grego</h2>
    <ol class="prose">
      <li>Deck "Grego — Alfabeto e Sons" (Nível 1), depois "Formas↔Função" e "Verbos Irregulares".</li>
      <li>Novos cartões/dia: 10; rev. máx./dia: 40; fator 2.3; fuzz ±5%.</li>
      <li>Frente: forma no contexto do versículo (com artigo!). Verso: parsing completo + glossa + referência.</li>
      <li>Cartões de paradigma "esqueleto": preencher lacunas (ex.: λ____ομεν → 1ª pl. pres. act. ind.).</li>
      <li>Prefixe tags por caso (ex.: #dat) para filtrar revisões fracas.</li>
    </ol>
  </section>

  <section id="grk-prompts">
    <h2>Prompts de IA (copiáveis)</h2>
    <div class="card" style="margin-bottom:12px">
      <h3 style="margin-top:0">Tutor Pessoal de Grego Koiné</h3>
      <pre id="grk-prompt-0" style="white-space:pre-wrap;background:var(--bg-inset);padding:12px;border-radius:10px;font-size:0.9rem">Você é tutor de grego koiné alinhado a Mounce/Rega. Quando eu enviar uma forma grega, faça 3 perguntas guiadas (radical/tema, terminação, função provável) antes de revelar qualquer resposta. Ao corrigir, cite a unidade da gramática. Trate.aspecto verbal com precisão (aoristo ≠ simplesmente "passado"). Não produza conclusões doutrinárias.</pre>
      <button type="button" class="btn copy-prompt" data-target="grk-prompt-0">Copiar prompt</button>
    </div>
    <div class="card" style="margin-bottom:12px">
      <h3 style="margin-top:0">Analista de Sintaxe e Casos Grego (Daniel Wallace)</h3>
      <pre id="grk-prompt-1" style="white-space:pre-wrap;background:var(--bg-inset);padding:12px;border-radius:10px;font-size:0.9rem">Atue como analista sintático no estilo de Wallace. Receberei um versículo com MEU parsing e minha classificação sintática preliminar. Tarefas: (1) confirmar/divergir item a item; (2) propor as 2 classificações concorrentes mais prováveis com as regras de teste de Wallace (ex.: critério do artigo, posição, contexto); (3) indicar a seção do livro para eu verificar. Nunca conclua por mim sem citar o critério verificável.</pre>
      <button type="button" class="btn copy-prompt" data-target="grk-prompt-1">Copiar prompt</button>
    </div>
  </section>

  <section id="grk-dores">
    <h2>Pontos de Dor e Antídotos</h2>
    <div class="table-scroll" role="region" tabindex="0" aria-label="Tabela de pontos de dor do estudante de grego">
      <table class="data">
        <caption>"Morte das categorias": casos aprendidos que evaporam na leitura — e os antídotos.</caption>
        <thead><tr><th scope="col">Dor comum</th><th scope="col">Diagnóstico</th><th scope="col">Antídoto (com Wallace como referência)</th></tr></thead>
        <tbody>
          <tr><th scope="row">Decoro paradigmas mas não leio</th><td>Conhecimento declarativo sem prática de recuperação em contexto</td><td>Parsing diário de versículo real + leitura com interlinear só na segunda passada</td></tr>
          <tr><th scope="row">Confundo aoristo/perfeito</th><td>Traduzir aspecto como se fosse só tempo</td><td>Cartões "qual o retrato do evento?" (pontual vs. resultado permanente); cf. cap. de aspecto verbal em Wallace</td></tr>
          <tr><th scope="row">Artigo me escapa</th><td>Não aplicar critérios de substantivação/anástrofe</td><td>Checklist de 4 perguntas sobre o artigo antes de classificar; registrar 5 achados/semana</td></tr>
          <tr><th scope="row">Particípios viram sopa</th><td>Traduzir tudo como "que/porque"</td><td>Tabela de funções (genitivo absoluto, causal, concessivo...) com um exemplo bíblico por função</td></tr>
          <tr><th scope="row">Paradigmas esquecidos</th><td>Estudar só antes da prova/sessão</td><td>Anki com lacunas + revisão semanal cruzada (contratos, irregulares, 3ª declinação)</td></tr>
        </tbody>
      </table>
    </div>
  </section>
`;

/* ========================= CONTEÚDO: FERRAMENTAS ========================= */

const CATS = [
  ['gramatica', 'Gramática'], ['lexico', 'Léxico'], ['manuscritologia', 'Manuscritologia'],
  ['critica-textual', 'Crítica textual'], ['exegese', 'Exegese'], ['software', 'Software'],
  ['app', 'App'], ['midia', 'Mídia'], ['mapas', 'Mapas'], ['texto-biblico', 'Texto bíblico'],
];

const ferrSections = [
  { id: 'ferr-catalogo', title: 'Catálogo de recursos' },
  { id: 'ferr-colecao', title: 'Minha coleção' },
  { id: 'ferr-adicionar', title: 'Adicionar/editar recursos' },
  { id: 'ferr-import-export', title: 'Importar e exportar' },
  { id: 'ferr-descoberta', title: 'Descoberta externa' },
  { id: 'ferr-privacidade', title: 'Privacidade e limites' },
];

const chips = CATS.map(([k, l]) => `<button type="button" class="chip" data-cat="${k}" aria-pressed="false">${esc(l)}</button>`).join('\n        ');

const toolsContent = `
  <h1 id="h1-ferr">Caixa de Ferramentas Bíblicas</h1>
  <p class="prose">Catálogo curado com busca dinâmica, filtros, favoritos e coleção pessoal salva <strong>somente neste dispositivo</strong> (sem contas, sem nuvem). O cofre local guarda seus itens; use exportar/importar para levá-los a outro aparelho.</p>

  <section id="ferr-catalogo">
    <h2>Catálogo de Recursos</h2>
    <div id="catalog-loading" role="status" class="note-editorial">Carregando catálogo…</div>
    <div id="catalog-error" hidden class="callout warn"><p style="margin:0" id="catalog-error-msg"></p></div>
    <div class="catalog-controls" id="catalog-controls">
      <div class="field" style="margin:0">
        <label for="catalog-search">Buscar no catálogo</label>
        <input type="search" id="catalog-search" placeholder="Título, autor ou descrição (ignora acentos)…" autocomplete="off">
      </div>
      <div class="field" style="margin:0">
        <label for="filter-language">Idioma</label>
        <select id="filter-language">
          <option value="todos">Todas as línguas</option><option value="hebraico">Hebraico</option><option value="aramaico">Aramaico</option><option value="grego">Grego</option>
        </select>
      </div>
      <div class="field" style="margin:0">
        <label for="filter-level">Nível</label>
        <select id="filter-level">
          <option value="todos">Todos os níveis</option><option value="iniciante">Iniciante</option><option value="intermediario">Intermediário</option><option value="avancado">Avançado</option>
        </select>
      </div>
      <div class="chips-row" role="group" aria-label="Filtrar por categoria">
        ${chips}
        <button type="button" id="only-favs" class="chip" aria-pressed="false">★ Somente favoritos</button>
        <button type="button" id="clear-filters" class="chip">Limpar filtros</button>
      </div>
    </div>
    <div class="results-meta">
      <p id="result-count" role="status" aria-live="polite" style="margin:0"></p>
      <p style="margin:0"><button type="button" id="add-resource-btn" class="btn btn-accent">＋ Adicionar recurso</button></p>
    </div>
    <div id="resource-list" class="grid" aria-live="polite"></div>
  </section>

  <section id="ferr-colecao">
    <h2>Minha coleção</h2>
    <p id="collection-count" class="note-editorial" style="margin:0 0 8px"></p>
    <p class="note-editorial">Seus favoritos e recursos próprios ficam salvos apenas neste navegador/dispositivo e <strong>não sincronizam automaticamente</strong>. Exporte um JSON para transferir.</p>
    <div id="collection-list"></div>
  </section>

  <section id="ferr-adicionar">
    <h2>Adicionar / editar recursos</h2>
    <p class="prose">Use o diálogo "Adicionar recurso" acima. Validação: título obrigatório; links apenas http/https; exclusões pedem confirmação e admitem desfazer.</p>
  </section>

  <section id="ferr-import-export">
    <h2>Importar e exportar</h2>
    <div class="card">
      <p style="display:flex;gap:12px;flex-wrap:wrap;margin:0 0 12px">
        <button type="button" id="export-json-btn" class="btn btn-primary">Exportar coleção (JSON)</button>
        <button type="button" id="import-json-btn" class="btn">Importar coleção (JSON)</button>
        <button type="button" id="export-pdf-btn" class="btn">Exportar para impressão/PDF</button>
      </p>
      <div class="field">
        <label for="import-dup-policy">Política para itens duplicados na importação</label>
        <select id="import-dup-policy">
          <option value="keep-existing">Manter o existente (padrão)</option>
          <option value="overwrite">Substituir pelo importado</option>
        </select>
      </div>
      <input type="file" id="import-json-input" accept="application/json,.json" hidden>
      <p id="pdf-note" class="note-editorial" hidden></p>
      <p class="note-editorial" style="margin-bottom:0">Limites: arquivo ≤ 512 KB, esquema versionado (schemaVersion 1), URLs validadas; nada importado é inserido como HTML executável.</p>
    </div>
  </section>

  <section id="ferr-descoberta">
    <h2>Descoberta externa</h2>
    <p class="prose">Estes botões <strong>apenas abrem páginas de busca externas em nova aba</strong> (Google, DuckDuckGo, STEP Bible). O site não realiza varredura autônoma da web, não usa APIs nem armazena chaves no cliente.</p>
    <div class="field">
      <label for="discovery-term">Termo de busca</label>
      <input type="text" id="discovery-term" placeholder='ex.: "sintaxe exegética grego pdf aula"' autocomplete="off">
    </div>
    <p style="display:flex;gap:12px;flex-wrap:wrap">
      <a id="disc-google" class="btn" href="#" rel="noopener noreferrer external" target="_blank">Buscar no Google ↗</a>
      <a id="disc-ddg" class="btn" href="#" rel="noopener noreferrer external" target="_blank">Buscar no DuckDuckGo ↗</a>
      <a id="disc-step" class="btn" href="#" rel="noopener noreferrer external" target="_blank">Buscar na STEP Bible ↗</a>
    </p>
  </section>

  <section id="ferr-privacidade">
    <h2>Privacidade e limites</h2>
    <ul class="prose">
      <li>Sem contas, sem telemetria, sem servidores: seus dados vivem em <code>localStorage</code> deste navegador.</li>
      <li>Limpar dados do navegador apaga a coleção — exporte regularmente.</li>
      <li>Funciona offline para as páginas já visitadas (service worker); links externos exigem conexão.</li>
      <li>PDF: alternativa transparente via impressão do navegador (biblioteca de PDF com hebraico/grego confiável não está incluída).</li>
    </ul>
  </section>

  <dialog id="resource-form-dialog" class="modal" aria-labelledby="form-title-mode">
    <form id="resource-form" method="dialog">
      <div class="modal-head"><h2 id="form-title-mode">Adicionar novo recurso</h2></div>
      <div class="modal-body">
        <div class="field"><label for="rf-title">Título *</label><input id="rf-title" name="title" type="text" required><p class="field-error" id="err-title" hidden></p></div>
        <div class="field"><label for="rf-author">Autor / curadoria</label><input id="rf-author" name="author" type="text"></div>
        <div class="field"><label for="rf-category">Categoria</label>
          <select id="rf-category" name="category">${CATS.map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join('')}</select>
        </div>
        <div class="field"><label for="rf-language">Idioma</label>
          <select id="rf-language" name="language"><option value="hebraico">Hebraico</option><option value="aramaico">Aramaico</option><option value="grego">Grego</option><option value="todos" selected>Todas as línguas</option></select>
        </div>
        <div class="field"><label for="rf-level">Nível</label>
          <select id="rf-level" name="level"><option value="iniciante">Iniciante</option><option value="intermediario">Intermediário</option><option value="avancado">Avançado</option><option value="todos" selected>Todos</option></select>
        </div>
        <div class="field"><label for="rf-type">Tipo</label><input id="rf-type" name="type" type="text" placeholder="Livro, App, Vídeo…"></div>
        <div class="field"><label for="rf-link">Link (http/https)</label><input id="rf-link" name="link" type="url" placeholder="https://…"><p class="field-error" id="err-link" hidden></p></div>
        <div class="field"><label for="rf-description">Descrição</label><textarea id="rf-description" name="description" rows="3"></textarea></div>
        <label class="checkbox-row"><input type="checkbox" id="rf-free" name="free"><span>Recurso gratuito</span></label>
      </div>
      <div class="modal-foot">
        <button type="button" class="btn" data-close="resource-form-dialog">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar neste dispositivo</button>
      </div>
    </form>
  </dialog>

  <dialog id="confirm-dialog" class="modal" aria-labelledby="confirm-title">
    <div class="modal-head"><h2 id="confirm-title">Confirmar exclusão</h2></div>
    <div class="modal-body"><p id="confirm-message"></p></div>
    <div class="modal-foot">
      <button type="button" id="confirm-cancel" class="btn">Cancelar</button>
      <button type="button" id="confirm-ok" class="btn btn-danger">Excluir</button>
    </div>
  </dialog>
`;

/* ========================= MONTAGEM FINAL ========================= */

const out = process.argv[2] || '.';
function write(file, html) {
  fs.writeFileSync(path.join(out, file), html);
  console.log('gerado:', file, html.length, 'bytes');
}

write('index.html', pageShell({
  file: 'index.html',
  title: 'O Sentido Autêntico — Portal do Estudante de Hebraico, Aramaico e Grego Koiné',
  desc: 'Portal pt-BR para o estudo introdutório das línguas bíblicas: métodos, currículo de 5 níveis, catálogo de ferramentas e estudo responsável com IA.',
  sections: portSections, content: indexContent, pageId: 'index',
}));

write('hebraico-aramaico.html', pageShell({
  file: 'hebraico-aramaico.html',
  title: 'Hebraico e Aramaico Bíblico — Métodos e Currículo | O Sentido Autêntico',
  desc: 'Percurso completo de hebraico bíblico e aramaico: 25 métodos analisados, ranking transparente, gráficos, currículo de 5 níveis, Anki e prompts de IA.',
  sections: hebSections, content: hebContent, pageId: 'hebraico-aramaico',
}));

write('grego-koine.html', pageShell({
  file: 'grego-koine.html',
  title: 'Grego Koiné — Métodos e Currículo | O Sentido Autêntico',
  desc: 'Percurso de grego koiné do alfabeto à sintaxe exegética: 25 métodos, integração Rega + Wallace, currículo de 5 níveis, Anki e prompts.',
  sections: grkSections, content: grkContent, pageId: 'grego-koine',
}));

write('caixa-de-ferramentas.html', pageShell({
  file: 'caixa-de-ferramentas.html',
  title: 'Caixa de Ferramentas Bíblicas — Catálogo e Coleção | O Sentido Autêntico',
  desc: 'Catálogo pesquisável de recursos para hebraico, aramaico e grego: filtros, favoritos, coleção local, importação/exportação JSON e descoberta externa.',
  sections: ferrSections, content: toolsContent, pageId: 'caixa-de-ferramentas',
}));

console.log('OK: páginas geradas.');
