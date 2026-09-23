/**
 * js/modules/export-import.js — Exportação/importação JSON (versionada, limitada)
 * e fallback honesto de PDF via folha de estilo de impressão.
 */
import { getVault, getUserResources, setVault, setUserResources } from './storage.js';
import { isSafeUrl, normalizeText } from './catalog.js';

export const SCHEMA_VERSION = 1;
export const MAX_IMPORT_BYTES = 512 * 1024; // 512 KB

function sanitizeResource(r) {
  if (!r || typeof r !== 'object') return null;
  const str = (v, max = 600) => String(v == null ? '' : v).slice(0, max);
  const out = {
    id: str(r.id, 80),
    title: str(r.title, 200),
    author: str(r.author, 200),
    category: str(r.category, 40),
    language: str(r.language, 20),
    level: str(r.level, 20),
    type: str(r.type, 60),
    free: !!r.free,
    link: isSafeUrl(str(r.link, 500)) ? str(r.link, 500) : '',
    description: str(r.description, 1200),
    userAdded: true,
  };
  if (!out.id || !out.title) return null;
  return out;
}

export function buildExportPayload() {
  return {
    app: 'o-sentido-autentico',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    favorites: getVault(),
    userResources: getUserResources(),
  };
}

export function downloadJSON(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `colecao-o-sentido-autentico-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Importa texto JSON. Retorna { ok, added, skippedDuplicates, errors }.
 * Política padrão de duplicados: manter o existente ("keep-existing").
 */
export function importFromText(text, { duplicatePolicy = 'keep-existing' } = {}) {
  const result = { ok: false, added: 0, updated: 0, skippedDuplicates: 0, errors: [] };
  let data;
  try { data = JSON.parse(text); }
  catch (e) { result.errors.push('O arquivo não é um JSON válido. Verifique se exportou pelo próprio site.'); return result; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    result.errors.push('Estrutura inesperada: esperava-se um objeto com "favorites" e "userResources".');
    return result;
  }
  const ver = Number(data.schemaVersion);
  if (!Number.isFinite(ver) || ver < 1 || ver > SCHEMA_VERSION) {
    result.errors.push(`Versão de esquema não suportada (${String(data.schemaVersion)}). Este site aceita a versão ${SCHEMA_VERSION}.`);
    return result;
  }
  const favIn = Array.isArray(data.favorites) ? data.favorites.filter(x => typeof x === 'string') : [];
  const resIn = Array.isArray(data.userResources) ? data.userResources : [];
  const clean = [];
  resIn.forEach((r, i) => {
    const s = sanitizeResource(r);
    if (s) clean.push(s);
    else result.errors.push(`Item ${i + 1} ignorado: sem id/título ou com link fora do padrão http/https.`);
  });

  const existing = getUserResources();
  const byId = new Map(existing.map(r => [r.id, r]));
  clean.forEach(r => {
    if (byId.has(r.id)) {
      if (duplicatePolicy === 'overwrite') {
        const i = existing.findIndex(x => x.id === r.id);
        existing[i] = r; byId.set(r.id, r);
        result.updated++;
      } else {
        result.skippedDuplicates++;
      }
    } else {
      existing.push(r); byId.set(r.id, r);
      result.added++;
    }
  });
  try {
    setUserResources(existing);
    const vault = new Set([...getVault(), ...favIn]);
    setVault(Array.from(vault));
  } catch (e) {
    result.errors.push('Falha ao salvar: armazenamento do dispositivo cheio.');
    return result;
  }
  result.ok = true;
  return result;
}

export function readFileWithLimit(file, limitBytes) {
  return new Promise((resolve, reject) => {
    if (file.size > limitBytes) {
      reject(new Error('ARQUIVO_GRANDE'));
      return;
    }
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('LEITURA_FALHOU'));
    fr.onload = () => resolve(String(fr.result));
    fr.readAsText(file);
  });
}

/** Fallback de PDF: usa a folha de estilo de impressão do navegador (honesto, sem lib externa). */
export function printAsPDF(noteEl) {
  if (noteEl) {
    noteEl.hidden = false;
    noteEl.textContent = 'Exportando como PDF pelo diálogo de impressão do navegador: esta é a alternativa transparente usada porque uma biblioteca de PDF confiável para hebraico/grego não está incluída no projeto.';
  }
  setTimeout(() => window.print(), 150);
}

export function initExportImport({ toast, rerender }) {
  const btnExp = document.getElementById('export-json-btn');
  if (btnExp) btnExp.addEventListener('click', () => {
    downloadJSON(buildExportPayload());
    toast('Coleção exportada em JSON (arquivo baixado neste dispositivo).');
  });

  const btnPrint = document.getElementById('export-pdf-btn');
  if (btnPrint) btnPrint.addEventListener('click', () => {
    printAsPDF(document.getElementById('pdf-note'));
  });

  const inp = document.getElementById('import-json-input');
  const btnImp = document.getElementById('import-json-btn');
  const selPolicy = document.getElementById('import-dup-policy');
  if (btnImp && inp) {
    btnImp.addEventListener('click', () => inp.click());
    inp.addEventListener('change', async () => {
      const file = inp.files && inp.files[0];
      if (!file) return;
      try {
        const text = await readFileWithLimit(file, MAX_IMPORT_BYTES);
        const policy = (selPolicy && selPolicy.value === 'overwrite') ? 'overwrite' : 'keep-existing';
        const res = importFromText(text, { duplicatePolicy: policy });
        if (!res.ok) {
          toast(res.errors[0] || 'Não foi possível importar o arquivo.');
        } else {
          const parts = [];
          if (res.added) parts.push(`${res.added} adicionado(s)`);
          if (res.updated) parts.push(`${res.updated} atualizado(s)`);
          if (res.skippedDuplicates) parts.push(`${res.skippedDuplicates} duplicado(s) mantidos como estavam`);
          toast(`Importação concluída: ${parts.join('; ') || 'nada a importar'}.`);
          if (rerender) rerender();
        }
      } catch (e) {
        if (e.message === 'ARQUIVO_GRANDE') toast('Arquivo muito grande (limite: 512 KB).');
        else toast('Falha ao ler o arquivo. Tente novamente.');
      } finally {
        inp.value = '';
      }
    });
  }
}
