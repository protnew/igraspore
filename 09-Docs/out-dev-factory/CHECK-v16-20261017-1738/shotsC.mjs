import path from 'path'; import fs from 'fs'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(path.resolve('.04-Src/node_modules/playwright-core/index.js'));
const BASE = 'http://127.0.0.1:8795/'; const OUT = process.argv[2]; const res = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function run(name, lang, vp, fn) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
  const page = await ctx.newPage(); const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  page.on('pageerror', e => errs.push('PAGEERR ' + String(e.message).slice(0, 160)));
  page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url().replace(BASE, '/')); });
  let note = '';
  try {
    await page.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); localStorage.setItem('igraspore_tut_v2', '1'); }, lang);
    await page.goto(BASE + '?lang=' + lang + '&t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#startBtn', { timeout: 25000 }); await page.waitForTimeout(1500);
    note = (await fn(page)) || '';
  } catch (e) { note = 'ERR ' + String(e.message).slice(0, 120); }
  const f = path.join(OUT, name + '.png'); await page.screenshot({ path: f }).catch(() => {});
  res.push({ name, lang, url: BASE + '?lang=' + lang, file: f, consoleErrors: errs.length, errs: errs.slice(0, 6), note });
  await ctx.close();
}
async function play(page) {
  await page.click('#startBtn'); await page.waitForTimeout(1800);
  const skip = page.locator('#tutSkip'); if (await skip.isVisible().catch(() => false)) await skip.click();
  await page.waitForFunction(() => window.state === 'playing', undefined, { timeout: 30000 }).catch(() => {});
  const ok = page.locator('#roleCardOk'); if (await ok.isVisible().catch(() => false)) await ok.click();
  await page.waitForTimeout(1200);
}
async function mark(page, sel) {
  return await page.evaluate(sel => { const el = document.querySelector(sel); if (!el) return 'no element ' + sel;
    const t = el.getAttribute('title') || el.getAttribute('aria-label') || ''; const r = el.getBoundingClientRect();
    const d = document.createElement('div'); d.textContent = 'TITLE: ' + t;
    d.style.cssText = `position:fixed;left:${Math.max(4, Math.min(r.left, innerWidth - 420))}px;top:${Math.max(4, r.top - 60)}px;max-width:400px;background:#ff0;color:#000;font:16px sans-serif;padding:6px;border:3px solid red;z-index:999999`;
    document.body.appendChild(d); el.style.outline = '3px solid red'; return 'title="' + t + '"'; }, sel);
}
const D = { width: 1280, height: 800 }, M = { width: 390, height: 844 };
await run('01-start-menu-tr', 'tr', D, async p => 'startBtn=' + (await p.textContent('#startBtn'))?.trim());
await run('02-language-list', 'en', D, async p => { await p.click('#langSelWrap').catch(() => {}); await p.waitForTimeout(700);
  const t = await p.evaluate(() => [...document.querySelectorAll('#langSelDrop > *')].map(x => x.textContent.trim()));
  return 'items=' + t.length + ' es/tr/fil=' + ['Español','Türkçe','Filipino'].map(n => t.some(x => x.includes(n))).join('/'); });
await run('03-th-menu-fonts', 'th', D, async p => 'fontThai=' + await p.evaluate(() => document.fonts.check('16px "Noto Sans Thai"')));
await run('04-fil-game-hud', 'fil', D, async p => { await play(p); return 'game'; });
await run('05-mobile-390x844-game-es', 'es', M, async p => { await play(p); return 'mobile es'; });
await browser.close();
fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(res, null, 1)); console.log(JSON.stringify(res.map(r => [r.name, r.consoleErrors, r.note, r.errs.join(' ; ')])));
