/** Página: Hebraico e Aramaico. */
import { initNav } from '../modules/nav.js';
import { initTheme } from '../modules/theme.js';
import { initOnboarding } from '../modules/onboarding.js';
import { initA11yBar } from '../modules/a11y.js';
import { initPWA } from '../modules/pwa.js';
import { initChartsToggle } from '../modules/charts.js';
import { chartData } from '../../data/metodos.js';

initTheme();
initNav({ pageId: 'heb' });
initOnboarding();
initA11yBar();
initPWA();
initChartsToggle({ buttonId: 'heb-charts-btn', containerId: 'heb-charts', getData: chartData, statusElId: 'heb-charts-status' });

document.querySelectorAll('.copy-prompt').forEach(btn => {
  btn.addEventListener('click', async () => {
    const t = document.getElementById(btn.dataset.target);
    if (!t) return;
    try { await navigator.clipboard.writeText(t.textContent); btn.textContent = 'Copiado!'; }
    catch (e) { btn.textContent = 'Selecione e copie manualmente'; }
    setTimeout(() => (btn.textContent = 'Copiar prompt'), 2000);
  });
});
