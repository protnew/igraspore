const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
// БЛОК C (TZ v20): B9,B10,B11,B14,B17,B18,B21
const SIZES = [
  { name: '1280', w: 1280, h: 800 },
  { name: '390', w: 390, h: 844 },
  { name: '360', w: 360, h: 740 },
];
test('[B9+B10] menu: footer bar separate, full width on mobile', async ({ browser }) => {
  for (const sz of SIZES) {
    const page = await (await browser.newContext({ viewport: { width: sz.w, height: sz.h } })).newPage();
    await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
    await page.waitForTimeout(1600);
    const r = await page.evaluate(`(function(){
      var f=document.getElementById('menuFooter'), m=document.getElementById('menuO'), g=document.getElementById('spGrid');
      var fr=f.getBoundingClientRect(), mr=m.getBoundingClientRect();
      var cards=[].slice.call(document.querySelectorAll('#spGrid .sc'));
      var sc=document.querySelector('#menuO .scrollbox')||document.getElementById('spGrid');
      var sr=sc.getBoundingClientRect();
      var overlapCnt=0;
      for(var i=0;i<cards.length;i+=Math.max(1,Math.floor(cards.length/8))){
        var cr=cards[i].getBoundingClientRect();
        if(cr.bottom>sr.bottom+1||cr.top<sr.top-1)continue;
        var v=Math.min(fr.bottom,cr.bottom)-Math.max(fr.top,cr.top);
        var h=Math.min(fr.right,cr.right)-Math.max(fr.left,cr.left);
        if(v>2&&h>2)overlapCnt++;
      }
      return {footerInside: fr.top>=mr.top-1 && fr.bottom<=window.innerHeight+1, overlapCnt: overlapCnt,
              menuW: Math.round(mr.width), innerW: window.innerWidth};})()`);
    expect(r.footerInside, sz.name + ' footer inside').toBe(true);
    expect(r.overlapCnt, sz.name + ' footer/grid overlap').toBe(0);
    if (sz.w <= 480) expect(r.menuW, sz.name + ' full width').toBe(r.innerW);
    await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-C-menu-' + sz.name + '.png' });
    await page.close();
  }
});
test('[B11+B14+B17] HUD: scale/status no overlap, watermark corner, tap sizes', async ({ browser }) => {
  for (const sz of [{ name: '390', w: 390, h: 844 }, { name: '360', w: 360, h: 740 }]) {
    const page = await (await browser.newContext({ viewport: { width: sz.w, height: sz.h } })).newPage();
    await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
    await page.waitForTimeout(1800);
    await page.click('#startBtn'); await page.waitForTimeout(500);
    await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
    await page.waitForTimeout(700);
    const r = await page.evaluate(`(function(){
      function bb(id){var e=document.getElementById(id); if(!e)return null; var b=e.getBoundingClientRect(); return {t:b.top,l:b.left,r:b.right,b:b.bottom,w:b.width,h:b.height};}
      var hud=bb('hud'), sw=bb('scaleW');
      var overlap = hud&&sw ? Math.min(hud.r,sw.r)-Math.max(hud.l,sw.l) : -1;
      var ovl = overlap>0 && (Math.min(hud.b,sw.b)-Math.max(hud.t,sw.t))>0;
      var small=[];
      ['helpBtn','setBtn2','wikiBtnMenu','burgerBtn'].forEach(function(id){var e=document.getElementById(id); if(e){var b=e.getBoundingClientRect(); if(b.height>0&&b.height<48)small.push(id+':'+Math.round(b.height));}});
      var acts=[].slice.call(document.querySelectorAll('#actBar .ab')).filter(function(e){return e.getBoundingClientRect().height>0;});
      acts.forEach(function(e){var b=e.getBoundingClientRect(); if(b.height<48)small.push(e.id+':'+Math.round(b.height));});
      var versionInPlay = !!document.getElementById('verWm') || (document.body.innerText||'').indexOf('v2.0.0')>=0;
      return {scaleOverlap: ovl, versionInPlay: versionInPlay, small: small};})()`);
    expect(r.scaleOverlap, sz.name + ' scale/status overlap').toBe(false);
    expect(r.versionInPlay, sz.name + ' version drawn in play').toBe(false);
    expect(r.small, sz.name + ' small taps').toEqual([]);
    await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-C-hud-' + sz.name + '.png' });
    await page.close();
  }
});
test('[B18] #spFilterStatus in screen or absent', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1600);
  const r = await page.evaluate(`(function(){
    var el=document.getElementById('spFilterStatus'); if(!el) return 'absent';
    var b=el.getBoundingClientRect();
    return (b.width===0||b.left>=window.innerWidth||b.right<=0)?'offscreen':'ok:'+Math.round(b.left)+','+Math.round(b.right);})()`);
  expect(['absent', r.startsWith('ok') ? r : ''].filter(Boolean).length).toBeGreaterThan(0);
  expect(r).not.toBe('offscreen');
});
test('[B21] ☰ opens panel with 8 working actions ≥48px', async ({ page }) => {
  await page.goto(BASE + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  await page.click('#startBtn');
  await page.waitForFunction('document.getElementById("introO").className==="ov show" || state==="playing"', null, { timeout: 10000 });
  await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await page.waitForFunction('state==="playing"', null, { timeout: 5000 });
  await page.evaluate('window.skipTutorial && window.skipTutorial()');
  await page.waitForTimeout(300);
  await page.click('#burgerGame');
  await page.waitForTimeout(300);
  const r = await page.evaluate(`(function(){
    var ids=['apFree','apMicro','apRender','apFol','apZI','apZO','apSandbox','apLeader'];
    var out={ok:0,small:[],wired:0};
    ids.forEach(function(id){var e=document.getElementById(id); if(!e)return; var b=e.getBoundingClientRect();
      if(b.height>=48&&b.width>=48)out.ok++;
      if(e.onclick)out.wired++;});
    return out;})()`);
  expect(r.ok).toBe(8);
  expect(r.wired).toBe(8);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-C-b21-panel.png' });
  await page.click('#apClose');
});
