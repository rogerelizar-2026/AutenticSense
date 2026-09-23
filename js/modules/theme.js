/**
 * js/modules/theme.js — Única implementação de tema (id consistente "theme-toggle").
 * Modos: claro | escuro | sistema. Persistência via storage.js (osa.v1.theme).
 */
import { getThemeMode, setThemeMode } from './storage.js';

const LABELS = { light: 'Claro', dark: 'Escuro', system: 'Sistema' };

function apply(mode) {
  const root = document.documentElement;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const resolved = mode === 'dark' || (mode === 'system' && mql.matches) ? 'dark' : 'light';
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-mode', mode);
}

export function initTheme() {
  const btn = document.getElementById('theme-toggle'); // id único em todo o site
  if (!btn) return; // §8.2: só inicializa com o alvo presente
  let mode = getThemeMode();
  apply(mode);

  const label = btn.querySelector('.theme-label');
  const sync = () => {
    btn.setAttribute('aria-label', `Tema: ${LABELS[mode]} (toque para alternar)`);
    btn.setAttribute('title', `Tema atual: ${LABELS[mode]}`);
    btn.setAttribute('data-mode', mode);
    if (label) label.textContent = LABELS[mode];
  };
  sync();

  btn.addEventListener('click', () => {
    mode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
    setThemeMode(mode);
    apply(mode);
    sync();
  });

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => { if (mode === 'system') apply('system'); };
  if (mql.addEventListener) mql.addEventListener('change', onChange);
}
