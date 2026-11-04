/* theme_micro.js — v5.4 decorative micro-life layer for v5 pond styles.
   Purely visual: tiny drifting organisms + particles drawn over the clean bg, behind real cells.
   Never touches simulation state. Cost: ~1 drawImage per particle (pre-baked sprites). */
(function (w) {
  "use strict";
  var SH = ["rod", "coccus", "spiral", "slipper", "oval", "diplococci", "bell", "comma", "filament", "rotifer", "colony", "flatworm"];
  var CATS = ["producer", "producer", "consumer1", "consumer2", "decomposer", "consumer3"];
  var DOT = { neon: "0,240,255", phase: "235,255,250", engr: "40,24,12", cyber: "0,255,220", glass: "255,255,255", haeckel: "90,64,40" };
  var DOTA = { neon: 0.55, phase: 0.45, engr: 0.5, cyber: 0.5, glass: 0.7, haeckel: 0.4 };
  var MA = { neon: 0.6, phase: 0.5, engr: 0.62, cyber: 0.6, glass: 0.55, haeckel: 0.6 };
  var YR = { neon: [0.05, 0.95], phase: [0.05, 0.95], engr: [0.22, 0.8], cyber: [0.3, 0.92], glass: [0.4, 0.95], haeckel: [0.24, 0.95] };
  var state = { st: null, sprites: [], parts: [], dots: [], n: 0 };
  function rng(seed) { return function () { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }; }
  function build(st, wide) {
    var D = w.igsNeonDraw; if (!D) return;
    var r = rng(st.length * 7919 + 17), sprites = [], i;
    for (i = 0; i < 24; i++) {
      var sp = { id: "micro-" + st + "-" + i, cat: CATS[i % CATS.length] };
      var col = D.colOf({ sp: sp }, st);
      sprites.push(D.bake(SH[i % SH.length], col, 72, st, i % 4));
    }
    var N = wide ? 150 : 80, parts = [];
    for (i = 0; i < N; i++) {
      var d = 0.35 + r() * 0.65;
      parts.push({ x: r(), y: (YR[st] || YR.neon)[0] + r() * ((YR[st] || YR.neon)[1] - (YR[st] || YR.neon)[0]), d: d, s: (wide ? 20 : 13) + r() * (wide ? 36 : 20) * d, k: (r() * sprites.length) | 0,
        a: r() * 6.283, sp: 0.15 + r() * 0.5, rot: r() * 6.283, vr: (r() - 0.5) * 0.4 });
    }
    var dots = [];
    for (i = 0; i < (wide ? 220 : 120); i++) dots.push({ x: r(), y: (YR[st] || YR.neon)[0] + r() * ((YR[st] || YR.neon)[1] - (YR[st] || YR.neon)[0]), r: 0.6 + r() * 1.8, ph: r() * 6.283 });
    state = { st: st, sprites: sprites, parts: parts, dots: dots, wide: wide };
  }
  function draw(ctx, cw, ch, cam, t) {
    var D = w.igsNeonDraw; if (!D) return;
    var st = D.styleNow(), wide = cw > 900;
    if (state.st !== st || state.wide !== wide) build(st, wide);
    if (!state.sprites.length) return;
    t = (t || 0) / 1000;
    var cx = (cam && cam.x) || 0, cy = (cam && cam.y) || 0, i, p;
    ctx.save();
    var dc = DOT[st] || DOT.neon, da = DOTA[st] || 0.5;
    for (i = 0; i < state.dots.length; i++) {
      p = state.dots[i];
      var dx = ((p.x * cw - cx * 0.02 + t * 4) % cw + cw) % cw, dy = p.y * ch + Math.sin(t * 0.5 + p.ph) * 6;
      ctx.fillStyle = "rgba(" + dc + "," + (da * (0.5 + 0.5 * Math.sin(t + p.ph))).toFixed(2) + ")";
      ctx.fillRect(dx, dy, p.r, p.r);
    }
    var ma = MA[st] || 0.6;
    for (i = 0; i < state.parts.length; i++) {
      p = state.parts[i];
      var px = ((p.x * cw - cx * 0.06 * p.d + Math.cos(t * p.sp + p.a) * 14 + t * 6 * p.sp) % (cw + 60) + cw + 60) % (cw + 60) - 30;
      var py = p.y * ch - Math.max(-30, Math.min(30, cy * 0.01 * p.d)) + Math.sin(t * p.sp * 0.8 + p.a) * 10;
      ctx.globalAlpha = ma * (0.45 + 0.55 * p.d);
      ctx.setTransform(1, 0, 0, 1, px, py); ctx.rotate(p.rot + t * p.vr);
      ctx.drawImage(state.sprites[p.k], -p.s / 2, -p.s / 2, p.s, p.s);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore();
  }
  w.igsMicro = { draw: draw };
})(window);
