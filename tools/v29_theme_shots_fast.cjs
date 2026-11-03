const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8820';
const OUT = path.resolve('09-Docs/out-dev-factory/theme-shots-v29');
const THEMES = ['classic', 'neon-bio', 'phase-contrast'];
const LANGS = ['en', 'ru', 'ar', 'hi'];
const VIEWS = [{ name: '375', width: 375, height: 812 }, { name: '1400', width: 1400, height: 900 }];
fs.mkdirSync(OUT, { recursive: true });
async function dismiss(page){
  await page.evaluate(`(function(){try{closeIntroCard&&closeIntroCard()}catch(e){}
    var rc=document.getElementById('roleCardOk'); if(rc) try{rc.click()}catch(e){}
    var skip=document.getElementById('tutSkip'); if(skip) try{skip.click()}catch(e){}
    var res=document.getElementById('resBtn'); if(res) try{res.click()}catch(e){}
    ['introO','roleCard','tutO','pauseO'].forEach(function(id){var el=document.getElementById(id); if(el) el.classList.remove('show');});
    try{if(state==='paused') state='playing';}catch(e){}})()`);
}
async function startPlaying(page, lang){
  await page.goto(BASE+'/?lang='+lang+'&t='+Date.now(),{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForSelector('#startBtn',{timeout:30000});
  await page.waitForTimeout(1200);
  await page.evaluate("document.getElementById('startBtn').click()");
  await page.waitForFunction('!!(window.player&&player.alive)&&(state==="playing"||state==="paused")',null,{timeout:60000,polling:150});
  await dismiss(page);
  await page.waitForFunction('!!window.igsThemeEngine',null,{timeout:10000});
  await page.waitForTimeout(400);
}
async function applyThemes(page,b,p){
  await page.evaluate(`(function(b,p){localStorage.setItem('igs.theme.bestiary',b);localStorage.setItem('igs.theme.pond',p);
    if(window.igsThemeEngine){window.igsThemeEngine.applyThemePond(p);window.igsThemeEngine.applyThemeBestiary(b);}})(${JSON.stringify(b)},${JSON.stringify(p)})`);
  await page.waitForTimeout(200);
}
async function openWiki(page){
  await page.evaluate(`(function(){var b=document.getElementById('bWiki')||document.getElementById('wikiBtnMenu');
    if(b) b.click(); else {var w=document.getElementById('wikiO'); if(w) w.className='ov show'; if(typeof buildWiki==='function') try{buildWiki()}catch(e){}}
    if(window.igsThemeEngine&&window.igsThemeEngine.injectWikiSwitcher) window.igsThemeEngine.injectWikiSwitcher();})()`);
  await page.waitForTimeout(450);
}
async function closeWiki(page){
  await page.evaluate(`(function(){var c=document.getElementById('wikiClose'); if(c) c.click();
    var w=document.getElementById('wikiO'); if(w){w.classList.remove('show'); w.className='ov';}})()`);
  await page.waitForTimeout(150);
}
(async()=>{
  const browser=await chromium.launch({headless:true});
  const report={shots:[],hitTargets:{},errors:[],base:BASE,startedAt:new Date().toISOString()};
  let n=0;
  for(const view of VIEWS){
    for(const lang of LANGS){
      const ctx=await browser.newContext({viewport:{width:view.width,height:view.height}});
      const page=await ctx.newPage();
      try{
        await startPlaying(page,lang);
        if(lang==='en'){
          await applyThemes(page,'neon-bio','neon-bio');
          await dismiss(page);
          const pondBox=await page.evaluate(`(function(){var el=document.getElementById('themeSelPond'); if(!el) return null; var r=el.getBoundingClientRect(); return {w:+r.width.toFixed(1),h:+r.height.toFixed(1)};})()`);
          await openWiki(page);
          const bestBox=await page.evaluate(`(function(){var el=document.getElementById('themeSelBestiary'); if(!el) return null; var r=el.getBoundingClientRect(); return {w:+r.width.toFixed(1),h:+r.height.toFixed(1)};})()`);
          report.hitTargets[view.name]={pond:pondBox,bestiary:bestBox};
          await closeWiki(page);
        }
        for(const theme of THEMES){
          await applyThemes(page,theme,theme);
          await closeWiki(page); await dismiss(page); await page.waitForTimeout(250);
          const pf='pond_'+theme+'_'+view.name+'_'+lang+'.png';
          await page.screenshot({path:path.join(OUT,pf)}); n++; report.shots.push(pf);
          await openWiki(page);
          const bf='bestiary_'+theme+'_'+view.name+'_'+lang+'.png';
          await page.screenshot({path:path.join(OUT,bf)}); n++; report.shots.push(bf);
          await closeWiki(page);
        }
        console.log('OK',view.name,lang,n);
      }catch(e){ report.errors.push(view.name+'/'+lang+':'+String(e.message||e).slice(0,180)); console.error('ERR',view.name,lang,e.message); }
      await ctx.close();
    }
  }
  report.shotCount=n; report.finishedAt=new Date().toISOString();
  const prev=JSON.parse(fs.readFileSync(path.join(OUT,'matrix-report.json'),'utf8'));
  report.fps=prev.fps||{};
  fs.writeFileSync(path.join(OUT,'matrix-report.json'), JSON.stringify(report,null,2));
  console.log('DONE',n,'errors',report.errors.length,'hits',JSON.stringify(report.hitTargets));
  await browser.close();
  process.exit(n>=48 && report.errors.length===0 ? 0 : 1);
})().catch(e=>{console.error(e);process.exit(1);});
