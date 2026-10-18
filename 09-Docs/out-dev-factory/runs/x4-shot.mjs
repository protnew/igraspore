import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
const require = createRequire(import.meta.url);
const { chromium } = require('../../../.04-Src/node_modules/playwright');
const outDir = process.argv[2];
const BASE = 'http://127.0.0.1:8795/';
fs.mkdirSync(outDir, { recursive: true });
const kill = setTimeout(() => { console.error('SHOT TIMEOUT'); process.exit(2); }, 240000);
const errs = [];
function track(page) {
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
}
async function boot(page, lang) {
  await page.goto(BASE + '?lang=' + lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('#startBtn', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(400);
}
async function startPlay(page) {
  await page.evaluate(() => { const b = document.getElementById('startBtn'); if (b) b.click(); });
  await page.waitForTimeout(700);
  await page.evaluate(() => { const s = document.getElementById('tutSkip'); if (s) s.click(); const r = document.getElementById('roleCardOk'); if (r) r.click(); });
  await page.waitForFunction(() => window.state === 'playing' && window.player && player.alive, null, { timeout: 20000 });
}
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const langs = ['es', 'tr', 'fil'];
const screens = ['menu', 'tutorial', 'game', 'pause', 'settings', 'wiki-list', 'wiki-article', 'gameover'];
for (const lang of langs) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  track(page);
  await boot(page, lang);
  for (const s of screens) {
    if (s === 'menu') { /* already there */ }
    if (s === 'tutorial') {
      await page.evaluate(() => localStorage.removeItem('igraspore_tut_v2'));
      await page.evaluate(() => document.getElementById('startBtn').click());
      await page.waitForTimeout(600);
    }
    if (s === 'game') {
      await startPlay(page);
    }
    if (s === 'pause') { await page.evaluate(() => document.getElementById('bPause').click()); await page.waitForTimeout(300); }
    if (s === 'settings') { await page.evaluate(() => document.getElementById('pSet').click()); await page.waitForTimeout(300); }
    if (s === 'wiki-list') {
      await page.evaluate(() => { const c = document.getElementById('setClose'); if (c) c.click(); });
      await page.evaluate(() => document.getElementById('pWiki').click());
      await page.waitForSelector('#wikiContent .wiki-entry', { timeout: 15000 }).catch(() => {});
    }
    if (s === 'wiki-article') {
      await page.evaluate(() => {
        const name = (document.querySelector('#wikiContent .wiki-entry b') || {}).textContent || '';
        const box = document.getElementById('wikiSearch');
        if (box && name.trim()) { box.value = name.trim(); box.dispatchEvent(new Event('input', { bubbles: true })); }
      });
      await page.waitForTimeout(400);
    }
    if (s === 'gameover') {
      await page.evaluate(() => {
        const c = document.getElementById('wikiClose'); if (c) c.click();
        if (window.player) { player.alive = false; player.energy = 0; }
        if (typeof state !== 'undefined') state = 'gameover';
      });
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: path.join(outDir, `390-${lang}-${s}.png`), timeout: 10000 });
    console.log('ok', lang, s);
  }
  await ctx.close();
}
const ctx2 = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
const page2 = await ctx2.newPage();
track(page2);
await boot(page2, 'fil');
const store = ['menu', 'game', 'settings', 'wiki-list'];
for (const s of store) {
  if (s === 'game') await startPlay(page2);
  if (s === 'settings') {
    await page2.evaluate(() => document.getElementById('bPause').click());
    await page2.waitForTimeout(200);
    await page2.evaluate(() => document.getElementById('pSet').click());
    await page2.waitForTimeout(300);
  }
  if (s === 'wiki-list') {
    await page2.evaluate(() => { const c = document.getElementById('setClose'); if (c) c.click(); document.getElementById('pWiki').click(); });
    await page2.waitForSelector('#wikiContent .wiki-entry', { timeout: 15000 }).catch(() => {});
  }
  await page2.screenshot({ path: path.join(outDir, `1080-fil-${s}.png`), timeout: 10000 });
  console.log('ok fil-store', s);
}
await browser.close();
const pngs = fs.readdirSync(outDir).filter((f) => f.endsWith('.png'));
const hashes = {};
let dup = 0;
for (const f of pngs) {
  const h = crypto.createHash('md5').update(fs.readFileSync(path.join(outDir, f))).digest('hex');
  if (hashes[h]) { dup++; console.log('DUP', f, hashes[h]); }
  hashes[h] = f;
}
const font404 = errs.filter((e) => /404/.test(e)).length;
const other = errs.filter((e) => !/404/.test(e));
fs.writeFileSync(path.join(outDir, 'x4-summary.txt'), `png=${pngs.length} md5dup=${dup} console404=${font404} other=${other.length}\n${other.join('\n')}\n`);
clearTimeout(kill);
console.log('SHOTS', outDir, 'png', pngs.length, 'dup', dup, '404', font404, 'other', other.length);
