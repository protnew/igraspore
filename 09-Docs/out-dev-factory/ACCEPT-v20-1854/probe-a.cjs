// probe-a.cjs — БЛОК A приёмка (B1,B2,B3,B4,B5,B6,B13) на 8796 (v3-webgl)
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
const fs = require('fs');
const BASE = 'http://127.0.0.1:8796/';
const OUT = 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message.slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 200)); });
  page.on('response', r => { if (r.status() >= 400) { errs.push('HTTP' + r.status() + ': ' + r.url()); (page.__urls404 = page.__urls404 || []).push(r.status() + ' ' + r.url()); } });
  const R = { errs };
  const shot = (n) => page.screenshot({ path: OUT + '/' + n + '.png' });

  await page.goto(BASE + '?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  R.testHook = await page.evaluate('typeof window.__igsTest');

  // --- B6: intro card, пауза ---
  await page.click('#startBtn');
  await page.waitForTimeout(700);
  R.b6 = await page.evaluate(`({state, introShown: document.getElementById('introO').className, energy: player?player.energy:0})`);
  await shot('v20-B6-card');
  R.b6_energyPaused = await page.evaluate('player.energy');
  await page.waitForTimeout(1500);
  R.b6_energyAfter = await page.evaluate('player.energy');
  await page.evaluate('window.closeIntroCard()');
  await page.waitForTimeout(300);

  // --- B2: Esc → пауза; pExit → подтверждение; Нет; Esc-Esc ---
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  R.b2_esc = await page.evaluate(`({state, pause: document.getElementById('pauseO').className, playerAlive: !!(player&&player.alive)})`);
  await shot('v20-B2-pause');
  await page.click('#pExit');
  await page.waitForTimeout(250);
  R.b2_confirm = await page.evaluate(`document.getElementById('exitConfirm').className`);
  await shot('v20-B2-confirm');
  await page.click('#ecNo');
  await page.waitForTimeout(200);
  R.b2_no = await page.evaluate(`({state, pause: document.getElementById('pauseO').className})`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  R.b2_resume = await page.evaluate(`({state, pause: document.getElementById('pauseO').className})`);

  // --- B13: killPlayer → deadO ≤2s ---
  const t0 = Date.now();
  await page.evaluate('window.__igsTest.killPlayer()');
  await page.waitForFunction(`document.getElementById('deadO').className==='ov show'`, null, { timeout: 4000 }).catch(()=>{});
  R.b13 = await page.evaluate(`({dead: document.getElementById('deadO').className, ms: ${Date.now()} - ${t0}})`);
  await shot('v20-B13-dead');

  // --- B3: меню — 9 элементов HUD скрыты ---
  await page.evaluate(`document.getElementById('menuBtn').click()`);
  await page.waitForTimeout(400);
  R.b3 = await page.evaluate(`(function(){
    var ids=['hud','topR','ecoP','legP','actBar','scaleW','spdBar','todWrap','camM'];
    var out={}; for(var i=0;i<ids.length;i++){ var el=document.getElementById(ids[i]);
      out[ids[i]] = el ? (getComputedStyle(el).display==='none' || el.getBoundingClientRect().width===0) : 'missing'; }
    out.state=state; return out; })()`);
  await shot('v20-B3-menu-clean');

  // --- B4/B5: демо ---
  await page.goto(BASE + '?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.click('#screensaverBtn');
  await page.waitForTimeout(3000);
  R.b4_t3 = await page.evaluate(`(function(){
    var vis=0; var vL=cam.x-cv.width/2/zoom, vR=cam.x+cv.width/2/zoom, vT=cam.y-cv.height/2/zoom, vB=cam.y+cv.height/2/zoom;
    for(var i=0;i<orgs.length;i++){var o=orgs[i]; if(o&&o.alive&&o.x>vL&&o.x<vR&&o.y>vT&&o.y<vB)vis++;}
    return {state, playerAlive: !!(player&&player.alive), autoAI: !!autoAI, camX: Math.round(cam.x), camY: Math.round(cam.y), visible: vis,
      badge: document.getElementById('demoBadge').style.display, badgeTxt: document.getElementById('demoBadge').textContent};})()`);
  await page.waitForTimeout(2000);
  R.b4_t5 = await page.evaluate(`({camX: Math.round(cam.x), camY: Math.round(cam.y), playerAlive: !!(player&&player.alive)})`);
  await shot('v20-B4-demo-0');
  R.b5_exitBtn = await page.evaluate(`(function(){var x=document.getElementById('demoExit');var r=x.getBoundingClientRect();return {display:x.style.display,w:Math.round(r.width),h:Math.round(r.height)}})()`);
  await shot('v20-B5-demo-x');
  await page.keyboard.press('x');
  await page.waitForTimeout(400);
  R.b5_keyExit = await page.evaluate(`({state, demo: !!window.__igsDemo})`);

  // --- B1: вирус рядом с клеткой, zoom 12 ---
  await page.goto(BASE + '?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(2200);
  await page.click('#startBtn');
  await page.waitForTimeout(400);
  await page.evaluate('window.closeIntroCard()');
  await page.evaluate(`window.__igsTest.spawnVirusNear()`);
  await page.evaluate(`(function(){ zoom=12; tZoom=12; if(player){cam.x=player.x; cam.y=player.y;} })()`);
  await page.waitForTimeout(1200);
  R.b1 = await page.evaluate(`window.__igsTest.getSizes()`);
  R.b1_zoom = 12;
  await shot('v20-B1-virus');

  R.consoleErrCount = errs.length;
  R.urls404 = page.__urls404 || [];
  R.errsSample = errs.slice(0, 6);
  fs.writeFileSync(OUT + '/probe-a-results.json', JSON.stringify(R, null, 1));
  console.log(JSON.stringify(R, null, 1));
  await browser.close();
})().catch(e => { console.error('PROBE FAIL:', e.message); process.exit(1); });
