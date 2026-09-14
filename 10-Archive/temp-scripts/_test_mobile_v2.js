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
  await page.goto(URL + '?v=mtest' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);
  
  // Start game
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => { var sb=document.getElementById('startBtn'); if(sb) sb.click(); });
  await page.waitForTimeout(3000);
  
  // 1. Game with NO touch - see default state
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOB2-idle.png' });
  
  // 2. Measure all mobile UI element dimensions
  const dims = await page.evaluate(() => {
    function dims(id) {
      var el = document.getElementById(id);
      if (!el) return null;
      var r = el.getBoundingClientRect();
      var s = getComputedStyle(el);
      return { id, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
               display: s.display, opacity: s.opacity, z: s.zIndex };
    }
    function dimsAll(sel) {
      var els = document.querySelectorAll(sel);
      return Array.from(els).map(function(el){
        var r = el.getBoundingClientRect();
        return { id: el.id||sel, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      });
    }
    return {
      joyZone: dims('joyZone'),
      joyBase: dims('joyBase'),
      joyKnob: dims('joyKnob'),
      mActBar: dims('mActBar'),
      mTopBar: dims('mTopBar'),
      mActBtns: dimsAll('#mActBar .mBtn'),
      mTopBtns: dimsAll('#mTopBar .mBtn'),
      renderModeBtn: dims('renderModeBtn'),
      mm: dims('mm'),
      pc: dims('pc'),
      leftContainer: dims('leftContainer'),
      canvas: dims('c'),
      body: dims('') || { w: 390, h: 844 },
      screenSize: { w: window.innerWidth, h: window.innerHeight },
    };
  });
  console.log('DIMS:', JSON.stringify(dims, null, 2));
  
  // 3. Simulate touch-hold on joystick zone to see it appear
  // Use touchstart without touchend
  await page.touchscreen.tap(100, 700);
  await page.waitForTimeout(200);
  // The joyBase should appear briefly - screenshot fast
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOB2-joystick.png' });
  
  // 4. Calculate screen coverage
  var jz = dims.joyZone;
  var ab = dims.mActBar;
  var tb = dims.mTopBar;
  if (jz && ab) {
    var screenArea = 390 * 844;
    var jzArea = jz.w * jz.h;
    var abArea = ab.w * ab.h;
    var tbArea = tb ? tb.w * tb.h : 0;
    console.log('COVERAGE: joyZone=' + Math.round(jzArea/screenArea*100) + '% mActBar=' + Math.round(abArea/screenArea*100) + '% mTopBar=' + Math.round(tbArea/screenArea*100) + '%');
    console.log('TOTAL UI=' + Math.round((jzArea+abArea+tbArea)/screenArea*100) + '% of screen');
  }
  
  await browser.close();
  console.log('DONE');
})().catch(e=>{ console.error('FAIL',e); process.exit(1); });
