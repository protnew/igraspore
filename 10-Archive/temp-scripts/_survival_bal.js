const { chromium } = require('playwright');
const fs = require('fs');
const URL = process.argv[2];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0,120)));
  console.log('goto', URL);
  await page.goto(URL + '?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof startGame === 'function' || typeof SPECIES_DB !== 'undefined', null, {timeout:20000}).catch(()=>{});
  await page.evaluate(() => { try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){} });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    if (typeof difficulty !== 'undefined') difficulty = 'easy';
    if (typeof settings !== 'undefined' && settings) { settings.density = Math.min(settings.density||1, 0.7); }
    if (typeof startGame === 'function') startGame();
  });
  await page.waitForTimeout(1200);
  const series = [];
  async function snap(t){
    const s = await page.evaluate((t) => {
      const alive = (typeof orgs!=='undefined'?orgs:[]).filter(o=>o && o.alive);
      const byCat = {}, bySp = {};
      for (const o of alive) {
        const c = (o.sp && o.sp.cat) || '?';
        const n = (o.sp && (o.sp.name || o.sp.id)) || '?';
        byCat[c]=(byCat[c]||0)+1;
        if(!bySp[n]) bySp[n]={cat:c,n:0}; bySp[n].n++;
      }
      return {t, alive:alive.length, viruses:(typeof viruses!=='undefined'?viruses.length:0), byCat, bySp, nSp:Object.keys(bySp).length};
    }, t);
    series.push(s);
    console.log('t='+t,'alive='+s.alive,'sp='+s.nSp,'vir='+s.viruses, JSON.stringify(s.byCat));
  }
  await snap(0);
  // 3 x 15s with dt=1/30 and fewer internal calls via larger dt
  for (const t of [15,30,45]) {
    await page.evaluate(() => {
      const steps = 15 * 30; // 15s @30fps
      const dt = 1/30;
      for (let i=0;i<steps;i++) {
        if (typeof updateWorld === 'function') updateWorld(dt);
      }
    });
    await snap(t);
  }
  const start = series[0].bySp, end = series[series.length-1].bySp;
  const names = new Set([...Object.keys(start), ...Object.keys(end)]);
  const outs = [];
  for (const name of names) {
    const a = start[name]?.n||0, b = end[name]?.n||0;
    const cat = (end[name]||start[name]||{}).cat||'?';
    let status='stable';
    if(a===0&&b>0) status='emerged';
    else if(a>0&&b===0) status='extinct';
    else if(a>0&&b<a*0.3) status='crash';
    else if(a>0&&b>a*1.8) status='boom';
    outs.push({name,cat,n0:a,n45:b,status});
  }
  const bySt={}; outs.forEach(o=>bySt[o.status]=(bySt[o.status]||0)+1);
  const catsEnd={}; outs.filter(o=>o.n45>0).forEach(o=>catsEnd[o.cat]=(catsEnd[o.cat]||0)+1);
  const crash=outs.filter(o=>o.status==='crash').sort((a,b)=>b.n0-a.n0);
  const extinct=outs.filter(o=>o.status==='extinct');
  const rep={url:URL,series:series.map(s=>({t:s.t,alive:s.alive,nSp:s.nSp,viruses:s.viruses,byCat:s.byCat})),bySt,catsEnd,crash,extinct,outs,jsErrors:errors};
  fs.writeFileSync('C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/SURVIVAL-BAL.json', JSON.stringify(rep,null,2));
  console.log('SUMMARY', JSON.stringify({bySt,catsEnd,crash:crash.map(c=>c.name+':'+c.n0+'->'+c.n45),extinct:extinct.map(e=>e.name),err:errors.length}));
  await page.screenshot({path:'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/BAL-45s.png'});
  await browser.close();
})().catch(e=>{console.error('FAIL',e); process.exit(1);});
