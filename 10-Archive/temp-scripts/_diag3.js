const { chromium } = require('playwright');
const path = require('path');
const SS = path.join(__dirname,'screenshots');
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1400,height:900}});
  const errors=[]; const logs=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{ if(m.type()==='error') logs.push(m.text()); });
  await page.goto('https://igraspore.pages.dev/?t='+Date.now(),{waitUntil:'networkidle',timeout:90000});
  await page.waitForTimeout(2500);

  // --- MENU filter test ---
  const filterTest = await page.evaluate(()=>{
    const out={};
    // ensure grid built
    if(typeof buildCatSel==='function') buildCatSel();
    if(typeof buildSpeciesGrid==='function') buildSpeciesGrid();
    out.initialCards = document.querySelectorAll('#spGrid .sc').length;
    out.selCat0 = (typeof selCat!=='undefined')?selCat: 'UNDEF';
    // list cat buttons
    out.catBtns = [...document.querySelectorAll('#catSel .cb')].map(b=>({
      text:b.textContent, data:b.getAttribute('data-c'), act:b.classList.contains('act')
    }));
    // click producer via real click simulation path: set selCat and rebuild
    const results={};
    for(const cat of ['producer','consumer1','consumer2','consumer3','decomposer','all']){
      selCat = cat;
      buildCatSel();
      buildSpeciesGrid();
      const cards=[...document.querySelectorAll('#spGrid .sc')];
      const names=cards.map(c=>c.innerText.split('\n')[0]||c.innerText.slice(0,40));
      const catsInGrid = cards.map(c=>{
        // find species by num
        const m=c.innerText.match(/#(\d+)/);
        if(!m) return '?';
        const sp=SPECIES_DB[parseInt(m[1],10)-1];
        return sp?sp.cat:'?';
      });
      const uniqueCats=[...new Set(catsInGrid)];
      const colonies = cards.filter(c=>/колон|colony/i.test(c.innerText)).length;
      results[cat]={count:cards.length, uniqueCats, colonies, sample:names.slice(0,5)};
    }
    out.results=results;
    // DOM click test - click consumer1 button
    const btn=[...document.querySelectorAll('#catSel .cb')].find(b=>b.getAttribute('data-c')==='consumer1');
    out.btnC1=btn?btn.textContent:null;
    if(btn){ btn.click(); }
    out.afterClick={selCat, count:document.querySelectorAll('#spGrid .sc').length,
      sample:[...document.querySelectorAll('#spGrid .sc')].slice(0,4).map(c=>c.innerText.replace(/\s+/g,' ').slice(0,60))};
    // colonies in all
    selCat='all'; buildSpeciesGrid();
    out.allColonies=[...document.querySelectorAll('#spGrid .sc')].filter(c=>/колон|colony|Volvox|Microcystis|Gloeocapsa/i.test(c.innerText)).map(c=>c.innerText.replace(/\s+/g,' ').slice(0,70));
    out.colonySp = SPECIES_DB.filter(s=>s.shape==='colony').map(s=>({n:s.num,name:s.name,cat:s.cat,flags:s.flags}));
    return out;
  });
  await page.screenshot({path:path.join(SS,'DIAG-menu.png')});

  // --- DEMO colonies ---
  const demo = await page.evaluate(async()=>{
    if(typeof startDemoMode!=='function') return {err:'no startDemoMode'};
    startDemoMode();
    await new Promise(r=>setTimeout(r,1000));
    const cols=orgs.filter(o=>o&&o.sp&&o.sp.shape==='colony');
    return {
      demoMode:window.demoMode,
      total:orgs.filter(o=>o&&o.alive).length,
      colonies:cols.map(o=>({name:o.sp.name,size:o.size,x:o.x,y:o.y,num:o.demoIndex})),
      freeCam, spectatorMode
    };
  });
  await page.screenshot({path:path.join(SS,'DIAG-demo.png')});

  // --- FREE CAM in play ---
  const cam = await page.evaluate(async()=>{
    window.demoMode=false;
    // start game as producer
    selSpecies=SPECIES_DB.findIndex(s=>s.cat==='producer'&&s.shape!=='colony');
    state='play'; startGame();
    document.getElementById('roleCardOk')?.click();
    await new Promise(r=>setTimeout(r,600));
    const bFree=document.getElementById('bFree');
    const before={freeCam, cam:{x:cam.x,y:cam.y}, bFree:!!bFree, bFreeText:bFree&&bFree.textContent};
    // toggle free cam
    if(bFree) bFree.click();
    await new Promise(r=>setTimeout(r,100));
    const afterClick={freeCam, cam:{x:cam.x,y:cam.y}};
    // simulate WASD via camKeys
    camKeys={w:true,a:false,s:false,d:false};
    const x0=cam.x,y0=cam.y;
    if(typeof updateCamera==='function'){
      for(let i=0;i<30;i++) updateCamera(0.05);
    }
    const afterMove={freeCam, cam:{x:cam.x,y:cam.y}, dy:cam.y-y0, dx:cam.x-x0};
    // F key path
    freeCam=false; camKeys={w:false,a:false,s:false,d:false};
    freeCam=true;
    camKeys={d:true,w:false,a:false,s:false};
    const x1=cam.x;
    for(let i=0;i<20;i++) updateCamera(0.05);
    const afterF={freeCam, dx:cam.x-x1, camx:cam.x};
    return {before, afterClick, afterMove, afterF, playerAlive:player&&player.alive};
  });
  await page.screenshot({path:path.join(SS,'DIAG-cam.png')});

  console.log(JSON.stringify({filterTest, demo, cam, errors, logs}, null, 2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
