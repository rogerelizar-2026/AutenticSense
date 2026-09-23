/**
 * js/modules/nav.js — Cabeçalho, navegação inferior, sidebar/drawer ("Nesta página"),
 * deep links (#port-*, #heb-*, #grk-*), redirecionamento de hashes legadas na entrada.
 * API exposta: window.osaSidebar = { open, close, toggle, isOpen } (invariante §8.1).
 */
import { saveReadingPosition, termsAccepted } from './storage.js';

const HASH_PREFIXES = ['port-', 'heb-', 'grk-'];

const PAGE_OF_PREFIX = {
  'port-': 'index.html',
  'heb-': 'hebraico-aramaico.html',
  'grk-': 'grego-koine.html',
};

// Hashes legadas conhecidas -> destino canônico (para redirecionar a partir do portal)
const LEGACY_HASHES = {
  '#recursos': 'caixa-de-ferramentas.html#ferr-catalogo',
  '#catalogo': 'caixa-de-ferramentas.html#ferr-catalogo',
  '#colecao': 'caixa-de-ferramentas.html#ferr-colecao',
  '#metodos': 'hebraico-aramaico.html#heb-metodos',
  '#curriculo-hebraico': 'hebraico-aramaico.html#heb-curriculo',
  '#curriculo-grego': 'grego-koine.html#grk-curriculo',
  '#gemini': 'index.html#port-gemini',
  '#institucional': 'index.html#port-instituicoes',
};

function currentPageFile() {
  const p = location.pathname;
  const file = p.substring(p.lastIndexOf('/') + 1);
  return file === '' ? 'index.html' : file;
}

/** Se estamos em index e o hash pertence a outra página, redireciona preservando o hash. */
export function resolveLegacyHashOnEntry() {
  if (currentPageFile() !== 'index.html') return false;
  const h = location.hash;
  if (!h) return false;
  const id = h.slice(1);
  // hash da própria página? deixa estar.
  if (document.getElementById(id)) return false;
  for (const pre of HASH_PREFIXES) {
    if (id.startsWith(pre)) {
      location.replace(PAGE_OF_PREFIX[pre] + h);
      return true;
    }
  }
  if (LEGACY_HASHES[h]) {
    location.replace(LEGACY_HASHES[h]);
    return true;
  }
  return false;
}

/** Marca aria-current na navegação inferior conforme a página atual. */
export function markActiveNav() {
  const file = currentPageFile();
  document.querySelectorAll('.bottom-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const target = href.split('#')[0];
    const same = (target === file) || (target === '' && file === 'index.html');
    if (same) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* ---------------- Sidebar / drawer ---------------- */
let sideState = { el: null, backdrop: null, opener: null, open: false };

function desktopMode() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

function focusFirstLink() {
  const link = sideState.el && sideState.el.querySelector('nav a');
  if (link) link.focus();
}

export function openSidebar() {
  if (!sideState.el || desktopMode()) return;
  sideState.open = true;
  sideState.el.classList.add('is-open');
  sideState.el.removeAttribute('aria-hidden');
  if (sideState.backdrop) sideState.backdrop.hidden = false;
  if (sideState.opener) sideState.opener.setAttribute('aria-expanded', 'true');
  focusFirstLink();
}
export function closeSidebar(opts = {}) {
  if (!sideState.el) return;
  sideState.open = false;
  sideState.el.classList.remove('is-open');
  if (!desktopMode()) sideState.el.setAttribute('aria-hidden', 'true');
  if (sideState.backdrop) sideState.backdrop.hidden = true;
  if (sideState.opener) {
    sideState.opener.setAttribute('aria-expanded', 'false');
    if (opts.restoreFocus !== false) sideState.opener.focus();
  }
}
export function toggleSidebar() {
  if (!sideState.el) return;
  if (sideState.open) closeSidebar(); else openSidebar();
}
export function isSidebarOpen() { return !!sideState.open; }

function initSidebar() {
  const el = document.getElementById('page-sidebar');
  if (!el) return; // invariante §8.2: só inicializa se o alvo existir
  sideState.el = el;
  sideState.backdrop = document.getElementById('sidebar-backdrop');
  sideState.opener = document.querySelector('.sidebar-toggle');

  if (sideState.backdrop) {
    sideState.backdrop.addEventListener('click', () => closeSidebar());
  }
  if (sideState.opener) {
    sideState.opener.addEventListener('click', () => toggleSidebar());
  }
  el.querySelectorAll('.close-side').forEach(b => b.addEventListener('click', () => closeSidebar()));
  // Links internos fecham o drawer no mobile
  el.querySelectorAll('nav a[href*="#"]').forEach(a => {
    a.addEventListener('click', () => { if (!desktopMode()) closeSidebar({ restoreFocus: false }); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideState.open) closeSidebar();
  });
  // Estado responsivo: no desktop a sidebar é permanente
  const mq = window.matchMedia('(min-width: 1024px)');
  const applyMq = () => {
    if (mq.matches) {
      el.removeAttribute('aria-hidden');
      if (sideState.backdrop) sideState.backdrop.hidden = true;
    } else if (!sideState.open) {
      el.setAttribute('aria-hidden', 'true');
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', applyMq);
  applyMq();
}

/* ---------------- Índice "Nesta página" ativo ---------------- */
function initSectionHighlight() {
  const el = document.getElementById('page-sidebar');
  if (!el) return;
  const links = Array.from(el.querySelectorAll('nav a[href^="#"], nav a[href^="index.html#"], nav a[href^="hebraico'], nav a[href^="grego"], nav a[href^="caixa"]'))
    .filter(a => (a.getAttribute('href') || '').includes('#'));
  const localLinks = links.filter(a => !a.getAttribute('href').includes('.html#'));
  if (!localLinks.length || !('IntersectionObserver' in window)) return;
  const map = new Map();
  localLinks.forEach(a => {
    const sec = document.getElementById(a.getAttribute('href').slice(1));
    if (sec) map.set(sec, a);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const a = map.get(en.target);
      if (!a) return;
      if (en.isIntersecting) {
        localLinks.forEach(x => x.removeAttribute('aria-current'));
        a.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  map.forEach((_a, sec) => io.observe(sec));
}

/* ---------------- Posição de leitura (real, não progresso) ---------------- */
function initReadingPos(pageId) {
  if (!pageId) return;
  let t = null;
  const onHash = () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (location.hash) saveReadingPosition(pageId, location.hash);
    }, 350);
  };
  window.addEventListener('hashchange', onHash);
  if (location.hash) onHash();
}

/* ---------------- Links externos seguros ---------------- */
function initExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(a => {
    const url = a.getAttribute('href') || '';
    const here = location.origin + (location.pathname.match(/^(.*\/)/) ? location.pathname.match(/^(.*\/)/)[1] : '/');
    if (!url.startsWith(location.origin)) {
      a.setAttribute('rel', 'noopener noreferrer external');
      a.setAttribute('target', '_blank');
    }
  });
}

/* ---------------- Boot ---------------- */
export function initNav({ pageId } = {}) {
  resolveLegacyHashOnEntry();
  markActiveNav();
  initSidebar();
  initSectionHighlight();
  initReadingPos(pageId);
  initExternalLinks();
  // Ao carregar direto numa âncora, garantir scroll-margin já tratado no CSS.
}

// Expor API estável p/ markup e testes (invariante §8.1)
window.osaSidebar = {
  open: openSidebar,
  close: closeSidebar,
  toggle: toggleSidebar,
  isOpen: isSidebarOpen,
};
