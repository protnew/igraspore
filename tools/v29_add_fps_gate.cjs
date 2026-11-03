const fs = require('fs');
const p = '.04-Src/js/theme_engine.js';
let s = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
if (s.includes('startFpsGate')) { console.log('already has fps gate'); process.exit(0); }
const inject = `
  var _fpsLowStreak = 0;
  function startFpsGate() {
    if (w.__igsThemeFpsGate) return;
    w.__igsThemeFpsGate = true;
    var last = performance.now();
    function tick(now) {
      var dt = now - last; last = now;
      var fps = 1000 / Math.max(dt, 0.001);
      var th = getTheme(currentPond()) || {};
      var budget = (th.fpsBudget && th.fpsBudget.target) || 30;
      if (fps < budget) _fpsLowStreak++; else _fpsLowStreak = 0;
      if (_fpsLowStreak >= 180) { // ~3s at 60fps samples; at 20fps ~9s wall — also check wall
        w.__igsThemePondShader = Object.assign({}, th.shader || {}, { fallback: 'low', bloom: 0, caustic: 0 });
        _fpsLowStreak = 0;
        try { if (typeof toast === 'function') toast((typeof tt === 'function' ? tt('theme.fpsFallback') : 'Theme FX reduced')); } catch (e) {}
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
`;
// insert before initThemes
if (!s.includes('function initThemes')) { console.error('no initThemes'); process.exit(1); }
s = s.replace('function initThemes()', inject + '\n  function initThemes()');
s = s.replace(
  'injectPondSwitcher(); applyThemePond(currentPond()); applyThemeBestiary(currentBestiary()); }); }',
  'injectPondSwitcher(); applyThemePond(currentPond()); applyThemeBestiary(currentBestiary()); startFpsGate(); }); }'
);
s = s.replace(
  'initThemes:initThemes, WAVE1:WAVE1',
  'initThemes:initThemes, startFpsGate:startFpsGate, WAVE1:WAVE1'
);
fs.writeFileSync(p, s);
console.log('lines', s.split(/\n/).length, 'hasGate', s.includes('startFpsGate'));
