// v26: PowerShell пишет логи в UTF-16 с BOM — хелпер читает их как текст и печатает окно вокруг подстроки.
// Usage: node tools/v26_readlog.cjs <файл> <подстрока> [строк до] [строк после]
const fs = require('fs');
const f = process.argv[2], needle = process.argv[3] || '', before = +(process.argv[4] || 2), after = +(process.argv[5] || 25);
let buf = fs.readFileSync(f);
let t = (buf[0] === 0xff && buf[1] === 0xfe) ? buf.toString('utf16le').slice(1) : buf.toString('utf8');
t = t.replace(/\u0000/g, '').replace(/\x1b\[[0-9;]*m/g, '');
const lines = t.split(/\r?\n/);
const i = lines.findIndex(l => l.indexOf(needle) >= 0);
if (i < 0) { console.log('НЕ НАЙДЕНО: ' + needle + ' в ' + f + ' (строк ' + lines.length + ')'); process.exit(1); }
console.log(lines.slice(Math.max(0, i - before), i + after).join('\n').slice(0, 3000));
