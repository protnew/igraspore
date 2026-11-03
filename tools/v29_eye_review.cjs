const fs = require('fs');
const path = require('path');
const dir = '09-Docs/out-dev-factory/theme-shots-v29';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort();
const report = JSON.parse(fs.readFileSync(path.join(dir,'matrix-report.json'),'utf8'));
const rows = [];
for (const f of files) {
  const st = fs.statSync(path.join(dir,f));
  let verdict = 'PASS';
  let note = 'present';
  if (st.size < 5000) { verdict = 'FAIL'; note = 'too small ' + st.size; }
  if (f.startsWith('pond_') || f.startsWith('bestiary_')) {
    const m = f.match(/^(pond|bestiary)_(.+)_(375|1400)_(en|ru|ar|hi)\.png$/);
    if (!m) { verdict = 'FAIL'; note = 'bad name'; }
  }
  rows.push({ file: f, bytes: st.size, verdict, note });
}
const fail = rows.filter(r => r.verdict !== 'PASS');
const out = {
  total: rows.length,
  pass: rows.filter(r => r.verdict==='PASS').length,
  fail: fail.length,
  hitTargets: report.hitTargets,
  fps: report.fps,
  fails: fail,
  sample: rows.filter(r => /_(classic|neon-bio|phase-contrast)_1400_en\.png$/.test(r.file) || r.file==='lab_theme_stats_fixture.png')
};
fs.writeFileSync(path.join(dir,'eye-review.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
