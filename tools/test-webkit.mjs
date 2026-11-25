// End-to-End-Test in WebKit (Safari-Engine): alle 51 Level einmal komplett durchspielen (teils mit Fehlern),
// Profile, Album, Karte, freie Uhr, Elternbereich. Aufruf: node tools/test-webkit.mjs
import { createRequire } from 'node:module'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const require = createRequire('C:/Users/Andrej/projekte/test1/boardgames/tools/webkit-test/package.json');
const { webkit } = require('playwright');
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'www');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p === '/') p = '/index.html'; const f = path.join(ROOT, p); if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((r) => srv.listen(5141, '127.0.0.1', r));
let fail = 0, n = 0; const ok = (c, m) => { n++; if (!c) { fail++; console.log('FEHLER', m); } };
const br = await webkit.launch();
for (const lang of ['de', 'en']) {
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: lang === 'de' ? 'de-DE' : 'en-US', hasTouch: true });
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); }); pg.on('requestfailed', (r) => { if (!/capacitor\.js$/.test(r.url())) errs.push('ladefehler ' + r.url()); }); pg.on('response', (r) => { if (r.status() >= 400 && !/capacitor\.js$/.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
  await pg.goto('http://127.0.0.1:5141/'); await pg.evaluate(() => localStorage.clear()); await pg.reload();
  ok(await pg.locator('#ncName').count() === 1, lang + ' Profil-Anlage sichtbar');
  await pg.fill('#ncName', 'Test'); await pg.click('[data-av="🐼"]'); await pg.click('[data-gr="2"]'); await pg.click('#ncGo');
  ok(await pg.locator('.world').count() === 4, lang + ' 4 Welten auf Start');
  await pg.evaluate(() => { LW.fast = 1; LW.S.set.speech = false; LW.S.set.sound = false; LW.S.set.breakMin = 0; });
  // Gesperrtes Level darf nicht starten
  await pg.click('[data-world="mult"] .w-tx'); ok(await pg.locator('.node.lock').count() > 0, lang + ' gesperrte Level vorhanden');
  // Alle Level durchspielen
  const levels = await pg.evaluate(() => LW.E.allLevels().map((l) => l.id));
  for (const [li, id] of levels.entries()) {
    await pg.evaluate((id) => LWapp.startLevel(id), id);
    const total = await pg.evaluate(() => LWapp.play.r.tasks.length);
    for (let i = 0; i < total; i++) {
      try { await pg.waitForFunction((i) => LWapp.play && LWapp.play.i === i && document.querySelector('.qcard'), i, { timeout: 5000 }); } catch (e) { console.log('HAENGT', lang, id, i, await pg.evaluate(() => JSON.stringify({ i: LWapp.play && LWapp.play.i, t: LWapp.play && LWapp.play.r.tasks[LWapp.play.i], fb: document.querySelector('#fb') && document.querySelector('#fb').className, ans: document.querySelector('#ans') && document.querySelector('#ans').textContent }))); throw e; }
      const tk = await pg.evaluate(() => { const t = LWapp.play.r.tasks[LWapp.play.i]; return { type: t.type, ans: t.ans, choices: t.choices, word: t.word }; });
      const wrongFirst = (li + i) % 4 === 1;
      if (tk.type === 'num') {
        if (wrongFirst) { const w = String(tk.ans + 1); for (const d of w) await pg.click(`[data-k="${d}"]`); await pg.click('[data-k="ok"]'); await pg.waitForTimeout(30); }
        for (const d of String(tk.ans)) await pg.click(`[data-k="${d}"]`);
        await pg.waitForFunction((i) => !LWapp.play || LWapp.play.i !== i || document.querySelector('.ansbox.right'), i, { timeout: 600 }).catch(async () => { await pg.click('[data-k="ok"]'); });
      } else if (tk.type === 'choice') {
        if (wrongFirst) { const w = tk.choices.find((c) => String(c) !== String(tk.ans)); await pg.click(`[data-c="${w}"]`); await pg.waitForTimeout(30); }
        await pg.click(`[data-c="${tk.ans}"]`);
      } else if (tk.type === 'build') {
        const tiles = await pg.evaluate(() => LWapp.play.r.tasks[LWapp.play.i].tiles); const used = new Set();
        for (const ch of tk.ans) { const idx = tiles.findIndex((x, k) => x === ch && !used.has(k)); used.add(idx); await pg.click(`[data-tile="${idx}"]`); }
      } else if (tk.type === 'clockSet') {
        await pg.evaluate((a) => { const st = document.querySelector('#clockSet')._st; st.h = a.h; st.m = a.m; }, tk.ans); await pg.click('[data-act=checkClock]');
      } else if (tk.type === 'trace') {
        // Buchstaben entlang der Maske "malen": Tinte = Glyphe
        await pg.waitForFunction(() => { const d = window.__traceDebug(); const a = d.mask.getImageData(0, 0, d.W, d.H).data; for (let k = 3; k < a.length; k += 400) if (a[k]) return true; return false; }); await pg.evaluate(() => { const d = window.__traceDebug(); d.ink.drawImage(d.mask.canvas, 0, 0); }); await pg.click('[data-act=checkTrace]');
      }
      await pg.waitForTimeout(20);
      if (await pg.locator('.fb.sol [data-act=next]').count()) await pg.click('.fb.sol [data-act=next]');
    }
    await pg.waitForSelector('.result', { timeout: 5000 }).catch(() => {});
    ok(await pg.locator('.result').count() === 1, `${lang} ${id} Ergebnis-Seite`);
  }
  const st = await pg.evaluate(() => { const p = LW.prof(); return { stars: LW.E.totalStars(p.prog), stickers: p.stickers.length, badges: p.badges.length, done: Object.keys(p.prog).length, mastered: LW.E.masteredCount(p.facts) }; });
  ok(st.done === levels.length, lang + ' alle Level gespeichert ' + JSON.stringify(st)); ok(st.stickers === Math.min(48, levels.length), lang + ' Sticker ' + st.stickers); ok(st.badges >= 5, lang + ' Abzeichen ' + st.badges);
  console.log(lang, JSON.stringify(st));
  // Training, Karte, Album, freie Uhr
  await pg.evaluate(() => LWapp.go({ n: 'grid' })); ok(await pg.locator('.mc').count() === 100, lang + ' Einmaleins-Karte 100 Felder');
  await pg.click('[data-act=training]'); ok(await pg.locator('.keypad').count() === 1, lang + ' Training startet');
  await pg.evaluate(() => LWapp.go({ n: 'album' })); ok(await pg.locator('.stk.have').count() === st.stickers, lang + ' Album zeigt Sticker');
  await pg.evaluate(() => LWapp.go({ n: 'freeclock' })); const box = await pg.locator('#fc svg').boundingBox();
  await pg.mouse.move(box.x + box.width / 2, box.y + box.height * 0.12); await pg.mouse.down(); await pg.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 8 }); await pg.mouse.up();
  ok(/15|Viertel|quarter/.test(await pg.locator('#fcW').textContent()), lang + ' freie Uhr Minutenzeiger: ' + await pg.locator('#fcW').textContent());
  // Elternbereich mit Sperre
  await pg.evaluate(() => LWapp.go({ n: 'home' })); await pg.click('[data-act=parents]'); ok(await pg.locator('.gate').count() === 1, lang + ' Elternsperre');
  const words = await pg.locator('.gw').textContent(); const W = lang === 'de' ? ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'] : ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  for (const w of words.split(' – ')) await pg.click(`[data-g="${W.indexOf(w.trim())}"]`);
  ok(await pg.locator('.parents').count() === 1, lang + ' Elternbereich offen'); ok(await pg.locator('.stats > div').count() === 6, lang + ' Statistik');
  // Zweites Kind
  await pg.click('.ptab.add'); await pg.fill('#ncName', 'Zwei'); await pg.click('#ncGo'); ok(await pg.evaluate(() => LW.S.profiles.length) === 2, lang + ' zweites Profil');
  await pg.reload(); ok(await pg.evaluate(() => LW.S.profiles.length) === 2, lang + ' Speicher bleibt nach Neustart');
  ok(errs.length === 0, lang + ' JS-Fehler: ' + errs.slice(0, 3).join(' | '));
  await ctx.close();
}
await br.close(); srv.close();
console.log(`${n - fail}/${n} ok` + (fail ? ` – ${fail} FEHLER` : ''));
process.exit(fail ? 1 : 0);
