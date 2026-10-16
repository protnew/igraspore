// store_shots.mjs — P2.6: снимки стора 1080x1920. ru/en — 8 экранов, остальные языки волны 1 — по 4.
// Выключенные языки (es, tr) берутся через QA-хук __igsForceLang на localhost (U39).
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(path.resolve('.04-Src/node_modules/playwright-core/index.js'));

const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8792/';
const OUT = '09-Docs/store-listing/shots';
const WAVE1 = ['en', 'ru', 'pt-BR', 'es', 'hi', 'id', 'tr', 'de', 'fr', 'ja'];
const DISABLED = new Set(['es', 'tr', 'fil']);
const SCREENS_COMMON = ['menu', 'game', 'settings', 'wiki-list'];
const SCREENS_EXTRA = ['tutorial', 'gameover', 'help', 'stars'];

async function closeOverlays(page) {
  for (const id of ['#wikiClose', '#setClose', '#helpClose', '#resBtn']) await page.click(id).catch(() => {});
  await page.waitForTimeout(250);
}

async function waitPlaying(page) {
  await page.waitForFunction(() => window.state === 'playing' && window.player && window.player.alive, undefined, { timeout: 30000 });
}
async function gotoLang(page, lang, { fresh = true } = {}) {
  if (DISABLED.has(lang)) await page.addInitScript((l) => { localStorage.setItem('igs_force_lang', l); localStorage.setItem('igs_lang', l); }, lang);
  else if (fresh) await page.addInitScript((l) => { localStorage.setItem('igs_lang', l); localStorage.removeItem('igs_force_lang'); }, lang);
  await page.goto(BASE + '?lang=' + lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('#startBtn', { timeout: 25000 });
  await page.waitForTimeout(1400);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
for (const lang of WAVE1) {
  const shots = SCREENS_COMMON.concat(lang === 'en' || lang === 'ru' ? SCREENS_EXTRA : []);
  fs.mkdirSync(`${OUT}/${lang}`, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1, isMobile: false });
  const page = await ctx.newPage();
  const done = [];
  try {
    await gotoLang(page, lang);
    for (const s of shots) {
      try {
        if (s === 'menu') { await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForSelector('#startBtn'); await page.waitForTimeout(1200); }
        if (s === 'tutorial') { await page.evaluate(() => localStorage.removeItem('igraspore_tut_v2')); await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForSelector('#startBtn'); await page.click('#startBtn'); await page.waitForTimeout(2000); }
        if (s === 'game') { const skip = page.locator('#tutSkip'); if (await skip.isVisible().catch(() => false)) await skip.click(); await waitPlaying(page); const ok = page.locator('#roleCardOk'); if (await ok.isVisible().catch(() => false)) await ok.click(); await page.waitForTimeout(1200); }
        if (s === 'settings') { await page.click('#bPause').catch(() => {}); await page.waitForTimeout(500); await page.click('#pSet').catch(() => {}); await page.waitForSelector('#setO.ov.show', { timeout: 6000 }).catch(() => {}); await page.waitForTimeout(500); }
        if (s === 'wiki-list') { await page.click('#setClose').catch(() => {}); await page.waitForTimeout(300); await page.click('#pWiki').catch(() => {}); await page.waitForSelector('#wikiO.ov.show', { timeout: 6000 }).catch(() => {}); await page.waitForSelector('#wikiContent .wiki-entry', { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(600); }
        if (s === 'help') { await closeOverlays(page); await page.click('#bPause').catch(() => {}); await page.waitForTimeout(600); await page.click('#pHelp').catch(() => {}); await page.waitForSelector('#helpO.ov.show', { timeout: 6000 }).catch(() => {}); await page.waitForTimeout(900); }
        if (s === 'stars') { await page.click('#helpClose').catch(() => {}); await page.click('#setClose').catch(() => {}); await page.click('#wikiClose').catch(() => {}); await page.waitForTimeout(400); await page.click('#starSelect').catch(() => {}); await page.waitForTimeout(1100); }
        if (s === 'gameover') { await closeOverlays(page); await page.evaluate(() => { if (window.player) { window.player.alive = false; window.player.energy = 0; } if (typeof window.state !== 'undefined') window.state = 'gameover'; }); await page.waitForTimeout(1600); }
        const f = `${OUT}/${lang}/1080-${s}.png`;
        await page.screenshot({ path: f });
        if (fs.existsSync(f) && fs.statSync(f).size > 1000) done.push(s);
      } catch (e) { results.push(`${lang}/${s}: ERR ${String(e.message).slice(0, 50)}`); }
    }
    results.push(`${lang}: ${done.length}/${shots.length} [${done.join(' ')}]`);
  } catch (e) { results.push(`${lang}: NAV ERR ${String(e.message).slice(0, 60)}`); }
  await ctx.close();
}
await browser.close();
console.log(results.join('\n'));
