// Sammelt alle Emoji aus www/*.js und legt die passenden Twemoji-Grafiken (CC-BY 4.0) als www/emoji.js ab.
// So sehen Bilder auf jedem Geraet gleich aus. Aufruf: node tools/build-emoji.mjs
import fs from 'node:fs'; import path from 'node:path';
const WWW = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'www');
const src = fs.readdirSync(WWW).filter((f) => f.endsWith('.js') && f !== 'emoji.js').map((f) => fs.readFileSync(path.join(WWW, f), 'utf8')).join('\n');
const re = /\p{Extended_Pictographic}(?:️|⃣)?(?:‍\p{Extended_Pictographic}️?)*/gu;
const set = [...new Set(src.match(re) || [])];
const file = (e) => { let cps = [...e].map((c) => c.codePointAt(0).toString(16)); if (!cps.includes('200d')) cps = cps.filter((c) => c !== 'fe0f'); return cps.join('-'); };
const out = {}; let miss = [];
for (const e of set) {
  const f = file(e); const cache = path.join(WWW, '..', 'tools', 'twemoji-cache', f + '.svg');
  let svg = fs.existsSync(cache) ? fs.readFileSync(cache, 'utf8') : null;
  if (!svg) {
    const r = await fetch(`https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${f}.svg`);
    if (!r.ok) { miss.push(e + ' ' + f); continue; }
    svg = await r.text(); fs.mkdirSync(path.dirname(cache), { recursive: true }); fs.writeFileSync(cache, svg);
  }
  out[e] = svg.trim();
}
fs.writeFileSync(path.join(WWW, 'emoji.js'), '// Twemoji (c) Twitter/X und Mitwirkende, CC-BY 4.0 – https://github.com/jdecked/twemoji\n\'use strict\';\n(window.LW || (window.LW = {})).EMOJI = ' + JSON.stringify(out) + ';\n');
console.log('Emoji:', Object.keys(out).length, 'fehlend:', miss.length ? miss.join(', ') : 'keine');
