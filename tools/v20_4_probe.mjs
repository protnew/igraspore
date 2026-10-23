import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'C:/Users/Space/agent-transfer/igraspore-v20-4';
const BASE = 'http://127.0.0.1:8807';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const shots = [];
async function shot(page, name) {
  const file = OUT + '/' + name + '.png';
  await page.screenshot({ path: file });
  shots.push(name);
}
async function measure(page) {
  return page.evaluate(() => {
    function cs(el) { return el ? getComputedStyle(el) : null; }
    function box(id) {
      const e = document.getElementById(id); if (!e) return null;
      const b = e.getBoundingClientRect();
      const s = cs(e);
      return { id, w: Math.round(b.width), h: Math.round(b.height), z: s.zIndex, bg: s.backgroundColor, fs: s.fontSize, disp: s.display, cls: e.className };
    }
    const ids = ['menuO', 'introO', 'pauseO', 'exitConfirm', 'deadO', 'setO', 'pauseBtn', 'introOk', 'restartBtn', 'menuBtn', 'ecYes', 'ecNo', 'langSelWrap', 'hud', 'menuFooter'];
    const out = { state: (typeof state !== 'undefined' ? state : null), vw: innerWidth, boxes: {} };
    ids.forEach((id) => { out.boxes[id] = box(id); });
    const cards = document.querySelectorAll('#spGrid .sc');
    if (cards[0]) out.cardFs = cs(cards[0]).fontSize;
    const pools = (document.body.innerText || '').split('Pool').length - 1;
    out.poolWord = pools;
    const hud = document.getElementById('hud');
    out.hudEmpty = !!(hud && hud.getBoundingClientRect().height > 8 && !(hud.textContent || '').trim());
    return out;
  });
}
const report = {};
for (const sz of [{ n: '1280', w: 1280, h: 800 }, { n: '390', w: 390, h: 844 }]) {
  const ctx = await browser.newContext({ viewport: { width: sz.w, height: sz.h } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  report['menu-' + sz.n] = await measure(page);
  await shot(page, 'menu-' + sz.n);
  await page.click('#setBtn2');
  await page.waitForTimeout(400);
  report['settings-' + sz.n] = await measure(page);
  await shot(page, 'settings-' + sz.n);
  await page.evaluate('document.getElementById("setO").className="ov"');
  await page.click('#startBtn');
  await page.waitForTimeout(700);
  report['intro-' + sz.n] = await measure(page);
  await shot(page, 'intro-' + sz.n);
  const ok = page.locator('#introOk');
  if (await ok.count()) await ok.click();
  await page.waitForTimeout(500);
  report['play-' + sz.n] = await measure(page);
  await shot(page, 'play-' + sz.n);
  const pb = page.locator('#pauseBtn');
  if (await pb.count()) await pb.click({ force: true });
  await page.waitForTimeout(400);
  report['pause-' + sz.n] = await measure(page);
  await shot(page, 'pause-' + sz.n);
  await page.evaluate('var e=document.getElementById("pExit"); if(e) e.click();');
  await page.waitForTimeout(300);
  report['exit-' + sz.n] = await measure(page);
  await shot(page, 'exit-' + sz.n);
  await page.evaluate('var e=document.getElementById("ecNo"); if(e) e.click();');
  await page.evaluate('if(window.__igsTest) window.__igsTest.killPlayer();');
  await page.waitForTimeout(600);
  report['dead-' + sz.n] = await measure(page);
  await shot(page, 'dead-' + sz.n);
  await ctx.close();
}
fs.writeFileSync(OUT + '/probe.json', JSON.stringify({ shots, report }, null, 2));
await browser.close();
console.log('shots', shots.length);
