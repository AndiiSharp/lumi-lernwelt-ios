// Lumi – das Maskottchen (eigene SVG-Zeichnung) + Uhr-Grafik
'use strict';
(function (root) {
  var LW = root.LW || (root.LW = {});
  var uid = 0;
  // mood: happy | cheer | think | oops | sleep ; hat: none|cap|party|crown|wizard|astro
  LW.lumi = function (mood, hat, cls) {
    var id = 'lu' + (++uid); mood = mood || 'happy';
    var eyes, mouth, arms;
    if (mood === 'sleep') eyes = '<path d="M70 92q10 8 20 0M110 92q10 8 20 0" stroke="#2B2250" stroke-width="5" fill="none" stroke-linecap="round"/>';
    else if (mood === 'cheer') eyes = '<path d="M68 96q12-16 24 0M108 96q12-16 24 0" stroke="#2B2250" stroke-width="6" fill="none" stroke-linecap="round"/>';
    else eyes = '<g class="lu-eyes"><ellipse cx="80" cy="92" rx="15" ry="17" fill="#fff"/><ellipse cx="120" cy="92" rx="15" ry="17" fill="#fff"/>' +
      '<circle cx="' + (mood === 'think' ? 84 : 82) + '" cy="' + (mood === 'think' ? 88 : 94) + '" r="8" fill="#2B2250"/><circle cx="' + (mood === 'think' ? 124 : 122) + '" cy="' + (mood === 'think' ? 88 : 94) + '" r="8" fill="#2B2250"/>' +
      '<circle cx="85" cy="90" r="3" fill="#fff"/><circle cx="125" cy="90" r="3" fill="#fff"/></g>';
    if (mood === 'oops') mouth = '<path d="M90 126q10-7 20 0" stroke="#2B2250" stroke-width="5" fill="none" stroke-linecap="round"/>';
    else if (mood === 'think') mouth = '<path d="M92 126h16" stroke="#2B2250" stroke-width="5" stroke-linecap="round"/>';
    else if (mood === 'sleep') mouth = '<ellipse cx="100" cy="126" rx="6" ry="5" fill="#2B2250"/>';
    else mouth = '<path d="M86 118q14 18 28 0z" fill="#2B2250"/><path d="M93 126q7 5 14 0" fill="#FF7BA5"/>';
    if (mood === 'cheer') arms = '<path d="M42 118q-22-22-16-48" stroke="url(#' + id + 'b)" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M158 118q22-22 16-48" stroke="url(#' + id + 'b)" stroke-width="16" fill="none" stroke-linecap="round"/>';
    else arms = '<path d="M40 122q-14 16-6 34" stroke="url(#' + id + 'b)" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M160 122q14 16 6 34" stroke="url(#' + id + 'b)" stroke-width="16" fill="none" stroke-linecap="round"/>';
    var hats = {
      cap: '<path d="M58 52q42-40 84 0z" fill="#FF4F8B"/><path d="M134 50q26 2 34 12q-20 4-38-4z" fill="#E23A74"/><circle cx="100" cy="22" r="6" fill="#FFD43B"/>',
      party: '<path d="M78 50l22-58l22 58z" fill="#FFD43B"/><path d="M84 34l32 6M90 18l20 4" stroke="#FF4F8B" stroke-width="5"/><circle cx="100" cy="-10" r="8" fill="#14B8A6"/>',
      crown: '<path d="M66 54l-6-38l22 18l18-28l18 28l22-18l-6 38z" fill="#FFC21A" stroke="#E0A000" stroke-width="3"/><circle cx="100" cy="40" r="6" fill="#FF4F8B"/><circle cx="78" cy="44" r="4" fill="#14B8A6"/><circle cx="122" cy="44" r="4" fill="#14B8A6"/>',
      wizard: '<path d="M56 56q44-12 88 0l-30-74q-8 6-14 4z" fill="#3B2A8F"/><path d="M50 58q50-16 100 0" stroke="#5B47C8" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M96 10l3 7l7 1l-5 5l1 7l-6-4l-6 4l1-7l-5-5l7-1z" fill="#FFD43B"/>',
      astro: '<circle cx="100" cy="98" r="86" fill="#BFE9FF" opacity=".28" stroke="#fff" stroke-width="5"/><path d="M60 26q40-26 80 0" stroke="#fff" stroke-width="5" fill="none" opacity=".8"/>'
    };
    return '<svg class="lumi ' + (cls || '') + ' mood-' + mood + '" viewBox="0 -24 200 230" aria-hidden="true">' +
      '<defs><radialGradient id="' + id + 'a" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#B9A6FF"/><stop offset=".6" stop-color="#8A6CFF"/><stop offset="1" stop-color="#6A4BE8"/></radialGradient>' +
      '<linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A6CFF"/><stop offset="1" stop-color="#6A4BE8"/></linearGradient></defs>' +
      '<ellipse cx="100" cy="196" rx="54" ry="9" fill="#2B2250" opacity=".12"/>' + arms +
      '<path d="M62 48l-6-30l26 18zM138 48l6-30l-26 18z" fill="#6A4BE8"/>' +
      '<path d="M100 32c46 0 72 34 72 80c0 48-32 80-72 80s-72-32-72-80c0-46 26-80 72-80z" fill="url(#' + id + 'a)"/>' +
      '<ellipse cx="100" cy="150" rx="40" ry="34" fill="#F3EEFF" opacity=".9"/>' +
      '<path d="M84 150q8 6 16 0q8 6 16 0M88 166q6 5 12 0q6 5 12 0" stroke="#C9BCFF" stroke-width="3" fill="none"/>' +
      '<circle cx="64" cy="114" r="9" fill="#FF8FB4" opacity=".55"/><circle cx="136" cy="114" r="9" fill="#FF8FB4" opacity=".55"/>' +
      eyes + '<path d="M94 106l6 8l6-8z" fill="#FFB020"/>' + mouth +
      '<path d="M78 190q-4 8 6 8h12M122 190q4 8-6 8h-12" stroke="#FFB020" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      (hats[hat] || '') + '</svg>';
  };

  // Uhr: farbige Stunden (Idee EduClock, MIT), Minuten aussen; opts: {h,m,size,minutes:true,interactive}
  var HCOL = ['#FF6B6B', '#FF8E3C', '#FFC21A', '#9BD33A', '#2BC48A', '#14B8A6', '#22A7F0', '#4C7DFF', '#7C5CFF', '#B35CFF', '#FF5CC8', '#FF4F8B'];
  LW.clockSVG = function (o) {
    var s = '<svg class="clock" viewBox="0 0 300 300" role="img"><circle cx="150" cy="150" r="146" fill="#fff" stroke="#2B2250" stroke-width="6"/>';
    var i, a, x, y;
    for (i = 0; i < 60; i++) { a = i * 6 * Math.PI / 180; var r1 = i % 5 ? 130 : 124; s += '<line x1="' + (150 + Math.sin(a) * r1).toFixed(1) + '" y1="' + (150 - Math.cos(a) * r1).toFixed(1) + '" x2="' + (150 + Math.sin(a) * 138).toFixed(1) + '" y2="' + (150 - Math.cos(a) * 138).toFixed(1) + '" stroke="#2B2250" stroke-width="' + (i % 5 ? 2 : 4) + '" stroke-linecap="round" opacity="' + (i % 5 ? .45 : .9) + '"/>'; }
    if (o.minutes !== false) for (i = 0; i < 12; i++) { a = i * 30 * Math.PI / 180; x = 150 + Math.sin(a) * 112; y = 150 - Math.cos(a) * 112; s += '<text x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '" class="cl-min">' + (i * 5 < 10 ? '0' : '') + i * 5 + '</text>'; }
    for (i = 1; i <= 12; i++) { a = i * 30 * Math.PI / 180; x = 150 + Math.sin(a) * 84; y = 150 - Math.cos(a) * 84; s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="19" fill="' + HCOL[i - 1] + '" opacity=".18"/><text x="' + x.toFixed(1) + '" y="' + (y + 10).toFixed(1) + '" class="cl-h" fill="' + HCOL[i - 1] + '">' + i + '</text>'; }
    var hd = ((o.h % 12) + o.m / 60) * 30, md = o.m * 6;
    var hc = HCOL[((o.h % 12) || 12) - 1];
    s += '<g class="hand-h" style="transform:rotate(' + hd + 'deg)"><line x1="150" y1="162" x2="150" y2="88" stroke="' + hc + '" stroke-width="13" stroke-linecap="round"/>' + (o.interactive ? '<circle cx="150" cy="92" r="22" fill="transparent" class="grab" data-hand="h"/>' : '') + '</g>';
    s += '<g class="hand-m" style="transform:rotate(' + md + 'deg)"><line x1="150" y1="166" x2="150" y2="42" stroke="#2B2250" stroke-width="8" stroke-linecap="round"/>' + (o.interactive ? '<circle cx="150" cy="48" r="24" fill="transparent" class="grab" data-hand="m"/>' : '') + '</g>';
    s += '<circle cx="150" cy="150" r="10" fill="#2B2250"/><circle cx="150" cy="150" r="4" fill="#FFC21A"/></svg>';
    return s;
  };
  LW.HCOL = HCOL;
})(typeof window !== 'undefined' ? window : globalThis);
