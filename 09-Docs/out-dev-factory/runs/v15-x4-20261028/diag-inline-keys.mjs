// X4 находка: ключи, которые показаны в интерфейсе по-английски у НЕ-английских языков,
// потому что их нет в словарях. Сравнивает три источника: инлайн T.en в .04-Src/js/config.js,
// .04-Src/i18n/en.json и словарь языка.
import fs from 'node:fs';
import path from 'node:path';

const cfg = fs.readFileSync('.04-Src/js/config.js', 'utf8');
// все присваивания вида T.en.<key>=...
const inline = new Set([...cfg.matchAll(/T\.en\.([A-Za-z0-9_.]+)\s*=/g)].map((m) => m[1]));
for (const m of cfg.matchAll(/T\.en=\{([^}]*)\}/g)) {
  for (const k of m[1].matchAll(/'?([A-Za-z0-9_.]+)'?\s*:/g)) inline.add(k[1]);
}
const enJson = new Set(Object.keys(JSON.parse(fs.readFileSync('.04-Src/i18n/en.json', 'utf8'))));
const missingInEnJson = [...inline].filter((k) => !enJson.has(k)).sort();

const langs = ['fil', 'es', 'tr', 'ru', 'de', 'id'];
console.log('ключей T.en (инлайн в config.js) =', inline.size, '| ключей en.json =', enJson.size);
console.log('нет в en.json (значит и во всех словарях):', missingInEnJson.length);
console.log(missingInEnJson.join(', '));
for (const L of langs) {
  const d = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join('.04-Src/i18n', L + '.json'), 'utf8'))));
  const miss = missingInEnJson.filter((k) => !d.has(k));
  console.log('  ' + L + ': показывается по-английски у', miss.length, 'ключей из этого списка');
}
// отдельно: что реально видно на экране настроек
for (const k of ['setLang', 'economy', 'errGeneric', 'errAsync', 'more']) {
  const inEn = enJson.has(k), inFil = fs.readFileSync('.04-Src/i18n/fil.json', 'utf8').includes('"' + k + '"');
  console.log('проверка ключа', k, ': в en.json =', inEn, ', в fil.json =', inFil);
}
