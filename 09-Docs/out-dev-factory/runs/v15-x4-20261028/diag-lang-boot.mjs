// Диагностика X4: загружает игру на локальном стенде для перечисленных языков, печатает
// console/pageerror, состояние после #startBtn и размеры критичных элементов.
// Запуск из корня: node 09-Docs/out-dev-factory/runs/v15-x4-20261028/diag-lang-boot.mjs fil en
import process from 'node:process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// запуск из корня проекта: node 09-Docs/out-dev-factory/runs/v15-x4-20261028/diag-lang-boot.mjs fil en
const mod = await import(pathToFileURL(path.resolve(process.cwd(), '.04-Src/node_modules/playwright-core/index.js')).href);
const { chromium } = mod.default ?? mod;

const langs = process.argv.slice(2);
const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8792/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });

for (const lang of langs) {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errs = [], warns = [];
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console:' + m.text().slice(0, 200)); else if (m.type() === 'warning') warns.push(m.text().slice(0, 160)); });
  await page.addInitScript((l) => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); }, lang);
  await page.goto(BASE + '?lang=' + lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector('#startBtn', { timeout: 25000 }).catch(() => errs.push('нет #startBtn'));
  await page.waitForTimeout(1200);
  const menu = await page.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; };
    return {
      state: typeof window.state !== 'undefined' ? window.state : '?',
      bodyH: document.body.scrollHeight, vh: window.innerHeight,
      startBtn: r('#startBtn'), menuO: r('#menuO'),
      overlays: Array.from(document.querySelectorAll('.ov')).filter(e => e.classList.contains('show')).map(e => e.id).join(','),
      errBox: (() => { const e = document.querySelector('#errGeneric,#errAsync,.errBanner,#jsError'); return e ? (e.textContent || '').trim().slice(0, 160) : null; })()
    };
  });
  await page.click('#startBtn').catch(() => {});
  await page.waitForTimeout(4000);
  const after = await page.evaluate(() => ({
    state: typeof window.state !== 'undefined' ? window.state : '?',
    alive: typeof window.player !== 'undefined' && window.player ? window.player.alive : 'нет player',
    tutStep: typeof window.tutorialStep !== 'undefined' ? window.tutorialStep : '?',
    roleCard: !!document.querySelector('#roleCard') && getComputedStyle(document.querySelector('#roleCard')).display,
    visibleOverlays: Array.from(document.querySelectorAll('.ov')).filter(e => e.classList.contains('show')).map(e => e.id).join(','),
    curLang: typeof window.curLang !== 'undefined' ? window.curLang : '?'
  }));
  console.log('=== ' + lang + ' ===');
  console.log('до клика:', JSON.stringify(menu));
  console.log('после клика:', JSON.stringify(after));
  console.log('ошибок:', errs.length, errs.slice(0, 5).join(' | ') || '—');
  console.log('предупреждений:', warns.length, warns.slice(0, 3).join(' | ') || '—');
  await ctx.close();
}
await browser.close();
