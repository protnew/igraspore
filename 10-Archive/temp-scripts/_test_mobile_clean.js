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
  await page.goto(URL + '?v=cln' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.evaluate(() => { var sb=document.getElementById('startBtn'); if(sb) sb.click(); });
  await page.waitForTimeout(4000);
  
  // Dismiss any popup/tutorial
  await page.evaluate(() => {
    // Click "Понятно — плыву" or any dismiss button
    var btns = document.querySelectorAll('button, .btn');
    for (var i=0; i<btns.length; i++) {
      if (btns[i].textContent.indexOf('Понятно') >= 0 || btns[i].textContent.indexOf('плыву') >= 0) {
        btns[i].click();
        break;
      }
    }
    // Close role card
    var rc = document.getElementById('roleCard');
    if (rc) rc.style.display = 'none';
    // Close tip
    var tip = document.getElementById('tip');
    if (tip) tip.style.display = 'none';
    // Close any overlay
    var overlays = document.querySelectorAll('.ov.show');
    overlays.forEach(function(o){ if(o.id !== 'menuO') o.classList.remove('show'); });
  });
  await page.waitForTimeout(2000);
  
  // Screenshot clean gameplay
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOB4-clean.png' });

  // Also measure clean state
  const dims = await page.evaluate(() => {
    function info(id){var e=document.getElementById(id);if(!e)return{id,exists:false};var r=e.getBoundingClientRect();var s=getComputedStyle(e);return{id,exists:true,x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),display:s.display}}
    var ids=['actBar','keyHint','leftContainer','renderModeBtn','mm','pc','spdBar','mJoy','mActs','mTop','hud','topR','weatherP','tip','roleCard'];
    var e={};ids.forEach(function(id){e[id]=info(id)});
    // visible UI area
    var visible=0;
    ['mm','pc','renderModeBtn','mActs','mTop','hud','topR'].forEach(function(id){
      if(e[id]&&e[id].exists&&e[id].display!=='none'){visible+=e[id].w*e[id].h}
    });
    // mJoy zone is transparent overlay (doesn't block view)
    var screenArea=390*844;
    return{e,visible,visiblePct:Math.round(visible/screenArea*100),screenArea};
  });
  console.log('VISIBLE UI (non-overlay): ' + dims.visible + 'px = ' + dims.visiblePct + '%');
  console.log('mJoy zone (transparent): ' + (dims.e.mJoy.exists ? dims.e.mJoy.w+'x'+dims.e.mJoy.h+' display='+dims.e.mJoy.display : 'N/A'));
  console.log('mActs: ' + (dims.e.mActs.exists ? dims.e.mActs.w+'x'+dims.e.mActs.h+' display='+dims.e.mActs.display : 'N/A'));
  console.log('actBar hidden: ' + (dims.e.actBar.display === 'none'));
  console.log('keyHint hidden: ' + (dims.e.keyHint.display === 'none'));
  console.log('leftContainer hidden: ' + (dims.e.leftContainer.display === 'none'));
  
  await browser.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1)});
