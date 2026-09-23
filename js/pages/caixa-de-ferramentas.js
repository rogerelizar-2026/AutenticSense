/** Página: Caixa de Ferramentas — catálogo, coleção, import/export, descoberta externa. */
import { initNav } from '../modules/nav.js';
import { initTheme } from '../modules/theme.js';
import { initOnboarding } from '../modules/onboarding.js';
import { initA11yBar } from '../modules/a11y.js';
import { initPWA } from '../modules/pwa.js';
import { initCatalogPage } from '../modules/catalog.js';
import { initExportImport } from '../modules/export-import.js';
import { toast } from '../modules/toast.js';

initTheme();
initNav({ pageId: 'ferr' });
initOnboarding();
initA11yBar();
initPWA();

const loading = document.getElementById('catalog-loading');
const errBox = document.getElementById('catalog-error');
const errMsg = document.getElementById('catalog-error-msg');

async function loadSeed() {
  const base = window.__OSA_BASE__ || './';
  try {
    const res = await fetch(base + 'data/recursos.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data || data.schemaVersion !== 1 || !Array.isArray(data.resources)) throw new Error('esquema inesperado');
    return data.resources;
  } catch (e) {
    return null;
  }
}

(async () => {
  let seed = await loadSeed();
  if (!seed) {
    if (!navigator.onLine) {
      errMsg.textContent = 'Você está offline e o catálogo ainda não foi carregado neste dispositivo. Reconecte-se uma vez para que o site possa guardar o catálogo para uso futuro.';
    } else {
      errMsg.textContent = 'Não foi possível carregar o catálogo (data/recursos.json). Tente recarregar a página.';
    }
    errBox.hidden = false;
    if (loading) loading.hidden = true;
    // Estado ainda funcional: coleção pessoal continua acessível sem o seed.
    seed = [];
  }
  if (loading) loading.hidden = true;
  const api = initCatalogPage({
    seed,
    listEl: document.getElementById('resource-list'),
    controlsEl: document.getElementById('catalog-controls'),
    statusEl: document.getElementById('result-count'),
    countEl: document.getElementById('result-count'),
    toast,
  });
  initExportImport({ toast, rerender: api && api.render });

  // Descoberta externa: apenas monta URLs de busca e abre em nova aba.
  const termInput = document.getElementById('discovery-term');
  const upd = () => {
    const q = encodeURIComponent((termInput.value || '').trim() || 'hebraico bíblico recursos estudo');
    const g = document.getElementById('disc-google'); if (g) g.href = 'https://www.google.com/search?q=' + q;
    const d = document.getElementById('disc-ddg'); if (d) d.href = 'https://duckduckgo.com/?q=' + q;
    const s = document.getElementById('disc-step'); if (s) s.href = 'https://www.stepbible.org/?q=' + q;
  };
  if (termInput) { termInput.addEventListener('input', upd); upd(); }

  // Botões genéricos data-close (diálogos)
  document.querySelectorAll('[data-close]').forEach(b => {
    b.addEventListener('click', () => {
      const dlg = document.getElementById(b.dataset.close);
      if (dlg && dlg.close) dlg.close(); else if (dlg) dlg.removeAttribute('open');
    });
  });
})();
