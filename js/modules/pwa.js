/**
 * js/modules/pwa.js — Registro do service worker + fluxo honesto de atualização:
 * NUNCA auto-ativa. Mostra "Nova versão disponível" + botão "Atualizar".
 * Também cuida do prompt de instalação e das instruções iOS.
 */
import { getRaw, setRaw, KEYS } from './storage.js';

export function initPWA() {
  const banner = document.getElementById('update-banner');
  const btnUpdate = document.getElementById('update-apply');
  const btnDismiss = document.getElementById('update-dismiss');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const base = window.__OSA_BASE__ || './';
      navigator.serviceWorker.register(base + 'sw.js').catch(() => {
        // Sem SW o site continua funcionando (static-first). Nada a prometer.
      });
      if (navigator.serviceWorker && navigator.serviceWorker.addEventListener) {
        navigator.serviceWorker.addEventListener('message', (ev) => {
          const d = ev.data || {};
          if (d.type === 'osa:update-available') {
            if (!banner) return;
            const version = String(d.version || '');
            if (getRaw(KEYS.SW_UPDATE_ACK) === version) return; // já dispensada nesta instalação? não força
            banner.hidden = false;
            const vEl = document.getElementById('update-version');
            if (vEl) vEl.textContent = version ? ` (versão ${version})` : '';
          }
        });
      }
    });
    if (btnUpdate) {
      btnUpdate.addEventListener('click', () => {
        const base = window.__OSA_BASE__ || './';
        fetch(base + 'sw.js', { cache: 'reload' }).then(() => {
          navigator.serviceWorker.getRegistration().then(reg => {
            if (reg && reg.waiting) reg.waiting.postMessage({ type: 'OSA_SKIP_WAITING' });
            else { if (banner) banner.hidden = true; window.location.reload(); }
          });
        }).catch(() => window.location.reload());
      });
    }
    if (btnDismiss && banner) {
      btnDismiss.addEventListener('click', () => {
        const vEl = document.getElementById('update-version-code');
        setRaw(KEYS.SW_UPDATE_ACK, vEl ? vEl.textContent : 'dismissed');
        banner.hidden = true;
      });
    }
    navigator.serviceWorker.ready.then(() => {}).catch(() => {});
  }

  /* Prompt de instalação (somente quando suportado) */
  const installBtn = document.getElementById('install-btn');
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn && !isStandalone()) installBtn.hidden = false;
  });
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.hidden = true;
    });
  }
  if (isStandalone()) {
    if (installBtn) installBtn.hidden = true;
    const ios = document.getElementById('ios-install-note');
    if (ios) ios.hidden = true;
  } else if (isIOS() && !window.navigator.standalone) {
    const ios = document.getElementById('ios-install-note');
    if (ios) ios.hidden = false;
  }
}

function isStandalone() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
}
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
