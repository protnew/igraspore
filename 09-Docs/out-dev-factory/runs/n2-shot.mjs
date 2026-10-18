import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../.04-Src/node_modules/playwright');
const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });
const kill = setTimeout(() => { console.error('SHOT TIMEOUT'); process.exit(2); }, 180000);
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const langs = ['tr', 'fil', 'es'];
const targets = ['tempL', 'lightL', 'energyBar'];
const lines = [];
for (const lang of langs) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
  await page.goto('http://127.0.0.1:8795/?lang=' + lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('#startBtn', { state: 'attached', timeout: 15000 });
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(800);
  await page.evaluate(() => { const s = document.getElementById('tutSkip'); if (s) s.click(); const r = document.getElementById('roleCardOk'); if (r) r.click(); });
  await page.waitForFunction(() => window.state === 'playing' && window.player && player.alive, null, { timeout: 20000 });
  await page.waitForSelector('#tempL', { timeout: 10000 });
  await page.waitForTimeout(600);
  for (const id of targets) {
    await page.hover('#' + id);
    await page.waitForTimeout(200);
    const tip = await page.evaluate(() => {
      const t = document.getElementById('globalTooltip');
      return { text: t ? t.textContent : '', display: t ? t.style.display : '' };
    });
    await page.screenshot({ path: path.join(outDir, lang + '-' + id + '.png'), timeout: 10000 });
    lines.push(lang + ' ' + id + ' display=' + tip.display + ' text=' + tip.text);
    console.log(lines[lines.length - 1]);
  }
  lines.push(lang + ' errors=' + errs.length);
  await page.close();
}
fs.writeFileSync(path.join(outDir, 'tips.txt'), lines.join('\n'));
await browser.close();
clearTimeout(kill);
console.log('SHOTS', outDir);
