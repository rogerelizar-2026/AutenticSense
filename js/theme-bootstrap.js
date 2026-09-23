// Bootstrap de tema: executa inline no <head> para evitar "flash" de tema errado.
// Usa apenas localStorage (chave nomepsaced osa.v1.theme) e prefers-color-scheme.
(function () {
  try {
    var d = document.documentElement;
    var stored = null;
    try { stored = localStorage.getItem('osa.v1.theme'); } catch (e) { /* storage indisponível */ }
    var mode = (stored === 'light' || stored === 'dark') ? stored : 'system';
    var mql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    var resolved = mode === 'dark' || ((mode === 'system' || !mode) && mql && mql.matches) ? 'dark' : 'light';
    d.setAttribute('data-theme', resolved);
    d.setAttribute('data-theme-mode', mode);
  } catch (e) {
    // Falha silenciosa: o CSS padrão (claro) se aplica.
  }
})();
