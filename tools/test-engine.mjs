// Prueft die Lernlogik: jedes Level 200x erzeugen, Antworten muessen gueltig und unter den Auswahlen sein.
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path';
const W = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'www');
const ctxG = { console }; ctxG.window = ctxG; vm.createContext(ctxG);
for (const f of ['data.js', 'i18n.js', 'engine.js']) vm.runInContext(fs.readFileSync(path.join(W, f), 'utf8'), ctxG, { filename: f });
const { E, TXT } = ctxG.LW; let fail = 0, n = 0;
const ok = (c, m) => { n++; if (!c) { fail++; if (fail < 30) console.log('FEHLER', m); } };
for (const lang of ['de', 'en']) {
  const T = TXT[lang];
  for (const lv of E.allLevels()) {
    ok(T[lv.id], lang + ' Levelname fehlt ' + lv.id);
    for (let r = 0; r < 200; r++) {
      const round = E.makeRound(lv.id, { lang, facts: {} });
      ok(round.tasks.length === lv.n, lv.id + ' Anzahl');
      for (const t of round.tasks) {
        const tag = lang + ' ' + lv.id + ' ' + JSON.stringify(t).slice(0, 160);
        ok(t.ans !== undefined && t.ans !== null && t.ans !== '' && !(typeof t.ans === 'number' && (isNaN(t.ans) || t.ans < 0)), 'Antwort ' + tag);
        if (t.choices) { ok(t.choices.map(String).includes(String(t.ans)), 'Antwort nicht in Auswahl ' + tag); ok(new Set(t.choices.map(String)).size === t.choices.length, 'doppelte Auswahl ' + tag); ok(t.choices.length >= 2, 'zu wenig Auswahl ' + tag); }
        if (t.sayKey) ok(T[t.sayKey[0]], 'Vorlesetext fehlt ' + t.sayKey[0]);
        if (t.qKey) ok(T[t.qKey[0]], 'Fragetext fehlt ' + t.qKey[0]);
        if (t.type === 'num') ok(Number.isInteger(t.ans) && t.ans <= 200, 'Zahl ' + tag);
        if (t.type === 'build') ok(t.word.split('').every((c) => t.tiles.includes(c)), 'Buchstaben fehlen ' + tag);
        if (t.type === 'clockSet') ok(E.check(t, { h: t.ans.h + 12, m: t.ans.m }), 'Uhr-Pruefung ' + tag);
      }
    }
  }
}
// Uhrzeit-Woerter
const exp = [[3, 0, 'drei Uhr'], [1, 0, 'ein Uhr'], [3, 30, 'halb vier'], [12, 30, 'halb eins'], [3, 15, 'Viertel nach drei'], [3, 45, 'Viertel vor vier'], [3, 25, 'fünf vor halb vier'], [3, 35, 'fünf nach halb vier'], [3, 50, 'zehn vor vier'], [11, 5, 'fünf nach elf'], [3, 7, '7 Minuten nach drei']];
for (const [h, m, s] of exp) ok(E.timeWords(h, m, 'de') === s, `Uhr de ${h}:${m} -> ${E.timeWords(h, m, 'de')} statt ${s}`);
ok(E.timeWords(3, 45, 'en') === 'quarter to four', 'Uhr en'); ok(E.timeWords(12, 0, 'en') === "twelve o'clock", 'Uhr en 12');
// Lernstand
const facts = {}; for (let i = 0; i < 5; i++) E.updateFact(facts, 3, 4, true, 2000); ok(E.factLevel(facts['3x4']) === 3, 'Fakt sicher');
E.updateFact(facts, 3, 4, false, 0); ok(E.factLevel(facts['3x4']) === 2, 'Fakt nach Fehler');
ok(E.stars(0, 10) === 3 && E.stars(2, 10) === 2 && E.stars(5, 10) === 1, 'Sterne');
const d = {}; const t0 = new Date(2026, 10, 25); for (let k = 0; k < 4; k++) { const x = new Date(t0); x.setDate(x.getDate() - k); d[E.dayKey(x)] = 1; } ok(E.streak(d, t0) === 4, 'Serie');
ok(E.lumiLevel(0).lv === 1 && E.lumiLevel(5).lv === 2, 'Lumi-Level');
console.log(`${n - fail}/${n} Pruefungen ok` + (fail ? `, ${fail} FEHLER` : ''));
process.exit(fail ? 1 : 0);
