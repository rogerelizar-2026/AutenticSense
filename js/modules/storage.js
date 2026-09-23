/**
 * js/modules/storage.js — Persistência local nomepsaceda + migração de chaves legadas.
 * Regras (seção 7/8 da especificação):
 *  - Novas chaves: osa.v1.*
 *  - Legado aceito sem nunca apagar dados: biblicalVault (ids de favoritos),
 *    userBiblicalResources (objetos), theme, welcomeModalDismissed, presentationCompleted.
 *  - Aceite real dos termos é separado do simples "dispensar" da apresentação.
 */
const NS = 'osa.v1.';

export const KEYS = {
  TERMS_ACCEPTED: NS + 'terms.accepted',        // boolean — consentimento REAL
  ONBOARDING_SEEN: NS + 'onboarding.seen',      // boolean — apenas apresentou/dispensou
  VAULT: NS + 'vault',                          // string[] ids favoritos
  USER_RESOURCES: NS + 'userResources',         // Resource[]
  READING_POS: NS + 'readingPositions',         // { [pageId]: {hash, ts} }
  THEME: NS + 'theme',                          // 'light' | 'dark' | 'system'
  A11Y: NS + 'a11y',                            // { fontScale, dyslexia, highContrast, reducedMotion }
  SW_UPDATE_ACK: NS + 'sw.updateAck',           // versão reconhecida
};

const LEGACY = {
  VAULT: 'biblicalVault',
  USER_RESOURCES: 'userBiblicalResources',
  THEME: 'theme',
  WELCOME_DISMISSED: 'welcomeModalDismissed',
  PRESENTATION_DONE: 'presentationCompleted',
};

function safeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch (e) {
    if (e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014)) {
      const err = new Error('quota'); err.quota = true; throw err;
    }
    return false;
  }
}
function parseJSON(raw, fallback) {
  if (raw == null) return fallback;
  try {
    const v = JSON.parse(raw);
    return (v === null || v === undefined) ? fallback : v;
  } catch (e) { return fallback; }
}

let migrated = false;

/** Executa a migração legado -> nomepsacedo uma vez por sessão (idempotente). */
export function migrateLegacy() {
  if (migrated) return;
  migrated = true;

  // Favoritos: biblicalVault podia ser array de ids OU objeto {ids:[...]}
  if (safeGet(KEYS.VAULT) === null) {
    const legacyVault = parseJSON(safeGet(LEGACY.VAULT), null);
    let ids = [];
    if (Array.isArray(legacyVault)) ids = legacyVault.filter(x => typeof x === 'string');
    else if (legacyVault && Array.isArray(legacyVault.ids)) ids = legacyVault.ids.filter(x => typeof x === 'string');
    safeSet(KEYS.VAULT, JSON.stringify(ids));
  }

  // Recursos do usuário: userBiblicalResources
  if (safeGet(KEYS.USER_RESOURCES) === null) {
    const legacyUser = parseJSON(safeGet(LEGACY.USER_RESOURCES), []);
    safeSet(KEYS.USER_RESOURCES, JSON.stringify(Array.isArray(legacyUser) ? legacyUser : []));
  }

  // Tema antigo ('dark'/'light' crus ou objeto)
  if (safeGet(KEYS.THEME) === null) {
    const t = safeGet(LEGACY.THEME);
    if (t === 'dark' || t === 'light') safeSet(KEYS.THEME, t);
    else if (t && typeof t === 'object' && (t.mode === 'dark' || t.mode === 'light')) safeSet(KEYS.THEME, t.mode);
    else safeSet(KEYS.THEME, 'system');
  }

  // IMPORTANTE: "dismissed"/"presentationCompleted" legados NUNCA viram aceite de termos.
  // Servem apenas para marcar que a pessoa já viu o texto uma vez.
  const dismissed = safeGet(LEGACY.WELCOME_DISMISSED);
  const presented = safeGet(LEGACY.PRESENTATION_DONE);
  if ((dismissed === 'true' || dismissed === '"true"' || presented === 'true') && safeGet(KEYS.ONBOARDING_SEEN) === null) {
    safeSet(KEYS.ONBOARDING_SEEN, 'true');
  }
  // Se as chaves novas ainda não existem, inicialize-as com estados seguros.
  if (safeGet(KEYS.TERMS_ACCEPTED) === null) safeSet(KEYS.TERMS_ACCEPTED, 'false');
  if (safeGet(KEYS.ONBOARDING_SEEN) === null) safeSet(KEYS.ONBOARDING_SEEN, 'false');
  if (safeGet(KEYS.READING_POS) === null) safeSet(KEYS.READING_POS, '{}');
  if (safeGet(KEYS.A11Y) === null) safeSet(KEYS.A11Y, JSON.stringify({ fontScale: 1, dyslexia: false, highContrast: false, reducedMotion: false }));
}

/* ---------- API tipada ---------- */
export function getJSON(key, fallback) {
  migrateLegacy();
  return parseJSON(safeGet(key), fallback);
}
export function setJSON(key, value) {
  migrateLegacy();
  return safeSet(key, JSON.stringify(value));
}
export function getRaw(key) { migrateLegacy(); return safeGet(key); }
export function setRaw(key, v) { migrateLegacy(); return safeSet(key, v); }

/* Termos */
export function termsAccepted() {
  migrateLegacy();
  return safeGet(KEYS.TERMS_ACCEPTED) === 'true';
}
export function acceptTerms() { migrateLegacy(); safeSet(KEYS.TERMS_ACCEPTED, 'true'); }
export function onboardingSeen() {
  migrateLegacy();
  return safeGet(KEYS.ONBOARDING_SEEN) === 'true';
}
export function markOnboardingSeen() { migrateLegacy(); safeSet(KEYS.ONBOARDING_SEEN, 'true'); }

/* Cofre (favoritos) */
export function getVault() {
  const v = getJSON(KEYS.VAULT, []);
  return Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
}
export function setVault(ids) { return setJSON(KEYS.VAULT, Array.from(new Set(ids))); }
export function toggleFavorite(id) {
  const ids = getVault();
  const has = ids.includes(id);
  if (has) setVault(ids.filter(x => x !== id));
  else setVault([...ids, id]);
  return !has;
}

/* Recursos do usuário */
export function getUserResources() {
  const v = getJSON(KEYS.USER_RESOURCES, []);
  return Array.isArray(v) ? v : [];
}
export function setUserResources(list) { return setJSON(KEYS.USER_RESOURCES, list); }

/* Posições de leitura (distinto de conclusão de lições) */
export function getReadingPositions() {
  const v = getJSON(KEYS.READING_POS, {});
  return (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
}
export function saveReadingPosition(pageId, hash) {
  const all = getReadingPositions();
  all[pageId] = { hash, ts: Date.now() };
  try { setJSON(KEYS.READING_POS, all); } catch (e) { /* quota: ignorar posição */ }
}
export function lastReading() {
  const all = getReadingPositions();
  let best = null;
  for (const page of Object.keys(all)) {
    const r = all[page];
    if (r && r.hash && (!best || r.ts > best.ts)) best = { page, ...r };
  }
  return best;
}

/* Acessibilidade */
export function getA11y() {
  return getJSON(KEYS.A11Y, { fontScale: 1, dyslexia: false, highContrast: false, reducedMotion: false });
}
export function setA11y(patch) {
  const cur = getA11y();
  const next = { ...cur, ...patch };
  setJSON(KEYS.A11Y, next);
  return next;
}

/* Tema */
export function getThemeMode() {
  const t = getRaw(KEYS.THEME);
  return (t === 'light' || t === 'dark') ? t : 'system';
}
export function setThemeMode(mode) { setRaw(KEYS.THEME, mode); }
