// stars.js — Star system selector + binary star rendering
window.STAR_PRESETS = [
  {
    id: 'sol',
    name: { ru: 'Солнце (G-карлик)', en: 'Sun (G-dwarf)' },
    skyTint: { dawn: '#ffd8a8', day: '#b8dcf0', dusk: '#ff9020' },
    stars: [
      { color: '#fffef5', core: '#fffef5', mid: '#ffd078', edge: '#ffc060', glow: 'rgba(255,240,200,0.45)', glowMid: 'rgba(255,220,150,0.22)', glowEnd: 'rgba(255,180,80,0)', offset: 0, sizeMul: 1.0 }
    ]
  },
  {
    id: 'binary',
    name: { ru: 'Двойная: Синяя + Оранжевая', en: 'Binary: Blue + Orange' },
    skyTint: { dawn: '#c0a0ff', day: '#a0c8ff', dusk: '#ff8040' },
    stars: [
      { color: '#aaccff', core: '#ddffff', mid: '#88bbff', edge: '#4477cc', glow: 'rgba(120,180,255,0.50)', glowMid: 'rgba(80,140,255,0.25)', glowEnd: 'rgba(40,80,200,0)', offset: -0.12, sizeMul: 0.85 },
      { color: '#ffcc88', core: '#fff5e0', mid: '#ffaa50', edge: '#ff7020', glow: 'rgba(255,180,80,0.45)', glowMid: 'rgba(255,140,40,0.22)', glowEnd: 'rgba(255,100,20,0)', offset: 0.12, sizeMul: 0.75 }
    ]
  },
  {
    id: 'dwarf',
    name: { ru: 'Красный карлик (M)', en: 'Red Dwarf (M-type)' },
    skyTint: { dawn: '#ff6030', day: '#ff8050', dusk: '#cc2010' },
    stars: [
      { color: '#ff6040', core: '#ffaa80', mid: '#ff5020', edge: '#cc1810', glow: 'rgba(255,80,40,0.50)', glowMid: 'rgba(220,60,30,0.25)', glowEnd: 'rgba(180,30,10,0)', offset: 0, sizeMul: 0.70 }
    ]
  },
  {
    id: 'giant',
    name: { ru: 'Оранжевый гигант (K)', en: 'Orange Giant (K-type)' },
    skyTint: { dawn: '#ffaa40', day: '#ffcc60', dusk: '#ff8020' },
    stars: [
      { color: '#ffcc40', core: '#fff8d0', mid: '#ffb030', edge: '#ff8010', glow: 'rgba(255,200,60,0.50)', glowMid: 'rgba(255,170,30,0.25)', glowEnd: 'rgba(255,120,10,0)', offset: 0, sizeMul: 1.35 }
    ]
  },
  {
    id: 'pulsar',
    name: { ru: 'Нейтронная звезда', en: 'Neutron Star' },
    skyTint: { dawn: '#a0d0ff', day: '#80c0ff', dusk: '#6080ff' },
    stars: [
      { color: '#eef8ff', core: '#ffffff', mid: '#aaddff', edge: '#4488ff', glow: 'rgba(180,220,255,0.55)', glowMid: 'rgba(100,160,255,0.28)', glowEnd: 'rgba(40,80,200,0)', offset: 0, sizeMul: 0.45, pulse: true }
    ]
  },
  {
    id: 'twin',
    name: { ru: 'Близнецы (2 желтых)', en: 'Twin Suns' },
    skyTint: { dawn: '#ffd8a8', day: '#c8e0ff', dusk: '#ff9020' },
    stars: [
      { color: '#fff8d0', core: '#ffffff', mid: '#ffe078', edge: '#ffc850', glow: 'rgba(255,240,180,0.42)', glowMid: 'rgba(255,220,140,0.20)', glowEnd: 'rgba(255,180,80,0)', offset: -0.10, sizeMul: 0.80 },
      { color: '#fff0a0', core: '#ffffe8', mid: '#ffd860', edge: '#ffb040', glow: 'rgba(255,235,140,0.42)', glowMid: 'rgba(255,210,100,0.20)', glowEnd: 'rgba(255,170,60,0)', offset: 0.10, sizeMul: 0.80 }
    ]
  }
];

window.currentStarId = 'sol';

window.getStarPreset = function() {
  var id = window.currentStarId || 'sol';
  for (var i = 0; i < window.STAR_PRESETS.length; i++) {
    if (window.STAR_PRESETS[i].id === id) return window.STAR_PRESETS[i];
  }
  return window.STAR_PRESETS[0];
};

window.setStarSystem = function(id) {
  window.currentStarId = id;
  try { localStorage.setItem('igraspore_star', id); } catch(e) {}
};

try {
  var saved = localStorage.getItem('igraspore_star');
  if (saved) window.currentStarId = saved;
} catch(e) {}

window.renderStarsCustom = function(sun, fade, dl) {
  var preset = window.getStarPreset();
  var stars = preset.stars;
  var sx = (typeof sun.scrX === 'number') ? sun.scrX : (cv.width * 0.5);
  var baseR = 14 + (sun.elev || 0.7) * 22;
  var waterScreenY = (0 - cam.y) * zoom + cv.height / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, cv.width, Math.max(0, waterScreenY));
  ctx.clip();
  ctx.globalAlpha = fade * Math.min(1, dl + 0.25);

  for (var si = 0; si < stars.length; si++) {
    var st = stars[si];
    var r = baseR * (st.sizeMul || 1.0);
    if (st.pulse) { r *= 0.8 + 0.4 * Math.sin(fc * 0.15); }
    var stx = sx + st.offset * cv.width * 0.15;
    var sty = Math.max(r + 4, waterScreenY * (0.12 + (1 - (sun.elev || 0.7)) * 0.18));
    if (sty + r > waterScreenY - 2) sty = waterScreenY - r - 2;
    if (sty < r * 0.3) continue;

    var g1 = ctx.createRadialGradient(stx, sty, 0, stx, sty, r * 4.5);
    g1.addColorStop(0, st.glow);
    g1.addColorStop(0.25, st.glowMid);
    g1.addColorStop(0.55, st.glowEnd);
    g1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.arc(stx, sty, r * 4.5, 0, Math.PI * 2);
    ctx.fill();

    var g2 = ctx.createRadialGradient(stx - r * 0.2, sty - r * 0.2, 0, stx, sty, r);
    g2.addColorStop(0, st.core);
    g2.addColorStop(0.3, st.mid);
    g2.addColorStop(0.7, st.edge);
    g2.addColorStop(1, st.edge);
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(stx, sty, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};
