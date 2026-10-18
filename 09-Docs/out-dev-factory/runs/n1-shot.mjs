import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../.04-Src/node_modules/playwright');
const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });
const kill = setTimeout(() => { console.error('SHOT TIMEOUT'); process.exit(2); }, 120000);
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const jobs = [
  ['bn', '16px "Noto Sans Bengali"', 'বাংলা'],
  ['hi', '16px "Noto Sans Devanagari"', 'हिन्दी'],
  ['th', '16px "Noto Sans Thai"', 'ไทย'],
];
const report = [];
for (const [lang, spec, sample] of jobs) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 180)); });
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 180)));
  const fontReqs = [];
  page.on('response', (res) => { if (res.url().includes('.woff2')) fontReqs.push(res.status() + ' ' + res.url()); });
  await page.goto('http://127.0.0.1:8795/?lang=' + lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('#startBtn', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(800);
  const loaded = await page.evaluate(async (q) => {
    const faces = await document.fonts.load(q);
    return faces.map((f) => f.family + ' status=' + f.status + ' ' + (f.unicodeRange || ''));
  }, spec);
  await page.screenshot({ path: path.join(outDir, lang + '-menu.png'), timeout: 10000 });
  const row = { lang, sample, loaded, fontReqs, errs };
  report.push(row);
  console.log(lang, 'faces', loaded.length, 'woff', fontReqs.join(' ; '), 'errs', errs.length);
  await page.close();
}
fs.writeFileSync(path.join(outDir, 'fonts.json'), JSON.stringify(report, null, 2));
await browser.close();
clearTimeout(kill);
const bad = report.filter((r) => !r.loaded.length || r.errs.length);
console.log('SHOTS', outDir, 'bad', bad.length);
if (bad.length) process.exit(3);
