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
  },
  {
    id: 'sirius',
    name: { ru: 'Сириус A+B (белый+карлик)', en: 'Sirius A+B' },
    skyTint: { dawn: '#c0e0ff', day: '#a8c8ff', dusk: '#80a0e0' },
    stars: [
      { color: '#f0f4ff', core: '#ffffff', mid: '#e0e8ff', edge: '#a0b8e0', glow: 'rgba(220,235,255,0.55)', glowMid: 'rgba(180,210,255,0.25)', glowEnd: 'rgba(100,140,220,0)', offset: -0.08, sizeMul: 1.20 },
      { color: '#ddeeff', core: '#ffffff', mid: '#c0d0ff', edge: '#8090c0', glow: 'rgba(200,220,255,0.40)', glowMid: 'rgba(160,180,240,0.18)', glowEnd: 'rgba(80,100,200,0)', offset: 0.10, sizeMul: 0.35 }
    ]
  },
  {
    id: 'betelgeuse',
    name: { ru: 'Бетельгейзе (красный сверхгигант)', en: 'Betelgeuse' },
    skyTint: { dawn: '#ff8040', day: '#ff9050', dusk: '#dd4010' },
    stars: [
      { color: '#ff6030', core: '#ffaa80', mid: '#ff4818', edge: '#cc2008', glow: 'rgba(255,80,30,0.55)', glowMid: 'rgba(220,50,15,0.28)', glowEnd: 'rgba(180,20,5,0)', offset: 0, sizeMul: 1.80, pulse: true }
    ]
  },
  {
    id: 'rigel',
    name: { ru: 'Ригель (голубой сверхгигант)', en: 'Rigel' },
    skyTint: { dawn: '#80a8ff', day: '#6088ee', dusk: '#4060cc' },
    stars: [
      { color: '#a0c8ff', core: '#ffffff', mid: '#80a8ff', edge: '#3050bb', glow: 'rgba(100,160,255,0.60)', glowMid: 'rgba(60,110,240,0.28)', glowEnd: 'rgba(20,50,180,0)', offset: 0, sizeMul: 1.60 }
    ]
  },
  {
    id: 'vega',
    name: { ru: 'Вега (бело-голубая)', en: 'Vega' },
    skyTint: { dawn: '#d0e0ff', day: '#b0d0ff', dusk: '#90b0dd' },
    stars: [
      { color: '#e8f0ff', core: '#ffffff', mid: '#c8d8ff', edge: '#8099cc', glow: 'rgba(200,225,255,0.52)', glowMid: 'rgba(160,190,250,0.24)', glowEnd: 'rgba(100,130,210,0)', offset: 0, sizeMul: 1.15 }
    ]
  },
  {
    id: 'antares',
    name: { ru: 'Антарес (красный сверхгигант)', en: 'Antares' },
    skyTint: { dawn: '#ff5030', day: '#ff6040', dusk: '#cc1808' },
    stars: [
      { color: '#ff4020', core: '#ffa070', mid: '#ff3010', edge: '#bb1000', glow: 'rgba(255,60,20,0.58)', glowMid: 'rgba(220,40,10,0.28)', glowEnd: 'rgba(170,15,5,0)', offset: 0, sizeMul: 1.75 }
    ]
  },
  {
    id: 'alphacentauri',
    name: { ru: 'Альфа Центавра A+B', en: 'Alpha Centauri A+B' },
    skyTint: { dawn: '#ffd8b0', day: '#ffe8c8', dusk: '#ffa060' },
    stars: [
      { color: '#fff0d0', core: '#ffffff', mid: '#ffd888', edge: '#ffc050', glow: 'rgba(255,230,150,0.48)', glowMid: 'rgba(255,200,100,0.22)', glowEnd: 'rgba(255,170,60,0)', offset: -0.08, sizeMul: 1.00 },
      { color: '#ffd080', core: '#fff5d0', mid: '#ffb840', edge: '#dd9020', glow: 'rgba(255,200,80,0.40)', glowMid: 'rgba(255,170,40,0.18)', glowEnd: 'rgba(220,140,20,0)', offset: 0.10, sizeMul: 0.85 }
    ]
  },
  {
    id: 'polaris',
    name: { ru: 'Полярная звезда', en: 'Polaris' },
    skyTint: { dawn: '#f0f4ff', day: '#e0e8ff', dusk: '#c0c8ee' },
    stars: [
      { color: '#fffaee', core: '#ffffff', mid: '#f0e8d0', edge: '#c0b890', glow: 'rgba(245,240,220,0.50)', glowMid: 'rgba(220,210,180,0.22)', glowEnd: 'rgba(180,170,130,0)', offset: 0, sizeMul: 0.95 }
    ]
  },
  {
    id: 'trinary',
    name: { ru: 'Тройная система', en: 'Trinary System' },
    skyTint: { dawn: '#d0a0ff', day: '#b0d0ff', dusk: '#ffa060' },
    stars: [
      { color: '#ffcc88', core: '#fff5e0', mid: '#ffaa50', edge: '#ff7020', glow: 'rgba(255,180,80,0.40)', glowMid: 'rgba(255,140,40,0.20)', glowEnd: 'rgba(255,100,20,0)', offset: -0.14, sizeMul: 0.70 },
      { color: '#aaccff', core: '#ddffff', mid: '#88bbff', edge: '#4477cc', glow: 'rgba(120,180,255,0.40)', glowMid: 'rgba(80,140,255,0.20)', glowEnd: 'rgba(40,80,200,0)', offset: 0.00, sizeMul: 0.60 },
      { color: '#ff88cc', core: '#ffd0e8', mid: '#ff60a0', edge: '#dd3070', glow: 'rgba(255,120,200,0.35)', glowMid: 'rgba(220,80,160,0.18)', glowEnd: 'rgba(180,40,100,0)', offset: 0.14, sizeMul: 0.55 }
    ]
  },
  {
    id: 'quadruple',
    name: { ru: 'Четверная система', en: 'Quadruple System' },
    skyTint: { dawn: '#c8a0e8', day: '#a8c0ff', dusk: '#e8a0c0' },
    stars: [
      { color: '#ffcc88', core: '#fff5e0', mid: '#ffaa50', edge: '#ff7020', glow: 'rgba(255,180,80,0.35)', glowMid: 'rgba(255,140,40,0.16)', glowEnd: 'rgba(255,100,20,0)', offset: -0.16, sizeMul: 0.55 },
      { color: '#aaccff', core: '#ddffff', mid: '#88bbff', edge: '#4477cc', glow: 'rgba(120,180,255,0.35)', glowMid: 'rgba(80,140,255,0.16)', glowEnd: 'rgba(40,80,200,0)', offset: -0.05, sizeMul: 0.50 },
      { color: '#ff88cc', core: '#ffd0e8', mid: '#ff60a0', edge: '#dd3070', glow: 'rgba(255,120,200,0.30)', glowMid: 'rgba(220,80,160,0.14)', glowEnd: 'rgba(180,40,100,0)', offset: 0.06, sizeMul: 0.45 },
      { color: '#88ffcc', core: '#d0ffe8', mid: '#50cc88', edge: '#20aa55', glow: 'rgba(80,255,180,0.30)', glowMid: 'rgba(40,200,120,0.14)', glowEnd: 'rgba(20,160,80,0)', offset: 0.16, sizeMul: 0.45 }
    ]
  },
  {
    id: 'flare',
    name: { ru: 'Звезда со вспышками (UV Ceti)', en: 'Flare Star (UV Ceti)' },
    skyTint: { dawn: '#ff5030', day: '#ff6040', dusk: '#dd2010' },
    stars: [
      { color: '#ff5030', core: '#ff8060', mid: '#ff3818', edge: '#bb1000', glow: 'rgba(255,60,30,0.55)', glowMid: 'rgba(220,40,15,0.28)', glowEnd: 'rgba(180,20,5,0)', offset: 0, sizeMul: 0.60, pulse: true }
    ]
  }
];
// Helper: convert hex color to "r, g, b" string
function _hexToRGB(hex){
  if(!hex || hex.length < 7) return '255,245,200';
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  return r+','+g+','+b;
}
// Patch star objects with RGB strings
(function(){
  if(!window.STAR_PRESETS) return;
  window.STAR_PRESETS.forEach(function(p){
    if(p.stars) p.stars.forEach(function(s){
      s.coreRGB = _hexToRGB(s.core);
      s.midRGB = _hexToRGB(s.mid);
      s.edgeRGB = _hexToRGB(s.edge);
    });
  });
})();
