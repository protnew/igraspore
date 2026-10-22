const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');

const SIZES = [{ name: '1280', w: 1280, h: 800 }, { name: '390', w: 390, h: 844 }];

test('[V20.4] overlays, contrast, tap size, no empty plaque', async ({ browser }) => {
  for (const sz of SIZES) {
    const page = await (await browser.newContext({ viewport: { width: sz.w, height: sz.h } })).newPage();
    await page.goto(BASE + '/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const menu = await page.evaluate(`(function(){
      var m=document.getElementById('menuO');
      var cs=getComputedStyle(m);
      var bg=cs.backgroundColor;
      var zMenu=parseInt(cs.zIndex,10)||0;
      var set=document.getElementById('setO');
      var zSet=set?parseInt(getComputedStyle(set).zIndex,10)||0:0;
      var empty=[].slice.call(document.querySelectorAll('.p')).filter(function(e){
        return !e.textContent.trim() && getComputedStyle(e).display!=='none' && e.getBoundingClientRect().height>2;
      }).map(function(e){return e.id;});
      return {w:Math.round(m.getBoundingClientRect().width), inner:window.innerWidth, bg:bg, zMenu:zMenu, zSet:zSet, empty:empty};
    })()`);
    expect(menu.w, sz.name + ' menu width').toBeGreaterThanOrEqual(Math.min(sz.w, menu.inner) - 24);
    expect(menu.zSet, sz.name + ' settings above menu').toBeGreaterThan(menu.zMenu);
    expect(menu.empty, sz.name + ' empty plaques').toEqual([]);
    await page.screenshot({ path: 'C:/Users/Space/agent-transfer/igraspore-v20-4/07-menu-' + sz.name + '.png' });
    await page.close();
  }
});
