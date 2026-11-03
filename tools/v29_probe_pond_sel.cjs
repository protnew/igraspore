const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto('http://127.0.0.1:8820/?lang=en&t='+Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#startBtn');
  await page.waitForTimeout(1200);
  await page.evaluate("document.getElementById('startBtn').click()");
  await page.waitForFunction('!!(window.player&&player.alive)', null, { timeout: 60000 });
  await page.evaluate(`(function(){
    try{closeIntroCard&&closeIntroCard()}catch(e){}
    var rc=document.getElementById('roleCardOk'); if(rc) rc.click();
    var skip=document.getElementById('tutSkip'); if(skip) skip.click();
    var res=document.getElementById('resBtn'); if(res) res.click();
    if(state==='paused') state='playing';
    if(window.igsThemeEngine) window.igsThemeEngine.initThemes();
  })()`);
  await page.waitForTimeout(800);
  const info = await page.evaluate(`(function(){
    var stack=document.getElementById('topRightStack');
    var bar=document.getElementById('themePondBar');
    var sel=document.getElementById('themeSelPond');
    function box(el){ if(!el) return null; var r=el.getBoundingClientRect(); var cs=getComputedStyle(el); return {w:r.width,h:r.height,disp:cs.display,vis:cs.visibility,op:cs.opacity,parent:el.parentElement&&el.parentElement.id}; }
    return {
      stack: box(stack),
      bar: box(bar),
      sel: box(sel),
      stackHTML: stack ? stack.innerHTML.slice(0,300) : null,
      themePond: document.documentElement.getAttribute('data-theme-pond'),
      ls: localStorage.getItem('igs.theme.pond')
    };
  })()`);
  console.log(JSON.stringify(info,null,2));
  await page.screenshot({ path: '09-Docs/out-dev-factory/theme-shots-v29/probe_pond_bar.png' });
  await browser.close();
})().catch(e=>{console.error(e); process.exit(1);});
