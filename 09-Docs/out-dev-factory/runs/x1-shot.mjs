// Снимок кадра X1: тост после E у consumer1 и живой кадр индонезийского 1280.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../.04-Src/node_modules/playwright');

const outDir = process.argv[2];
fs.mkdirSync(outDir, { recursive: true });

function track(page, bag) {
  page.on('console', (msg) => { if (msg.type() === 'error') bag.push(msg.text().slice(0, 300)); });
  page.on('pageerror', (err) => bag.push(String(err).slice(0, 300)));
}

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  track(page, errs);
  await page.goto('http://127.0.0.1:8795/?lang=en&t=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#startBtn', { timeout: 20000 });
  await page.click('#startBtn');
  await page.waitForTimeout(1500);
  const skip = page.locator('#tutSkip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
  const rc = page.locator('#roleCardOk');
  if (await rc.isVisible().catch(() => false)) await rc.click();
  await page.waitForFunction(() => window.state === 'playing' && window.player && player.alive, null, { timeout: 30000 });
  await page.evaluate(() => {
    var sp = SPECIES_DB.find(function (s) { return s.cat === 'consumer1'; });
    if (sp) player.sp = sp;
    player.cyst = false; player.dying = false; player.alive = true; player.energy = 30;
    document.getElementById('toast').textContent = '';
  });
  await page.waitForTimeout(100);
  await page.click('#bEat');
  await page.waitForTimeout(250);
  const toast = await page.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
  const alive = await page.evaluate(() => !!(window.player && player.alive));
  await page.screenshot({ path: path.join(outDir, 'en-eat-toast.png') });
  fs.writeFileSync(path.join(outDir, 'en-console.txt'), JSON.stringify({ toast, alive, errors: errs }, null, 2));

  const page2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs2 = [];
  track(page2, errs2);
  await page2.goto('http://127.0.0.1:8795/?lang=id&t=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page2.evaluate(() => localStorage.removeItem('igraspore_tut_v2'));
  await page2.goto('http://127.0.0.1:8795/?lang=id&t=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page2.waitForSelector('#startBtn', { timeout: 20000 });
  await page2.click('#startBtn');
  await page2.waitForTimeout(800);
  const alive2 = await page2.evaluate(() => !!(window.player && player.alive && window.state === 'playing')).catch(() => false);
  await page2.screenshot({ path: path.join(outDir, 'id-1280-alive.png') });
  fs.writeFileSync(path.join(outDir, 'id-console.txt'), JSON.stringify({ alive: alive2, errors: errs2 }, null, 2));
  await browser.close();
  console.log('SHOTS', outDir, 'enErrors', errs.length, 'idErrors', errs2.length, 'toast', toast, 'alive2', alive2);
})().catch((e) => { console.error(e); process.exit(1); });
