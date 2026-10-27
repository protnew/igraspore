// v21: tally из allscreens.json (с UNS-когнатами и locked-фил пометками)
const d = require(process.argv[2] || 'C:/Users/Space/agent-transfer/igraspore-v21/cycle3/allscreens.json');
const SCREENS = ['menu','help','settings','wiki','intro','game','pause','death','demo','aquarium'];
const RED = ['crash','overlap','lowContrast','emptyPlaque','untranslated'];
const rows = []; const cnt = { GREEN:0, YELLOW:0, RED:0 };
for (const k of Object.keys(d)) {
  const row = [k];
  for (const st of SCREENS) {
    const s = d[k][st];
    const light = !s ? 'RED' : (s.F || []).some(f => RED.includes(f[0])) ? 'RED' : (s.F || []).length ? 'YELLOW' : 'GREEN';
    row.push(light); cnt[light]++;
  }
  rows.push(row);
}
console.log(JSON.stringify(cnt));
const y = rows.filter(r => r.slice(1).includes('YELLOW'));
if (y.length) console.log('YELLOW rows: ' + y.map(r => r[0]).join(', '));
