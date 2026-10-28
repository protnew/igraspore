// X4: «живой браузер» — обход 8 экранов для es/tr/fil на локальном стенде с дампом консоли.
// Считает красные (error) и жёлтые (warning) сообщения СВОЕГО кода; сторонние (расширения,
// favicon 404, внешние шрифты) выносит отдельно, чтобы не выдавать чужое за наше.
// Запуск из корня: node 09-Docs/out-dev-factory/runs/v15-x4-20261028/x4-console-walk.mjs
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const mod = await import(pathToFileURL(path.resolve(process.cwd(), '.04-Src/node_modules/playwright-core/index.js')).href);
const { chromium } = mod.default ?? mod;

const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8795/';
const OUT = '09-Docs/out-dev-factory/runs/v15-x4-20261028';
const THIRD_PARTY = /favicon|\.woff|fonts\.g|net::ERR_(NOT_FOUND|CONNECTION)|DevTools|Download the React/i;

const SCREENS = ['menu', 'tutorial', 'game', 'pause', 'settings', 'wiki-list', 'wiki-article', 'gameover'];

async function walk(page, lang) {
  const errs = [], warns = [], other = [];
  const push = (bucket, txt) => (THIRD_PARTY.test(txt) ? other : bucket).push(txt);
  page.on('pageerror', (e) => errs.push('pageerror: ' + String(e.message).slice(0, 160)));
  page.on('console', (m) => {
    const t = m.type();
    if (t === 'error') push(errs, 'console.error: ' + m.text().slice(0, 160));
    else if (t === 'warning') push(warns, 'console.warn: ' + m.text().slice(0, 160));
  });
  await page.goto(BASE + '?lang=' + lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('#startBtn', { timeout: 25000 });
  await page.waitForTimeout(1200);                                  // menu
  await page.evaluate(() => localStorage.removeItem('igraspore_tut_v2'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#startBtn'); await page.click('#startBtn'); await page.waitForTimeout(2000); // tutorial
  for (const sel of ['#introOk', '#roleCardOk', '#tutSkip']) {
    const b = page.locator(sel);
    if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.waitForFunction(() => window.state === 'playing' && window.player && window.player.alive, undefined, { timeout: 30000 });
  await page.waitForTimeout(800);                                   // game
  await page.click('#bPause').catch(() => {}); await page.waitForTimeout(500);   // pause
  await page.click('#pSet').catch(() => {}); await page.waitForSelector('#setO.ov.show', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(400);                                   // settings
  await page.click('#setClose').catch(() => {}); await page.waitForTimeout(300);
  await page.click('#pWiki').catch(() => {});
  await page.waitForSelector('#wikiContent .wiki-entry', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(400);                                   // wiki-list
  const name = ((await page.locator('#wikiContent .wiki-entry b').first().textContent().catch(() => '')) || '').trim();
  if (name) { await page.locator('#wikiSearch').fill(name); await page.locator('#wikiSearch').dispatchEvent('input'); }
  await page.waitForTimeout(900);                                   // wiki-article
  await page.click('#wikiClose').catch(() => {});
  await page.evaluate(() => { if (window.player) { window.player.alive = false; window.player.energy = 0; } if (typeof window.state !== 'undefined') window.state = 'gameover'; });
  await page.waitForTimeout(1200);                                  // gameover
  return { errs, warns, other };
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const rows = [];
for (const lang of ['es', 'tr', 'fil']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const r = await walk(page, lang);
  rows.push({ lang, экранов: SCREENS.length, красных: r.errs.length, жёлтых: r.warns.length, сторонних: r.other.length,
    примеры: r.errs.slice(0, 3).concat(r.warns.slice(0, 3)) });
  await ctx.close();
}
await browser.close();
const dump = rows.map((r) => JSON.stringify(r, null, 1)).join('\n');
fs.writeFileSync(path.join(OUT, 'x4-console-dump.txt'), 'стенд ' + BASE + '\n' + dump + '\n');
console.log('язык | экранов | красных | жёлтых | сторонних');
for (const r of rows) console.log(r.lang + ' | ' + r.экранов + ' | ' + r.красных + ' | ' + r.жёлтых + ' | ' + r.сторонних);
console.log('дамп: ' + path.join(OUT, 'x4-console-dump.txt'));
