
const { test } = require('@playwright/test');

test('Color debug', async ({ page }) => {
  page.setDefaultTimeout(15000);
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore%20V2/index.html', { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await page.waitForTimeout(1500);
  
  // Switch to realistic
  await page.evaluate(() => {
    if(settings.renderMode !== 'realistic') toggleRenderModeLarge();
  });
  await page.waitForTimeout(500);
  
  // Check what color the player organism would be rendered with
  const colorInfo = await page.evaluate(() => {
    var o = player;
    if(!o) return 'no player';
    var rgb = hex2rgb(o.sp.color);
    var healthRatio = o.energy/100;
    var tint = 0.4 + healthRatio * 0.8;
    
    // Realistic conversion
    var gray = Math.round((rgb[0]*0.3 + rgb[1]*0.59 + rgb[2]*0.11) * tint);
    var realRgb = [
      Math.min(255, Math.round(gray*1.1)),
      Math.min(255, Math.round(gray*1.05)),
      Math.min(255, Math.round(gray*0.85))
    ];
    
    var bc = shadeRgb(realRgb[0], realRgb[1], realRgb[2], tint);
    
    return JSON.stringify({
      species: o.sp.name,
      origColor: o.sp.color,
      origRgb: rgb,
      healthRatio: Math.round(healthRatio*100)/100,
      tint: Math.round(tint*100)/100,
      gray: gray,
      realRgb: realRgb,
      realisticColor: bc,
      mode: settings.renderMode,
    });
  });
  console.log('COLOR: ' + colorInfo);
  console.log('DONE');
});
