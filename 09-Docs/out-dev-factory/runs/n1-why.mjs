import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../.04-Src/node_modules/playwright');
const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });
const kill = setTimeout(() => { console.error('WHY TIMEOUT'); process.exit(2); }, 90000);
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const specs = [
  ['bn', '16px "Noto Sans Bengali"', 'বাংলা'],
  ['hi', '16px "Noto Sans Devanagari"', 'हिन्दी'],
  ['th', '16px "Noto Sans Thai"', 'ไทย'],
];
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errs = [];
const statuses = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 180)); });
page.on('pageerror', (e) => errs.push(String(e).slice(0, 180)));
page.on('response', (res) => {
  const u = res.url();
  if (res.status() >= 400 || u.includes('.woff2')) statuses.push(res.status() + ' ' + u);
});
await page.goto('http://127.0.0.1:8795/?lang=bn&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForSelector('#startBtn', { state: 'attached', timeout: 15000 });
await page.waitForTimeout(800);
const probe = await page.evaluate(async (jobs) => {
  const rows = [];
  for (const [lang, spec, sample] of jobs) {
    const bare = await document.fonts.load(spec);
    const withText = await document.fonts.load(spec, sample);
    const one = await document.fonts.load(spec, Array.from(sample)[0]);
    rows.push({
      lang,
      spec,
      sample,
      bare: bare.length,
      withSample: withText.map((f) => f.family + ' ' + f.status),
      withFirst: one.length,
      check: document.fonts.check(spec),
      checkSample: document.fonts.check(spec, sample),
    });
  }
  const faces = [];
  document.fonts.forEach((f) => {
    faces.push(f.family + ' status=' + f.status + ' range=' + (f.unicodeRange || ''));
  });
  return { rows, faces };
}, specs);
const en = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const enErrs = [];
const en404 = [];
en.on('console', (m) => { if (m.type() === 'error') enErrs.push(m.text().slice(0, 180)); });
en.on('response', (res) => { if (res.status() >= 400) en404.push(res.status() + ' ' + res.url()); });
await en.goto('http://127.0.0.1:8795/?lang=en&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 20000 });
await en.waitForSelector('#startBtn', { state: 'attached', timeout: 15000 });
await en.waitForTimeout(800);
const report = { probe, bnErrs: errs, bnNet: statuses, enErrs, en404 };
fs.writeFileSync(path.join(outDir, 'why.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(probe.rows, null, 2));
console.log('faces', probe.faces.length);
console.log('bnErrs', errs.length, 'enErrs', enErrs.length, 'en404', en404.length);
await browser.close();
clearTimeout(kill);
