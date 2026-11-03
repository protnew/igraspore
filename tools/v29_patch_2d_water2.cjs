const fs = require('fs');
const p = '.04-Src/js/render_effects.js';
let s = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
if (s.includes('rgbTop')) { console.log('already'); process.exit(0); }
const re = /  \/\/ Natural pond colors ALWAYS \(swiss mode only changes organism drawing, not world\)\r?\n  var lt=lightTop, lm=lightMid, lb=lightBot;\r?\n  grad\.addColorStop\(0, 'rgb\('\+Math\.round\(12\+lt\*28\)\+','\+Math\.round\(70\+lt\*65\)\+','\+Math\.round\(85\+lt\*55\)\+'\)'\);\r?\n  grad\.addColorStop\(0\.12, 'rgb\('\+Math\.round\(10\+lt\*20\)\+','\+Math\.round\(55\+lt\*48\)\+','\+Math\.round\(75\+lt\*50\)\+'\)'\);\r?\n  grad\.addColorStop\(0\.45, 'rgb\('\+Math\.round\(8\+lm\*12\)\+','\+Math\.round\(30\+lm\*28\)\+','\+Math\.round\(55\+lm\*35\)\+'\)'\);\r?\n  grad\.addColorStop\(0\.75, 'rgb\('\+Math\.round\(10\+lb\*8\)\+','\+Math\.round\(22\+lb\*14\)\+','\+Math\.round\(40\+lb\*22\)\+'\)'\);\r?\n  grad\.addColorStop\(1, 'rgb\('\+Math\.round\(12\+lb\*6\)\+','\+Math\.round\(18\+lb\*8\)\+','\+Math\.round\(22\+lb\*10\)\+'\)'\);/;
const repl = `  // Theme-aware pond colors (2D); swiss organisms unchanged
  var lt=lightTop, lm=lightMid, lb=lightBot;
  var _sh=(typeof window!=='undefined' && window.__igsThemePondShader) ? window.__igsThemePondShader : null;
  var _rt=_sh&&_sh.rgbTop ? _sh.rgbTop : [12,70,85];
  var _rm=_sh&&_sh.rgbMid ? _sh.rgbMid : [8,30,55];
  var _rb=_sh&&_sh.rgbBot ? _sh.rgbBot : [12,18,22];
  function _tc(base, light, g0,g1,g2){ return Math.round(clamp(base[0]+light*g0,0,255))+','+Math.round(clamp(base[1]+light*g1,0,255))+','+Math.round(clamp(base[2]+light*g2,0,255)); }
  grad.addColorStop(0, 'rgb('+_tc(_rt,lt,28,65,55)+')');
  grad.addColorStop(0.12, 'rgb('+_tc(_rt,lt,20,48,50)+')');
  grad.addColorStop(0.45, 'rgb('+_tc(_rm,lm,12,28,35)+')');
  grad.addColorStop(0.75, 'rgb('+_tc(_rb,lb,8,14,22)+')');
  grad.addColorStop(1, 'rgb('+_tc(_rb,lb,6,8,10)+')');`;
if (!re.test(s)) { console.error('no match'); process.exit(1); }
s = s.replace(re, repl);
fs.writeFileSync(p, s);
console.log('patched', s.includes('rgbTop'));
