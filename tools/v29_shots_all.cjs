const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8820';
const OUT = path.resolve('09-Docs/out-dev-factory/theme-shots-v29-all');
const THEMES = ['classic','phase-contrast','neon-bio','glass-lab','cyberpunk-scanner','haeckel-watercolor','engraving'];
const VIEWS = [{ name:'375', width:375, height:812 }, { name:'1400', width:1400, height:900 }];
fs.mkdirSync(OUT, { recursive: true });

async function dismiss(page){
  await page.evaluate(`(function(){try{closeIntroCard&&closeIntroCard()}catch(e){}
    ['roleCardOk','tutSkip','resBtn'].forEach(function(id){var el=document.getElementById(id); if(el) try{el.click()}catch(e){}});
    ['introO','roleCard','tutO','pauseO'].forEach(function(id){var el=document.getElementById(id); if(el) el.classList.remove('show');});
    try{if(state==='paused') state='playing';}catch(e){}})()`);
}
async function start(page, theme){
  const url = BASE+'/?lang=en&themePond='+theme+'&themeBestiary='+theme+'&t='+Date.now();
  await page.goto(url, { waitUntil:'domcontentloaded', timeout:45000 });
  await page.waitForSelector('#startBtn', { timeout:30000 });
  await page.waitForTimeout(1200);
  await page.evaluate("document.getElementById('startBtn').click()");
  await page.waitForFunction('!!(window.player&&player.alive)', null, { timeout:60000 });
  await dismiss(page);
  await page.waitForFunction('!!window.igsThemeEngine', null, { timeout:10000 });
  await page.evaluate(`(function(th){
    if(window.igsThemeEngine){ window.igsThemeEngine.applyThemePond(th); window.igsThemeEngine.applyThemeBestiary(th); }
    try{ if(typeof enableWebGLRenderMode==='function'){ settings.renderMode='webgl'; enableWebGLRenderMode(); } }catch(e){}
  })(${JSON.stringify(theme)})`);
  await page.waitForTimeout(500);
}
async function openWiki(page){
  await page.evaluate(`(function(){
    var b=document.getElementById('bWiki')||document.getElementById('wikiBtnMenu');
    if(b) b.click(); else { var w=document.getElementById('wikiO'); if(w) w.className='ov show'; if(typeof buildWiki==='function') try{buildWiki()}catch(e){} }
    if(window.igsThemeEngine&&window.igsThemeEngine.injectWikiSwitcher) window.igsThemeEngine.injectWikiSwitcher();
  })()`);
  await page.waitForTimeout(500);
}
async function closeWiki(page){
  await page.evaluate(`(function(){var c=document.getElementById('wikiClose'); if(c)c.click();
    var w=document.getElementById('wikiO'); if(w){w.classList.remove('show'); w.className='ov';}})()`);
  await page.waitForTimeout(150);
}
async function fps(page, ms){
  return page.evaluate(`(function(ms){return new Promise(function(res){
    var dts=[], last=performance.now(), t0=last;
    function fr(now){ dts.push(now-last); last=now;
      if(now-t0<ms) requestAnimationFrame(fr);
      else { var fps=dts.map(function(d){return 1000/Math.max(d,0.001);}).sort(function(a,b){return a-b;});
        res({n:fps.length, med:+fps[Math.floor(fps.length/2)].toFixed(1), p5:+fps[Math.max(0,Math.floor(fps.length*0.05))].toFixed(1)}); }
    } requestAnimationFrame(fr);
  })})(${ms})`);
}

(async()=>{
  const browser = await chromium.launch({ headless:true });
  const report = { shots:[], fps:{}, overlap:{}, errors:[], base:BASE, startedAt:new Date().toISOString() };
  let n=0;
  for (const view of VIEWS) {
    for (const theme of THEMES) {
      const ctx = await browser.newContext({ viewport:{ width:view.width, height:view.height } });
      const page = await ctx.newPage();
      page.on('pageerror', e => report.errors.push(theme+'/'+view.name+':'+String(e.message).slice(0,120)));
      try {
        await start(page, theme);
        // overlap check
        const ov = await page.evaluate(`(function(){
          var bar=document.getElementById('themePondBar'); var pause=document.getElementById('pauseBtn');
          function box(el){ if(!el) return null; var r=el.getBoundingClientRect(); var cs=getComputedStyle(el); return {x:r.x,y:r.y,w:r.width,h:r.height,disp:cs.display}; }
          var b=box(bar), p=box(pause);
          var overlap=false;
          if(b&&p&&p.disp!=='none'&&b.w>0&&p.w>0){
            overlap=!(b.x+b.w<=p.x || p.x+p.w<=b.x || b.y+b.h<=p.y || p.y+p.h<=b.y);
          }
          return {bar:b, pause:p, overlap:overlap};
        })()`);
        report.overlap[theme+'_'+view.name] = ov;

        await closeWiki(page); await dismiss(page); await page.waitForTimeout(300);
        const pf = 'pond_'+theme+'_'+view.name+'_en.png';
        await page.screenshot({ path: path.join(OUT, pf) }); n++; report.shots.push(pf);

        await openWiki(page);
        const bf = 'bestiary_'+theme+'_'+view.name+'_en.png';
        await page.screenshot({ path: path.join(OUT, bf) }); n++; report.shots.push(bf);
        await closeWiki(page);

        if (view.name==='375' && (theme==='classic' || theme==='neon-bio')) {
          await dismiss(page);
          report.fps[theme+'_375'] = await fps(page, 20000);
          console.log('FPS', theme, report.fps[theme+'_375']);
        }
        if (view.name==='1400' && theme==='classic') {
          report.fps['classic_1400'] = await fps(page, 15000);
        }
        console.log('OK', theme, view.name, n);
      } catch (e) {
        report.errors.push(theme+'/'+view.name+':'+String(e.message||e).slice(0,180));
        console.error('ERR', theme, view.name, e.message);
      }
      await ctx.close();
    }
  }
  report.shotCount=n; report.finishedAt=new Date().toISOString();
  fs.writeFileSync(path.join(OUT,'matrix-report.json'), JSON.stringify(report,null,2));
  console.log('DONE', n, 'errors', report.errors.length, 'overlapFails', Object.values(report.overlap).filter(o=>o.overlap).length);
  await browser.close();
  process.exit(n >= 28 && report.errors.length===0 ? 0 : 1);
})().catch(e=>{console.error(e); process.exit(1);});
