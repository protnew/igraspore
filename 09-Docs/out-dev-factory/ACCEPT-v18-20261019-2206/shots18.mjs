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
await run('01-language-list', 'en', D, async p => { await p.click('#langSelWrap').catch(() => {}); await p.waitForTimeout(700);
  const t = await p.evaluate(() => [...document.querySelectorAll('#langSelDrop > *')].map(x => x.textContent.trim()));
  return 'items=' + t.length + ' es/tr/fil=' + ['Español','Türkçe','Filipino'].map(n => t.some(x => x.includes(n))).join('/') + ' :: ' + t.join(','); });
for (const l of ['es', 'tr', 'fil']) await run('02-start-menu-' + l, l, D, async p => 'startBtn=' + (await p.textContent('#startBtn'))?.trim());
await run('03-hud-cell-card-D1', 'tr', D, async p => { await play(p);
  const g = () => p.evaluate(() => ({ divs: document.getElementById('hudDivs')?.textContent, off: window.player && player.offspring, inf: document.getElementById('hudInfect')?.style.display }));
  const a = await g(); await p.evaluate(() => { try { player.offspring += 3; player.infected = true; } catch (e) {} }); await p.waitForTimeout(1500); const b = await g();
  await p.evaluate(() => { const e = document.getElementById('hudDivs'); if (e) e.parentElement.style.outline = '3px solid red'; });
  return 'before=' + JSON.stringify(a) + ' after=' + JSON.stringify(b) + ' updated=' + (a.divs !== b.divs); });
await run('04-miss-toast-only-eat-D2', 'en', D, async p => { await play(p);
  const shown = () => p.evaluate(() => { const t = document.getElementById('toast'); return t && t.style.display !== 'none' && getComputedStyle(t).opacity !== '0' ? t.textContent.trim() : ''; });
  let idle = []; for (let i = 0; i < 12; i++) { const x = await shown(); if (x) idle.push(x); await p.waitForTimeout(500); }
  await p.keyboard.press('Space'); await p.waitForTimeout(400); const afterSpace = await shown();
  await p.waitForTimeout(3500);
  await p.click('#bEat').catch(() => {}); await p.waitForTimeout(300); const afterEat = await shown();
  return 'idleToasts=' + [...new Set(idle)].join('|') + ' ; afterSpace=' + afterSpace + ' ; afterEatClick=' + afterEat; });
await run('05-tr-tooltip-tempL-N2', 'tr', D, async p => { await play(p);
  const box = await p.locator('#tempL').boundingBox().catch(() => null); if (!box) return 'no #tempL';
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.waitForTimeout(150); await p.mouse.move(box.x + box.width / 2 + 1, box.y + box.height / 2); await p.waitForTimeout(500);
  const t = await p.evaluate(() => { const g = document.getElementById('globalTooltip'); return g ? [g.style.display, g.textContent] : ['none', '']; });
  return 'tooltip=' + JSON.stringify(t) + ' cyrillic=' + /[А-Яа-я]/.test(t[1]); });
for (const l of ['th', 'hi', 'bn']) await run('06-fonts-' + l, l, D, async p => {
  const fam = { th: 'Noto Sans Thai', hi: 'Noto Sans Devanagari', bn: 'Noto Sans Bengali' }[l]; const ch = { th: 'ก', hi: 'क', bn: 'ক' }[l];
  const n = await p.evaluate(([f, c]) => document.fonts.load('16px "' + f + '"', c).then(x => x.length), [fam, ch]);
  return 'fonts.load(' + fam + ')=' + n + ' start=' + (await p.textContent('#startBtn'))?.trim(); });
{ const ctx = await browser.newContext({ viewport: D }); const p = await ctx.newPage(); const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  await p.goto('http://127.0.0.1:8793/lab/tests', { waitUntil: 'load', timeout: 60000 }).catch(e => errs.push('nav ' + e.message));
  await p.waitForTimeout(1500); const f = path.join(OUT, '07-lab-tests-page.png'); await p.screenshot({ path: f });
  const top = (await p.textContent('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 220);
  res.push({ name: '07-lab-tests-page', url: 'http://127.0.0.1:8793/lab/tests', file: f, consoleErrors: errs.length, errs, note: top });
  const r = await p.goto('http://127.0.0.1:8793/', { waitUntil: 'load' }).catch(() => null); await p.waitForTimeout(800);
  const f2 = path.join(OUT, '08-lab-root-redirect.png'); await p.screenshot({ path: f2 });
  res.push({ name: '08-lab-root-redirect', url: 'http://127.0.0.1:8793/', file: f2, consoleErrors: 0, errs: [], note: 'final url=' + p.url() + ' chain=' + (r ? (r.request().redirectedFrom()?.url() || '-') : 'ERR') });
  await ctx.close(); }
await run('09-mobile-390x844-game-fil', 'fil', M, async p => { await play(p); return 'mobile fil'; });
await browser.close();
fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(res, null, 1)); console.log(JSON.stringify(res.map(r => [r.name, r.consoleErrors, r.note, r.errs.join(' ; ')])));
