// v26 задача 9 (A5): система цифр и шрифты — что реально видит игрок против реестра.
// Для каждого языка: запускаем игру на QA-стенде, снимаем цифры из HUD, зовём igsNum()
// из страницы и сверяем с __IGS_DIGITS; отдельно проверяем, загружен ли @font-face из реестра
// (__IGS_FONTS: hi/th/bn) — document.fonts.check, а не «надеемся, что сработает».
// Usage: node tools/v26_a5_digits.cjs [base] [lang1 lang2 ...]
const fs = require('fs'), path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = process.argv[2] || 'http://127.0.0.1:8821';
const LANGS = process.argv.slice(3).length ? process.argv.slice(3) : ['ar', 'he', 'dz', 'bo', 'km', 'lo', 'bn', 'as', 'or', 'hi', 'th', 'ta', 'pa', 'ti'];
const OUT = '09-Docs/out-dev-factory/logs-release-ready-2026-10-14';
const REG = (() => {
  const j = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '.04-Src', 'i18n', 'languages.json'), 'utf8'));
  const arr = j.languages || j;
  const list = Array.isArray(arr) ? arr : Object.entries(arr).map(([k, v]) => Object.assign({ code: k }, v));
  const m = {}; for (const l of list) m[l.code] = l; return m;
})();

const PROBE = (face) => `(function(){
  var FACE = ${JSON.stringify(face || '')};
  var hud = document.getElementById('hud');
  var txt = (hud ? hud.textContent : document.body.textContent) || '';
  var digits = txt.match(/[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u1040-\\u1049\\u17E0-\\u17E9\\u19D0-\\u19D9\\uA830-\\uA839\\u11FC0-\\u11FFF]/g) || [];
  var groups = {}, seen = {};
  (txt.match(/[0-9\\u0660-\\u0669\\u06F0-\\u06F9\\u0966-\\u096F\\u0E50-\\u0E59\\u17E0-\\u17E9\\u0A66-\\u0A6F\\u0BE6-\\u0BEF\\u11FC0-\\u11FFF]+/g) || []).forEach(function (g) {
    var cls = g.replace(/[0-9]/g, 'L').replace(/[^L]/g, 'X');
    seen[cls] = (seen[cls] || 0) + 1;
  });
  groups = seen;
  return JSON.stringify({
    curLang: (typeof curLang === 'string') ? curLang : '',
    runtimeRegistryDigits: (typeof __IGS_DIGITS === 'object') ? (__IGS_DIGITS[curLang] || '(нет в реестре)') : 'NO_REGISTRY',
    dir: document.documentElement.getAttribute('dir') || '',
    hudDigitsSample: digits.slice(0, 10).join(' '),
    hudDigitClasses: groups,
    igsNum24: (typeof igsNum === 'function') ? igsNum(24, 0) : 'NO_IGSNUM',
    igsNum1234: (typeof igsNum === 'function') ? igsNum(1234, 0) : 'NO_IGSNUM',
    face: FACE,
    faceLoaded: FACE && FACE !== 'system' ? document.fonts.check('16px "' + FACE + '"') : (FACE === 'system' ? 'системный стек' : 'n/a')
  });
})()`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  const rows = [];
  for (const code of LANGS) {
    const ctx = await br.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 100)));
    await page.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); }, code);
    await page.goto(`${BASE}/?lang=${code}&t=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#startBtn', { timeout: 25000 }).catch(() => {});
    await page.click('#startBtn').catch(() => {});
    for (const sel of ['#introOk', '#roleCardOk', '#tutSkip']) {
      const b = page.locator(sel); if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
      await page.waitForTimeout(300);
    }
    await page.waitForFunction(() => window.state === 'playing', undefined, { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const reg = REG[code] || {};
    const r = JSON.parse(await page.evaluate(PROBE(reg.font === 'system' ? '' : reg.font)).catch(() => '{"curLang":"(ошибка замера)"}'));
    rows.push({ code, expectedDigits: reg.digits || '?', expectedDir: reg.dir || 'ltr', errs: errs.length, errSample: errs.slice(0, 2), ...r });
    console.log(`${code.padEnd(3)} реестр=${String(r.runtimeRegistryDigits).padEnd(8)} igsNum(24)=${String(r.igsNum24).padEnd(7)} HUD="${String(r.hudDigitsSample).slice(0, 22)}" face=${r.face || 'system'} загружен=${r.faceLoaded} errs=${errs.length}`);
    await ctx.close();
  }
  await br.close();
  const md = ['# v26 задача 9 — A5: система цифр и шрифты (замер из браузера, не из кода)', '',
    `Стенд ${BASE} · снято ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' })} (UTC+3) · tools/v26_a5_digits.cjs`, '',
    '| Язык | Цифры: реестр(languages.json) | реестр в рантайме | igsNum(24) | igsNum(1234) | Цифры в HUD (образец) | Классы цифр в HUD | Шрифт из реестра | @font-face загружен | dir | Ошибок |',
    '|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of rows) {
    const cls = Object.entries(r.hudDigitClasses || {}).map(([k, v]) => `${k}×${v}`).join(' ') || '—';
    md.push(`| ${r.code} | ${r.expectedDigits} | ${r.runtimeRegistryDigits} | ${r.igsNum24} | ${r.igsNum1234} | ${r.hudDigitsSample || '—'} | ${cls} | ${r.face || 'системный'} | ${r.faceLoaded} | ${r.dir} | ${r.errs} |`);
  }
  fs.writeFileSync(path.join(OUT, 'v26-a5-digits.md'), md.join('\n') + '\n');
  fs.writeFileSync(path.join(OUT, 'v26-a5-digits.json'), JSON.stringify(rows, null, 1));
  console.log('файл: ' + path.join(OUT, 'v26-a5-digits.md'));
})();
