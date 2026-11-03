const fs = require('fs');
const path = require('path');
const dir = '.04-Src/data/themes';
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
  const p = path.join(dir, f);
  let s = fs.readFileSync(p);
  if (s[0] === 0xEF && s[1] === 0xBB && s[2] === 0xBF) s = s.slice(3);
  const txt = s.toString('utf8').replace(/^\uFEFF/, '');
  JSON.parse(txt); // validate
  fs.writeFileSync(p, txt, { encoding: 'utf8' });
  console.log('fixed', f, 'starts', JSON.stringify(txt.slice(0,20)));
}
// also strip BOM from js files that may have it
for (const rel of ['.04-Src/js/theme_engine.js','.04-Src/js/theme_analytics.js','style-themes-v29.css','.04-Src/07-QA-and-Testing/vitest/theme_engine.test.js']) {
  let s = fs.readFileSync(rel);
  if (s[0] === 0xEF && s[1] === 0xBB && s[2] === 0xBF) {
    fs.writeFileSync(rel, s.slice(3));
    console.log('bom stripped', rel);
  }
}
