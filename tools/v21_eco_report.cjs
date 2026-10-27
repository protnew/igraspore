// v21_eco_report.cjs — C1/C3: таблица вид × механика, критерии правдоподобности, PNG-графики.
// Usage: node tools/v21_eco_report.cjs <ecoDir> <speciesJson> <outDir>
// speciesJson — JSON с массивом {name, cat} (снимок со стенда через v21_species_dump.cjs).
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));

const DIR = process.argv[2] || '09-Docs/out-dev-factory/eco-v21';
const SPFile = process.argv[3] || path.join(DIR, 'species.json');
const OUT = process.argv[4] || DIR;
const SEEDS = fs.readdirSync(DIR).filter(f => /^seed\d+\.jsonl$/.test(f)).map(f => parseInt(f.slice(4), 10)).sort((a, b) => a - b);
if (!SEEDS.length) { console.error('no seed jsonl in ' + DIR); process.exit(1); }

const SPECIES = JSON.parse(fs.readFileSync(SPFile, 'utf8')); // [{name, cat, locomotion}]
const byName = {}; for (const s of SPECIES) byName[s.name] = s;
const SESSILE = new Set(['sessile', 'ciliaStalk']); // сидячие фильтраторы — движение не обязательная механика

function load(seed) {
  return fs.readFileSync(path.join(DIR, 'seed' + seed + '.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
}
const runs = SEEDS.map(load);

// C1: вид × механика (5 сидов, 60 мин). N-порог: ест ≥5, делится ≥2, умирает ≥2, движется — vel>0.001 хоть в одном сидовом финальном срезе.
const N_EAT = 5, N_DIV = 2, N_DIE = 2;
const table = [];
for (const sp of SPECIES) {
  const nm = sp.name;
  let eat = 0, div = 0, die = 0, aliveEnd = 0, velMax = 0;
  for (const run of runs) {
    const last = run[run.length - 1];
    eat += last.ev.eat[nm] || 0;
    div += last.ev.div[nm] || 0;
    die += last.ev.die[nm] || 0;
    if ((last.per[nm] || 0) > 0) aliveEnd++;
    velMax = Math.max(velMax, last.velAny[nm] || last.vel[nm] || 0);
  }
  const g = (n, N) => n >= N ? '🟢' : (n > 0 ? '🟡' : '🔴');
  table.push({
    name: nm, cat: sp.cat,
    eat, eatS: g(eat, N_EAT),
    div, divS: g(div, N_DIV),
    die, dieS: g(die, N_DIE),
    move: velMax > 0.001 || SESSILE.has(sp.locomotion || ''), moveS: (velMax > 0.001 || SESSILE.has(sp.locomotion || '')) ? '🟢' : '🔴',
    sessile: SESSILE.has(sp.locomotion || ''),
    aliveEnd, survS: aliveEnd >= 3 ? '🟢' : (aliveEnd > 0 ? '🟡' : '🔴'),
    velMax: +velMax.toFixed(3),
  });
}

// C3: критерии
function crit() {
  const res = {};
  // пирамида биомассы по уровням, средняя за мин 10–60 (биомасса из bio по именам, суммируем по cat)
  const pyramidPass = [];
  const noTotalDieoff = [], noBloom = [], coexist = [];
  let corpsesOK = true, virusesOK = true;
  for (let ri = 0; ri < runs.length; ri++) {
    const run = runs[ri];
    const win = run.filter(l => l.t >= 600);
    const catBio = { producer: 0, consumer1: 0, consumer2: 0, consumer3: 0, decomposer: 0 };
    for (const l of win) {
      const cb = { producer: 0, consumer1: 0, consumer2: 0, consumer3: 0, decomposer: 0 };
      for (const nm in (l.bio || {})) { const c = byName[nm] && byName[nm].cat; if (c in cb) cb[c] += l.bio[nm]; }
      for (const c in cb) catBio[c] += cb[c];
    }
    for (const c in catBio) catBio[c] /= Math.max(1, win.length);
    pyramidPass.push(catBio.producer > catBio.consumer1 && catBio.consumer1 > catBio.consumer2 && catBio.consumer2 > catBio.consumer3);
    // вымирание: на 60-й мин живы ≥3 уровня
    const last = run[run.length - 1];
    noTotalDieoff.push(Object.keys(last.cats).length >= 3);
    // взрыв: вид >40% всех особей дольше 5 минут подряд
    let bloom = false, cnt = 0;
    for (const l of run) {
      let mx = 0; for (const nm in l.per) mx = Math.max(mx, l.per[nm]);
      if (l.total > 0 && mx / l.total > 0.4) { cnt++; if (cnt > 30) { bloom = true; break; } } else cnt = 0;
    }
    noBloom.push(!bloom);
    coexist.push(Object.keys(last.per).length >= Math.round(SPECIES.length * 0.6));
    // вирусы: не исчезли в первые 5 мин (минимум в окне 4–6 мин: age>300 удаляет стартовую партию ровно к 5-й мин)
    const win5 = run.filter(l => l.t >= 240 && l.t <= 360);
    const minVir = win5.length ? Math.min(...win5.map(l => l.viruses)) : (run[0] ? run[0].viruses : 0);
    virusesOK = virusesOK && minVir > 0 && last.total > 30;
  }
  res.pyramid = pyramidPass;
  res.noDieoff = noTotalDieoff;
  res.noBloom = noBloom;
  res.coexist = coexist.map(x => x);
  res.viruses = virusesOK;
  return res;
}
const C3 = crit();

// C2: PNG графики численности по уровням (по сиду + среднее) — headless chrome canvas → PNG
async function plots() {
  const cats = ['producer', 'consumer1', 'consumer2', 'consumer3', 'decomposer'];
  const colors = { producer: '#4c4', consumer1: '#4af', consumer2: '#f80', consumer3: '#c4f', decomposer: '#a86' };
  const W = 900, H = 420;
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: W, height: H } })).newPage();
  for (const ci of [0]) {
    const html = `<canvas id="c" width="${W}" height="${H}"></canvas>`;
    await p.setContent(html);
    const png = await p.evaluate(`(function(){
      var c = document.getElementById('c'), x = c.getContext('2d');
      x.fillStyle = '#0a1420'; x.fillRect(0, 0, ${W}, ${H});
      var runs = ${JSON.stringify(runs.map(r => r.map(l => ({ t: l.t, cats: l.cats, total: l.total }))))};
      var maxT = 3600, maxV = 10;
      for (var r = 0; r < runs.length; r++) for (var i = 0; i < runs[r].length; i++) maxV = Math.max(maxV, runs[r][i].total);
      function X(t){ return 60 + t / maxT * (${W} - 90); }
      function Y(v){ return ${H} - 40 - v / maxV * (${H} - 70); }
      x.strokeStyle = '#234'; for (var g = 0; g <= 5; g++) { var y = 40 + g * (${H} - 70) / 5; x.beginPath(); x.moveTo(60, y); x.lineTo(${W} - 30, y); x.stroke(); }
      var cats = ${JSON.stringify(cats)}, colors = ${JSON.stringify(colors)};
      for (var ci2 = 0; ci2 < cats.length; ci2++) {
        var cat = cats[ci2];
        x.strokeStyle = colors[cat]; x.lineWidth = 1.2; x.globalAlpha = 0.35;
        for (var r2 = 0; r2 < runs.length; r2++) {
          x.beginPath();
          for (var i2 = 0; i2 < runs[r2].length; i2++) { var l = runs[r2][i2]; var v = l.cats[cat] || 0; i2 ? x.lineTo(X(l.t), Y(v)) : x.moveTo(X(l.t), Y(v)); }
          x.stroke();
        }
        x.globalAlpha = 1; x.lineWidth = 2.4;
        x.beginPath();
        for (var i3 = 0; i3 < runs[0].length; i3++) {
          var t = runs[0][i3].t, sum = 0;
          for (var r3 = 0; r3 < runs.length; r3++) { var li = runs[r3][Math.min(i3, runs[r3].length - 1)]; sum += (li.cats[cat] || 0); }
          var v2 = sum / runs.length; i3 ? x.lineTo(X(t), Y(v2)) : x.moveTo(X(t), Y(v2));
        }
        x.stroke();
        x.fillStyle = colors[cat]; x.font = '12px sans-serif';
        x.fillText(cat, 64 + ci2 * 130, 24);
      }
      x.fillStyle = '#9bc'; x.font = '12px sans-serif';
      for (var tm = 0; tm <= 60; tm += 10) { x.fillText(tm + 'm', X(tm * 60) - 8, ${H} - 18); }
      x.fillText('трофические уровни: тонкие=сиды, толстые=среднее', 64, ${H} - 4);
      return c.toDataURL('image/png').split(',')[1];
    })()`);
    fs.writeFileSync(path.join(OUT, 'eco-trophic.png'), Buffer.from(png, 'base64'));
  }
  await b.close();
}

(async () => {
  await plots();
  const reds = table.filter(r => r.eatS === '🔴' || r.divS === '🔴' || r.dieS === '🔴' || r.moveS === '🔴' || r.survS === '🔴');
  const md = [];
  md.push('# C1/C3: вид × механика (' + SEEDS.length + ' сидов × 60 мин)');
  md.push('');
  md.push('Пороги: ест ≥' + N_EAT + ', делится ≥' + N_DIV + ', умирает ≥' + N_DIE + ' (суммарно по 5 сидам); движение vel>0.001; выживает ≥3 сидов.');
  md.push('');
  md.push('| вид | кат | ест | делится | умирает | движ | жив на 60м |');
  md.push('|---|---|---|---|---|---|---|');
  for (const r of table) md.push('| ' + r.name + ' | ' + r.cat + ' | ' + r.eatS + r.eat + ' | ' + r.divS + r.div + ' | ' + r.dieS + r.die + ' | ' + r.moveS + ' | ' + r.survS + r.aliveEnd + '/5 |');
  md.push('');
  md.push('## C3 критерии (по сидам ' + SEEDS.join(',') + ')');
  md.push('- пирамида биомассы prod>c1>c2>c3: ' + JSON.stringify(C3.pyramid));
  md.push('- нет тотального вымирания (≥3 уровней на 60м): ' + JSON.stringify(C3.noDieoff));
  md.push('- нет взрыва (>40% дольше 5 мин): ' + JSON.stringify(C3.noBloom));
  md.push('- сосуществование ≥60% видов на 60м: ' + JSON.stringify(C3.coexist));
  md.push('- вирусы живы и не убили всё: ' + C3.viruses);
  md.push('');
  md.push('🔴-строк: ' + reds.length + ' из ' + table.length);
  fs.writeFileSync(path.join(OUT, 'eco-report.md'), md.join('\n'));
  fs.writeFileSync(path.join(OUT, 'eco-table.json'), JSON.stringify(table, null, 1));
  const green = (arr) => arr.filter(Boolean).length;
  console.log(JSON.stringify({
    species: table.length, redRows: reds.length,
    pyramid: green(C3.pyramid) + '/' + C3.pyramid.length,
    noDieoff: green(C3.noDieoff) + '/' + C3.noDieoff.length,
    noBloom: green(C3.noBloom) + '/' + C3.noBloom.length,
    coexist: green(C3.coexist) + '/' + C3.coexist.length,
    viruses: C3.viruses,
  }));
  process.exit(0);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
