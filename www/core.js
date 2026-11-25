// Lumi Lernwelt – Speicher, Klang, Vorlesen, Vibration, Konfetti
'use strict';
(function (root) {
  var LW = root.LW || (root.LW = {});
  var KEY = 'lumi.v1';
  var S = LW.S = null;

  // ---------- Speicher (nur auf dem Geraet) ----------
  function defaults() { return { v: 1, profiles: [], cur: null, set: { sound: true, speech: true, haptic: true, lang: 'auto', goal: 3, breakMin: 20 } }; }
  LW.load = function () {
    var d = null; try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { d = null; }
    S = LW.S = d && d.v === 1 ? d : defaults();
    var def = defaults().set; for (var k in def) if (S.set[k] === undefined) S.set[k] = def[k];
    return S;
  };
  LW.save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  LW.newProfile = function (name, avatar, grade) {
    var p = { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), name: name, avatar: avatar, grade: grade, created: Date.now(), prog: {}, facts: {}, stickers: [], badges: [],
      days: {}, minutes: {}, totalMs: 0, rounds: 0, right: 0, wrong: 0, bestStreak: 0, unlockAll: grade >= 3, hat: 'none', stickerOrder: LW.E.shuffle(LW.STICKERS.map(function (_, i) { return i; })) };
    S.profiles.push(p); S.cur = p.id; LW.save(); return p;
  };
  LW.prof = function () { for (var i = 0; i < S.profiles.length; i++) if (S.profiles[i].id === S.cur) return S.profiles[i]; return S.profiles[0] || null; };

  // ---------- Sprache ----------
  LW.lang = function () { var l = S && S.set.lang !== 'auto' ? S.set.lang : ((navigator.language || 'de').toLowerCase().indexOf('de') === 0 ? 'de' : 'en'); return l === 'en' ? 'en' : 'de'; };
  LW.t = function (k) { var T = LW.TXT[LW.lang()]; var s = T[k]; if (s === undefined) s = LW.TXT.de[k]; if (s === undefined) return k; if (typeof s !== 'string') return s;
    for (var i = 1; i < arguments.length; i++) s = s.split('%' + i).join(arguments[i]); return s; };
  LW.tk = function (arr) { return arr ? LW.t.apply(null, arr) : ''; };

  // ---------- Klang (eigene Synthese, keine Dateien) ----------
  var ac = null;
  function ctx() { if (!ac) { try { ac = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { ac = null; } } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
  function tone(f, t0, d, type, vol) { var a = ctx(); if (!a) return; var o = a.createOscillator(), g = a.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, a.currentTime + t0);
    g.gain.setValueAtTime(0.0001, a.currentTime + t0); g.gain.exponentialRampToValueAtTime(vol || 0.18, a.currentTime + t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + d);
    o.connect(g); g.connect(a.destination); o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + d + 0.05); }
  LW.sfx = function (k) {
    if (!S || !S.set.sound) return;
    if (k === 'tap') tone(660, 0, 0.06, 'triangle', 0.08);
    else if (k === 'ok') { tone(784, 0, 0.14, 'sine'); tone(1175, 0.09, 0.22, 'sine'); }
    else if (k === 'no') { tone(300, 0, 0.16, 'triangle', 0.12); tone(250, 0.12, 0.2, 'triangle', 0.1); }
    else if (k === 'star') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.09, 0.2, 'sine', 0.14); }); }
    else if (k === 'win') { [523, 659, 784, 1047, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * 0.11, 0.26, i > 4 ? 'triangle' : 'sine', 0.15); }); }
    else if (k === 'pop') tone(880, 0, 0.08, 'sine', 0.1);
    else if (k === 'combo') { tone(988, 0, 0.1, 'square', 0.05); tone(1319, 0.08, 0.18, 'square', 0.05); }
  };
  LW.unlockAudio = function () { ctx(); try { if (root.speechSynthesis) root.speechSynthesis.getVoices(); } catch (e) { } };

  // ---------- Vorlesen (Sprachausgabe des Geraets, offline) ----------
  var voice = null;
  function pickVoice() { try { var l = LW.lang() === 'en' ? 'en' : 'de'; var vs = root.speechSynthesis.getVoices().filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(l) === 0; });
    voice = vs.filter(function (v) { return /premium|enhanced|anna|helena|samantha/i.test(v.name); })[0] || vs[0] || null; } catch (e) { voice = null; } }
  LW.say = function (text, force) {
    if (!text || !S || (!S.set.speech && !force) || !root.speechSynthesis) return;
    try { root.speechSynthesis.cancel(); pickVoice(); var u = new SpeechSynthesisUtterance(String(text).replace(/▢/g, '')); u.lang = LW.lang() === 'en' ? 'en-US' : 'de-DE'; if (voice) u.voice = voice; u.rate = 0.92; u.pitch = 1.08; root.speechSynthesis.speak(u); } catch (e) { }
  };
  LW.hush = function () { try { root.speechSynthesis && root.speechSynthesis.cancel(); } catch (e) { } };

  // ---------- Vibration ----------
  LW.buzz = function (k) {
    if (!S || !S.set.haptic) return; var H = root.Capacitor && root.Capacitor.Plugins && root.Capacitor.Plugins.Haptics; if (!H) return;
    try { if (k === 'ok') H.notification({ type: 'SUCCESS' }); else if (k === 'no') H.notification({ type: 'WARNING' }); else H.impact({ style: k === 'heavy' ? 'HEAVY' : 'LIGHT' }); } catch (e) { }
  };

  // ---------- Konfetti ----------
  var cv = null, parts = [], raf = 0;
  LW.confetti = function (n, x, y) {
    if (!cv) { cv = document.createElement('canvas'); cv.id = 'confetti'; document.body.appendChild(cv); }
    var dpr = root.devicePixelRatio || 1; cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cols = ['#7C5CFF', '#FF8A3D', '#14B8A6', '#FF4F8B', '#FFC21A', '#22A7F0'];
    x = x === undefined ? innerWidth / 2 : x; y = y === undefined ? innerHeight / 3 : y;
    for (var i = 0; i < (n || 80); i++) { var a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9; parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, r: 4 + Math.random() * 5, c: cols[i % cols.length], rot: Math.random() * 6, vr: Math.random() * .4 - .2, life: 90 + Math.random() * 40, sq: Math.random() < .5 }); }
    if (!raf) { var step = function () { c.clearRect(0, 0, innerWidth, innerHeight); parts = parts.filter(function (p) { return p.life-- > 0 && p.y < innerHeight + 40; });
      parts.forEach(function (p) { p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.c; c.globalAlpha = Math.min(1, p.life / 30);
        if (p.sq) c.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { c.beginPath(); c.arc(0, 0, p.r * .7, 0, 7); c.fill(); } c.restore(); });
      if (parts.length) raf = requestAnimationFrame(step); else { raf = 0; c.clearRect(0, 0, innerWidth, innerHeight); } }; raf = requestAnimationFrame(step); }
  };

  // Emoji als einheitliche Grafik (Twemoji); Rueckfall: Systemzeichen
  LW.em = function (e, cls) { var svg = LW.EMOJI && LW.EMOJI[e]; if (!svg) return '<span class="emo ' + (cls || '') + '">' + e + '</span>';
    return '<img class="emo ' + (cls || '') + '" alt="" draggable="false" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '">'; };
  LW.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
})(typeof window !== 'undefined' ? window : globalThis);
