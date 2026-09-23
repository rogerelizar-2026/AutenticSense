/* ============================================================
   O Sentido Autêntico — Service Worker
   Regras (§8.3/§8.4):
   - PRECACHA SOMENTE arquivos verificados (scripts/verify-sw-assets.js confere 200).
   - Cache item a item com falha individual (sem addAll all-or-nothing).
   - Navegação: network-first com timeout + página offline dedicada (Response válida sempre).
   - Sem skipWaiting automático: atualização só via mensagem do usuário ("Atualizar").
   - Nomes de cache nomepsacedos; limpeza apenas dos caches deste app.
   ============================================================ */
const VERSION = '2026.09.1';
const CACHE_CORE = 'osa-v1-core-' + VERSION;
const CACHE_ASSETS = 'osa-v1-assets';
const CACHE_PAGES = 'osa-v1-pages';
const APP_CACHE_PREFIXES = ['osa-v1-'];

// Lista verificada pelo build (scripts/verify-sw-assets.js -> sw-manifest.json espelhado aqui).
const CORE_URLS = [
  './',
  './index.html',
  './hebraico-aramaico.html',
  './grego-koine.html',
  './caixa-de-ferramentas.html',
  './offline.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/fonts.css',
  './css/base.css',
  './js/base-path.js',
  './js/theme-bootstrap.js',
  './js/pages/index.js',
  './js/pages/hebraico-aramaico.js',
  './js/pages/grego-koine.js',
  './js/pages/caixa-de-ferramentas.js',
  './js/modules/storage.js',
  './js/modules/nav.js',
  './js/modules/theme.js',
  './js/modules/a11y.js',
  './js/modules/onboarding.js',
  './js/modules/catalog.js',
  './js/modules/export-import.js',
  './js/modules/pwa.js',
  './js/modules/charts.js',
  './js/modules/toast.js',
  './data/recursos.json',
  './data/metodos.js',
  './assets/fonts/inter/Inter-Regular.woff2',
  './assets/fonts/inter/Inter-SemiBold.woff2',
  './assets/fonts/inter/Inter-Bold.woff2',
  './assets/fonts/cinzel/Cinzel-Bold.woff2',
  './assets/fonts/notoserifhebrew/NotoSerifHebrew-Regular.woff2',
  './assets/fonts/notoserif/NotoSerif-Greek.woff2',
  './assets/icons/app-icon-192.png',
  './assets/icons/app-icon-512.png',
  './assets/icons/favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_CORE);
    // um por um: uma URL ausente não derruba a instalação inteira
    const results = await Promise.allSettled(CORE_URLS.map(u => cache.add(new Request(u, { cache: 'reload' }))));
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed === results.length) throw new Error('precache totalmente falho');
    // sucesso parcial é aceitável; páginas seguem funcionando online
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => APP_CACHE_PREFIXES.some(p => k.startsWith(p)) && ![CACHE_CORE, CACHE_ASSETS, CACHE_PAGES].includes(k))
      .map(k => caches.delete(k)));
    self.clients.matchAll().then(cs => cs.forEach(c => c.postMessage({ type: 'osa:update-available', version: VERSION })));
  })());
});

// Ativação somente sob pedido explícito do usuário
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'OSA_SKIP_WAITING') self.skipWaiting();
});

function isNavigation(req) {
  return req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // nunca intercepta externos

  if (isNavigation(req)) {
    event.respondWith(networkFirstPage(req));
    return;
  }
  event.respondWith(staleWhileRevalidate(req));
});

async function networkFirstPage(req) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    let res;
    try {
      res = await fetch(req, { signal: ctrl.signal });
    } finally {
      clearTimeout(t);
    }
    if (res && res.ok) {
      const cache = await caches.open(CACHE_PAGES);
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (e) {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    const offline = await caches.match('./offline.html');
    if (offline) return offline;
    // SEMPRE uma Response válida
    return new Response('<!doctype html><html lang="pt-BR"><body><h1>Sem conexão</h1><p>Esta página ainda não foi visitada neste dispositivo. Reconecte-se e tente novamente.</p></body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_ASSETS);
  const cached = await cache.match(req);
  const network = fetch(req).then(res => {
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);
  if (cached) { network.catch(() => {}); return cached; }
  const net = await network;
  if (net) return net;
  return new Response('', { status: 504, statusText: 'Sem conexão para este recurso' });
}
