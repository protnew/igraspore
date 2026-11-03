const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = 'http://127.0.0.1:8820';
const OUT = path.resolve('09-Docs/out-dev-factory/theme-shots-v29-all');
async function dismiss(page){
  await page.evaluate(`(function(){try{closeIntroCard&&closeIntroCard()}catch(e){}
    ['roleCardOk','tutSkip','resBtn','okBtn'].forEach(function(id){var el=document.getElementById(id); if(el) try{el.click()}catch(e){}});
    document.querySelectorAll('.ov.show button,.role-card button,#roleCard button').forEach(function(b){try{b.click()}catch(e){}});
    ['introO','roleCard','tutO','pauseO'].forEach(function(id){var el=document.getElementById(id); if(el){ el.classList.remove('show'); el.style.display='none'; }});
    try{if(typeof state!=='undefined' && state==='paused') state='playing';}catch(e){}
    try{ if(window.igsThemeVisuals) igsThemeVisuals.install(); }catch(e){}})()`);
}
(async()=>{
  const browser = await chromium.launch({ headless:true, channel:'chrome' });
  for (const theme of ['neon-bio','haeckel-watercolor','phase-contrast','cyberpunk-scanner','engraving','glass-lab']) {
    const ctx = await browser.newContext({ viewport:{ width:1400, height:900 } });
    const page = await ctx.newPage();
    const url = BASE+'/?lang=en&themePond='+theme+'&themeBestiary='+theme+'&t='+Date.now();
    await page.goto(url, { waitUntil:'domcontentloaded', timeout:45000 });
    await page.waitForSelector('#startBtn', { timeout:30000 });
    await page.waitForTimeout(800);
    await page.evaluate("document.getElementById('startBtn').click()");
    await page.waitForFunction('!!(window.player&&player.alive)', null, { timeout:60000 });
    await dismiss(page);
    await page.waitForFunction('!!window.igsThemeEngine', null, { timeout:10000 });
    await page.evaluate(`(function(th){
      if(window.igsThemeEngine){ window.igsThemeEngine.applyThemePond(th); window.igsThemeEngine.applyThemeBestiary(th); }
      try{ if(window.igsThemeVisuals) igsThemeVisuals.install(); }catch(e){}
      try{ if(typeof enableWebGLRenderMode==='function'){ settings.renderMode='webgl'; enableWebGLRenderMode(); } }catch(e){}
      try{ window.__igsThemeDayLight = (th==='neon-bio'?0.12: th==='cyberpunk-scanner'?0.28: window.__igsThemeDayLight); }catch(e){}
    })(${JSON.stringify(theme)})`);
    await page.waitForTimeout(900);
    await dismiss(page);
    await page.screenshot({ path: path.join(OUT, 'pond_'+theme+'_1400_en.png') });
    await page.evaluate(`(function(){
      var b=document.getElementById('bWiki')||document.getElementById('wikiBtnMenu');
      if(b) b.click(); else { var w=document.getElementById('wikiO'); if(w) w.className='ov show'; if(typeof buildWiki==='function') try{buildWiki()}catch(e){} }
      if(window.igsThemeEngine&&window.igsThemeEngine.injectWikiSwitcher) window.igsThemeEngine.injectWikiSwitcher();
      if(window.igsThemeWikiEnhance) window.igsThemeWikiEnhance();
    })()`);
    await page.waitForTimeout(500);
    const thumbs = await page.evaluate('document.querySelectorAll(".wiki-thumb").length');
    console.log(theme, 'thumbs', thumbs, 'day', await page.evaluate('window.__igsThemeDayLight'));
    await page.screenshot({ path: path.join(OUT, 'bestiary_'+theme+'_1400_en.png') });
    await ctx.close();
  }
  await browser.close();
  console.log('OK targeted');
})().catch(e=>{console.error(e); process.exit(1);});
