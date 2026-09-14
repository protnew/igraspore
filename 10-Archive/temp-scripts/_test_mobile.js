const { chromium } = require('playwright');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true,
    args: ['--use-fake-ui-for-media-stream'] });
  // iPhone 12 Pro viewport
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,200)));
  page.on('console', msg => { if (msg.type()==='error') errors.push('console:'+msg.text().slice(0,200)); });
  
  console.log('goto', URL);
  await page.goto(URL + '?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);
  
  // Take menu screenshot
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOBILE-menu.png' });
  
  // Start game (click start button)
  await page.evaluate(() => {
    try { localStorage.setItem('igraspore_tut_v2','1'); } catch(e){}
  });
  await page.evaluate(() => {
    var sb = document.getElementById('startBtn');
    if (sb) sb.click();
  });
  await page.waitForTimeout(3000);
  
  // Check mobile-active class
  const isMobile = await page.evaluate(() => document.body.classList.contains('mobile-active'));
  console.log('mobile-active:', isMobile);
  
  // Check joystick zone exists
  const hasJoy = await page.evaluate(() => !!document.getElementById('joyZone'));
  console.log('joyZone:', hasJoy);
  
  // Check mobile buttons
  const mBtns = await page.evaluate(() => Array.from(document.querySelectorAll('#mActBar .mBtn')).length);
  console.log('mActBar buttons:', mBtns);
  
  // Check density cap
  const density = await page.evaluate(() => typeof settings !== 'undefined' ? settings.density : 'undef');
  console.log('density:', density);
  
  // Check canvas size
  const canvasSize = await page.evaluate(() => {
    var cv = document.getElementById('c');
    return cv ? { w: cv.width, h: cv.height } : null;
  });
  console.log('canvas:', JSON.stringify(canvasSize));
  
  // Check game state
  const state = await page.evaluate(() => ({
    alive: typeof orgs !== 'undefined' ? orgs.filter(o=>o&&o.alive).length : -1,
    player: typeof player !== 'undefined' && player ? (player.sp ? player.sp.name : 'unknown') : 'none',
    energy: typeof player !== 'undefined' && player ? Math.round(player.energy||0) : -1,
    paused: typeof paused !== 'undefined' ? paused : 'undef',
  }));
  console.log('game state:', JSON.stringify(state));
  
  // In-game screenshot
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOBILE-game.png' });
  
  // Simulate joystick touch: touch in left-bottom zone
  await page.touchscreen.tap(80, 700);
  await page.waitForTimeout(500);
  
  // Check if joystick appeared
  const joyVisible = await page.evaluate(() => {
    var jb = document.getElementById('joyBase');
    return jb ? getComputedStyle(jb).display !== 'none' : false;
  });
  console.log('joystick visible after tap:', joyVisible);
  
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOBILE-joystick.png' });
  
  // Scroll/swipe up on right side to test pinch (won't fully test but checks no crash)
  await page.waitForTimeout(1000);
  
  // Final check
  console.log('errors:', errors.length);
  if (errors.length) console.log('error[0]:', errors[0]);
  
  await browser.close();
  console.log('DONE');
})().catch(e=>{ console.error('FAIL', e); process.exit(1); });
