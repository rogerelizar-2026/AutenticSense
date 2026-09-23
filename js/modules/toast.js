/**
 * js/modules/toast.js — Região de notificações acessível (role=status) com ação opcional (desfazer).
 */
let region = null;

function ensureRegion() {
  if (region && document.body.contains(region)) return region;
  region = document.getElementById('toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'toast-region';
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }
  return region;
}

export function toast(message, opts = {}) {
  const reg = ensureRegion();
  const t = document.createElement('div');
  t.className = 'toast';
  const p = document.createElement('p');
  p.textContent = message;
  p.style.margin = '0';
  t.appendChild(p);
  let timer = null;
  const dismiss = () => {
    clearTimeout(timer);
    t.remove();
  };
  if (opts.actionLabel && typeof opts.onAction === 'function') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.textContent = opts.actionLabel;
    b.addEventListener('click', () => { opts.onAction(); dismiss(); });
    t.appendChild(b);
    timer = setTimeout(dismiss, 12000);
  } else {
    timer = setTimeout(dismiss, 6000);
  }
  reg.appendChild(t);
  return dismiss;
}
