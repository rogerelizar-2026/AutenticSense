/**
 * js/modules/onboarding.js — Diálogo de termos da primeira visita.
 * Regras (§4): checkbox inicia DESMARCADO; ação primária desabilitada até marcar;
 * rolagem NUNCA implica consentimento; fechar sem aceitar mantém barra persistente
 * "Ler e aceitar os termos"; foco entra no diálogo e retorna ao fechar;
 * aceite real (osa.v1.terms.accepted) separado de "visto" (osa.v1.onboarding.seen).
 */
import { termsAccepted, acceptTerms, onboardingSeen, markOnboardingSeen } from './storage.js';

let lastFocus = null;
let barEl = null;

function getDialog() { return document.getElementById('terms-dialog'); }

export function openTermsDialog({ focusBack = true } = {}) {
  const dlg = getDialog();
  if (!dlg) return;
  lastFocus = document.activeElement;
  const cb = document.getElementById('terms-checkbox');
  const btnOk = document.getElementById('terms-accept');
  if (cb) { cb.checked = false; }
  if (btnOk) btnOk.disabled = true;
  if (typeof dlg.showModal === 'function') {
    if (!dlg.open) dlg.showModal();
  } else {
    dlg.setAttribute('open', ''); // fallback simples
  }
  if (cb) cb.focus();
}

function closeTermsDialog(accepted) {
  const dlg = getDialog();
  if (!dlg) return;
  if (dlg.close && dlg.open) dlg.close();
  else dlg.removeAttribute('open');
  hideBar();
  if (focusBackTarget()) focusBackTarget().focus();
  else if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function focusBackTarget() {
  return document.getElementById('start-studies-btn');
}

function showBar() {
  if (barEl || termsAccepted()) return;
  barEl = document.createElement('div');
  barEl.className = 'terms-bar';
  barEl.setAttribute('role', 'status');
  barEl.id = 'terms-persistent-bar';
  const p = document.createElement('p');
  p.textContent = 'Para começar, leia e aceite o propósito e as diretrizes do estudo.';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-accent';
  btn.textContent = 'Ler e aceitar os termos';
  btn.addEventListener('click', () => openTermsDialog());
  barEl.append(p, btn);
  document.body.appendChild(barEl);
}
function hideBar() {
  if (barEl) { barEl.remove(); barEl = null; }
}

export function initOnboarding() {
  const dlg = getDialog();
  if (!dlg) return; // §8.2 — página sem diálogo (offline etc.) não quebra

  const cb = document.getElementById('terms-checkbox');
  const btnOk = document.getElementById('terms-accept');
  const btnCancel = document.getElementById('terms-cancel');
  const btnLater = document.getElementById('terms-later');

  if (cb && btnOk) {
    cb.addEventListener('change', () => { btnOk.disabled = !cb.checked; });
  }
  if (btnOk) {
    btnOk.addEventListener('click', (e) => {
      e.preventDefault();
      if (!cb || !cb.checked) return; // dupla proteção: só aceita com marcação explícita
      acceptTerms();
      markOnboardingSeen();
      closeTermsDialog(true);
      window.dispatchEvent(new CustomEvent('osa:terms-accepted'));
    });
  }
  if (btnCancel) {
    btnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      markOnboardingSeen();      // "vi a apresentação" ≠ aceite
      closeTermsDialog(false);
      showBar();
    });
  }
  if (btnLater) {
    btnLater.addEventListener('click', (e) => {
      e.preventDefault();
      markOnboardingSeen();
      closeTermsDialog(false);
      showBar();
    });
  }

  // Fechar por ESC/click externo: NÃO burla o requisito — mostra a barra.
  dlg.addEventListener('cancel', (e) => {
    e.preventDefault();
    markOnboardingSeen();
    closeTermsDialog(false);
    showBar();
  });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) { // clique no backdrop nativo
      markOnboardingSeen();
      closeTermsDialog(false);
      showBar();
    }
  });

  // Primeira visita: abre automaticamente se ainda não aceitou nem viu.
  if (!termsAccepted()) {
    if (!onboardingSeen()) {
      openTermsDialog();
    } else {
      showBar();
    }
  }

  // Ação "Começar meus estudos": exige aceite; reabre o diálogo se preciso.
  const startBtn = document.getElementById('start-studies-btn');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      if (!termsAccepted()) {
        e.preventDefault();
        openTermsDialog();
      }
    });
  }
}
