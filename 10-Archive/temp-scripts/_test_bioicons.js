const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  
  await page.goto('https://igraspore.pages.dev?v=bi' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => { 
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    if (typeof difficulty !== 'undefined') difficulty = 'easy'; 
    if (typeof startGame === 'function') startGame(); 
  });
  await page.waitForTimeout(2000);
  
  // Switch to bioicons mode
  const result = await page.evaluate(() => {
    // Click the render mode button to cycle to bioicons
    settings.renderMode = 'bioicons';
    if (typeof applyRenderMode === 'function') applyRenderMode();
    
    // Load bioicons
    if (typeof window.loadBioicons === 'function') {
      window.loadBioicons();
      return { hasFunction: true };
    }
    return { hasFunction: false, hasDraw: typeof drawBioicon === 'function' };
  });
  console.log('Bioicons switch:', JSON.stringify(result));
  
  // Wait for sprites to load
  await page.waitForTimeout(3000);
  
  // Check if sprites loaded
  const ready = await page.evaluate(() => {
    return {
      bioiconsReady: window.bioiconsReady ? window.bioiconsReady() : 'no func',
      hasDrawBioicon: typeof window.drawBioicon === 'function',
      renderMode: settings.renderMode,
    };
  });
  console.log('Bioicons status:', JSON.stringify(ready));
  
  // Take screenshot
  await page.evaluate(() => { for(var i=0;i<30;i++) updateWorld(1/30); });
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BIOICONS-1.png' });
  
  // Check for canvas errors
  console.log('JS ERRORS:', errors.length);
  errors.slice(0,5).forEach(function(e){console.log('  ', e);});
  
  await browser.close();
})().catch(function(e){console.error(e);process.exit(1)});
