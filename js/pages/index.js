/** Página: Portal do Estudante (index). */
import { initNav } from '../modules/nav.js';
import { initTheme } from '../modules/theme.js';
import { initOnboarding } from '../modules/onboarding.js';
import { initA11yBar } from '../modules/a11y.js';
import { initPWA } from '../modules/pwa.js';
import { lastReading, termsAccepted } from '../modules/storage.js';

initTheme();
initNav({ pageId: 'index' });
initOnboarding();
initA11yBar();
initPWA();

// "Continuar de onde parei" apenas com estado REAL salvo
const last = lastReading();
if (last) {
  const map = { index: 'index.html', hebraico: 'hebraico-aramaico.html', heb: 'hebraico-aramaico.html', grego: 'grego-koine.html', grk: 'grego-koine.html', ferramentas: 'caixa-de-ferramentas.html' };
  const file = map[last.page] || 'index.html';
  const row = document.getElementById('continue-reading');
  const link = document.getElementById('continue-reading-link');
  if (row && link) {
    link.href = file + last.hash;
    link.textContent = `Continuar de onde parei (${file.replace('.html','')} ${last.hash}) →`;
    row.hidden = !termsAccepted() ? false : false; // mostra sempre que houver posição real
  }
}

// Copiar prompts
document.querySelectorAll('.copy-prompt').forEach(btn => {
  btn.addEventListener('click', async () => {
    const t = document.getElementById(btn.dataset.target);
    if (!t) return;
    try { await navigator.clipboard.writeText(t.textContent); btn.textContent = 'Copiado!'; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = t.textContent; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); btn.textContent = 'Copiado!'; } catch (e2) { btn.textContent = 'Selecione e copie manualmente'; }
      ta.remove();
    }
    setTimeout(() => (btn.textContent = 'Copiar prompt'), 2000);
  });
});
