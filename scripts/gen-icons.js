// Gera os ícones SVG do conjunto local (sem icon fonts) e os favicons/PWA icons.
const fs = require('fs'), path = require('path');
const dir = 'assets/icons'; fs.mkdirSync(dir, {recursive:true});
const S = (body, vb='0 0 24 24') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const icons = {
  home: S('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>'),
  hebrew: S('<path d="M6 20L12 4l6 16"/><path d="M8.5 14h7"/>'),
  greek: S('<path d="M7 4h7a4 4 0 0 1 0 8H7z"/><path d="M7 12v8"/>'),
  tools: S('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2.3-.6-.6-2.3z"/>'),
  star: S('<path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7z"/>'),
  search: S('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
  sun: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: S('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  menu: S('<path d="M3 6h18M3 12h18M3 18h18"/>'),
  close: S('<path d="M6 6l12 12M18 6L6 18"/>'),
  book: S('<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M4 4v12a4 4 0 0 0 4 4"/>'),
  download: S('<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/>'),
  external: S('<path d="M14 4h6v6"/><path d="M20 4L10 14"/><path d="M19 14v6H4V5h6"/>'),
};
for (const [k,v] of Object.entries(icons)) fs.writeFileSync(path.join(dir, k+'.svg'), v);

// Ícones PWA (gerados programaticamente — autorais, não são logos oficiais)
const appSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
<rect width="512" height="512" rx="96" fill="#0F3731"/>
<text x="256" y="250" text-anchor="middle" font-family="Georgia, serif" font-size="200" fill="#C5A059" direction="rtl">&#x5D0;</text>
<text x="256" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="120" fill="#F3EFE6">&#x3B1;</text>
</svg>`;
fs.writeFileSync(path.join(dir,'app-icon.svg'), appSvg(512));
// PNGs via sharp não disponível: usar SVG no manifest é aceito por Chromium/Firefox modernos;
// para compatibilidade máxima, também exportamos ICO-like PNG via canvas? Sem dependências:
// geramos PNGs simples com um encoder minimalista embutido abaixo.
