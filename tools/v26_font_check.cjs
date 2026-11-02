// v26 задача 9 (A5): подключены ли @font-face из реестра и чиста ли загрузка страницы.
// Делает то, что нельзя вывести из кода: список document.fonts со статусами, 4xx-ответы и ошибки консоли
// для каждого языка, плюс образец подписи меню (menuSub) — там видна система цифр из A5.
// Usage: node tools/v26_font_check.cjs [base] [lang ...]
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = process.argv[2] || 'http://127.0.0.1:8821';
const LANGS = process.argv.slice(3).length ? process.argv.slice(3) : ['hi', 'bn', 'th', 'ar', 'dz'];

const PROBE = `(function(){
  var faces = Array.from(document.fonts).map(function(f){ return f.family + ' [' + f.status + ']'; });
  var ms = document.getElementById('menuSub');
  return JSON.stringify({
    faces: faces,
    menuSub: ms ? (ms.textContent||'').replace(/\\s+/g,' ').trim() : '(нет #menuSub)',
    dir: document.documentElement.getAttribute('dir') || '',
    sheetCount: document.styleSheets.length
  });
})()`;

(async () => {
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  for (const code of LANGS) {
    const ctx = await br.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    const bad = [], errs = [];
    page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 90)); });
    page.on('pageerror', e => errs.push('pageerror: ' + String(e.message).slice(0, 90)));
    await page.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); }, code);
    await page.goto(`${BASE}/?lang=${code}&t=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#startBtn', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const r = JSON.parse(await page.evaluate(PROBE).catch(() => '{"faces":[],"menuSub":"(ошибка)","sheetCount":0}'));
    console.log(`${code}: css-файлов=${r.sheetCount} | @font-face: ${r.faces.length ? r.faces.join(', ') : 'НЕТ'} | dir=${r.dir} | 4xx=${bad.length ? bad.join(' ; ') : 'нет'} | ошибок=${errs.length}${errs.length ? ' (' + errs[0] + ')' : ''}`);
    console.log(`     menuSub: "${r.menuSub}"`);
    await ctx.close();
  }
  await br.close();
})();
