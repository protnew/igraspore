const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    hasTouch: true, isMobile: true, deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,150)));
  page.on('console', msg => { if (msg.type()==='error') errors.push('console:'+msg.text().slice(0,150)); });

  await page.goto(URL + '?v=crit' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);
  
  // Start game
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => { var sb=document.getElementById('startBtn'); if(sb) sb.click(); });
  await page.waitForTimeout(4000);

  // Wait for purgeDesktop to kick in
  await page.waitForTimeout(1000);

  // Measure EVERYTHING
  const dims = await page.evaluate(() => {
    function info(id) {
      var el = document.getElementById(id);
      if (!el) return { id, exists: false };
      var r = el.getBoundingClientRect();
      var s = getComputedStyle(el);
      return { id, exists: true, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), display: s.display, vis: s.visibility };
    }
    var screen = { w: 390, h: 844 };
    var elements = {};
    var ids = ['actBar','keyHint','leftContainer','renderModeBtn','mm','pc','spdBar','sandboxTools',
               'mJoy','mJoyB','mJoyK','mActs','mTop','hud','topR','weatherP','tip','scaleBar','camM','todWrap'];
    ids.forEach(function(id){ elements[id] = info(id); });
    
    // Count visible buttons
    var mActBtns = document.querySelectorAll('#mActs .ma');
    var mTopBtns = document.querySelectorAll('#mTop .ma');
    elements._mActBtnCount = mActBtns.length;
    elements._mTopBtnCount = mTopBtns.length;
    
    // Screen coverage calculation
    var uiPixels = 0;
    // mJoy zone
    if (elements.mJoy.exists && elements.mJoy.display !== 'none') {
      uiPixels += elements.mJoy.w * elements.mJoy.h;
    }
    // mActs
    if (elements.mActs.exists && elements.mActs.display !== 'none') {
      var maR = document.getElementById('mActs').getBoundingClientRect();
      uiPixels += maR.width * maR.height;
    }
    // mTop
    if (elements.mTop.exists && elements.mTop.display !== 'none') {
      var mtR = document.getElementById('mTop').getBoundingClientRect();
      uiPixels += mtR.width * mtR.height;
    }
    // minimap
    if (elements.mm.exists && elements.mm.display !== 'none') {
      uiPixels += elements.mm.w * elements.mm.h;
    }
    // pc
    if (elements.pc.exists && elements.pc.display !== 'none') {
      uiPixels += elements.pc.w * elements.pc.h;
    }
    
    var screenArea = screen.w * screen.h;
    return { elements, screenArea, uiPixels, uiPct: Math.round(uiPixels/screenArea*100) };
  });
  
  console.log('SCREEN: 390x844 = ' + dims.screenArea + 'px');
  console.log('UI COVERAGE: ' + dims.uiPixels + 'px = ' + dims.uiPct + '%');
  console.log('');
  console.log('=== KEY ELEMENTS ===');
  var el = dims.elements;
  var report = [
    ['actBar (desktop btns)', el.actBar],
    ['keyHint', el.keyHint],
    ['leftContainer', el.leftContainer],
    ['renderModeBtn', el.renderModeBtn],
    ['mJoy (joystick zone)', el.mJoy],
    ['mActs (right btns)', el.mActs],
    ['mTop (top btns)', el.mTop],
    ['minimap', el.mm],
    ['pop graph', el.pc],
    ['hud', el.hud],
    ['topR', el.topR],
    ['weatherP', el.weatherP],
  ];
  report.forEach(function(r) {
    var e = r[1];
    if (!e || !e.exists) { console.log('  ' + r[0] + ': NOT FOUND'); return; }
    var status = (e.display === 'none') ? 'HIDDEN' : (e.w + 'x' + e.h + ' @' + e.x + ',' + e.y);
    console.log('  ' + r[0] + ': ' + status + ' display=' + e.display);
  });
  console.log('');
  console.log('mActBtns: ' + dims.elements._mActBtnCount + ', mTopBtns: ' + dims.elements._mTopBtnCount);
  console.log('errors: ' + errors.length);
  if (errors.length) console.log('first error: ' + errors[0]);

  // Screenshot
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOB3-game.png' });
  
  await browser.close();
})().catch(e=>{ console.error('FAIL',e); process.exit(1); });
