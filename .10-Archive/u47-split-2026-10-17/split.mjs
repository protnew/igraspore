// U47 (блок W5): разрез functional_test.js (612 строк) на модули ≤ 500 строк.
// Источник «до» — копия в архиве; тела тестов и ожидания переносятся дословно.
// Запуск из корня проекта: node .10-Archive/u47-split-2026-10-17/split.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = '.04-Src/07-QA-and-Testing/playwright/functional_test.js';
const OUTDIR = '.04-Src/qa-playwright/functional_tests';
const ARCH = '.10-Archive/u47-split-2026-10-17';
const BEFORE = path.join(ARCH, 'functional_test-before-U47.js');

fs.mkdirSync(ARCH, { recursive: true });
fs.mkdirSync(OUTDIR, { recursive: true });

// источник: архивная копия «до», если она уже есть (скрипт идемпотентен)
if (!fs.existsSync(BEFORE)) fs.writeFileSync(BEFORE, fs.readFileSync(SRC, 'utf8'));
const raw = fs.readFileSync(BEFORE, 'utf8');
const L = raw.split('\n');
const idx = (re) => { for (let i = 0; i < L.length; i++) if (re.test(L[i])) return i; throw new Error('не найдено: ' + re); };

const iDescribe = idx(/^test\.describe\('iGraSpore V2/m);
const iFirst = idx(/^\s+test\('01 Game loads/m);
const iSplit = idx(/^\s+test\('31 Eclipse button/m);
let iClose = L.length - 1;
while (iClose > 0 && L[iClose].trim() === '') iClose--;
if (L[iClose].trim() !== '});') throw new Error('последняя строка не }); — файл изменился');

// 1. helpers.js = строки 1 … (describe-1) + module.exports
fs.writeFileSync(path.join(OUTDIR, 'helpers.js'),
  L.slice(0, iDescribe).join('\n') +
  "\nmodule.exports = { test, expect, GAME_URL, SS, DESKTOP, MOBILE,\n  waitForGame, startGame, skipTutorial, getGameState, switchToSpecies };\n");

// 2. части: та же шапка describe + тот же beforeEach + свой диапазон тестов
const describeOpen = L[iDescribe];
const beforeEachBlock = L.slice(iDescribe + 1, iFirst);      // setup перед первым тестом
const firstHalf = L.slice(iFirst, iSplit);                   // тесты 01–30
const secondHalf = L.slice(iSplit, iClose);                  // тесты 31–60
const head = (n, range) =>
  '// U47: ' + n + ' функционального набора (тесты ' + range + '). Тела тестов и ожидания — дословный перенос\n' +
  '// из .04-Src/07-QA-and-Testing/playwright/functional_test.js (копия «до»: .10-Archive/u47-split-2026-10-17/).\n' +
  "const { test, expect, GAME_URL, SS, DESKTOP, MOBILE,\n  waitForGame, startGame, skipTutorial, getGameState, switchToSpecies } = require('./helpers.js');\n\n";
const body = (n, range, tests) =>
  head(n, range) + describeOpen + '\n' + beforeEachBlock.join('\n') + '\n' + tests.join('\n') + '\n});\n';

fs.writeFileSync(path.join(OUTDIR, 'part01.js'), body('часть 1', '01–30', firstHalf));
fs.writeFileSync(path.join(OUTDIR, 'part02.js'), body('часть 2', '31–60', secondHalf));

// 3. functional_test.js — указатель на части (тот же путь прогона, что и «до»)
fs.writeFileSync(SRC,
  '// iGraSpore V2 — Comprehensive Functional Test (60 элементов).\n' +
  '// U47 17.10.2026: было 612 строк (>500) — разрезано на два модуля ≤ 500. Набор и ожидания те же: 60 тестов,\n' +
  '// имена тестов и describe не менялись. Копия «до»: .10-Archive/u47-split-2026-10-17/functional_test-before-U47.js\n' +
  "require('../../qa-playwright/functional_tests/part01.js');\n" +
  "require('../../qa-playwright/functional_tests/part02.js');\n");

const count = (p) => fs.readFileSync(p, 'utf8').split('\n').length;
console.log('helpers.js         =', count(path.join(OUTDIR, 'helpers.js')));
console.log('part01.js          =', count(path.join(OUTDIR, 'part01.js')));
console.log('part02.js          =', count(path.join(OUTDIR, 'part02.js')));
console.log('functional_test.js =', count(SRC), '(было 612)');
