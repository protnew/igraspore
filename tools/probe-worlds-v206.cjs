// v20.6: probe — 3 последовательных старта дают разные миры; полный пул как у живой генерации
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');

const PAGE_SIDE = `(function(){
  window.state="menu";
  var mo=document.getElementById("menuO"); if(mo) mo.className="ov show";
  if(player){ player.isPlayer=false; }
  player=null;
  return 1;
})()`;

const PAGE_SNAP = `(function(){
  var h=0;
  for(var i=0;i<orgs.length;i++){
    h=(h*31+Math.round(orgs[i].x*7)+Math.round(orgs[i].y*13))|0;
  }
  var cats={};
  for(var j=0;j<orgs.length;j++){
    var o=orgs[j];
    if(o&&o.alive) cats[o.sp.cat]=(cats[o.sp.cat]||0)+1;
  }
  return JSON.stringify({total:orgs.length,hash:h,cats:cats});
})()`;

async function freshStart(page){
  await page.evaluate(PAGE_SIDE);
  await page.waitForTimeout(150);
  await page.evaluate(`(function(){ window.IGS_PHASE=[]; document.getElementById("startBtn").click(); return 1})()`);
  await page.waitForFunction(`(function(){ var p=window.IGS_PHASE||[]; for(var i=0;i<p.length;i++) if(p[i][0]==='world.full') return true; return !window._chunkPop && (window.state==='playing'||window.state==='paused'); })()`, null, { timeout: 8000 });
  return page.evaluate(PAGE_SNAP);
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto((process.env.GATE_BASE_URL || 'http://127.0.0.1:8821') + '/?lang=en&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  await p.waitForFunction('window._bake && window._bake.easy', null, { timeout: 8000 }).catch(function(){});
  const A = await freshStart(p);
  const B = await freshStart(p);
  const C = await freshStart(p);
  console.log('A:', A);
  console.log('B:', B);
  console.log('C:', C);
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
