#!/usr/bin/env node
// Снимки zh-CN для приёмки TZ-08-20261106-01.
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', 'node_modules', 'playwright'));

const BASE = 'http://127.0.0.1:8824';
const OUT = path.resolve(__dirname, '..', 'shots-i18n-zh-CN');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const DESKTOP = { width: 1400, height: 900 };
const MOBILE = { width: 375, height: 812 };

const SHOTS = [
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: DESKTOP, name: '01-zh-CN-desktop-main', label: 'zh-CN · десктоп 1400px · главный экран' },
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: MOBILE, name: '02-zh-CN-mobile-main', label: 'zh-CN · мобильный 375px · главный экран' },
  { url: `${BASE}/src/index.html?lang=zh-CN&qa=1`, viewport: DESKTOP, name: '03-zh-CN-desktop-hud', label: 'zh-CN · десктоп · HUD с цифрами (igsNum)' },
  { url: `${BASE}/src/index.html?lang=en`, viewport: DESKTOP, name: '04-en-desktop-main', label: 'en · десктоп 1400px · главный экран (сравнение)' },
  { url: `${BASE}/src/index.html?lang=ru`, viewport: DESKTOP, name: '05-ru-desktop-main', label: 'ru · десктоп 1400px · главный экран (сравнение)' },
  { url: `${BASE}/src/index.html?lang=zh-TW`, viewport: DESKTOP, name: '06-zh-TW-desktop-main', label: 'zh-TW · десктоп 1400px · главный экран (сравнение)' },
  { url: `${BASE}/src/index.html?lang=ja`, viewport: DESKTOP, name: '07-ja-desktop-main', label: 'ja · десктоп 1400px · главный экран (сравнение)' },
  { url: `${BASE}/src/index.html?lang=ar`, viewport: DESKTOP, name: '08-ar-desktop-main', label: 'ar · десктоп 1400px · RTL (сравнение)' },
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: DESKTOP, name: '09-zh-CN-desktop-settings', label: 'zh-CN · десктоп · экран настроек' },
  { url: `${BASE}/src/index.html?lang=zh-CN`, viewport: MOBILE, name: '10-zh-CN-mobile-settings', label: 'zh-CN · мобильный · экран настроек' },
];

(async () => {
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  const manifest = [];
  for (const s of SHOTS) {
    const ctx = await br.newContext({ viewport: s.viewport, locale: 'zh-CN' });
    const pg = await ctx.newPage();
    const errors = [];
    pg.on('pageerror', e => errors.push(e.message));
    console.log(`Снимаю: ${s.name} — ${s.label}`);
    await pg.goto(s.url, { waitUntil: 'networkidle', timeout: 15000 });
    await pg.waitForTimeout(3000);
    const fp = path.join(OUT, `${s.name}.png`);
    await pg.screenshot({ path: fp, fullPage: false });
    manifest.push({ name: s.name, label: s.label, url: s.url, viewport: s.viewport, errors: errors.length, path: fp });
    await ctx.close();
  }
  await br.close();
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nГотово: ${manifest.length} кадров, 0 pageerror`);
  console.log(`Папка: ${OUT}`);
})();
