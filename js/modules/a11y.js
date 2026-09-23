/**
 * js/modules/a11y.js — Barra de acessibilidade: tamanho de fonte (A−/A+/reset),
 * fonte p/ dislexia, alto contraste, movimento reduzido e leitura em voz alta (TTS).
 * Preferências persistidas (osa.v1.a11y). TTS detecta speechSynthesis; nota honesta:
 * vozes pt-BR não pronunciam hebraico/grego corretamente.
 */
import { getA11y, setA11y } from './storage.js';

const MIN = 0.85, MAX = 1.6, STEP = 0.1;

function applyA11y(prefs) {
  const root = document.documentElement;
  root.style.fontSize = `${Math.round(17 * prefs.fontScale)}px`;
  root.setAttribute('data-dyslexia-font', String(!!prefs.dyslexia));
  root.setAttribute('data-high-contrast', String(!!prefs.highContrast));
  root.setAttribute('data-reduced-motion', String(!!prefs.reducedMotion));
}

export function initA11yBar() {
  const bar = document.getElementById('a11y-bar');
  if (!bar) return; // §8.2
  let prefs = getA11y();
  applyA11y(prefs);

  const status = document.getElementById('a11y-status');
  const announce = (msg) => { if (status) status.textContent = msg; };

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  };

  bind('font-minus', () => {
    prefs = setA11y({ fontScale: Math.max(MIN, +(prefs.fontScale - STEP).toFixed(2)) });
    applyA11y(prefs); announce(`Tamanho do texto: ${Math.round(prefs.fontScale * 100)}%`);
  });
  bind('font-plus', () => {
    prefs = setA11y({ fontScale: Math.min(MAX, +(prefs.fontScale + STEP).toFixed(2)) });
    applyA11y(prefs); announce(`Tamanho do texto: ${Math.round(prefs.fontScale * 100)}%`);
  });
  bind('font-reset', () => {
    prefs = setA11y({ fontScale: 1 });
    applyA11y(prefs); announce('Tamanho do texto restaurado (100%).');
  });
  bind('dys-toggle', (e) => {
    prefs = setA11y({ dyslexia: !prefs.dyslexia });
    applyA11y(prefs);
    e.currentTarget.setAttribute('aria-pressed', String(prefs.dyslexia));
    announce(prefs.dyslexia ? 'Fonte alternativa ativada.' : 'Fonte alternativa desativada.');
  });
  bind('contrast-toggle', (e) => {
    prefs = setA11y({ highContrast: !prefs.highContrast });
    applyA11y(prefs);
    e.currentTarget.setAttribute('aria-pressed', String(prefs.highContrast));
    announce(prefs.highContrast ? 'Alto contraste ativado.' : 'Alto contraste desativado.');
  });
  bind('motion-toggle', (e) => {
    prefs = setA11y({ reducedMotion: !prefs.reducedMotion });
    applyA11y(prefs);
    e.currentTarget.setAttribute('aria-pressed', String(prefs.reducedMotion));
    announce(prefs.reducedMotion ? 'Animações reduzidas ativadas.' : 'Animações reduzidas desativadas.');
  });

  const dBtn = document.getElementById('dys-toggle');
  if (dBtn) dBtn.setAttribute('aria-pressed', String(prefs.dyslexia));
  const cBtn = document.getElementById('contrast-toggle');
  if (cBtn) cBtn.setAttribute('aria-pressed', String(prefs.highContrast));
  const mBtn = document.getElementById('motion-toggle');
  if (mBtn) mBtn.setAttribute('aria-pressed', String(prefs.reducedMotion));

  initTTS(announce);
}

/* ---------- Leitura em voz alta ---------- */
function initTTS(announce) {
  const btnRead = document.getElementById('tts-read');
  const btnStop = document.getElementById('tts-stop');
  if (!btnRead || !btnStop) return;
  const supported = 'speechSynthesis' in window;
  if (!supported) {
    btnRead.disabled = true;
    btnRead.title = 'Não disponível neste navegador';
    btnStop.disabled = true;
    announce('Leitura em voz alta indisponível neste navegador.');
    return;
  }
  let speaking = false;

  btnRead.addEventListener('click', () => {
    const main = document.getElementById('main-content');
    if (!main) return;
    window.speechSynthesis.cancel();
    const text = main.innerText || '';
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.onend = () => { speaking = false; btnRead.setAttribute('aria-pressed', 'false'); };
    utter.onerror = () => { speaking = false; btnRead.setAttribute('aria-pressed', 'false'); };
    window.speechSynthesis.speak(utter);
    speaking = true;
    btnRead.setAttribute('aria-pressed', 'true');
    announce('Leitura iniciada. Atenção: as vozes em português não pronunciam corretamente palavras em hebraico, aramaico ou grego.');
  });
  btnStop.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    speaking = false;
    btnRead.setAttribute('aria-pressed', 'false');
    announce('Leitura interrompida.');
  });
}
