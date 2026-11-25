// Lumi Lernwelt – Lernlogik (ohne Oberflaeche, in Node testbar).
// Ideen: Lernstufen "lernen -> schneller -> sicher (<3 s)" (Multiplay), Welten mit Levels (Flashy, MIT),
// farbige Stunden + Minutenzahlen am Ziffernblatt (EduClock for Kids, MIT), Punkte-Bilder beim Rechnen (Addition Game, MIT).
'use strict';
(function (root) {
  var LW = root.LW || (root.LW = {});
  var E = LW.E = {};
  var rnd = Math.random;
  E.seed = function (s) { var x = s >>> 0 || 1; rnd = function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; };
  E.unseed = function () { rnd = Math.random; };
  var ri = E.ri = function (a, b) { return a + Math.floor(rnd() * (b - a + 1)); };
  var pick = E.pick = function (arr) { return arr[Math.floor(rnd() * arr.length)]; };
  var shuffle = E.shuffle = function (arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  // ---------- Welten und Level ----------
  function L(id, kind, p, n) { return { id: id, kind: kind, p: p || {}, n: n || 10 }; }
  E.WORLDS = [
    { id: 'mult', color: '#7C5CFF', icon: '✖️', levels: [
      L('m1', 'mul', { rows: [1, 10] }), L('m2', 'mul', { rows: [2] }), L('m3', 'mul', { rows: [5] }), L('m4', 'mul', { rows: [2, 5, 10], mix: 1 }),
      L('m5', 'mul', { rows: [3] }), L('m6', 'mul', { rows: [4] }), L('m7', 'mul', { rows: [3, 4], mix: 1 }), L('m8', 'mul', { rows: [6] }),
      L('m9', 'mul', { rows: [7] }), L('m10', 'mul', { rows: [8] }), L('m11', 'mul', { rows: [9] }), L('m12', 'mul', { rows: [6, 7, 8, 9], mix: 1 }),
      L('m13', 'mul', { rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mix: 1, gap: 1 }), L('m14', 'div', { rows: [2, 5, 10] }), L('m15', 'div', { rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }),
      L('m16', 'mul', { rows: [2, 3, 4, 5, 6, 7, 8, 9], mix: 1, blitz: 1 }, 15)
    ] },
    { id: 'math', color: '#FF8A3D', icon: '➕', levels: [
      L('r1', 'count', { max: 10 }), L('r2', 'add', { max: 10 }), L('r3', 'sub', { max: 10 }), L('r4', 'bond', { max: 10 }),
      L('r5', 'cmp', { max: 20 }), L('r6', 'add', { max: 20, cross: 1 }), L('r7', 'sub', { max: 20, cross: 1 }), L('r8', 'dbl', {}),
      L('r9', 'seq', {}), L('r10', 'tens', {}), L('r11', 'add100', {}), L('r12', 'mix', {})
    ] },
    { id: 'clock', color: '#14B8A6', icon: '⏰', levels: [
      L('c1', 'cread', { step: 60 }, 8), L('c2', 'cset', { step: 60 }, 6), L('c3', 'cread', { step: 30 }, 8), L('c4', 'cset', { step: 30 }, 6),
      L('c5', 'cread', { step: 15 }, 8), L('c6', 'cset', { step: 15 }, 6), L('c7', 'cread', { step: 5 }, 8), L('c8', 'cset', { step: 5 }, 6),
      L('c9', 'cread', { step: 1 }, 8), L('c10', 'c24', {}, 8), L('c11', 'cspan', {}, 8)
    ] },
    { id: 'abc', color: '#FF4F8B', icon: '🔤', levels: [
      L('a1', 'initial', { from: 'A', to: 'M' }, 8), L('a2', 'initial', { from: 'N', to: 'Z' }, 8), L('a3', 'trace', { set: 'AM' }, 6), L('a4', 'trace', { set: 'NZ' }, 6),
      L('a5', 'trace', { set: 'low' }, 6), L('a6', 'syll', {}, 8), L('a7', 'readw', { maxLen: 4 }, 8), L('a8', 'readw', { minLen: 5 }, 8),
      L('a9', 'build', { maxLen: 4 }, 6), L('a10', 'article', {}, 8), L('a11', 'tf', {}, 8), L('a12', 'build', { minLen: 5 }, 6)
    ] }
  ];
  E.world = function (id) { for (var i = 0; i < E.WORLDS.length; i++) if (E.WORLDS[i].id === id) return E.WORLDS[i]; return null; };
  E.level = function (id) { for (var i = 0; i < E.WORLDS.length; i++) { var w = E.WORLDS[i]; for (var j = 0; j < w.levels.length; j++) if (w.levels[j].id === id) return { w: w, l: w.levels[j], idx: j }; } return null; };
  E.allLevels = function () { var a = []; E.WORLDS.forEach(function (w) { w.levels.forEach(function (l) { a.push(l); }); }); return a; };

  // ---------- Hilfen ----------
  function numChoices(ans, spread, min) {
    var s = { }; s[ans] = 1; var out = [ans]; var guard = 0;
    while (out.length < 4 && guard++ < 200) { var v = ans + ri(-spread, spread); if (v < (min || 0) || s[v]) continue; s[v] = 1; out.push(v); }
    return shuffle(out);
  }
  function uniqBy(list, key) { var s = {}, o = []; list.forEach(function (x) { var k = key(x); if (!s[k]) { s[k] = 1; o.push(x); } }); return o; }

  // ---------- Einmaleins mit Lernstand (Leitner + Tempo) ----------
  // facts[profile]["a x b"] = { box: 0..5, ms: mittlere Zeit, ok, bad, seen }
  E.factKey = function (a, b) { return a + 'x' + b; };
  E.factLevel = function (f) { if (!f || !f.ok) return 0; if (f.box >= 4 && f.ms > 0 && f.ms < 3000) return 3; if (f.box >= 2) return 2; return 1; };
  E.updateFact = function (facts, a, b, ok, ms) {
    var k = E.factKey(a, b); var f = facts[k] || (facts[k] = { box: 0, ms: 0, ok: 0, bad: 0, seen: 0 });
    f.seen = Date.now();
    if (ok) { f.ok++; f.box = Math.min(5, f.box + 1); f.ms = f.ms ? Math.round(f.ms * 0.6 + Math.min(ms, 20000) * 0.4) : Math.min(ms, 20000); }
    else { f.bad++; f.box = Math.max(0, f.box - 2); }
    return f;
  };
  E.masteredCount = function (facts) { var n = 0; for (var a = 1; a <= 10; a++) for (var b = 1; b <= 10; b++) if (E.factLevel(facts[E.factKey(a, b)]) === 3) n++; return n; };
  // Adaptive Auswahl: schwache und lange nicht gesehene Aufgaben zuerst
  E.adaptivePick = function (facts, rows, n) {
    var cand = []; rows.forEach(function (a) { for (var b = 1; b <= 10; b++) cand.push([a, b]); });
    var now = Date.now();
    cand.forEach(function (c) { var f = facts[E.factKey(c[0], c[1])]; var box = f ? f.box : 0; var age = f ? (now - f.seen) / 3600000 : 99;
      c.w = (6 - box) * 3 + Math.min(age, 48) / 8 + (f && f.ms > 3000 ? 2 : 0) + rnd() * 2; });
    cand.sort(function (x, y) { return y.w - x.w; });
    return cand.slice(0, n).map(function (c) { return rnd() < 0.5 ? [c[0], c[1]] : [c[1], c[0]]; });
  };

  // ---------- Uhr ----------
  var NUM_DE = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'];
  var NUM_EN = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  var MIN_DE = { 5: 'fünf', 10: 'zehn', 15: 'Viertel', 20: 'zwanzig' };
  var MIN_EN = { 5: 'five', 10: 'ten', 15: 'quarter', 20: 'twenty', 25: 'twenty-five' };
  function h12(h) { h = h % 12; return h === 0 ? 12 : h; }
  E.digital = function (h, m) { return h12(h) + ':' + (m < 10 ? '0' : '') + m; };
  E.digital24 = function (h, m) { return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; };
  E.timeWords = function (h, m, lang) {
    var H = h12(h), N = h12(h + 1);
    if (lang === 'en') {
      var hn = NUM_EN[H], nn = NUM_EN[N];
      if (m === 0) return hn + " o'clock"; if (m === 30) return 'half past ' + hn;
      if (m % 5 === 0) return m < 30 ? MIN_EN[m] + ' past ' + hn : MIN_EN[60 - m] + ' to ' + nn;
      return m < 30 ? m + ' minutes past ' + hn : (60 - m) + ' minutes to ' + nn;
    }
    var hd = H === 1 ? 'eins' : NUM_DE[H], nd = N === 1 ? 'eins' : NUM_DE[N];
    if (m === 0) return (H === 1 ? 'ein' : NUM_DE[H]) + ' Uhr';
    if (m === 30) return 'halb ' + nd;
    if (m === 15) return 'Viertel nach ' + hd; if (m === 45) return 'Viertel vor ' + nd;
    if (m === 25) return 'fünf vor halb ' + nd; if (m === 35) return 'fünf nach halb ' + nd;
    if (m % 5 === 0) return m < 30 ? MIN_DE[m] + ' nach ' + hd : MIN_DE[60 - m] + ' vor ' + nd;
    return m < 30 ? m + ' Minuten nach ' + hd : (60 - m) + ' Minuten vor ' + nd;
  };
  function randTime(step) { var h = ri(1, 12); var m = step >= 60 ? 0 : step * ri(0, 60 / step - 1); return { h: h, m: m }; }

  // ---------- Aufgaben-Generatoren ----------
  // Aufgabe: { type, q (Text), say (Vorlesetext), ans, choices?, vis?, data? }
  var G = {};
  G.mul = function (lv, ctx, i) {
    var a, b, p = lv.p; var fx = ctx.multPlan && ctx.multPlan[i];
    if (fx) { a = fx[0]; b = fx[1]; }
    else if (p.mix) { a = pick(p.rows); b = ri(1, 10); if (rnd() < 0.5) { var t = a; a = b; b = t; } }
    else { a = p.rows.length > 1 ? pick(p.rows) : p.rows[0]; b = i < 10 && !p.mix ? ((i * 7) % 10) + 1 : ri(1, 10); if (p.rows.length === 1 && rnd() < 0.3) { var t2 = a; a = b; b = t2; } }
    var gap = p.gap && rnd() < 0.3;
    if (gap) return { type: 'num', q: a + ' × ▢ = ' + a * b, sayKey: ['sayMulGap', a, a * b], ans: b, fact: [a, b], vis: { dots: [a, b] } };
    return { type: 'num', q: a + ' × ' + b + ' = ▢', sayKey: ['sayMul', a, b], ans: a * b, fact: [a, b], vis: { dots: [a, b] }, blitz: !!p.blitz };
  };
  G.div = function (lv) { var a = pick(lv.p.rows), b = ri(1, 10); return { type: 'num', q: a * b + ' : ' + a + ' = ▢', sayKey: ['sayDiv', a * b, a], ans: b, vis: { dots: [b, a] } }; };
  G.count = function (lv) { var n = ri(1, lv.p.max); var em = pick(['🍎', '⭐', '🐟', '🎈', '🍓', '🐞']); return { type: 'num', q: '', sayKey: ['sayCount'], ans: n, vis: { count: n, em: em } }; };
  G.add = function (lv) {
    var max = lv.p.max, a, b, g = 0;
    do { a = ri(0, max); b = ri(0, max - a); g++; } while (g < 50 && ((lv.p.cross && !((a % 10) + (b % 10) >= 10 && a < 10 && b < 10)) || (!lv.p.cross && a + b < 2)));
    return { type: 'num', q: a + ' + ' + b + ' = ▢', sayKey: ['sayAdd', a, b], ans: a + b, vis: max <= 10 ? { add: [a, b] } : null };
  };
  G.sub = function (lv) {
    var max = lv.p.max, a, b, g = 0;
    do { a = ri(1, max); b = ri(0, a); g++; } while (g < 50 && lv.p.cross && !(a > 10 && (a % 10) < b && b < 10));
    return { type: 'num', q: a + ' − ' + b + ' = ▢', sayKey: ['saySub', a, b], ans: a - b, vis: max <= 10 ? { sub: [a, b] } : null };
  };
  G.bond = function (lv) { var t = ri(5, lv.p.max), a = ri(1, t - 1); return { type: 'num', q: t + ' = ' + a + ' + ▢', sayKey: ['sayBond', t, a], ans: t - a, vis: { house: [t, a] } }; };
  G.cmp = function (lv) { var a = ri(0, lv.p.max), b = rnd() < 0.2 ? a : ri(0, lv.p.max); var ans = a < b ? '<' : a > b ? '>' : '='; return { type: 'choice', q: a + ' ▢ ' + b, sayKey: ['sayCmp', a, b], ans: ans, choices: ['<', '=', '>'], big: 1 }; };
  G.dbl = function () { if (rnd() < 0.5) { var a = ri(1, 20); return { type: 'num', q: '', sayKey: ['sayDbl', a], ans: a * 2, qKey: ['qDbl', a] }; } var b = ri(1, 20) * 2; return { type: 'num', q: '', qKey: ['qHalf', b], sayKey: ['sayHalf', b], ans: b / 2 }; };
  G.seq = function () { var st = pick([1, 2, 3, 5, 10]), s = ri(0, 10) * (st === 10 ? 1 : 1), arr = []; for (var k = 0; k < 5; k++) arr.push(s + k * st); var hole = ri(1, 4); var ans = arr[hole]; var shown = arr.map(function (v, k) { return k === hole ? '▢' : v; }); return { type: 'num', q: shown.join(', '), sayKey: ['saySeq'], ans: ans }; };
  G.tens = function () { var a = ri(1, 9) * 10, b = rnd() < 0.5 ? ri(1, 9) : ri(1, 9) * 10; if (a + b > 100) b = 100 - a; var sub = rnd() < 0.4 && a > b; return sub ? { type: 'num', q: a + ' − ' + b + ' = ▢', sayKey: ['saySub', a, b], ans: a - b } : { type: 'num', q: a + ' + ' + b + ' = ▢', sayKey: ['sayAdd', a, b], ans: a + b }; };
  G.add100 = function () { if (rnd() < 0.5) { var a = ri(10, 89), b = ri(1, 99 - a); return { type: 'num', q: a + ' + ' + b + ' = ▢', sayKey: ['sayAdd', a, b], ans: a + b }; } var c = ri(20, 99), d = ri(1, c - 1); return { type: 'num', q: c + ' − ' + d + ' = ▢', sayKey: ['saySub', c, d], ans: c - d }; };
  G.mix = function (lv, ctx, i) { var k = pick(['add', 'sub', 'add', 'sub', 'dbl', 'seq', 'add100', 'cmp']); var fake = { p: { max: 20, cross: 0 } }; return G[k](fake, ctx, i); };

  G.cread = function (lv, ctx) {
    var t = randTime(lv.p.step); var opts = [t]; var guard = 0;
    while (opts.length < 4 && guard++ < 100) {
      var o = rnd() < 0.5 ? { h: t.h, m: (t.m + pick([15, 30, 45, 5, 10, 50]) * (lv.p.step >= 60 ? 0 : 1)) % 60 } : { h: h12(t.h + pick([1, 2, 11, 6])), m: t.m };
      if (lv.p.step >= 60) o = { h: h12(t.h + ri(1, 11)), m: 0 };
      if (lv.p.step === 30 && rnd() < 0.5) o = { h: h12(t.h + ri(1, 11)), m: pick([0, 30]) };
      if (lv.p.step === 1 && rnd() < 0.5) o = { h: t.h, m: (t.m + ri(1, 59)) % 60 };
      if (opts.some(function (x) { return x.h === o.h && x.m === o.m; })) continue; opts.push(o);
    }
    opts = shuffle(opts);
    var words = lv.p.step >= 5;
    return { type: 'choice', clock: t, q: '', sayKey: ['sayRead'], ans: E.digital(t.h, t.m),
      choices: opts.map(function (o) { return E.digital(o.h, o.m); }), sub: words ? opts.map(function (o) { return E.timeWords(o.h, o.m, ctx.lang); }) : null };
  };
  G.cset = function (lv, ctx) { var t = randTime(lv.p.step); return { type: 'clockSet', target: t, step: lv.p.step, q: E.timeWords(t.h, t.m, ctx.lang), qSub: E.digital(t.h, t.m), sayKey: ['saySet', E.timeWords(t.h, t.m, ctx.lang)], ans: t }; };
  G.c24 = function (lv, ctx) {
    var h = ri(13, 23), m = pick([0, 0, 15, 30, 45]); var h1 = h - 12;
    if (rnd() < 0.5) {
      var c1 = shuffle([h, h1, h + 1 > 23 ? h - 2 : h + 1, h - 1 < 13 ? h + 2 : h - 1]);
      return { type: 'choice', clock: { h: h1, m: m }, pm: 1, qKey: ['q24', E.digital(h1, m)], sayKey: ['say24'], ans: E.digital24(h, m), choices: uniqBy(c1, String).map(function (x) { return E.digital24(x, m); }) };
    }
    var c2 = uniqBy(shuffle([h1, h12(h1 + 1), h12(h1 + 11), h12(h1 + 2), h12(h1 + 6)]), String).slice(0, 4); if (c2.indexOf(h1) < 0) c2[0] = h1;
    return { type: 'choice', q: E.digital24(h, m), qKey: ['q24b', E.digital24(h, m)], sayKey: ['say24b'], ans: E.digital(h1, m), clockChoices: 1, choices: shuffle(c2).map(function (x) { return E.digital(x, m); }) };
  };
  G.cspan = function (lv, ctx) { var t = randTime(15), d = pick([15, 30, 45, 60, 90, 120]); var tot = t.h * 60 + t.m + d; var r = { h: h12(Math.floor(tot / 60)), m: tot % 60 };
    var opts = uniqBy([r, { h: r.h, m: (r.m + 15) % 60 }, { h: h12(r.h + 1), m: r.m }, { h: r.h, m: (r.m + 45) % 60 }, { h: h12(r.h + 11), m: r.m }], function (o) { return o.h + ':' + o.m; }).slice(0, 4);
    return { type: 'choice', clock: t, qKey: ['qSpan', d], sayKey: ['saySpan', d], ans: E.digital(r.h, r.m), choices: shuffle(opts.map(function (o) { return E.digital(o.h, o.m); })) }; };

  function words(ctx) { return LW.WORDS[ctx.lang] || LW.WORDS.de; }
  function letter(w) { return w[0].charAt(0).toUpperCase(); }
  G.initial = function (lv, ctx) {
    var ws = words(ctx).filter(function (w) { var c = letter(w); return c >= lv.p.from && c <= lv.p.to && !/^(Sch|Qu)/.test(w[0]) && 'XY'.indexOf(c) < 0; });
    var w = pick(ws), L0 = letter(w); var others = shuffle(words(ctx).filter(function (x) { return letter(x) !== L0; })).slice(0, 2);
    var opts = shuffle([w].concat(others));
    return { type: 'choice', letter: L0, qKey: ['qInitial', L0], sayKey: ['sayInitial', L0], ans: w[3], choices: opts.map(function (x) { return x[3]; }), labels: opts.map(function (x) { return x[0]; }), emoji: 1 };
  };
  var UP_AM = 'ABCDEFGHIJKLM'.split(''), UP_NZ = 'NOPQRSTUVWXYZ'.split(''), LOW = 'abcdefghijklmnopqrstuvwxyz'.split('');
  G.trace = function (lv, ctx, i) { var set = lv.p.set === 'AM' ? UP_AM : lv.p.set === 'NZ' ? UP_NZ : LOW; if (!ctx.tracePlan) ctx.tracePlan = shuffle(set); var c = ctx.tracePlan[i % ctx.tracePlan.length]; return { type: 'trace', letter: c, sayKey: ['sayTrace', c], ans: c }; };
  G.syll = function (lv, ctx) { var w = pick(words(ctx).filter(function (x) { return x[1].split('-').length <= 4; })); var n = w[1].split('-').length; return { type: 'choice', word: w, sayKey: ['saySyll', w[0]], speakWord: w[0], ans: n, choices: [1, 2, 3, 4], syll: 1, emojiQ: w[3] }; };
  G.readw = function (lv, ctx) {
    var ws = words(ctx).filter(function (x) { var l = x[0].length; return (!lv.p.maxLen || l <= lv.p.maxLen) && (!lv.p.minLen || l >= lv.p.minLen); });
    var w = pick(ws); var opts = shuffle([w].concat(shuffle(words(ctx).filter(function (x) { return x !== w; })).slice(0, 3)));
    return { type: 'choice', readWord: w[0], sayKey: ['sayReadW'], ans: w[3], choices: opts.map(function (x) { return x[3]; }), labels: opts.map(function (x) { return x[0]; }), emoji: 1, hideLabels: 1 };
  };
  G.build = function (lv, ctx) {
    var ws = words(ctx).filter(function (x) { var l = x[0].length; return /^[A-Za-zÄÖÜäöüß]+$/.test(x[0]) && (!lv.p.maxLen || l <= lv.p.maxLen) && (!lv.p.minLen || (l >= lv.p.minLen && l <= 7)); });
    var w = pick(ws); var lettersArr = w[0].toUpperCase().split(''); var extra = ctx.lang === 'en' ? 'AEIOUSTRN' : 'AEIOUNRST'; var pool = lettersArr.concat([pick(extra.split('')), pick(extra.split(''))]);
    return { type: 'build', word: w[0].toUpperCase(), emojiQ: w[3], sayKey: ['sayBuild', w[0]], speakWord: w[0], ans: w[0].toUpperCase(), tiles: shuffle(pool) };
  };
  G.article = function (lv, ctx) {
    var w = pick(words(ctx));
    var ch = ctx.lang === 'en' ? ['a', 'an'] : ['der', 'die', 'das'];
    return { type: 'choice', emojiQ: w[3], word: w, qKey: ['qArticle', w[0]], sayKey: ['sayArticle'], ans: w[2], choices: ch, big: 1, artWord: w[0] };
  };
  G.tf = function (lv, ctx) {
    var en = ctx.lang === 'en';
    if (rnd() < 0.5) {
      var w = pick(words(ctx)), truth = rnd() < 0.5; var shown = truth ? w : pick(words(ctx).filter(function (x) { return x !== w; }));
      var sentence = en ? 'This is ' + shown[2] + ' ' + shown[0].toLowerCase() + '.' : 'Das ist ' + ({ der: 'ein', die: 'eine', das: 'ein' })[shown[2]] + ' ' + shown[0] + '.';
      return { type: 'choice', emojiQ: w[3], sentence: sentence, sayKey: ['sayTf'], ans: truth ? 'yes' : 'no', choices: ['yes', 'no'], tf: 1 };
    }
    var f = pick(LW.COLORFACTS), t2 = rnd() < 0.5, col = t2 ? (en ? f[2] : f[1]) : pick(LW.COLORS[en ? 'en' : 'de'].filter(function (c) { return c !== (en ? f[2] : f[1]); }));
    var s2 = en ? 'It is ' + col + '.' : 'Das ist ' + col + '.';
    return { type: 'choice', emojiQ: f[0], sentence: s2, sayKey: ['sayTf'], ans: t2 ? 'yes' : 'no', choices: ['yes', 'no'], tf: 1 };
  };

  // Eine Runde (Level) erzeugen
  E.makeRound = function (levelId, ctx) {
    var info = E.level(levelId); if (!info) return null; var lv = info.l;
    if (lv.kind === 'mul' && ctx.facts && (lv.p.mix || lv.p.rows.length > 1)) ctx.multPlan = E.adaptivePick(ctx.facts, lv.p.rows, lv.n);
    var tasks = [], last = '';
    for (var i = 0; i < lv.n; i++) {
      var t, g = 0; do { t = G[lv.kind](lv, ctx, i); g++; } while (g < 8 && JSON.stringify([t.q, t.ans, t.clock, t.letter, t.word, t.readWord, t.sentence, t.target]) === last);
      last = JSON.stringify([t.q, t.ans, t.clock, t.letter, t.word, t.readWord, t.sentence, t.target]); t.i = i; tasks.push(t);
    }
    ctx.multPlan = null; ctx.tracePlan = null;
    return { level: lv, world: info.w, tasks: tasks };
  };
  // Freies Profi-Training Einmaleins (adaptiv)
  E.makeTraining = function (ctx, rows) {
    var plan = E.adaptivePick(ctx.facts || {}, rows || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10);
    var tasks = plan.map(function (f, i) { return { type: 'num', q: f[0] + ' × ' + f[1] + ' = ▢', sayKey: ['sayMul', f[0], f[1]], ans: f[0] * f[1], fact: f, vis: { dots: f }, i: i }; });
    return { level: { id: 'train', kind: 'mul', n: 10, p: {} }, world: E.world('mult'), tasks: tasks, training: 1 };
  };

  E.check = function (task, val) {
    if (task.type === 'clockSet') { var m = ((val.m % 60) + 60) % 60, h = h12(val.h); return h === task.ans.h && m === task.ans.m; }
    return String(val) === String(task.ans);
  };
  E.stars = function (errors, n) { if (errors === 0) return 3; if (errors <= Math.max(1, Math.round(n * 0.2))) return 2; return 1; };

  // ---------- Fortschritt / Belohnung ----------
  E.totalStars = function (prog) { var s = 0; for (var k in prog) s += prog[k].stars || 0; return s; };
  E.unlocked = function (prof, levelId) {
    if (prof.unlockAll) return true; var info = E.level(levelId); if (!info) return false; if (info.idx === 0) return true;
    var prev = info.w.levels[info.idx - 1].id; return !!(prof.prog[prev] && prof.prog[prev].stars > 0);
  };
  E.worldStars = function (prof, wid) { var w = E.world(wid), s = 0; w.levels.forEach(function (l) { s += (prof.prog[l.id] && prof.prog[l.id].stars) || 0; }); return { have: s, max: w.levels.length * 3 }; };
  E.nextLevel = function (prof, wid) { var w = E.world(wid); for (var i = 0; i < w.levels.length; i++) { var p = prof.prog[w.levels[i].id]; if (!p || !p.stars) return w.levels[i].id; } for (var j = 0; j < w.levels.length; j++) { var q = prof.prog[w.levels[j].id]; if (q.stars < 3) return w.levels[j].id; } return w.levels[w.levels.length - 1].id; };
  E.lumiLevel = function (stars) { var lv = 1, need = 5, s = stars; while (s >= need) { s -= need; lv++; need = Math.min(20, need + 2); } return { lv: lv, cur: s, need: need }; };
  E.dayKey = function (d) { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate(); };
  E.streak = function (days, today) {
    today = today || new Date(); var n = 0; var d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!days[E.dayKey(d)]) d.setDate(d.getDate() - 1);
    while (days[E.dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  E.BADGES = [
    { id: 'first', test: function (p) { return E.totalStars(p.prog) > 0; } },
    { id: 'stars25', test: function (p) { return E.totalStars(p.prog) >= 25; } },
    { id: 'stars75', test: function (p) { return E.totalStars(p.prog) >= 75; } },
    { id: 'stars150', test: function (p) { return E.totalStars(p.prog) >= 150; } },
    { id: 'perfect', test: function (p) { for (var k in p.prog) if (p.prog[k].stars === 3) return true; return false; } },
    { id: 'streak3', test: function (p) { return (p.bestStreak || 0) >= 3; } },
    { id: 'streak7', test: function (p) { return (p.bestStreak || 0) >= 7; } },
    { id: 'mult25', test: function (p) { return E.masteredCount(p.facts || {}) >= 25; } },
    { id: 'mult100', test: function (p) { return E.masteredCount(p.facts || {}) >= 100; } },
    { id: 'clock', test: function (p) { return !!(p.prog.c9 && p.prog.c9.stars); } },
    { id: 'reader', test: function (p) { return !!(p.prog.a8 && p.prog.a8.stars); } },
    { id: 'writer', test: function (p) { return !!(p.prog.a5 && p.prog.a5.stars); } },
    { id: 'math100', test: function (p) { return !!(p.prog.r11 && p.prog.r11.stars); } },
    { id: 'stickers', test: function (p) { return (p.stickers || []).length >= 24; } },
    { id: 'allworlds', test: function (p) { return ['mult', 'math', 'clock', 'abc'].every(function (w) { return E.worldStars(p, w).have > 0; }); } }
  ];
  E.newBadges = function (p) { var got = p.badges || []; return E.BADGES.filter(function (b) { return got.indexOf(b.id) < 0 && b.test(p); }).map(function (b) { return b.id; }); };
})(typeof window !== 'undefined' ? window : globalThis);
