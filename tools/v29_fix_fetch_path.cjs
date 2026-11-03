const fs = require('fs');
const p = '.04-Src/js/theme_engine.js';
let s = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
if (!s.includes(".04-Src/data/themes/")) {
  s = s.replace("fetch('04-Src/data/themes/' + id + '.json')", "fetch('.04-Src/data/themes/' + id + '.json')");
  fs.writeFileSync(p, s);
  console.log('patched fetch path');
} else console.log('already patched');
console.log('linecount', s.split(/\n/).length);
