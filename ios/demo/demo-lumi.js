// Lumi-Lernwelt-Rundgang fuer das Pruefvideo: Profil anlegen, Startseite, Einmaleins (mit Fehler + Tipp),
// Uhr lesen (ganze Runde bis zum Ergebnis mit Sternen/Sticker), Uhr stellen (Zeiger ziehen), Woerter bauen,
// Sticker-Album, Elternbereich mit Elternsperre.
(function () {
  const D = window.DEMO;
  const P = () => window.LWapp.play;
  const task = () => P() && P().r.tasks[P().i];
  async function solveNum(wrongFirst) {
    const t = task(); if (!t) return;
    if (wrongFirst) { for (const d of String(t.ans + 1)) await D.tap(`[data-k="${d}"]`, { after: 350 }); await D.tap('[data-k="ok"]', { after: 1600 }); const h = document.querySelector('[data-act=hint]'); if (h) await D.tap(h, { after: 1800 }); }
    for (const d of String(t.ans)) await D.tap(`[data-k="${d}"]`, { after: 350 });
    await D.wait(400); if (task() === t && !document.querySelector('.ansbox.right')) await D.tap('[data-k="ok"]', { after: 300 });
    await D.wait(1300);
  }
  async function solveChoice() { const t = task(); if (!t) return; await D.tap(`[data-c="${t.ans}"]`, { after: 1500 }); }
  async function solveBuild() { const t = task(); if (!t) return; const used = new Set();
    for (const ch of t.ans) { const i = t.tiles.findIndex((x, k) => x === ch && !used.has(k)); used.add(i); await D.tap(`[data-tile="${i}"]`, { after: 450 }); } await D.wait(1400); }
  async function dragHand(wrap, from, toAngles) {
    const svg = wrap.querySelector('svg'); const r = svg.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2;
    const pt = (deg, f) => [cx + Math.sin(deg * Math.PI / 180) * R * f, cy - Math.cos(deg * Math.PI / 180) * R * f];
    const f = from === 'm' ? 0.68 : 0.4; let [x, y] = pt(toAngles[0], f);
    await D.moveTo(x, y); const o = (x, y) => ({ bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'touch', isPrimary: true });
    wrap.dispatchEvent(new PointerEvent('pointerdown', o(x, y)));
    for (let k = 1; k < toAngles.length; k++) { const a0 = toAngles[k - 1], a1 = toAngles[k]; for (let s = 1; s <= 12; s++) { [x, y] = pt(a0 + (a1 - a0) * s / 12, f); wrap.dispatchEvent(new PointerEvent('pointermove', o(x, y))); await fastMove(x, y); } }
    wrap.dispatchEvent(new PointerEvent('pointerup', o(x, y))); await D.wait(500);
  }
  const fastMove = async (x, y) => { const f = [...document.body.children].find((e) => e.style && e.style.zIndex === '2147483647'); if (!f) return; f.style.transition = 'none'; f.style.left = x + 'px'; f.style.top = y + 'px'; await D.wait(60); f.style.transition = 'left .55s ease,top .55s ease,transform .12s ease'; };
  D.run([
    () => { try { LW.S.set.breakMin = 0; } catch (e) {} },
    () => D.wait(1200),
    // Profil anlegen
    () => D.type('#ncName', 'Mia', { after: 700 }),
    () => D.tap('[data-av="🦄"]', { after: 700 }),
    () => D.tap('[data-gr="2"]', { after: 800 }),
    () => D.tap('#ncGo', { after: 3200 }),
    () => D.scroll(500), () => D.scroll(-500),
    // Einmaleins
    () => D.tap('[data-world="mult"] .w-tx', { after: 2200 }),
    () => D.tap('[data-lv="m1"]', { after: 2200 }),
    () => solveNum(false), () => solveNum(true), () => solveNum(false), () => solveNum(false),
    () => D.tap('[data-act=quit]', { after: 1500 }),
    () => D.tap('.top .back', { after: 1500 }),
    // Uhr lesen: ganze Runde
    () => D.tap('[data-world="clock"] .w-tx', { after: 2000 }),
    () => D.tap('[data-lv="c1"]', { after: 2200 }),
    solveChoice, solveChoice, solveChoice, solveChoice, solveChoice, solveChoice, solveChoice, solveChoice,
    () => D.wait(4500),
    // Naechstes Level: Uhr stellen
    () => D.tap('[data-next]', { after: 2500 }),
    async () => { const t = task(); const w = document.querySelector('#clockSet'); const tm = t.ans.m * 6, th = ((t.ans.h % 12) + t.ans.m / 60) * 30;
      await dragHand(w, 'h', [0, th / 2, th]); await D.wait(400); if (tm) await dragHand(w, 'm', [0, tm]); await D.tap('[data-act=checkClock]', { after: 2200 }); },
    () => D.tap('[data-act=quit]', { after: 1500 }),
    () => D.tap('.top .back', { after: 1500 }),
    // Woerter bauen
    () => { window.LW.prof().unlockAll = true; return D.wait(10); },
    () => D.tap('[data-world="abc"] .w-tx', { after: 2000 }),
    () => D.tap('[data-lv="a1"]', { after: 2000 }), solveChoice, solveChoice,
    () => D.tap('[data-act=quit]', { after: 1300 }),
    () => D.tap('[data-lv="a9"]', { after: 2000 }), solveBuild, solveBuild,
    () => D.tap('[data-act=quit]', { after: 1300 }),
    () => { window.LW.prof().unlockAll = false; return D.wait(10); },
    () => D.tap('.top .back', { after: 1500 }),
    // Sticker-Album
    () => D.tap('[data-go="album"]', { after: 2500 }),
    () => D.scroll(600), () => D.scroll(-600),
    () => D.tap('.top .back', { after: 1500 }),
    // Elternbereich mit Sperre
    () => D.tap('[data-act=parents]', { after: 2200 }),
    async () => { const W = (LW.lang() === 'en' ? ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'] : ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun']);
      for (const w of document.querySelector('.gw').textContent.split(' – ')) await D.tap(`[data-g="${W.indexOf(w.trim())}"]`, { after: 500 }); await D.wait(2000); },
    () => D.scroll(700), () => D.scroll(700), () => D.scroll(-1400),
    () => D.tap('.top .back', { after: 2000 }),
  ], 3000);
})();
