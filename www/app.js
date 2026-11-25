// Lumi Lernwelt – Oberflaeche
'use strict';
(function () {
  var LW = window.LW, E = LW.E, t = LW.t, em = LW.em, esc = LW.esc;
  var $app = document.getElementById('app'), $ov = document.getElementById('ov');
  var route = { n: 'home' }, play = null, sessionStart = Date.now(), breakShown = false;

  function h(s) { $app.innerHTML = s; $app.scrollTop = 0; }
  function q(sel, el) { return (el || document).querySelector(sel); }
  function qa(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function go(r) { LW.hush(); route = r; render(); }
  window.LWgo = go;
  function P() { return LW.prof(); }
  function wname(id) { return t('w_' + id); }
  function starRow(n, cls) { var s = ''; for (var i = 0; i < 3; i++) s += '<span class="st ' + (i < n ? 'on' : '') + '">★</span>'; return '<span class="stars ' + (cls || '') + '">' + s + '</span>'; }
  function topbar(title, back, color) { return '<header class="top" style="' + (color ? '--wc:' + color : '') + '"><button class="ib back" data-go="' + (back || 'home') + '" aria-label="' + t('back') + '">' + svgI('back') + '</button><h1>' + esc(title) + '</h1><span class="sp"></span></header>'; }
  function svgI(n) {
    var p = { back: '<path d="M15 5l-7 7l7 7" />', close: '<path d="M6 6l12 12M18 6L6 18"/>', speak: '<path d="M4 10v4h4l5 4V6L8 10z" fill="currentColor"/><path d="M16 9q2 3 0 6M18.5 6.5q4 5.5 0 11"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
      gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>', del: '<path d="M9 6l-6 6l6 6h11V6z"/><path d="M12 10l4 4M16 10l-4 4"/>', check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/>' }[n];
    return '<svg viewBox="0 0 24 24" class="i" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }
  function snack(msg) { var s = document.getElementById('snack'); s.textContent = msg; s.classList.add('on'); clearTimeout(snack.t); snack.t = setTimeout(function () { s.classList.remove('on'); }, 2200); }
  function modal(html, cls) { $ov.innerHTML = '<div class="ovbg"></div><div class="sheet ' + (cls || '') + '">' + html + '</div>'; $ov.classList.add('on'); }
  function closeModal() { $ov.classList.remove('on'); $ov.innerHTML = ''; }

  // ---------- Profile ----------
  function vProfiles() {
    var ps = LW.S.profiles;
    if (!ps.length) return vNewChild();
    h('<div class="scr profiles"><div class="pf-head">' + LW.lumi('happy', 'none', 'lumi-m') + '<h1>' + t('who') + '</h1></div><div class="pf-grid">' +
      ps.map(function (p) { return '<button class="pf card3d" data-pf="' + p.id + '">' + em(p.avatar, 'pf-av') + '<b>' + esc(p.name) + '</b><span>★ ' + E.totalStars(p.prog) + '</span></button>'; }).join('') +
      (ps.length < 6 ? '<button class="pf pf-add" data-go="newchild"><span class="plus">+</span><b>' + t('addChild') + '</b></button>' : '') + '</div></div>');
  }
  function vNewChild(edit) {
    var p = edit ? P() : null; var av = p ? p.avatar : LW.AVATARS[0], gr = p ? p.grade : 1;
    h('<div class="scr newchild">' + (LW.S.profiles.length ? topbar(edit ? t('pEdit') : t('newChild'), edit ? 'parents' : 'profiles') : '<div class="nc-hero">' + LW.lumi('cheer', 'none', 'lumi-l') + '<h1>' + t('appName') + '</h1></div>') +
      '<div class="pad"><label class="lab">' + t('childName') + '</label><input id="ncName" class="inp" maxlength="16" autocomplete="off" placeholder="' + t('childNamePh') + '" value="' + (p ? esc(p.name) : '') + '">' +
      '<label class="lab">' + t('pickAvatar') + '</label><div class="avs">' + LW.AVATARS.map(function (a) { return '<button class="av ' + (a === av ? 'sel' : '') + '" data-av="' + a + '">' + em(a) + '</button>'; }).join('') + '</div>' +
      '<label class="lab">' + t('grade') + '</label><div class="grs">' + [0, 1, 2, 3, 4].map(function (g) { return '<button class="gr ' + (g === gr ? 'sel' : '') + '" data-gr="' + g + '">' + (g ? g + '.' : 'K') + '</button>'; }).join('') + '</div>' +
      '<p class="grtxt" id="grTxt">' + (gr ? t('gradeN', gr) : t('gradeK')) + '</p>' +
      '<button class="btn big primary" id="ncGo">' + (edit ? t('save') : t('start')) + '</button></div></div>');
    var state = { av: av, gr: gr };
    qa('[data-av]').forEach(function (b) { b.onclick = function () { qa('.av').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); state.av = b.dataset.av; LW.sfx('pop'); }; });
    qa('[data-gr]').forEach(function (b) { b.onclick = function () { qa('.gr').forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel'); state.gr = +b.dataset.gr; q('#grTxt').textContent = state.gr ? t('gradeN', state.gr) : t('gradeK'); LW.sfx('pop'); }; });
    q('#ncGo').onclick = function () {
      var name = q('#ncName').value.trim() || (LW.lang() === 'en' ? 'Kid' : 'Kind');
      if (edit) { p.name = name; p.avatar = state.av; p.grade = state.gr; LW.save(); go({ n: 'parents' }); return; }
      LW.newProfile(name, state.av, state.gr); LW.sfx('win'); LW.confetti(90); go({ n: 'home' });
    };
  }

  // ---------- Startseite ----------
  function dailyCount(p) { return p.days[E.dayKey()] || 0; }
  function ring(frac, inner, col) { var r = 26, c = 2 * Math.PI * r; return '<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="' + r + '" stroke="#EDE7FF" stroke-width="8" fill="none"/><circle cx="32" cy="32" r="' + r + '" stroke="' + (col || '#7C5CFF') + '" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="' + (c * Math.min(1, frac)).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 32 32)"/></svg><span class="ring-in">' + inner + '</span>'; }
  function vHome() {
    var p = P(); if (!p) return vProfiles();
    var stars = E.totalStars(p.prog), lum = E.lumiLevel(stars), dc = dailyCount(p), goal = LW.S.set.goal, st = E.streak(p.days);
    var hour = new Date().getHours();
    h('<div class="scr home">' +
      '<header class="hm-top"><button class="who" data-go="profiles">' + em(p.avatar, 'who-av') + '<span>' + esc(p.name) + '</span></button><span class="sp"></span>' +
      '<span class="pill star">★ ' + stars + '</span><span class="pill fire ' + (st ? '' : 'off') + '">' + em('🔥', 'pill-em') + ' ' + st + '</span>' +
      '<button class="ib parent" data-act="parents" aria-label="' + t('parents') + '">' + svgI('lock') + '</button></header>' +
      '<section class="hero"><div class="hero-l">' + LW.lumi(hour >= 20 || hour < 6 ? 'sleep' : 'happy', p.hat, 'lumi-hero bob') + '</div><div class="hero-r"><div class="bubble"><b>' + t('hello', esc(p.name)) + '</b><span>' + t('helloSub') + '</span></div>' +
      '<div class="lvbar"><span>' + t('lumiLv', lum.lv) + '</span><i><em style="width:' + Math.round(lum.cur / lum.need * 100) + '%"></em></i></div></div></section>' +
      '<section class="goal card"><div class="ringw">' + ring(dc / goal, dc >= goal ? '✓' : dc + '/' + goal, dc >= goal ? '#2BC48A' : '#7C5CFF') + '</div><div><b>' + (dc >= goal ? t('dailyDone') : t('daily')) + '</b><span>' + t('dailyOf', Math.min(dc, goal), goal) + ' · ' + (st ? (st === 1 ? t('streak1') : t('streak', st)) : t('streak0')) + '</span></div></section>' +
      '<section class="worlds">' + E.WORLDS.map(function (w) { var ws = E.worldStars(p, w.id); var nl = E.nextLevel(p, w.id);
        return '<button class="world card3d" style="--wc:' + w.color + '" data-world="' + w.id + '"><span class="w-ic">' + worldIcon(w.id) + '</span><span class="w-tx"><b>' + wname(w.id) + '</b><small>' + t('wd_' + w.id) + '</small>' +
          '<span class="w-prog"><i><em style="width:' + Math.round(ws.have / ws.max * 100) + '%"></em></i><span>★ ' + ws.have + '/' + ws.max + '</span></span></span><span class="w-go" data-start="' + nl + '">▶</span></button>'; }).join('') + '</section>' +
      '<section class="extras"><button class="ex card3d" data-go="album">' + em('🦄', 'ex-em') + '<b>' + t('stickers') + '</b><small>' + p.stickers.length + '/' + LW.STICKERS.length + '</small></button>' +
      '<button class="ex card3d" data-go="grid">' + em('🧮', 'ex-em') + '<b>' + t('grid').replace('Meine ', '').replace('My ', '') + '</b><small>' + t('mastered', E.masteredCount(p.facts)).replace(' von 100 sicher', '/100').replace(' of 100 mastered', '/100') + '</small></button>' +
      '<button class="ex card3d" data-go="freeclock">' + em('🕰️', 'ex-em') + '<b>' + t('clockFree') + '</b><small>' + t('clockFreeSub') + '</small></button></section>' +
      '</div>');
    qa('[data-world]').forEach(function (b) { b.onclick = function (ev) { LW.sfx('tap'); var s = ev.target.closest('[data-start]'); if (s) startLevel(s.dataset.start); else go({ n: 'world', id: b.dataset.world }); }; });
  }
  function worldIcon(id) { return { mult: '<span class="wi-t">×</span>', math: '<span class="wi-t">+−</span>', clock: LW.clockSVG({ h: 10, m: 10, minutes: false }), abc: '<span class="wi-t abc">Aa</span>' }[id]; }

  // ---------- Welt ----------
  function vWorld(id) {
    var p = P(), w = E.world(id);
    var extra = '';
    if (id === 'mult') extra = '<div class="wx"><button class="wxb card3d" data-act="training">' + em('🎯', 'ex-em') + '<span><b>' + t('training') + '</b><small>' + t('trainingSub') + '</small></span></button><button class="wxb card3d" data-go="grid">' + em('🧮', 'ex-em') + '<span><b>' + t('grid') + '</b><small>' + t('mastered', E.masteredCount(p.facts)) + '</small></span></button></div>';
    if (id === 'clock') extra = '<div class="wx"><button class="wxb card3d" data-go="freeclock">' + em('🕰️', 'ex-em') + '<span><b>' + t('clockFree') + '</b><small>' + t('clockFreeSub') + '</small></span></button></div>';
    var path = w.levels.map(function (l, i) {
      var pr = p.prog[l.id], un = E.unlocked(p, l.id), cur = un && (!pr || !pr.stars) ? ' cur' : '';
      return '<div class="node-row ' + (i % 2 ? 'r' : 'l') + '"><button class="node' + (un ? '' : ' lock') + cur + '" data-lv="' + l.id + '" style="--wc:' + w.color + '"><span class="nn">' + (un ? i + 1 : svgI('lock')) + '</span></button>' +
        '<div class="node-tx"><b>' + t(l.id) + '</b>' + starRow(pr ? pr.stars : 0) + '</div></div>';
    }).join('');
    h('<div class="scr world" style="--wc:' + w.color + '">' + topbar(wname(id), 'home', w.color) + '<div class="w-hero"><span class="w-ic big">' + worldIcon(id) + '</span><div><b>★ ' + E.worldStars(p, id).have + '/' + E.worldStars(p, id).max + '</b><small>' + t('wd_' + id) + '</small></div></div>' + extra + '<div class="path">' + path + '</div></div>');
    qa('[data-lv]').forEach(function (b) { b.onclick = function () { if (b.classList.contains('lock')) { LW.sfx('no'); snack(t('locked')); b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 400); return; } LW.sfx('tap'); startLevel(b.dataset.lv); }; });
    var cur = q('.node.cur'); if (cur) setTimeout(function () { cur.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 120);
  }

  // ---------- Spielen ----------
  function ctxObj() { var p = P(); return { lang: LW.lang(), facts: p.facts, t: t }; }
  function startLevel(id) { var r = E.makeRound(id, ctxObj()); startRound(r); }
  function startRound(r) { play = { r: r, i: 0, errors: 0, right: 0, tries: 0, combo: 0, t0: Date.now(), taskT0: Date.now(), input: '', firstWrong: {} }; go({ n: 'play' }); }
  function cur() { return play.r.tasks[play.i]; }
  function promptText(tk) {
    if (tk.qKey) return LW.tk(tk.qKey);
    var k = play.r.level.kind;
    return { count: t('qCount'), cread: t('qRead'), cmp: t('qCmp'), seq: t('qSeq'), syll: t('qSyll'), readw: t('qReadW'), build: t('qBuild'), article: t('qArticle'), tf: t('qTf'), trace: t('qTrace'), cset: t('qSet') }[k] || '';
  }
  function sayTask(tk) { var s = tk.sayKey ? LW.tk(tk.sayKey) : ''; if (tk.readWord) s = t('sayReadW'); if (tk.sentence) s = tk.sentence; LW.say(s); }
  function vPlay() {
    var r = play.r, tk = cur(), w = r.world, n = r.tasks.length;
    var prog = r.tasks.map(function (_, i) { return '<i class="' + (i < play.i ? 'done' : i === play.i ? 'now' : '') + '"></i>'; }).join('');
    var body = '';
    var pt = promptText(tk);
    if (tk.type === 'num') body = numView(tk, pt);
    else if (tk.type === 'choice') body = choiceView(tk, pt);
    else if (tk.type === 'clockSet') body = clockSetView(tk);
    else if (tk.type === 'trace') body = traceView(tk);
    else if (tk.type === 'build') body = buildView(tk);
    h('<div class="scr play" style="--wc:' + w.color + '"><header class="pl-top"><button class="ib" data-act="quit" aria-label="' + t('close') + '">' + svgI('close') + '</button><div class="pbar">' + prog + '</div>' +
      '<button class="ib" data-act="say" aria-label="' + t('listen') + '">' + svgI('speak') + '</button></header>' +
      '<div class="pl-ask">' + LW.lumi('happy', P().hat, 'lumi-s') + '<div class="ask" data-act="say">' + esc(pt || t('qCalc')) + '</div><span class="combo" id="combo"></span></div>' +
      '<main class="pl-main" id="plMain">' + body + '</main><div class="fb" id="fb"></div></div>');
    play.taskT0 = Date.now(); play.input = ''; play.tries = 0; play.locked = false;
    bindTask(tk);
    setTimeout(function () { sayTask(tk); }, 250);
  }
  function lumiMood(m) { var l = q('.pl-ask .lumi'); if (l) l.outerHTML = LW.lumi(m, P().hat, 'lumi-s ' + (m === 'cheer' ? 'jump' : m === 'oops' ? 'wob' : '')); }

  // Zahlen-Eingabe
  function visHTML(v) {
    if (!v) return '';
    if (v.count) { var s = ''; for (var i = 0; i < v.count; i++) s += em(v.em, 'cnt'); return '<div class="vis count">' + s + '</div>'; }
    if (v.dots) { var a = v.dots[0], b = v.dots[1], rows = ''; for (var r = 0; r < Math.min(a, 10); r++) { var row = ''; for (var c = 0; c < Math.min(b, 10); c++) row += '<i></i>'; rows += '<div>' + row + '</div>'; } return '<div class="vis dots hint-only">' + rows + '</div>'; }
    if (v.add) return '<div class="vis blocks">' + dotsN(v.add[0], 'a') + '<b>+</b>' + dotsN(v.add[1], 'b') + '</div>';
    if (v.sub) { var x = ''; for (var k = 0; k < v.sub[0]; k++) x += '<i class="a ' + (k >= v.sub[0] - v.sub[1] ? 'gone' : '') + '"></i>'; return '<div class="vis blocks"><span class="bl">' + x + '</span></div>'; }
    if (v.house) return '<div class="vis house"><div class="roof">' + v.house[0] + '</div><div class="rooms"><span>' + v.house[1] + '</span><span class="qm">?</span></div></div>';
    return '';
  }
  function dotsN(n, cls) { var s = ''; for (var i = 0; i < n; i++) s += '<i class="' + cls + '"></i>'; return '<span class="bl">' + s + '</span>'; }
  function numView(tk, pt) {
    var qhtml = tk.q ? esc(tk.q).replace('▢', '<span class="ansbox" id="ans">&nbsp;</span>') : '<span class="ansbox solo" id="ans">&nbsp;</span>';
    var keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'ok'].map(function (k) { return '<button class="key ' + (k === 'ok' ? 'kok' : k === 'del' ? 'kdel' : '') + '" data-k="' + k + '">' + (k === 'del' ? svgI('del') : k === 'ok' ? svgI('check') : k) + '</button>'; }).join('');
    var showVis = tk.vis && (tk.vis.count || tk.vis.add || tk.vis.sub || tk.vis.house);
    return '<div class="qcard">' + (showVis ? visHTML(tk.vis) : '') + '<div class="eq">' + qhtml + '</div>' + (tk.vis && tk.vis.dots ? '<button class="hintb" data-act="hint">' + svgI('bulb') + t('hint') + '</button><div id="hintBox"></div>' : '') + '</div><div class="keypad">' + keys + '</div>';
  }
  function choiceView(tk, pt) {
    var top = '';
    if (tk.clock) top += '<div class="clockwrap">' + LW.clockSVG({ h: tk.clock.h, m: tk.clock.m, minutes: true }) + (tk.pm ? '<span class="pm">' + em('🌇', 'pm-em') + '</span>' : '') + '</div>';
    if (tk.letter) top += '<div class="bigletter">' + tk.letter + '<small>' + tk.letter.toLowerCase() + '</small></div>';
    if (tk.emojiQ) top += '<div class="bigemo">' + em(tk.emojiQ) + '</div>';
    if (tk.syll) top += '<div class="word syl" data-act="sayword">' + esc(tk.word[0]) + '</div>';
    if (tk.artWord) top += '<div class="word">▢ ' + esc(tk.artWord) + '</div>';
    if (tk.readWord) top += '<div class="word read">' + esc(tk.readWord) + '</div>';
    if (tk.sentence) top += '<div class="sentence">' + esc(tk.sentence) + '</div>';
    if (tk.q && !tk.clock) top += '<div class="eq">' + esc(tk.q).replace('▢', '<span class="ansbox" id="ans">?</span>') + '</div>';
    var cls = tk.emoji ? 'ch-emo' : tk.clockChoices ? 'ch-clock' : tk.big || tk.syll ? 'ch-big' : tk.tf ? 'ch-tf' : 'ch-txt';
    var ch = tk.choices.map(function (c, i) {
      var inner;
      if (tk.emoji) inner = em(c, 'ch-e');
      else if (tk.clockChoices) { var hm = String(c).split(':'); inner = LW.clockSVG({ h: +hm[0], m: +hm[1], minutes: false }); }
      else if (tk.tf) inner = (c === 'yes' ? '<span class="tf ok">✓</span>' + t('yes') : '<span class="tf no">✗</span>' + t('no'));
      else if (tk.syll) inner = '<span class="claps">' + new Array(c + 1).join('👏').split('👏').slice(1).map(function () { return em('👏', 'clap'); }).join('') + '</span><b>' + c + '</b>';
      else inner = '<b>' + esc(c) + '</b>' + (tk.sub ? '<small>' + esc(tk.sub[i]) + '</small>' : '');
      return '<button class="ch card3d" data-c="' + esc(c) + '">' + inner + '</button>';
    }).join('');
    return '<div class="qcard">' + top + '</div><div class="choices ' + cls + '"' + (tk.choices.length === 3 ? ' style="grid-template-columns:repeat(3,1fr)"' : '') + '>' + ch + '</div>';
  }
  function clockSetView(tk) {
    return '<div class="qcard"><div class="target"><b>' + esc(tk.q) + '</b><span>' + esc(tk.qSub) + '</span></div><div class="clockwrap set" id="clockSet">' + LW.clockSVG({ h: 12, m: 0, interactive: true }) + '</div><p class="hintline">' + t('setHint') + '</p></div>' +
      '<div class="actions"><button class="btn big primary" data-act="checkClock">' + svgI('check') + t('check') + '</button></div>';
  }
  function traceView(tk) {
    return '<div class="qcard"><div class="tracewrap"><canvas id="trace" width="600" height="600"></canvas></div></div>' +
      '<div class="actions two"><button class="btn big ghost" data-act="clearTrace">' + t('clear') + '</button><button class="btn big primary" data-act="checkTrace">' + svgI('check') + t('check') + '</button></div>';
  }
  function buildView(tk) {
    var slots = tk.word.split('').map(function (_, i) { return '<span class="slot" data-slot="' + i + '"></span>'; }).join('');
    var tiles = tk.tiles.map(function (c, i) { return '<button class="tile card3d" data-tile="' + i + '">' + c + '</button>'; }).join('');
    return '<div class="qcard"><div class="bigemo" data-act="sayword">' + em(tk.emojiQ) + '</div><div class="slots">' + slots + '</div></div><div class="tiles">' + tiles + '</div>';
  }

  function bindTask(tk) {
    if (tk.type === 'num') {
      qa('[data-k]').forEach(function (b) { b.onclick = function () { var k = b.dataset.k; LW.sfx('tap');
        if (k === 'del') play.input = play.input.slice(0, -1); else if (k === 'ok') { if (play.input) answer(+play.input); return; } else if (play.input.length < 3) play.input += k;
        q('#ans').innerHTML = play.input || '&nbsp;'; q('#ans').classList.toggle('filled', !!play.input);
        if (play.input && String(tk.ans).length === play.input.length && +play.input === tk.ans) setTimeout(function () { if (cur() === tk && play.input) answer(+play.input); }, 160);
      }; });
    }
    if (tk.type === 'choice') qa('[data-c]').forEach(function (b) { b.onclick = function () { if (b.disabled) return; answer(b.dataset.c, b); }; });
    if (tk.type === 'clockSet') bindClock(q('#clockSet'), tk.step, null);
    if (tk.type === 'trace') bindTrace(tk);
    if (tk.type === 'build') bindBuild(tk);
    qa('[data-act=sayword]').forEach(function (b) { b.onclick = function () { LW.say(tk.speakWord || tk.word[0], true); }; });
  }

  function answer(val, btn) {
    var tk = cur(); if (play.locked) return; var ok = E.check(tk, val); var ms = Date.now() - play.taskT0;
    if (ok) {
      if (!play.firstWrong[play.i]) { play.right++; play.combo++; } else play.combo = 0;
      if (tk.fact) E.updateFact(P().facts, tk.fact[0], tk.fact[1], !play.firstWrong[play.i], ms);
      if (btn) btn.classList.add('right');
      var ab = q('#ans'); if (ab) { ab.textContent = tk.type === 'choice' ? val : tk.ans; ab.classList.add('right'); }
      LW.sfx(play.combo >= 3 && play.combo % 3 === 0 ? 'combo' : 'ok'); LW.buzz('ok'); lumiMood('cheer');
      var rr = t('right'); feedback(rr[Math.floor(Math.random() * rr.length)] + (ms < 3000 && tk.fact && !play.firstWrong[play.i] ? ' ⚡' : ''), 'ok');
      if (play.combo >= 3 && play.combo % 3 === 0) { var c = q('#combo'); c.textContent = t('combo', play.combo); c.classList.add('on'); LW.confetti(40, innerWidth / 2, innerHeight * .25); }
      play.locked = true; lockInputs(); setTimeout(nextTask, LW.fast ? 5 : 950);
    } else {
      play.tries++; LW.sfx('no'); LW.buzz('no'); lumiMood('oops');
      if (!play.firstWrong[play.i]) { play.firstWrong[play.i] = 1; play.errors++; }
      play.combo = 0;
      if (btn) { btn.classList.add('wrong'); btn.disabled = true; }
      var main = q('#plMain'); main.classList.remove('shake'); void main.offsetWidth; main.classList.add('shake');
      if (tk.fact && play.tries === 1) E.updateFact(P().facts, tk.fact[0], tk.fact[1], false, ms);
      if (play.tries >= 2) { play.locked = true; showSolution(tk); return; }
      feedback(t('wrong'), 'no'); showHint(tk);
      if (tk.type === 'num') { play.input = ''; setTimeout(function () { var a = q('#ans'); if (a && cur() === tk && !play.input) { a.innerHTML = '&nbsp;'; a.classList.remove('filled'); } }, 500); }
    }
  }
  function showHint(tk) { var hb = q('#hintBox'); if (hb && tk.vis && tk.vis.dots) hb.innerHTML = visHTML(tk.vis).replace('hint-only', ''); }
  function showSolution(tk) {
    var sol = tk.type === 'clockSet' ? E.digital(tk.ans.h, tk.ans.m) : tk.type === 'choice' && tk.tf ? t(tk.ans) : tk.ans;
    if (tk.type === 'choice') qa('[data-c]').forEach(function (b) { if (b.dataset.c === String(tk.ans)) b.classList.add('right', 'pulse'); });
    if (tk.type === 'clockSet') { var cw = q('#clockSet'); cw.innerHTML = LW.clockSVG({ h: tk.ans.h, m: tk.ans.m }); }
    showHint(tk); var ab = q('#ans'); if (ab && tk.type !== 'choice') { ab.textContent = tk.ans; ab.classList.add('sol'); }
    lockInputs();
    var fb = q('#fb'); fb.className = 'fb on sol'; fb.innerHTML = '<span>' + esc(t('solution', tk.emoji ? '' : sol)) + (tk.emoji ? em(tk.ans, 'fb-em') : '') + '</span><button class="btn primary" data-act="next">' + t('next') + ' ▶</button>';
    LW.say(t('solution', tk.emoji || tk.type === 'trace' ? '' : (tk.type === 'clockSet' ? E.timeWords(tk.ans.h, tk.ans.m, LW.lang()) : sol)));
  }
  function lockInputs() { qa('.keypad button, .choices button, .tiles button, .actions button').forEach(function (b) { b.disabled = true; }); }
  function feedback(msg, kind) { var fb = q('#fb'); fb.className = 'fb on ' + kind; fb.innerHTML = '<span>' + esc(msg) + '</span>'; clearTimeout(feedback.t); if (kind === 'no') feedback.t = setTimeout(function () { fb.classList.remove('on'); }, 1600); }
  function nextTask() { play.i++; if (play.i >= play.r.tasks.length) finishRound(); else vPlay(); }

  // Uhr stellen (Zeiger ziehen)
  function bindClock(wrap, step, onChange) {
    var st = { h: 12, m: 0 }, drag = null; wrap._st = st;
    function upd() { var hd = ((st.h % 12) + st.m / 60) * 30, md = st.m * 6; var hh = q('.hand-h', wrap), mm = q('.hand-m', wrap); hh.style.transform = 'rotate(' + hd + 'deg)'; mm.style.transform = 'rotate(' + md + 'deg)';
      var hc = LW.HCOL[((st.h % 12) || 12) - 1]; q('.hand-h line', wrap).setAttribute('stroke', hc); if (onChange) onChange(st); }
    function ang(ev) { var r = q('svg', wrap).getBoundingClientRect(); var p = ev.touches ? ev.touches[0] : ev; var x = p.clientX - (r.left + r.width / 2), y = p.clientY - (r.top + r.height / 2); var a = Math.atan2(x, -y) * 180 / Math.PI; return (a + 360) % 360; }
    function down(ev) { var a = ang(ev); var g = ev.target.closest && ev.target.closest('[data-hand]'); var r = q('svg', wrap).getBoundingClientRect(); var p = ev.touches ? ev.touches[0] : ev;
      var dist = Math.hypot(p.clientX - (r.left + r.width / 2), p.clientY - (r.top + r.height / 2)) / (r.width / 2);
      drag = g ? g.dataset.hand : (dist < 0.55 ? 'h' : 'm'); drag === 'm' ? setM(a) : setH(a); ev.preventDefault(); }
    function move(ev) { if (!drag) return; var a = ang(ev); drag === 'm' ? setM(a) : setH(a); ev.preventDefault(); }
    function up() { drag = null; }
    var lastM = 0;
    function setM(a) { var s = step >= 60 ? 5 : Math.max(1, Math.min(step, 5)); var m = Math.round(a / 6 / s) * s % 60;
      if (lastM > 45 && m < 15) st.h = st.h % 12 + 1; else if (lastM < 15 && m > 45) st.h = (st.h + 10) % 12 + 1; lastM = m; if (m !== st.m) { st.m = m; LW.sfx('tap'); } upd(); }
    function setH(a) { var hh = Math.floor(((a + 360 - st.m / 2) % 360 + 15) / 30) % 12; hh = hh === 0 ? 12 : hh; if (hh !== st.h) { st.h = hh; LW.sfx('tap'); } upd(); }
    wrap.addEventListener('pointerdown', function (e) { wrap.setPointerCapture && wrap.setPointerCapture(e.pointerId); down(e); });
    wrap.addEventListener('pointermove', move); wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', up);
    wrap.style.touchAction = 'none'; upd(); return st;
  }

  // Buchstaben nachspuren
  function bindTrace(tk) {
    var cv = q('#trace'), c = cv.getContext('2d'), W = cv.width, Hh = cv.height, low = tk.letter === tk.letter.toLowerCase();
    var font = (low ? 400 : 440) + 'px Andika, sans-serif';
    var mask = document.createElement('canvas'); mask.width = W; mask.height = Hh; var mc = mask.getContext('2d');
    var ink = document.createElement('canvas'); ink.width = W; ink.height = Hh; var ic = ink.getContext('2d');
    function drawGuide() { mc.clearRect(0, 0, W, Hh); mc.font = font; mc.textAlign = 'center'; mc.textBaseline = 'alphabetic'; mc.fillStyle = '#000'; mc.fillText(tk.letter, W / 2, low ? Hh * 0.7 : Hh * 0.8); }
    function paint() { c.clearRect(0, 0, W, Hh);
      c.strokeStyle = '#E6E0F7'; c.lineWidth = 3; [0.2, 0.5, 0.8].forEach(function (y, i) { c.setLineDash(i === 1 ? [12, 12] : []); c.beginPath(); c.moveTo(20, Hh * y); c.lineTo(W - 20, Hh * y); c.stroke(); }); c.setLineDash([]);
      c.font = font; c.textAlign = 'center'; c.fillStyle = '#EFEAFE'; c.fillText(tk.letter, W / 2, low ? Hh * 0.7 : Hh * 0.8);
      c.save(); c.setLineDash([3, 14]); c.lineWidth = 6; c.strokeStyle = '#B3A4F2'; c.lineCap = 'round'; c.strokeText(tk.letter, W / 2, low ? Hh * 0.7 : Hh * 0.8); c.restore();
      c.drawImage(ink, 0, 0); }
    function go2() { drawGuide(); paint(); }
    if (document.fonts && document.fonts.load) document.fonts.load(font).then(go2, go2); else go2();
    var last = null, drawing = false;
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * Hh / r.height }; }
    cv.addEventListener('pointerdown', function (e) { drawing = true; last = pos(e); cv.setPointerCapture && cv.setPointerCapture(e.pointerId); dot(last); e.preventDefault(); });
    cv.addEventListener('pointermove', function (e) { if (!drawing) return; var p = pos(e); ic.strokeStyle = getComputedStyle(document.body).getPropertyValue('--wc') || '#FF4F8B'; ic.strokeStyle = '#FF4F8B'; ic.lineWidth = 34; ic.lineCap = 'round'; ic.lineJoin = 'round'; ic.beginPath(); ic.moveTo(last.x, last.y); ic.lineTo(p.x, p.y); ic.stroke(); last = p; paint(); e.preventDefault(); });
    function stop() { drawing = false; }
    cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop); cv.style.touchAction = 'none';
    function dot(p) { ic.fillStyle = '#FF4F8B'; ic.beginPath(); ic.arc(p.x, p.y, 17, 0, 7); ic.fill(); paint(); }
    q('[data-act=clearTrace]').onclick = function () { ic.clearRect(0, 0, W, Hh); paint(); LW.sfx('tap'); };
    q('[data-act=checkTrace]').onclick = function () {
      var md = mc.getImageData(0, 0, W, Hh).data, id = ic.getImageData(0, 0, W, Hh).data, glyph = 0, hit = 0, inkN = 0, out = 0;
      for (var i = 3; i < md.length; i += 16) { var g = md[i] > 100, k = id[i] > 100; if (g) { glyph++; if (k) hit++; } if (k) { inkN++; if (!g) out++; } }
      // Nachbarschaft grosszuegig: Glyphe dilatieren ueber Treffer-Abdeckung der Tinte
      var cover = glyph ? hit / glyph : 0, outside = inkN ? out / inkN : 1;
      var ok = cover >= 0.5 && outside <= 0.62;
      if (ok) { tk._ok = 1; answer(tk.ans); feedback(t('traceGood'), 'ok'); }
      else { answer('__'); if (play.tries < 2) feedback(t('traceAgain'), 'no'); ic.clearRect(0, 0, W, Hh); paint(); }
    };
    window.__traceDebug = function () { return { mask: mc, ink: ic, W: W, H: Hh }; };
  }

  // Woerter bauen
  function bindBuild(tk) {
    var placed = [];
    function upd() { qa('.slot').forEach(function (s, i) { var tIdx = placed[i]; s.textContent = tIdx === undefined ? '' : tk.tiles[tIdx]; s.classList.toggle('fill', tIdx !== undefined); });
      qa('[data-tile]').forEach(function (b) { b.classList.toggle('used', placed.indexOf(+b.dataset.tile) >= 0); }); }
    qa('[data-tile]').forEach(function (b) { b.onclick = function () { var i = +b.dataset.tile; if (placed.indexOf(i) >= 0 || b.disabled) return; if (placed.length >= tk.word.length) return; placed.push(i); LW.sfx('pop'); upd();
      if (placed.length === tk.word.length) { var w = placed.map(function (x) { return tk.tiles[x]; }).join(''); if (w === tk.ans) { answer(w); LW.say(tk.speakWord, true); } else { answer(w); setTimeout(function () { if (cur() === tk && play.tries < 2) { placed = []; upd(); } }, 700); } } }; });
    qa('.slot').forEach(function (s, i) { s.onclick = function () { if (i < placed.length) { placed.splice(i, 1); upd(); LW.sfx('tap'); } }; });
  }

  // ---------- Runde beenden ----------
  function finishRound() {
    var p = P(), r = play.r, n = r.tasks.length, stars = E.stars(play.errors, n), lv = r.level, rew = [];
    var ms = Date.now() - play.t0; p.totalMs += ms; var dk = E.dayKey(); p.minutes[dk] = (p.minutes[dk] || 0) + ms / 60000;
    p.rounds++; p.right += play.right; p.wrong += play.errors; p.days[dk] = (p.days[dk] || 0) + 1; p.bestStreak = Math.max(p.bestStreak || 0, E.streak(p.days));
    var beforeStars = E.totalStars(p.prog), beforeLv = E.lumiLevel(beforeStars).lv;
    var first = false;
    if (!r.training) { var pr = p.prog[lv.id] || (p.prog[lv.id] = { stars: 0, plays: 0 }); first = !pr.stars; pr.plays++; if (stars > pr.stars) pr.stars = stars; }
    if (first && p.stickers.length < LW.STICKERS.length) { var idx = p.stickerOrder[p.stickers.length]; p.stickers.push(idx); rew.push('<div class="rew">' + em(LW.STICKERS[idx], 'rew-em pop') + '<b>' + t('newSticker') + '</b></div>'); }
    var afterStars = E.totalStars(p.prog), lum = E.lumiLevel(afterStars);
    if (lum.lv > beforeLv) rew.push('<div class="rew">' + LW.lumi('cheer', p.hat, 'rew-lumi') + '<b>' + t('lumiUp', lum.lv) + '</b></div>');
    LW.HATS.forEach(function (hh) { if (hh.need > beforeStars && hh.need <= afterStars) { p.hat = hh.id; rew.push('<div class="rew">' + LW.lumi('happy', hh.id, 'rew-lumi') + '<b>' + t('newHat') + '</b></div>'); } });
    var nb = E.newBadges(p); nb.forEach(function (b) { p.badges.push(b); rew.push('<div class="rew">' + badgeIcon(b, true) + '<b>' + t('newBadge') + '</b><small>' + t('b_' + b) + '</small></div>'); });
    LW.save();
    var title = stars === 3 ? t('roundPerfect') : stars === 2 ? t('roundGood') : t('roundOk');
    var info = E.level(lv.id), nextId = info && info.w.levels[info.idx + 1] ? info.w.levels[info.idx + 1].id : null;
    h('<div class="scr result" style="--wc:' + r.world.color + '"><div class="res-card">' + LW.lumi('cheer', p.hat, 'lumi-l jump') + '<h1>' + title + '</h1><div class="res-stars">' +
      [0, 1, 2].map(function (i) { return '<span class="bst ' + (i < stars ? 'on' : '') + '" style="animation-delay:' + (0.35 + i * 0.35) + 's">★</span>'; }).join('') + '</div>' +
      '<p class="res-sub">' + (r.training ? t('training') : t(lv.id)) + ' · ' + t('correctOf', play.right, n) + '</p>' + (rew.length ? '<div class="rews">' + rew.join('') + '</div>' : '') + '</div>' +
      '<div class="res-btns">' + (nextId && !r.training ? '<button class="btn big primary" data-next="' + nextId + '">' + t('nextLevel') + ' ▶</button>' : '') +
      '<button class="btn big ' + (nextId && !r.training ? 'ghost' : 'primary') + '" data-act="again">' + t('playAgain') + '</button><button class="btn big ghost" data-go="' + (r.training ? 'world:mult' : 'world:' + r.world.id) + '">' + t('backHome') + '</button></div></div>');
    LW.sfx('win'); LW.buzz('heavy'); LW.confetti(stars === 3 ? 160 : 90);
    [0, 1, 2].forEach(function (i) { if (i < stars) setTimeout(function () { LW.sfx('star'); }, 400 + i * 350); });
    setTimeout(function () { LW.say(title); }, 300);
    var nx = q('[data-next]'); if (nx) nx.onclick = function () { startLevel(nx.dataset.next); };
    q('[data-act=again]').onclick = function () { if (r.training) startRound(E.makeTraining(ctxObj())); else startLevel(lv.id); };
    checkBreak();
  }
  function checkBreak() {
    var m = LW.S.set.breakMin; if (!m || breakShown) return; if ((Date.now() - sessionStart) / 60000 < m) return; breakShown = true;
    setTimeout(function () { modal('<div class="brk">' + LW.lumi('sleep', P().hat, 'lumi-m') + '<h2>' + t('breakTitle') + '</h2><p>' + t('breakText', m) + '</p><button class="btn big primary" data-act="closeModal">' + t('breakOk') + '</button></div>'); }, 1600);
  }

  // ---------- Album & Abzeichen ----------
  function badgeIcon(id, big) { var map = { first: '⭐', stars25: '🌟', stars75: '💫', stars150: '🏆', perfect: '💯', streak3: '🔥', streak7: '🚀', mult25: '🧮', mult100: '🧠', clock: '⏰', reader: '📚', writer: '✏️', math100: '💯', stickers: '🦄', allworlds: '🌍' };
    return '<span class="badge ' + (big ? 'big' : '') + '">' + em(map[id] || '⭐') + '</span>'; }
  function vAlbum() {
    var p = P(), have = {}; p.stickers.forEach(function (i) { have[i] = 1; });
    h('<div class="scr album">' + topbar(t('album'), 'home') + '<div class="pad"><p class="sub">' + t('albumSub', p.stickers.length, LW.STICKERS.length) + '</p>' +
      '<div class="stk-grid">' + LW.STICKERS.map(function (s, i) { return '<div class="stk ' + (have[i] ? 'have' : '') + '">' + (have[i] ? em(s) : '<span class="qm">?</span>') + '</div>'; }).join('') + '</div>' +
      '<h2 class="sec">' + t('badges') + '</h2><div class="bdg-grid">' + E.BADGES.map(function (b) { var got = p.badges.indexOf(b.id) >= 0; return '<div class="bdg ' + (got ? 'got' : '') + '">' + badgeIcon(b.id) + '<small>' + t('b_' + b.id) + '</small></div>'; }).join('') + '</div></div></div>');
  }

  // ---------- Einmaleins-Karte ----------
  function vGrid() {
    var p = P(), s = '<div class="mg"><span></span>';
    for (var b = 1; b <= 10; b++) s += '<span class="mh">' + b + '</span>';
    for (var a = 1; a <= 10; a++) { s += '<span class="mh">' + a + '</span>'; for (var c = 1; c <= 10; c++) { var lv = Math.max(E.factLevel(p.facts[E.factKey(a, c)]), E.factLevel(p.facts[E.factKey(c, a)])); s += '<button class="mc l' + lv + '" data-f="' + a + 'x' + c + '">' + a * c + '</button>'; } }
    s += '</div>';
    h('<div class="scr grid">' + topbar(t('grid'), 'world:mult', '#7C5CFF') + '<div class="pad"><p class="sub">' + t('mastered', E.masteredCount(p.facts)) + '</p><p class="legend"><i class="l3"></i>' + t('gridSub') + '</p>' + s +
      '<button class="btn big primary" data-act="training">' + em('🎯', 'btn-em') + t('training') + '</button></div></div>');
    qa('[data-f]').forEach(function (b) { b.onclick = function () { var f = b.dataset.f.split('x'); LW.say(LW.t('sayMul', f[0], f[1]) + ' = ' + f[0] * f[1], true); b.classList.add('pulse'); setTimeout(function () { b.classList.remove('pulse'); }, 500); }; });
  }

  // ---------- Freie Uhr ----------
  function vFreeClock() {
    h('<div class="scr freeclock">' + topbar(t('clockFree'), 'world:clock', '#14B8A6') + '<div class="pad center"><div class="clockwrap set big" id="fc">' + LW.clockSVG({ h: 12, m: 0, interactive: true }) + '</div>' +
      '<div class="fc-read"><b id="fcW"></b><span id="fcD"></span></div><p class="hintline">' + t('freeClockHint') + '</p><button class="btn primary" data-act="fcSay">' + svgI('speak') + t('listen') + '</button></div></div>');
    bindClock(q('#fc'), 1, function (st) { q('#fcW').textContent = E.timeWords(st.h, st.m, LW.lang()); q('#fcD').textContent = E.digital(st.h, st.m) + ' · ' + E.digital24(st.h === 12 ? 12 : st.h, st.m) + ' / ' + E.digital24(st.h + 12 === 24 ? 0 : st.h + 12, st.m); });
    q('[data-act=fcSay]').onclick = function () { LW.say(q('#fcW').textContent, true); };
  }

  // ---------- Eltern ----------
  var NUMW = { de: ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'], en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'] };
  function gate(then) {
    var d = [E.ri(1, 9), E.ri(0, 9), E.ri(0, 9)], words = d.map(function (x) { return NUMW[LW.lang()][x]; }).join(' – '), input = '';
    modal('<div class="gate"><h2>' + svgI('lock') + t('gateTitle') + '</h2><p>' + t('gateText') + '</p><p class="gw">' + words + '</p><div class="gin" id="gin">_ _ _</div><div class="keypad small">' +
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 'x', 0, 'del'].map(function (k) { return '<button class="key ' + (k === 'x' ? 'kdel' : '') + '" data-g="' + k + '">' + (k === 'del' ? svgI('del') : k === 'x' ? svgI('close') : k) + '</button>'; }).join('') + '</div></div>', 'gatebox');
    qa('[data-g]').forEach(function (b) { b.onclick = function () { var k = b.dataset.g; if (k === 'x') return closeModal(); if (k === 'del') input = input.slice(0, -1); else input += k;
      q('#gin').textContent = (input + '___').slice(0, 3).split('').join(' ');
      if (input.length === 3) { if (input === d.join('')) { closeModal(); then(); } else { q('#gin').textContent = t('gateWrong'); input = ''; } } }; });
  }
  function fmtMin(m) { m = Math.round(m || 0); return m < 60 ? t('minutesShort', m) : Math.floor(m / 60) + ' h ' + (m % 60) + ' min'; }
  function vParents() {
    var p = P(), S = LW.S, acc = p.right + p.wrong ? Math.round(p.right / (p.right + p.wrong) * 100) : 0;
    var weak = []; for (var k in p.facts) { var f = p.facts[k]; if (f.bad > 0 && E.factLevel(f) < 3) weak.push([k, f.box - f.bad * 0.5]); } weak.sort(function (a, b) { return a[1] - b[1]; });
    var wl = E.WORLDS.map(function (w) { var ws = E.worldStars(p, w.id); return '<div class="pw"><span>' + wname(w.id) + '</span><i><em style="width:' + Math.round(ws.have / ws.max * 100) + '%;background:' + w.color + '"></em></i><b>' + ws.have + '/' + ws.max + '</b></div>'; }).join('');
    var days = []; for (var i = 6; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); var mm = p.minutes[E.dayKey(d)] || 0; days.push('<div class="day"><i style="height:' + Math.min(100, mm * 4) + '%"></i><small>' + d.toLocaleDateString(LW.lang() === 'en' ? 'en-US' : 'de-DE', { weekday: 'short' }).slice(0, 2) + '</small></div>'); }
    function tog(key, label) { return '<label class="row"><span>' + label + '</span><input type="checkbox" class="sw" data-set="' + key + '"' + (S.set[key] ? ' checked' : '') + '></label>'; }
    h('<div class="scr parents">' + topbar(t('pTitle'), 'home') + '<div class="pad">' +
      '<div class="ptabs">' + S.profiles.map(function (x) { return '<button class="ptab ' + (x.id === p.id ? 'sel' : '') + '" data-pp="' + x.id + '">' + em(x.avatar, 'pt-em') + esc(x.name) + '</button>'; }).join('') + '<button class="ptab add" data-go="newchild">+</button></div>' +
      '<h2 class="sec">' + t('pProgress') + '</h2><div class="stats"><div><b>' + fmtMin(p.minutes[E.dayKey()]) + '</b><small>' + t('pMinutes') + '</small></div><div><b>' + fmtMin(p.totalMs / 60000) + '</b><small>' + t('pTotal') + '</small></div>' +
      '<div><b>' + p.rounds + '</b><small>' + t('pRounds') + '</small></div><div><b>' + acc + ' %</b><small>' + t('pAcc') + '</small></div><div><b>' + E.totalStars(p.prog) + '</b><small>' + t('pStars') + '</small></div><div><b>' + E.masteredCount(p.facts) + '/100</b><small>' + t('pMastered') + '</small></div></div>' +
      '<div class="week">' + days.join('') + '</div>' + wl +
      '<h3 class="sec3">' + t('pWeak') + '</h3><p class="weak">' + (weak.length ? weak.slice(0, 8).map(function (w) { var f = w[0].split('x'); return '<span>' + f[0] + ' × ' + f[1] + '</span>'; }).join('') : t('pNone')) + '</p>' +
      '<h2 class="sec">' + t('pSettings') + '</h2><div class="list">' + tog('sound', t('pSound')) + tog('speech', t('pSpeech')) + tog('haptic', t('pHaptic')) +
      '<label class="row"><span>' + t('pLang') + '</span><select data-sel="lang"><option value="auto">' + t('langAuto') + '</option><option value="de">Deutsch</option><option value="en">English</option></select></label>' +
      '<label class="row"><span>' + t('pGoal') + '</span><select data-sel="goal">' + [1, 2, 3, 4, 5, 6, 8, 10].map(function (g) { return '<option value="' + g + '">' + g + '</option>'; }).join('') + '</select></label>' +
      '<label class="row"><span>' + t('pBreak') + '</span><select data-sel="breakMin"><option value="0">' + t('pBreakOff') + '</option>' + [10, 15, 20, 30, 45].map(function (g) { return '<option value="' + g + '">' + t('pBreakMin', g) + '</option>'; }).join('') + '</select></label>' +
      '<label class="row"><span>' + t('pUnlock') + '<small>' + t('pUnlockSub') + '</small></span><input type="checkbox" class="sw" data-unlock' + (p.unlockAll ? ' checked' : '') + '></label></div>' +
      '<h2 class="sec">' + t('pProfiles') + '</h2><div class="list"><button class="row btnrow" data-go="editchild">' + t('pEdit') + ' – ' + esc(p.name) + '</button><button class="row btnrow" data-act="resetP">' + t('pReset') + '</button><button class="row btnrow danger" data-act="delP">' + t('pDelete') + '</button></div>' +
      '<h2 class="sec">' + t('pPrivacy') + '</h2><p class="txt">' + t('pPrivacyText') + '</p>' +
      '<h2 class="sec">' + t('pAbout') + '</h2><p class="txt small">Lumi Lernwelt 1.0 · © Lumvero<br>' + t('pLicenses') + ': Twemoji (CC-BY 4.0, Twitter/X & contributors) · Nunito & Andika (SIL Open Font License) · Capacitor (MIT). ' +
      (LW.lang() === 'en' ? 'Ideas inspired by open-source learning apps (MIT): EduClock for Kids, Flashy, Addition Game, Multiplication Tables.' : 'Ideen inspiriert von Open-Source-Lern-Apps (MIT): EduClock for Kids, Flashy, Addition Game, Multiplication Tables.') + '</p></div></div>');
    qa('[data-sel]').forEach(function (s) { s.value = String(S.set[s.dataset.sel]); s.onchange = function () { var k = s.dataset.sel; S.set[k] = k === 'lang' ? s.value : +s.value; LW.save(); if (k === 'lang') render(); }; });
    qa('[data-set]').forEach(function (c) { c.onchange = function () { S.set[c.dataset.set] = c.checked; LW.save(); }; });
    q('[data-unlock]').onchange = function (e) { p.unlockAll = e.target.checked; LW.save(); };
    qa('[data-pp]').forEach(function (b) { b.onclick = function () { S.cur = b.dataset.pp; LW.save(); render(); }; });
    q('[data-act=delP]').onclick = function () { confirmBox(t('pDeleteQ', esc(p.name)), function () { S.profiles = S.profiles.filter(function (x) { return x.id !== p.id; }); S.cur = S.profiles[0] ? S.profiles[0].id : null; LW.save(); go({ n: S.profiles.length ? 'parents' : 'profiles' }); }); };
    q('[data-act=resetP]').onclick = function () { confirmBox(t('pResetQ', esc(p.name)), function () { p.prog = {}; p.facts = {}; p.stickers = []; p.badges = []; p.days = {}; p.minutes = {}; p.totalMs = 0; p.rounds = 0; p.right = 0; p.wrong = 0; p.bestStreak = 0; p.hat = 'none'; LW.save(); render(); }); };
  }
  function confirmBox(msg, yes) { modal('<div class="cf"><p>' + msg + '</p><div class="actions two"><button class="btn big ghost" data-act="closeModal">' + t('cancel') + '</button><button class="btn big danger" id="cfYes">' + t('del') + '</button></div></div>'); q('#cfYes').onclick = function () { closeModal(); yes(); }; }

  // ---------- Router ----------
  function render() {
    closeModal(); document.documentElement.lang = LW.lang(); document.title = t('appName');
    var n = route.n;
    if (!LW.S.profiles.length && n !== 'newchild') n = 'newchild';
    if (n === 'home') vHome(); else if (n === 'profiles') vProfiles(); else if (n === 'newchild') vNewChild(); else if (n === 'editchild') vNewChild(true);
    else if (n === 'world') vWorld(route.id); else if (n === 'play') vPlay(); else if (n === 'album') vAlbum(); else if (n === 'grid') vGrid(); else if (n === 'freeclock') vFreeClock(); else if (n === 'parents') vParents();
  }
  document.addEventListener('click', function (e) {
    LW.unlockAudio();
    var g = e.target.closest('[data-go]'); if (g && !g.disabled) { e.preventDefault(); LW.sfx('tap'); var v = g.dataset.go.split(':'); if (v[0] === 'world') go({ n: 'world', id: v[1] }); else if (v[0] === 'parents' || v[0] === 'editchild') go({ n: v[0] }); else go({ n: v[0] }); return; }
    var pf = e.target.closest('[data-pf]'); if (pf) { LW.S.cur = pf.dataset.pf; LW.save(); LW.sfx('pop'); go({ n: 'home' }); return; }
    var a = e.target.closest('[data-act]'); if (!a || a.disabled) return; var act = a.dataset.act;
    if (act === 'parents') gate(function () { go({ n: 'parents' }); });
    else if (act === 'training') { LW.sfx('tap'); startRound(E.makeTraining(ctxObj())); }
    else if (act === 'quit') { var w = play && play.r.world.id; play = null; go(w ? { n: 'world', id: w } : { n: 'home' }); }
    else if (act === 'say') { if (play) sayTask(cur()); }
    else if (act === 'hint') { showHint(cur()); a.remove(); }
    else if (act === 'next') { if (play && play.locked) { play.locked = false; nextTask(); } }
    else if (act === 'checkClock') { var st = q('#clockSet')._st; answer({ h: st.h, m: st.m }); }
    else if (act === 'closeModal') closeModal();
  });
  document.addEventListener('touchstart', function () { LW.unlockAudio(); }, { passive: true, once: true });

  LW.load();
  if (window.__LW_TEST_BOOT) window.__LW_TEST_BOOT(LW);
  render();
  window.LWapp = { go: go, render: render, startLevel: startLevel, get play() { return play; }, answer: answer };
})();
