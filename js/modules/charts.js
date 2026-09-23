/**
 * js/modules/charts.js — Carrega Chart.js (cópia local vendorizada) SOMENTE sob ação do usuário.
 * Todos os valores vêm das tabelas de métodos/curriculum já presentes no DOM/data file.
 * Cada gráfico tem tabela-alternativa acessível (renderizada pelo próprio conteúdo estático).
 */

export async function loadChartLib() {
  if (window.Chart) return window.Chart;
  const base = window.__OSA_BASE__ || './';
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = base + 'vendor/chart.umd.min.js';
    s.onload = resolve;
    s.onerror = () => reject(new Error('chart-lib-falha'));
    document.head.appendChild(s);
  });
  return window.Chart;
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function themeColors() {
  return {
    text: cssVar('--fg-text') || '#1A2530',
    muted: cssVar('--fg-muted') || '#4A5568',
    gold: cssVar('--c-gold') || '#C5A059',
    heb: cssVar('--c-heb') || '#102A43',
    grk: cssVar('--c-grk') || '#7B1D22',
    portal: cssVar('--c-portal') || '#0F3731',
    surface: cssVar('--bg-card') || '#FFFFFF',
  };
}

function destroyAll(registry) {
  registry.forEach(c => { try { c.destroy(); } catch (e) {} });
  registry.length = 0;
}

/**
 * Constrói os gráficos a partir dos dados passados (nunca inventa valores aqui —
 * os dados vêm de data/metodos-*.js que por sua vez alimentam as tabelas visíveis).
 * @param {{scatter:Array, radarTop:Array, barrasTempo:Array, comparativo:Object}} dataMethods
 */
export function buildCharts(containerId, dataMethods) {
  const container = document.getElementById(containerId);
  if (!container) return Promise.resolve(false); // §8.2
  return loadChartLib().then(Chart => {
    const tc = themeColors();
    const registry = [];
    container.querySelectorAll('canvas[data-chart]').forEach(cv => {
      const kind = cv.dataset.chart;
      let cfg = null;
      if (kind === 'scatter') {
        cfg = {
          type: 'bubble',
          data: {
            datasets: [{
              label: 'Métodos (complexidade × tempo semanal × eficácia)',
              data: dataMethods.scatter.map(p => ({ x: p.complexidade, y: p.tempoSemanal, r: 4 + p.eficacia * 1.2, metodo: p.metodo })),
              backgroundColor: tc.gold + 'CC',
              borderColor: tc.heb,
            }],
          },
          options: chartOpts(tc, {
            scales: {
              x: { title: { display: true, text: 'Complexidade percebida (1–10, estimativa editorial)' }, min: 0, max: 10 },
              y: { title: { display: true, text: 'Tempo semanal estimado (horas)' }, min: 0 },
            },
            plugins: { tooltip: { callbacks: { label: (ctx) => `${ctx.raw.metodo}: complexidade ${ctx.raw.x}, ${ctx.raw.y} h/sem` } } },
          }),
        };
      } else if (kind === 'radar') {
        cfg = {
          type: 'radar',
          data: {
            labels: ['Eficácia', 'Facilidade de início', 'Custo acessível', 'Sustentabilidade', 'Aplicação ao texto'],
            datasets: dataMethods.radarTop.map((m, i) => ({
              label: m.metodo,
              data: [m.eficacia, m.facilidade, m.custo, m.sustentabilidade, m.aplicacao],
              borderColor: [tc.gold, tc.portal, tc.heb, tc.grk][i % 4],
              backgroundColor: 'transparent',
              pointRadius: 3,
            })),
          },
          options: chartOpts(tc, { scales: { r: { min: 0, max: 10, ticks: { color: tc.muted } }, grid: { color: tc.muted + '33' } }, angleLines: { color: tc.muted + '33' }, pointLabels: { color: tc.text } }),
        };
      } else if (kind === 'barras') {
        cfg = {
          type: 'bar',
          data: {
            labels: dataMethods.barrasTempo.map(m => m.metodo),
            datasets: [{ label: 'Tempo médio semanal estimado (h)', data: dataMethods.barrasTempo.map(m => m.tempoSemanal), backgroundColor: tc.portal + 'BB' }],
          },
          options: chartOpts(tc, { indexAxis: 'y', scales: { x: { beginAtZero: true, title: { display: true, text: 'Horas por semana (estimativa editorial)' } } } }),
        };
      } else if (kind === 'comparativo') {
        cfg = {
          type: 'bar',
          data: {
            labels: ['Eficácia', 'Custo (menor melhor → invertido)', 'Facilidade', 'Sustentabilidade'],
            datasets: [
              { label: 'Abordagem híbrida recomendada', data: dataMethods.comparativo.hibrido, backgroundColor: tc.gold + 'CC' },
              { label: 'Gramática-tradução tradicional', data: dataMethods.comparativo.tradicional, backgroundColor: tc.heb + '99' },
            ],
          },
          options: chartOpts(tc, { scales: { y: { min: 0, max: 10 } } }),
        };
      }
      if (cfg) {
        cfg.options.responsive = true;
        cfg.options.maintainAspectRatio = false;
        const c = new Chart(cv.getContext('2d'), cfg);
        registry.push(c);
      }
    });
    container.dataset.ready = '1';
    // Recriar com cores do tema quando o tema mudar
    window.__osaChartsRedraw = () => { destroyAll(registry); buildCharts(containerId, dataMethods); };
    return true;
  }).catch(() => false);
}

function chartOpts(tc, extra) {
  return Object.assign({
    plugins: {
      legend: { labels: { color: tc.text } },
    },
    scales: {},
  }, extra);
}

/** Botão "mostrar gráficos" com carregamento sob demanda e estado acessível. */
export function initChartsToggle({ buttonId, containerId, getData, statusElId }) {
  const btn = document.getElementById(buttonId);
  if (!btn) return; // §8.2
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Carregando gráficos…';
    const status = document.getElementById(statusElId);
    const ok = await buildCharts(containerId, getData());
    btn.disabled = false;
    if (ok) {
      btn.textContent = 'Ocultar gráficos';
      btn.dataset.state = 'shown';
      if (status) status.textContent = 'Gráficos gerados a partir dos dados das tabelas acima (estimativas editoriais sinalizadas).';
      const cont = document.getElementById(containerId);
      if (cont) cont.hidden = false;
    } else {
      btn.textContent = 'Mostrar gráficos';
      if (status) status.textContent = 'Não foi possível carregar a biblioteca de gráficos local. As tabelas com os mesmos dados continuam disponíveis acima.';
    }
  });
}
