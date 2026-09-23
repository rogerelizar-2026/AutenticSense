/**
 * js/modules/catalog.js — Busca, filtros, favoritos, coleção, CRUD de recursos do usuário.
 * Segurança: renderização SEMPRE via textContent/DOM (nunca innerHTML com dados),
 * allowlist de protocolo http/https para links.
 */
import {
  getVault, toggleFavorite, getUserResources, setUserResources,
} from './storage.js';

export const CATEGORIES = [
  ['gramatica', 'Gramática'], ['lexico', 'Léxico'], ['manuscritologia', 'Manuscritologia'],
  ['critica-textual', 'Crítica textual'], ['exegese', 'Exegese'], ['software', 'Software'],
  ['app', 'App'], ['midia', 'Mídia'], ['mapas', 'Mapas'], ['texto-biblico', 'Texto bíblico'],
];
export const LANGS = [['hebraico', 'Hebraico'], ['aramaico', 'Aramaico'], ['grego', 'Grego'], ['todos', 'Todas as línguas']];
export const LEVELS = [['iniciante', 'Iniciante'], ['intermediario', 'Intermediário'], ['avancado', 'Avançado'], ['todos', 'Todos os níveis']];

const catLabel = k => (CATEGORIES.find(c => c[0] === k) || [, k])[1];
const langLabel = k => (LANGS.find(c => c[0] === k) || [, k])[1];
const levelLabel = k => (LEVELS.find(c => c[0] === k) || [, k])[1];

/** Normalização sem acentos p/ busca (NFD + strip de combining marks). */
export function normalizeText(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function isSafeUrl(url) {
  try {
    const u = new URL(url, window.location.href);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) { return false; }
}

export function filterResources(all, q) {
  const nq = normalizeText(q.query).trim();
  const terms = nq ? nq.split(/\s+/) : [];
  return all.filter(r => {
    if (terms.length) {
      const hay = normalizeText(`${r.title} ${r.author || ''} ${r.description || ''}`);
      if (!terms.every(t => hay.includes(t))) return false;
    }
    if (q.category && r.category !== q.category) return false;
    if (q.language && q.language !== 'todos' && r.language !== q.language && r.language !== 'todos') return false;
    if (q.level && q.level !== 'todos' && r.level !== q.level && r.level !== 'todos') return false;
    if (q.onlyFavorites && !q.vault.includes(r.id)) return false;
    return true;
  });
}

/* ---------- Renderização segura ---------- */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function starSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z');
  svg.appendChild(path);
  return svg;
}

export function renderResourceCard(res, ctx) {
  const card = el('article', 'card card-hover resource-card');
  card.dataset.id = res.id;
  const head = el('header');
  head.appendChild(el('h3', null, res.title));
  const badges = el('div', 'badges-row');
  badges.appendChild(el('span', 'badge badge-' + (res.free ? 'free' : 'paid'), res.free ? 'Gratuito' : 'Pago'));
  badges.appendChild(el('span', 'badge', catLabel(res.category)));
  badges.appendChild(el('span', 'badge', langLabel(res.language)));
  badges.appendChild(el('span', 'badge', levelLabel(res.level)));
  if (res.type) badges.appendChild(el('span', 'badge', res.type));
  if (res.userAdded) badges.appendChild(el('span', 'badge badge-paid', 'Adicionado por você'));
  head.appendChild(badges);
  card.appendChild(head);

  if (res.author) card.appendChild(el('p', 'meta', `Autor/curadoria: ${res.author}`));
  card.appendChild(el('p', 'desc', res.description || ''));

  const actions = el('div', 'actions');
  if (isSafeUrl(res.link)) {
    const a = el('a', 'btn btn-primary', 'Abrir recurso');
    a.href = res.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer external';
    const ext = el('span', 'visually-hidden', ' (abre em nova aba, site externo)');
    a.appendChild(ext);
    actions.appendChild(a);
  } else if (res.link) {
    actions.appendChild(el('span', 'note-editorial', 'Link inválido omitido (apenas http/https são aceitos).'));
  }

  const fav = el('button', 'btn fav-btn');
  fav.type = 'button';
  const pressed = ctx.vault.includes(res.id);
  fav.setAttribute('aria-pressed', String(pressed));
  fav.setAttribute('aria-label', pressed ? `Remover "${res.title}" dos favoritos` : `Adicionar "${res.title}" aos favoritos`);
  fav.appendChild(starSVG());
  fav.appendChild(el('span', null, pressed ? 'Favorito' : 'Favoritar'));
  fav.addEventListener('click', () => {
    const nowFav = toggleFavorite(res.id);
    ctx.onVaultChange();
    // atualiza o próprio botão sem re-render total
    fav.setAttribute('aria-pressed', String(nowFav));
    fav.setAttribute('aria-label', nowFav ? `Remover "${res.title}" dos favoritos` : `Adicionar "${res.title}" aos favoritos`);
    fav.querySelector('span').textContent = nowFav ? 'Favorito' : 'Favoritar';
    ctx.refreshCounts();
  });
  actions.appendChild(fav);

  if (res.userAdded) {
    const edit = el('button', 'btn', 'Editar');
    edit.type = 'button';
    edit.addEventListener('click', () => ctx.editUserResource(res.id));
    actions.appendChild(edit);
    const del = el('button', 'btn btn-danger', 'Excluir');
    del.type = 'button';
    del.addEventListener('click', () => ctx.deleteUserResource(res.id));
    actions.appendChild(del);
  }
  card.appendChild(actions);
  return card;
}

/* ---------- Estado principal da página de catálogo ---------- */
export function initCatalogPage({ seed, listEl, controlsEl, statusEl, countEl, toast }) {
  if (!listEl || !controlsEl) return null; // §8.2

  const state = {
    query: '', category: '', language: 'todos', level: 'todos',
    onlyFavorites: false, vault: getVault(),
  };

  const all = () => [...seed.map(r => ({ ...r, userAdded: false })), ...getUserResources()];

  function refreshCounts() { state.vault = getVault(); }

  function render() {
    const items = filterResources(all(), { ...state });
    listEl.textContent = '';
    const frag = document.createDocumentFragment();
    items.forEach(r => frag.appendChild(renderResourceCard(r, {
      vault: state.vault,
      onVaultChange: refreshCounts,
      refreshCounts,
      editUserResource,
      deleteUserResource,
    })));
    listEl.appendChild(frag);
    countEl.textContent = `${items.length} ${items.length === 1 ? 'recurso encontrado' : 'recursos encontrados'} de ${all().length}.`;
    if (!items.length) {
      const empty = el('div', 'empty-state');
      empty.appendChild(el('p', null, 'Nenhum recurso corresponde aos filtros atuais.'));
      const b = el('button', 'btn', 'Limpar filtros');
      b.type = 'button';
      b.addEventListener('click', clearFilters);
      empty.appendChild(b);
      listEl.appendChild(empty);
    }
    renderCollection();
  }

  function clearFilters() {
    state.query = ''; state.category = ''; state.language = 'todos'; state.level = 'todos'; state.onlyFavorites = false;
    const qi = document.getElementById('catalog-search'); if (qi) qi.value = '';
    const li = document.getElementById('filter-language'); if (li) li.value = 'todos';
    const vi = document.getElementById('filter-level'); if (vi) vi.value = 'todos';
    const fb = document.getElementById('only-favs'); if (fb) { fb.setAttribute('aria-pressed', 'false'); }
    controlsEl.querySelectorAll('.chip[data-cat]').forEach(c => c.setAttribute('aria-pressed', 'false'));
    render();
  }

  /* Controles */
  const search = document.getElementById('catalog-search');
  if (search) {
    let t = null;
    search.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { state.query = search.value; render(); }, 120);
    });
  }
  controlsEl.querySelectorAll('.chip[data-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      const was = chip.getAttribute('aria-pressed') === 'true';
      controlsEl.querySelectorAll('.chip[data-cat]').forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', String(!was));
      state.category = was ? '' : chip.dataset.cat;
      render();
    });
  });
  const fLang = document.getElementById('filter-language');
  if (fLang) fLang.addEventListener('change', () => { state.language = fLang.value; render(); });
  const fLevel = document.getElementById('filter-level');
  if (fLevel) fLevel.addEventListener('change', () => { state.level = fLevel.value; render(); });
  const favToggle = document.getElementById('only-favs');
  if (favToggle) favToggle.addEventListener('click', () => {
    state.onlyFavorites = favToggle.getAttribute('aria-pressed') !== 'true';
    favToggle.setAttribute('aria-pressed', String(state.onlyFavorites));
    render();
  });
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) clearBtn.addEventListener('click', clearFilters);

  /* ---------- Minha coleção ---------- */
  function renderCollection() {
    const colEl = document.getElementById('collection-list');
    if (!colEl) return;
    const favorites = seed.concat(getUserResources()).filter(r => state.vault.includes(r.id));
    const users = getUserResources();
    colEl.textContent = '';
    const mk = (title, items) => {
      const h = el('h3', null, title);
      colEl.appendChild(h);
      if (!items.length) {
        colEl.appendChild(el('p', 'note-editorial', 'Nada por aqui ainda.'));
        return;
      }
      const wrap = el('div', 'grid');
      items.forEach(r => wrap.appendChild(renderResourceCard(r, {
        vault: state.vault, onVaultChange: refreshCounts, refreshCounts,
        editUserResource, deleteUserResource,
      })));
      colEl.appendChild(wrap);
    };
    mk('Favoritos', favorites);
    mk('Recursos adicionados por você', users);
    const cc = document.getElementById('collection-count');
    if (cc) cc.textContent = `Total no cofre local: ${new Set([...favorites.map(f => f.id), ...users.map(u => u.id)]).size} itens.`;
  }

  /* ---------- CRUD de recursos do usuário ---------- */
  function openForm(resource) {
    const dlg = document.getElementById('resource-form-dialog');
    if (!dlg) return;
    const f = document.getElementById('resource-form');
    f.reset();
    document.getElementById('form-title-mode').textContent = resource ? 'Editar recurso' : 'Adicionar novo recurso';
    f.dataset.editing = resource ? resource.id : '';
    if (resource) {
      f.title.value = resource.title || '';
      f.author.value = resource.author || '';
      f.category.value = resource.category || 'gramatica';
      f.language.value = resource.language || 'todos';
      f.level.value = resource.level || 'todos';
      f.type.value = resource.type || '';
      f.link.value = resource.link || '';
      f.description.value = resource.description || '';
      f.free.checked = !!resource.free;
    }
    hideErrors();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    f.title.focus();
  }
  function hideErrors() {
    document.querySelectorAll('#resource-form .field-error').forEach(e => (e.hidden = true));
  }
  function showErrors(errs) {
    hideErrors();
    errs.forEach(([field, msg]) => {
      const e = document.getElementById(`err-${field}`);
      if (e) { e.textContent = msg; e.hidden = false; }
    });
  }
  function validateForm(f) {
    const errs = [];
    if (!f.title.value.trim()) errs.push(['title', 'O título é obrigatório.']);
    if (f.link.value.trim() && !isSafeUrl(f.link.value.trim())) {
      errs.push(['link', 'Informe uma URL válida iniciando com http:// ou https://.']);
    }
    return errs;
  }
  function saveForm() {
    const f = document.getElementById('resource-form');
    const errs = validateForm(f);
    if (errs.length) { showErrors(errs); return false; }
    const editingId = f.dataset.editing;
    const list = getUserResources();
    const obj = {
      id: editingId || ('user-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)),
      title: f.title.value.trim(),
      author: f.author.value.trim(),
      category: f.category.value,
      language: f.language.value,
      level: f.level.value,
      type: f.type.value.trim() || 'Recurso',
      free: f.free.checked,
      link: f.link.value.trim(),
      description: f.description.value.trim(),
      userAdded: true,
    };
    try {
      if (editingId) {
        const i = list.findIndex(r => r.id === editingId);
        if (i >= 0) list[i] = obj; else list.push(obj);
      } else list.push(obj);
      setUserResources(list);
    } catch (e) {
      if (e && e.quota) { toast('O armazenamento do dispositivo está cheio. Remova itens e tente novamente.'); return false; }
      throw e;
    }
    const dlg = document.getElementById('resource-form-dialog');
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
    render();
    toast(editingId ? 'Recurso atualizado na sua coleção.' : 'Recurso adicionado à sua coleção (salvo neste dispositivo).');
    return true;
  }
  function editUserResource(id) {
    const r = getUserResources().find(x => x.id === id);
    if (r) openForm(r);
  }
  function deleteUserResource(id) {
    const confirmDlg = document.getElementById('confirm-dialog');
    if (!confirmDlg) return;
    const msg = document.getElementById('confirm-message');
    const r = getUserResources().find(x => x.id === id);
    msg.textContent = `Excluir "${r ? r.title : id}" da sua coleção? Esta ação afeta apenas este dispositivo.`;
    const onOk = () => {
      const list = getUserResources();
      const idx = list.findIndex(x => x.id === id);
      if (idx < 0) return;
      const removed = list.splice(idx, 1)[0];
      setUserResources(list);
      // remove também do cofre de favoritos se lá estiver
      const vault = getVault().filter(v => v !== id);
      import('./storage.js').then(m => m.setVault(vault));
      render();
      toast('Recurso excluído.', {
        actionLabel: 'Desfazer',
        onAction: () => {
          const l2 = getUserResources();
          l2.splice(Math.min(idx, l2.length), 0, removed);
          setUserResources(l2);
          render();
        },
      });
      cleanup();
    };
    const onCancel = () => { cleanup(); };
    const okBtn = document.getElementById('confirm-ok');
    const cancelBtn = document.getElementById('confirm-cancel');
    function cleanup() {
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
    }
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    if (typeof confirmDlg.showModal === 'function') confirmDlg.showModal(); else confirmDlg.setAttribute('open', '');
    okBtn.focus();
  }

  const addBtn = document.getElementById('add-resource-btn');
  if (addBtn) addBtn.addEventListener('click', () => openForm(null));
  const form = document.getElementById('resource-form');
  if (form) {
    form.addEventListener('submit', (e) => { e.preventDefault(); saveForm(); });
  }

  render();
  return { render, state, openForm };
}
