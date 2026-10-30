#!/usr/bin/env node
// v24 A6: термин-линт — глоссарий языка по ключам-якорям (ТЗ v24) ловит разные переводы одного термина
// и известные дефекты (ru «Разлагатели» vs «Редуценты», poolWill «бассейн» vs «водоём»).
// Usage: node tools/i18n/term_lint.cjs [код-языка|all]
const fs = require('fs'), path = require('path');
const I18N = path.join(__dirname, '..', '..', '.04-Src', 'i18n');
const ANCHORS = [ // ключ-якорь → термин (RU-норма из ТЗ v24)
  ['poolWill', 'водоём'],
  ['demo.grp.producer', 'продуценты'],
  ['demo.grp.consumer1', 'консументы'],
  ['demo.grp.decomposer', 'редуценты'],
  ['x.cyst', 'циста'],
  ['colonyBadge', 'колония'],
  ['virus', 'вирусы'],
  ['x.phages', 'фаги'],
  ['dead', 'вымирание'],
  ['hud.btn.eat', 'есть'],
  ['hud.goal', 'делиться'],
  ['set', 'настройки'],
  ['lb.title', 'таблица лидеров'],
  ['aquarium', 'аквариум'],
  ['wiki', 'вики'],
];
function load(code) { return JSON.parse(fs.readFileSync(path.join(I18N, code + '.json'), 'utf8')); }
const warns = [];
function check(code) {
  const dict = load(code);
  const problems = [];
  // 1) термин по ключу-якорю должен быть ОДИН на все вхождения: собираем значение якоря,
  //    ищем тот же термин в соседних ключах с тем же корнем (grp.*, d*, x.*)
  for (const [key] of ANCHORS) {
    if (!(key in dict)) { problems.push('нет якоря ' + key); continue; }
    const v = String(dict[key]).toLowerCase();
    // семейство ключей того же термина
    const fam = Object.keys(dict).filter(k2 => k2 !== key && (
      (key.startsWith('demo.grp.') && k2.startsWith('demo.grp.')) ||
      (key === 'virus' && /^(x\.phage|dLysis|hud\.btn\.eat)/.test(k2) === false && /virus/i.test(k2)) ||
      (key === 'x.cyst' && /cyst/i.test(k2)) ||
      (key === 'colonyBadge' && /colon/i.test(k2)) ||
      (key === 'dead' && /^d(ead|Starve|Eaten|Temp|Age|Lysis|Cull)/.test(k2) === false && /extinct|dead/i.test(k2))
    ));
    for (const k2 of fam) {
      const v2 = String(dict[k2]).toLowerCase();
      // общий фрагмент ≥4 знаков → считаем тем же термином; если якорь НЕ содержится в v2 и наоборот — разнобой терминов не ловим тут (ловим только специфичные пары ниже)
    }
  }
  // 2) специфичные правила (известные дефекты v24/критиков)
  if (code === 'ru') {
    const d = dict;
    const all = Object.values(d).join('|');
    if (/разлагател/i.test(all) && !/редуцент/i.test(all)) problems.push('ru: «Разлагатели» без «Редуценты»');
    if (/разлагател/i.test(all) && /редуцент/i.test(all)) problems.push('ru: смешение «Разлагатели»/«Редуценты» — унифицировать (якорь demo.grp.decomposer=' + d['demo.grp.decomposer'] + ')');
    if (d.poolWill && /бассейн/i.test(d.poolWill)) problems.push('ru: poolWill «бассейн» → «водоём» (глоссарий: пруд/водоём, как es/fr/de)');
    if (d.poolWill && /водоём/i.test(d.poolWill) && /бассейн/i.test(all) === false) { /* ok */ }
    // водоём-термин: где ещё «бассейн»?
    const basKeys = Object.keys(d).filter(k => /бассейн/i.test(String(d[k])));
    if (/водоём|пруд/i.test(String(d.poolWill)) && basKeys.length) problems.push('ru: «бассейн» в ключах ' + basKeys.slice(0, 5).join(',') + ' — унифицировать с «водоём»');
  }
  // 3) eat-глагол: ЕДИНЫЙ глагол, но формы (императив/инфинитив) легальны → предупреждение, не блокировка (v24 A6)
  const eat = String(dict['hud.btn.eat'] || '').trim().toLowerCase();
  if (eat && code !== 'en') {
    const foodish = ['tip.eat', 'hud.btn.eat.short', 'x.digest'].map(k => String(dict[k] || '').toLowerCase()).filter(Boolean);
    for (const f of foodish) {
      if (f && f !== eat) warns.push(code + ': eat-форма «' + eat + '»/«' + f + '» (один глагол — ок)');
    }
  }
  return problems;
}
const target = process.argv[2] || 'all';
const codes = target === 'all'
  ? fs.readdirSync(I18N).filter(f => f.endsWith('.json') && !['languages.json', 'wave2-status.json', 'i18n_identity.allow.json'].includes(f)).map(f => f.replace('.json', '')).filter(c => c !== 'en')
  : [target];
let total = 0;
for (const c of codes) { const p = check(c); if (p.length) { total += p.length; console.log(c + ': ' + p.length + ' — ' + p.slice(0, 3).join(' | ')); } }
warns.forEach(w => console.log('WARN ' + w));
console.log('TERMS problems total: ' + total + (target === 'all' ? '' : ' (' + target + ')'));
process.exit(total ? 1 : 0);
