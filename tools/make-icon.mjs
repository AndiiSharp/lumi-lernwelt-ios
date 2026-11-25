// Erzeugt App-Icon (1024) und Startbild (2732) als SVG aus der Lumi-Zeichnung; danach mit render-svg.mjs zu PNG.
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path';
const D = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const c = { console }; c.window = c; vm.createContext(c); vm.runInContext(fs.readFileSync(path.join(D, 'www/art.js'), 'utf8'), c);
const lumi = c.LW.lumi('cheer', 'none').replace('<svg class="lumi  mood-cheer" viewBox="0 -24 200 230" aria-hidden="true">', '').replace(/<\/svg>$/, '');
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD36B"/><stop offset=".55" stop-color="#FF9A6B"/><stop offset="1" stop-color="#FF5C9A"/></linearGradient>
<radialGradient id="gl" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<rect width="1024" height="1024" fill="url(#bg)"/><circle cx="512" cy="450" r="430" fill="url(#gl)"/>
<g fill="#fff" opacity=".95"><path d="M168 230l14 34l36 3l-27 23l8 35l-31-19l-31 19l8-35l-27-23l36-3z"/><path d="M842 170l10 24l26 2l-20 17l6 25l-22-14l-22 14l6-25l-20-17l26-2z"/><path d="M860 690l8 19l20 2l-15 13l5 20l-18-11l-17 11l4-20l-15-13l20-2z"/></g>
<g transform="translate(152 150) scale(3.6)">${lumi}</g></svg>`;
fs.writeFileSync(path.join(D, 'tools/icon.svg'), icon);
const splash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732" width="2732" height="2732"><rect width="2732" height="2732" fill="#FFF7EC"/>
<g transform="translate(1066 1000) scale(3)">${c.LW.lumi('happy', 'none').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g></svg>`;
fs.writeFileSync(path.join(D, 'tools/splash.svg'), splash);
console.log('OK');
