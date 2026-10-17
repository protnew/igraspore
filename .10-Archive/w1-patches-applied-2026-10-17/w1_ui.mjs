// W1 (U26 круг 8): правки fil UI по таблице 2 и tr по таблице 3 из
// ANALYST-ROUND7-2026-10-17.md. Печатает таблицу «ключ | было | стало».
import fs from 'fs';
const P = (f) => `.04-Src/i18n/${f}`;
const rows = [];
function patch(file, edits) {
  const p = P(file);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const [key, val] of Object.entries(edits)) {
    const before = d[key];
    if (before === undefined) { rows.push([file, key, '(КЛЮЧА НЕТ)', '-']); continue; }
    if (before === val) { rows.push([file, key, before, '(без изменений)']); continue; }
    d[key] = val;
    rows.push([file, key, before, val]);
  }
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n', 'utf8');
}

patch('fil.json', {
  'aria.aqua': 'Akwaryum',
  'aria.zo': 'Paliitin',
  'ev.eclipse': 'Eklipse ng araw',
  'sp.1000': 'Espongha (Nagsasala ng pagkain)',
  'fc.schema': '(eskema)',
  'wiki.div.budding': 'Pag-usbong',
  'wgl.diff1': 'Ginagawa ng WebGL shader ang background ng tubig (alon, caustics, kislap)',
  'x.born': 'Isinilang',
  'x.totalBorn': 'Kabuuang isinilang',
  'x.locomotion': 'Paggalaw',
  'edu.membrane.desc': 'Manipis na lipid na balot. Kinokontrol kung ano ang pumapasok at lumalabas. May membrane ang bawat selula.',
  'edu.flagella.desc': 'Mahabang motor sa paglangoy. Umiikot o kumukurba — lumalangoy ang selula papunta sa pagkain o palayo sa panganib (chemotaxis).',
  'edu.oral.desc': 'Sa ciliate — uka kung saan itinutulak ng cilia ang huli. Dito pumapasok ang pagkain sa digestive vacuole.',
  'tip.energyBar': 'Enerhiya ng nilikha. Bumababa habang lumilipas ang oras. Sa zero — mamamatay sa gutom.',
  'role.consumer2': 'Katamtamang kumakain (ciliate). Sinasala ang tubig: hinihila ang bakteriya at berde. Hindi umaatake sa mga higante.',
  'role.macrophage': 'Mga bantay. Umaatake sa may-sakit/mapanganib na selula — sistemang imyuno ng lawa.',
  'toast.filter.catch2': 'Filter: nahuli ang biktima',
  'toast.digest': 'Tinutunaw... ({s}s)',
  'star.dwarf': '★ Pulang dwarf',
  'star.giant': '★ Kahel na higante',
  'star.binary': '★ Binary (asul+kahel)',
  'star.flare': '★ Sumisiklab na bituin (UV Ceti)',
  'tip.popC': 'Tsart ng populasyon. Ipinapakita ang kasaysayan ng pagsilang at kamatayan.',
  'hud.btn.light': 'LIWANAG',
  'hud.btn.light.short': 'LIWANAG',
  'autoOn': 'AWTO',
  'hud.btn.auto': 'AWTO',
  'hud.btn.auto.short': 'AWTO',
  'autoPilotOn': 'NAKA-AWTO',
});

patch('tr.json', {
  'wiki.div.binary': 'İkili bölünme',
  'edu.flagella.desc': 'Uzun yüzme motoru. Döner ya da kıvrılır — hücre yiyeceğe ya da tehlikeden uzağa yüzer (kemotaksi).',
  'wgl.diff1': 'Su arka planını WebGL shader’ı çizer (dalga, kostik, parıltı)',
  'midEaterTip': 'Orta yiyici: yeşillere yüzmeye çalış. Kirpikler kendiliğinden süzer.',
  'tip.popC': 'Nüfus grafiği. Doğum ve ölüm geçmişini gösterir.',
});

console.log('| файл | ключ | было | стало |');
console.log('|---|---|---|---|');
for (const [f, k, a, b] of rows) console.log(`| ${f} | \`${k}\` | ${String(a).slice(0, 70)} | ${String(b).slice(0, 70)} |`);
console.log('строк правок: ' + rows.filter(r => !r[3].startsWith('(')).length);
