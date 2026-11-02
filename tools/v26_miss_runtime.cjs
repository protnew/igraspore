// v26 задача 10: какие ключи код запрашивает через tt(), но их нет ни в словаре языка, ни в en.json.
// Собирается в реальном браузере (меню + настройки + wiki + игра), язык берём из реестра —
// статический regex ловит только литералы, а misses идут из динамических ключей ('edu.'+id, 'loc.'+id).
// Usage: node tools/v26_miss_runtime.cjs [base] [lang]
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = process.argv[2] || 'http://127.0.0.1:8795';
const LANG = process.argv[3] || 'en';
const OUT = '09-Docs/out-dev-factory/logs-release-ready-2026-10-14';

(async () => {
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await br.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); }, LANG);
  await page.goto(`${BASE}/?lang=${LANG}&t=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('#startBtn', { timeout: 25000 }).catch(() => {});
  const dump = async () => page.evaluate(`(function(){
    var ks = Object.keys(window.__i18nMissKeys || {});
    // __i18nMiss растёт и на обращениях ДО загрузки языкового пакета — отсекаем по актуальному T.en
    var absent = ks.filter(function (k) { var key = k.split(':').slice(1).join(':'); return !(window.T && T.en && (key in T.en)); });
    return JSON.stringify({ recorded: ks.length, n: window.__i18nMiss || 0, absent: absent, enKeys: (window.T && T.en) ? Object.keys(T.en).length : -1 });
  })()`);
  const stage1 = JSON.parse(await dump());
  await page.click('#startBtn').catch(() => {});
  for (const sel of ['#introOk', '#roleCardOk', '#tutSkip']) {
    const b = page.locator(sel); if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.waitForFunction(() => window.state === 'playing', undefined, { timeout: 25000 }).catch(() => {});
  const stage2 = JSON.parse(await dump());
  await page.click('#bPause').catch(() => {}); await page.waitForTimeout(400);
  await page.click('#pSet').catch(() => {}); await page.waitForSelector('#setO.ov.show', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(600);
  const stage3 = JSON.parse(await dump());
  await page.click('#setClose').catch(() => {}); await page.waitForTimeout(300);
  const stage4 = JSON.parse(await dump());
  await br.close();
  const all = [...new Set([...stage1.absent, ...stage2.absent, ...stage3.absent, ...stage4.absent])].sort();
  const lines = ['# v26 — ключи, которые код зовёт через tt(), но их нет ни в словаре, ни в en.json', '',
    `Стенд: ${BASE} · язык ${LANG} · снято ${new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Moscow' })} (UTC+3)`,
    `__i18nMiss считается по обращениям к tt(); в таблице ниже оставлены только те ключи, которых НЕТ в загруженном T.en (${stage4.enKeys} ключей) — обращения до загрузки пакета отброшены.`, '',
    '| Этап | записано обращений | реально absent-ключей |', '|---|---|---|',
    `| Меню (до старта) | ${stage1.recorded} | ${stage1.absent.length} |`,
    `| Игра (state=playing) | ${stage2.recorded} | ${stage2.absent.length} |`,
    `| + настройки | ${stage3.recorded} | ${stage3.absent.length} |`,
    `| + закрытие настроек | ${stage4.recorded} | ${stage4.absent.length} |`, '',
    `Уникальных absent-ключей: ${all.length}`, '', '```'].concat(all).concat(['```']);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'v26-miss-runtime.txt'), lines.join('\n') + '\n');
  console.log(`recorded: меню=${stage1.recorded} игра=${stage2.recorded} настройки=${stage3.recorded} | реально absent=${all.length}`);
  console.log(all.slice(0, 12).join(', ') + (all.length > 12 ? ' …' : ''));
  console.log('файл: ' + path.join(OUT, 'v26-miss-runtime.txt'));
})();
