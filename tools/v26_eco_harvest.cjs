// v26 задача 7: сводка по эко-прогону из стриминговых jsonl (по 5 сидам в отдельных папках).
// Считает по каждому сидy: горизонт, сэмплы, биомасса/популяция (старт/финал/мин/макс), богатство видов,
// вымирания (вид был в первой трети и исчез к финалу), вирусы и смертность по причинам.
// Usage: node tools/v26_eco_harvest.cjs [dirs через запятую]
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const DIRS = (process.argv[2] || 'eco-v26-s1,eco-v26-s2,eco-v26-s3,eco-v26-s4,eco-v26-s5')
  .split(',').map(d => path.join(ROOT, '09-Docs/out-dev-factory', d));
const OUT = path.join(ROOT, '09-Docs/out-dev-factory/logs-release-ready-2026-10-14');

const rows = [];
for (const dir of DIRS) {
  const files = fs.readdirSync(dir).filter(f => /^seed\d+\.jsonl$/.test(f));
  for (const f of files) {
    const seed = f.match(/seed(\d+)/)[1];
    const s = fs.readFileSync(path.join(dir, f), 'utf8').trim().split('\n').map(JSON.parse);
    if (!s.length) continue;
    const bio = s.map(x => x.biomass), tot = s.map(x => x.total);
    const mean = a => +(a.reduce((p, c) => p + c, 0) / a.length).toFixed(1);
    const rich = new Set(); for (const x of s) for (const k in x.per) if (x.per[k] > 0) rich.add(k);
    const third = Math.max(1, Math.floor(s.length / 3));
    const early = new Set(), late = new Set();
    for (const x of s.slice(0, third)) for (const k in x.per) if (x.per[k] > 0) early.add(k);
    for (const x of s.slice(-third)) for (const k in x.per) if (x.per[k] > 0) late.add(k);
    const gone = [...early].filter(k => !late.has(k));
    const last = s[s.length - 1];
    rows.push({
      dir: path.basename(dir), seed, samples: s.length,
      tFrom: s[0].t, tTo: last.t, gameMin: +(last.t / 60).toFixed(1),
      bioStart: bio[0], bioEnd: last.biomass, bioMin: Math.min(...bio), bioMax: Math.max(...bio), bioMeanTail: mean(bio.slice(-10)),
      popStart: tot[0], popEnd: last.total, popMin: Math.min(...tot), popMax: Math.max(...tot),
      speciesEver: rich.size, speciesNow: Object.keys(last.per).length,
      extinct: gone.length, extinctList: gone.slice(0, 6),
      viruses: last.viruses, deaths: Object.values(last.ev.die || {}).reduce((a, c) => a + c, 0),
      births: Object.values(last.ev.div || {}).reduce((a, c) => a + c, 0),
      cats: last.cats
    });
  }
}
const md = ['# v26 задача 7 — сводка эко-прогона (посчитана из jsonl, не на глаз)', '',
  `Прогон: \`node tools/v21_eco_run.cjs http://127.0.0.1:8821 <out> <seed> <минут> 100\`, рендер выключен, считается только \`updateWorld\`.`,
  `Сидов: ${rows.length} · суммарно сэмплов: ${rows.reduce((a, r) => a + r.samples, 0)} · горизонт на сид: ${rows.map(r => r.gameMin).join(' / ')} игр-мин`, '',
  '| Сид | Сэмплов | Горизонт, игр-мин | Биомасса старт→финал (мин/макс) | Популяция старт→финал (мин/макс) | Видов всего/сейчас | Вымирано | Вирусы | Рождений | Смертей |',
  '|---|---|---|---|---|---|---|---|---|---|'];
for (const r of rows) md.push(`| ${r.dir} (seed ${r.seed}) | ${r.samples} | ${r.gameMin} | ${r.bioStart} → ${r.bioEnd} (${r.bioMin}/${r.bioMax}) | ${r.popStart} → ${r.popEnd} (${r.popMin}/${r.popMax}) | ${r.speciesEver}/${r.speciesNow} | ${r.extinct}${r.extinctList.length ? ' (' + r.extinctList.join(', ') + ')' : ''} | ${r.viruses} | ${r.births} | ${r.deaths} |`);
md.push('', '## Категории в финальном сэмпле', '');
for (const r of rows) md.push(`- ${r.dir}: ${Object.entries(r.cats).map(([k, v]) => k + ' ' + v).join(', ')}`);
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'v26-eco-summary.md'), md.join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'v26-eco-summary.json'), JSON.stringify(rows, null, 1));
console.log(md.slice(0, 8).join('\n'));
console.log('файл: ' + path.join(OUT, 'v26-eco-summary.md'));
