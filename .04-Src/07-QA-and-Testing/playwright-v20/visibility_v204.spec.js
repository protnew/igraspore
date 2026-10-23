const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');

function contrast(fg, bg) {
  function lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function L(c) {
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || '');
    if (!m) return 0;
    return 0.2126 * lin(+m[1]) + 0.7152 * lin(+m[2]) + 0.0722 * lin(+m[3]);
  }
  const a = L(fg), b = L(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

async function openFresh(browser, w, h) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.addInitScript(() => { try { localStorage.clear(); } catch (e) {} });
  await page.goto(BASE + '/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1600);
  return page;
}

test.describe('v20.4 visibility', () => {
[{ n: '1280', w: 1280, h: 800 }, { n: '390', w: 390, h: 844 }].forEach((sz) => {
  test('visibility ' + sz.n, async ({ browser }) => {
    const page = await openFresh(browser, sz.w, sz.h);
    const menu = await page.evaluate(() => {
      const m = document.getElementById('menuO').getBoundingClientRect();
      const card = document.querySelector('#spGrid .sc');
      const name = card.querySelector('.scN') || card;
      const lang = document.querySelector('#langSelWrap .lang-curr');
      const lb = lang.getBoundingClientRect();
      const cs = getComputedStyle(name);
      const bg = getComputedStyle(card).backgroundColor;
      const lc = getComputedStyle(lang);
      return {
        menuW: m.width, vw: innerWidth,
        cardFs: parseFloat(cs.fontSize), cardColor: cs.color, cardBg: bg,
        langH: lb.height, langBg: lc.backgroundColor, langColor: lc.color,
        setZ: +getComputedStyle(document.getElementById('setO')).zIndex,
        menuZ: +getComputedStyle(document.getElementById('menuO')).zIndex
      };
    });
    expect(menu.menuW).toBe(menu.vw);
    expect(menu.cardFs).toBeGreaterThanOrEqual(13);
    expect(contrast(menu.cardColor, menu.cardBg)).toBeGreaterThanOrEqual(4.5);
    expect(menu.langH).toBeGreaterThanOrEqual(48);
    expect(contrast(menu.langColor, menu.langBg)).toBeGreaterThanOrEqual(4.5);
    await page.click('#setBtn2');
    await page.waitForTimeout(300);
    const set = await page.evaluate(() => {
      const s = document.getElementById('setO');
      const b = s.getBoundingClientRect();
      return { w: b.width, z: +getComputedStyle(s).zIndex, menuZ: +getComputedStyle(document.getElementById('menuO')).zIndex, show: s.className.indexOf('show') >= 0 };
    });
    expect(set.show).toBe(true);
    expect(set.w).toBe(sz.w);
    expect(set.z).toBeGreaterThan(set.menuZ);
    await page.evaluate('document.getElementById("setO").className="ov"');
    await page.click('#startBtn');
    await page.waitForFunction('document.getElementById("introO").className.indexOf("show")>=0 || state==="playing"');
    const intro = await page.evaluate(() => {
      const io = document.getElementById('introO');
      const shown = io.className.indexOf('show') >= 0;
      const b = io.getBoundingClientRect();
      const ok = document.getElementById('introOk').getBoundingClientRect();
      return { shown, w: b.width, h: b.height, state, menu: document.getElementById('menuO').className, okH: ok.height, okFs: parseFloat(getComputedStyle(document.getElementById('introOk')).fontSize) };
    });
    if (intro.shown) {
      expect(intro.state).toBe('paused');
      expect(intro.menu).not.toContain('show');
      expect(intro.w).toBe(sz.w);
      expect(intro.h).toBe(sz.h);
      expect(intro.okH).toBeGreaterThanOrEqual(48);
      expect(intro.okFs).toBeGreaterThanOrEqual(18);
      await page.click('#introOk');
    }
    await page.waitForFunction('state==="playing"', null, { timeout: 8000 });
    const play = await page.evaluate(() => {
      const hud = document.getElementById('hud');
      const hb = hud.getBoundingClientRect();
      const pb = document.getElementById('pauseBtn').getBoundingClientRect();
      const empty = hb.height > 8 && !(hud.textContent || '').trim();
      return { state, hudW: hb.width, hudH: hb.height, empty, pause: Math.min(pb.width, pb.height), text: hud.innerText || '' };
    });
    expect(play.state).toBe('playing');
    expect(play.empty).toBe(false);
    expect(play.hudW).toBeGreaterThan(80);
    expect(play.hudH).toBeGreaterThan(40);
    expect(play.pause).toBeGreaterThanOrEqual(48);
    expect(play.text).toContain('Pop');
    await page.click('#pauseBtn');
    await page.waitForFunction('document.getElementById("pauseO").className.indexOf("show")>=0');
    expect(await page.evaluate('state')).toBe('paused');
    await page.click('#pExit');
    const exit = await page.evaluate(() => {
      const y = document.getElementById('ecYes').getBoundingClientRect();
      const n = document.getElementById('ecNo').getBoundingClientRect();
      const e = document.getElementById('exitConfirm').getBoundingClientRect();
      return { ew: e.width, yw: y.width, nw: n.width, yh: y.height, nh: n.height };
    });
    expect(exit.ew).toBe(sz.w);
    expect(exit.yh).toBeGreaterThanOrEqual(48);
    expect(exit.nh).toBeGreaterThanOrEqual(48);
    expect(Math.abs(exit.yw - exit.nw)).toBeLessThanOrEqual(2);
    const minW = sz.w <= 430 ? sz.w * 0.8 : sz.w * 0.4;
    expect(Math.max(exit.yw, exit.nw)).toBeGreaterThanOrEqual(minW * 0.9);
    await page.evaluate('document.getElementById("ecNo").click()');
    await page.evaluate('window.__igsTest.killPlayer()');
    await page.waitForFunction('document.getElementById("deadO").className.indexOf("show")>=0');
    const dead = await page.evaluate(() => {
      const t = document.getElementById('deadT').textContent || '';
      const body = document.getElementById('deadStats').innerText || '';
      const r = document.getElementById('restartBtn').getBoundingClientRect();
      const m = document.getElementById('menuBtn').getBoundingClientRect();
      return { t, body, rw: r.width, mw: m.width, rh: r.height, mh: m.height, pause: document.getElementById('pauseO').className };
    });
    expect(dead.t).toBe('Your cell died');
    expect(dead.pause).not.toContain('show');
    expect(dead.rh).toBeGreaterThanOrEqual(48);
    expect(Math.abs(dead.rw - dead.mw)).toBeLessThanOrEqual(2);
    expect(dead.rw).toBeGreaterThanOrEqual(minW * 0.9);
    await page.close();
  });
});
});
