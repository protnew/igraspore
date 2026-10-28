// Добавление раздела «причина найдена» в записки X0 (блок X1).
import fs from 'node:fs';
const P = '09-Docs/out-dev-factory/runs/baseline-v15-20261028-1612/X0-ЗАМЕРКИ.md';
const add = [
  '',
  '## Причина красных X0 — найдена и устранена (17:04–17:06)',
  '',
  'Локальные стенды были опущены: `netstat -ano | findstr :8792` и `:8795` — пусто, GET отвечает ошибкой.',
  'Playwright не мог загрузить игру и умирал на `Test timeout of 120000ms exceeded`',
  '(в диагностике — `page.screenshot: Target page, context or browser has been closed`, i18n_overflow.spec.js:74).',
  'Поднял скрытно новым `tools/serve-up.ps1` (GET 200 на 8792 и 8795, окно не показывается).',
  '',
  'Итог X1: **до** — 0 из 5 (стенда нет), **после** — **5 из 5 passed** по 33,6–37,7 с',
  '(файл `x1-id-5progons-s-stendom.txt`). Сам тест НЕ менялся: ожидания, пороги и таймауты те же,',
  'diff по `i18n_overflow.spec.js` = 0. Единственный новый файл блока — `tools/serve-up.ps1`.',
  ''
].join('\n');
fs.appendFileSync(P, add);
console.log('строк в файле:', fs.readFileSync(P, 'utf8').split('\n').length);
