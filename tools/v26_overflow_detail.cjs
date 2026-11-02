// v26 задача 9/10: кто именно вылезает за вьюпорт 375px — поэкранно, с якорями (id/класс/текст/координаты).
// Нужен потому, что v26_rtl_shots.cjs считает максимум по кадрам, а именаelements только на первом кадре.
// Usage: node tools/v26_overflow_detail.cjs [base] [lang ...]
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = process.argv[2] || 'http://127.0.0.1:8821';
const LANGS = process.argv.slice(3).length ? process.argv.slice(3) : ['dz', 'ti', 'pa', 'ar'];

const OUT = `(function(){
  function vis(el){ var r=el.getBoundingClientRect(); if(!r.width||!r.height) return false;
    var cs=getComputedStyle(el); return cs.display!=='none'&&cs.visibility!=='hidden'&&cs.opacity!=='0'; }
  var vw=innerWidth, vh=innerHeight, res=[];
  Array.from(document.querySelectorAll('body *')).forEach(function(el){
    if(!vis(el)) return;
    var r=el.getBoundingClientRect();
    if(r.right>vw+2||r.x<-2||r.bottom>vh+2){
      if(el.closest('.ov')) return;
      res.push({ tag: el.tagName.toLowerCase(), id: el.id||'', cls: String(el.className||'').slice(0,40),
        txt: (el.textContent||'').replace(/\\s+/g,' ').trim().slice(0,36),
        x: Math.round(r.x), right: Math.round(r.right), bottom: Math.round(r.bottom),
        parentOverflow: getComputedStyle(el.parentElement||document.body).overflowX });
    }
  });
  return JSON.stringify({ vw: vw, vh: vh, list: res.slice(0,10) });
})()`;

(async () => {
  const br = await chromium.launch({ channel: 'chrome', headless: true });
  for (const code of LANGS) {
    const ctx = await br.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.addInitScript(l => { localStorage.setItem('igs_lang', l); localStorage.setItem('igs_force_lang', l); localStorage.removeItem('igraspore_tut_v2'); }, code);
    await page.goto(`${BASE}/?lang=${code}&t=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#startBtn', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const shots = { menu: JSON.parse(await page.evaluate(OUT)) };
    await page.click('#startBtn').catch(() => {});
    for (const sel of ['#introOk', '#roleCardOk', '#tutSkip']) {
      const b = page.locator(sel); if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
      await page.waitForTimeout(300);
    }
    await page.waitForFunction(() => window.state === 'playing', undefined, { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(1200);
    shots.game = JSON.parse(await page.evaluate(OUT));
    await page.click('#bPause').catch(() => {}); await page.waitForTimeout(400);
    await page.click('#pWiki').catch(() => {});
    await page.waitForSelector('#wikiContent .wiki-entry', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(700);
    shots.wiki = JSON.parse(await page.evaluate(OUT));
    console.log(`### ${code}`);
    for (const s in shots) {
      const o = shots[s];
      console.log(`  ${s}: вылазит ${o.list.length}`);
      for (const e of o.list) console.log(`    <${e.tag} id="${e.id}" class="${e.cls}"> "${e.txt}" x=${e.x} right=${e.right} bottom=${e.bottom} vw=${o.vw} parentOverflowX=${e.parentOverflow}`);
    }
    await ctx.close();
  }
  await br.close();
})();
