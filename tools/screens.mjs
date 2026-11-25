// Echte App-Bilder (WebKit) mit Beispiel-Lernstand fuer die Store-Grafiken. iPhone 6,9" + iPad 13", Deutsch + Englisch.
import { createRequire } from 'node:module'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const require = createRequire('C:/Users/Andrej/projekte/test1/boardgames/tools/webkit-test/package.json');
const { webkit } = require('playwright');
const D = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const OUT = 'C:/Users/Andrej/projekte/ios-tools/aso/raw4/lumi';
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ttf': 'font/ttf' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p === '/') p = '/index.html'; const f = path.join(D, 'www', p); if (!fs.existsSync(f)) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((r) => srv.listen(5143, '127.0.0.1', r));
const DEV = { iphone: { viewport: { width: 440, height: 956 }, deviceScaleFactor: 3 }, ipad: { viewport: { width: 1032, height: 1376 }, deviceScaleFactor: 2 } };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const br = await webkit.launch();
for (const lang of ['de', 'en']) for (const [dev, cfg] of Object.entries(DEV)) {
  const ctx = await br.newContext({ ...cfg, locale: lang === 'de' ? 'de-DE' : 'en-US', isMobile: dev === 'iphone', hasTouch: true, reducedMotion: 'reduce' });
  const pg = await ctx.newPage(); pg.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  const dir = path.join(OUT, lang, dev); fs.mkdirSync(dir, { recursive: true });
  const shot = async (n) => { await wait(450); await pg.screenshot({ path: path.join(dir, n + '.png') }); console.log(lang, dev, n); };
  await pg.goto('http://127.0.0.1:5143/'); await pg.evaluate(() => localStorage.clear());
  await pg.evaluate((lang) => {
    const S = { v: 1, profiles: [], cur: null, set: { sound: true, speech: true, haptic: true, lang, goal: 3, breakMin: 20 } };
    localStorage.setItem('lumi.v1', JSON.stringify(S));
  }, lang);
  await pg.reload(); await wait(300);
  await pg.evaluate((lang) => {
    LW.E.seed(42);
    const p = LW.newProfile(lang === 'de' ? 'Mia' : 'Emma', '🦄', 2); p.unlockAll = false;
    const done = { m1: 3, m2: 3, m3: 3, m4: 2, m5: 3, m6: 2, r1: 3, r2: 3, r3: 3, r4: 2, r5: 3, r6: 2, c1: 3, c2: 3, c3: 2, c4: 3, a1: 3, a2: 3, a3: 2, a4: 3, a5: 2, a6: 3, a7: 3 };
    for (const k in done) p.prog[k] = { stars: done[k], plays: 2 };
    for (let a = 1; a <= 10; a++) for (let b = 1; b <= 10; b++) { const k = a + 'x' + b; if ([1, 2, 5, 10].includes(a) || [1, 2, 5, 10].includes(b)) p.facts[k] = { box: 5, ms: 1800, ok: 6, bad: 0, seen: Date.now() }; else if ([3, 4].includes(a) || [3, 4].includes(b)) p.facts[k] = { box: 2, ms: 4200, ok: 3, bad: 1, seen: Date.now() }; else if (a * b % 3 === 0) p.facts[k] = { box: 1, ms: 6000, ok: 1, bad: 2, seen: Date.now() }; }
    p.stickers = p.stickerOrder.slice(0, 23); p.badges = ['first', 'stars25', 'perfect', 'streak3', 'mult25', 'writer'];
    const now = new Date(); for (let d = 0; d < 6; d++) { const x = new Date(now); x.setDate(x.getDate() - d); const k = LW.E.dayKey(x); p.days[k] = d === 0 ? 2 : 3; p.minutes[k] = [14, 22, 18, 9, 25, 16][d]; }
    p.bestStreak = 6; p.rounds = 74; p.right = 642; p.wrong = 51; p.totalMs = 5.6 * 3600000; p.hat = 'party';
    LW.save();
  }, lang);
  await pg.reload(); await wait(500);
  // Lumi soll tagsueber wach sein
  await pg.evaluate(() => { const D0 = Date; window.Date = class extends D0 { constructor(...a) { if (!a.length) { super(); this.setHours(16, 30); } else super(...a); } static now() { return D0.now(); } }; LWapp.go({ n: 'home' }); });
  await shot('01-home');
  await pg.evaluate(() => { LW.E.seed(7); LWapp.startLevel('m7'); }); await wait(300);
  await pg.evaluate(() => { const t = LWapp.play.r.tasks[0]; t.q = '7 × 4 = ▢'; t.ans = 28; t.fact = [7, 4]; t.vis = { dots: [7, 4] }; t.sayKey = ['sayMul', 7, 4]; LWapp.go({ n: 'play' }); });
  await wait(200); await pg.click('[data-act=hint]'); await pg.click('[data-k="2"]'); await shot('02-einmaleins');
  await pg.evaluate(() => { LW.E.seed(11); LWapp.startLevel('c5'); }); await shot('03-uhr');
  await pg.evaluate(() => { LW.E.seed(3); LWapp.startLevel('a3'); }); await wait(600);
  await pg.evaluate(() => { const d = window.__traceDebug(); const c = d.ink; c.save(); c.globalCompositeOperation = 'source-over'; c.drawImage(d.mask.canvas, 0, 0); c.globalCompositeOperation = 'source-in'; c.fillStyle = '#FF4F8B'; c.fillRect(0, 0, d.W, d.H * 0.62); c.restore(); document.querySelector('[data-act=clearTrace]'); });
  await pg.evaluate(() => { const cv = document.querySelector('#trace'); cv.dispatchEvent(new PointerEvent('pointermove', { bubbles: true })); });
  await pg.evaluate(() => { const d = window.__traceDebug(); const cv = document.querySelector('#trace'); const c = cv.getContext('2d'); c.drawImage(d.ink.canvas, 0, 0); });
  await shot('04-schreiben');
  await pg.evaluate(() => { LW.E.seed(5); LWapp.startLevel('a9'); }); await wait(300);
  await pg.evaluate(() => { const t = LWapp.play.r.tasks[0]; const used = new Set(); [...t.ans].slice(0, 2).forEach((ch) => { const i = t.tiles.findIndex((x, k) => x === ch && !used.has(k)); used.add(i); document.querySelector(`[data-tile="${i}"]`).click(); }); });
  await shot('05-woerter');
  await pg.evaluate(() => { LW.E.seed(9); LWapp.startLevel('r4'); }); await shot('06-rechnen');
  // Ergebnis mit Sternen + Sticker
  await pg.evaluate(() => { LW.fast = 1; LW.S.set.breakMin = 0; LWapp.startLevel('m8'); });
  for (let i = 0; i < 10; i++) { await pg.evaluate(() => { const t = LWapp.play.r.tasks[LWapp.play.i]; LWapp.answer(t.ans); }); await wait(60); }
  await wait(2600); await pg.evaluate(() => { const c = document.getElementById('confetti'); if (c) c.remove(); }); await shot('07-ergebnis');
  await pg.evaluate(() => LWapp.go({ n: 'album' })); await shot('08-album');
  await pg.evaluate(() => LWapp.go({ n: 'grid' })); await shot('09-karte');
  await pg.evaluate(() => LWapp.go({ n: 'parents' })); await shot('10-eltern');
  await pg.evaluate(() => LWapp.go({ n: 'world', id: 'abc' })); await wait(800); await pg.evaluate(() => document.getElementById('app').scrollTo(0, 0)); await shot('11-welt');
  await ctx.close();
}
await br.close(); srv.close();
