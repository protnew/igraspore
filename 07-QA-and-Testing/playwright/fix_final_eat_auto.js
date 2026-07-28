
const { test } = require('@playwright/test');
test('final eat auto', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('file:///C:/Obsidian/New/Projects/08-iGraSpore_V2/index.html', {waitUntil:'load'});
  await page.evaluate(()=>localStorage.setItem('igraspore_tut_v2','1'));
  await page.reload({waitUntil:'load'}); await page.waitForTimeout(800);
  await page.evaluate(()=>document.getElementById('startBtn').click());
  await page.waitForTimeout(500);
  await page.evaluate(()=>{ if(window.skipTutorial) skipTutorial(); });

  // Eat button + key
  await page.evaluate(()=>{
    player.energy=70;player.alive=true;player.dying=false;player.cyst=false;player.parasite=null;player.eaten=0;
    for(let i=0;i<8;i++){const fo=spawnOrg(SPECIES_DB[0],player.x+12,player.y+(i-4)*4,false); if(fo){fo.size=player.size*0.3;fo.divCD=0;fo.invuln=0;}}
  });
  await page.keyboard.press('e'); await page.waitForTimeout(100);
  await page.keyboard.press('e'); await page.waitForTimeout(100);
  const box=await page.evaluate(()=>{const b=document.getElementById('bEat');const r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
  await page.mouse.click(box.x, box.y); await page.waitForTimeout(100);
  const eat=await page.evaluate(()=>({eaten:player.eaten,energy:player.energy,toast:(document.getElementById('toast')||{}).textContent}));
  console.log('EAT: '+JSON.stringify(eat));

  // Straight hunt
  await page.evaluate(()=>{
    autoAI=true; player.energy=100; player.parasite=null; player.vx=0;player.vy=0;
    player.angle=0; player.aiTarget=null; player.aiRetargetT=0;
    for(const o of orgs){ if(o!==player && Math.hypot(o.x-player.x,o.y-player.y)<800) o.alive=false; }
    const prey=spawnOrg(SPECIES_DB[0], player.x+140, player.y, false);
    prey.size=player.size*0.3; prey.vx=0;prey.vy=0;prey.divCD=0;prey.invuln=0;
    window.__prey=prey; window.__path=[]; window.__e0=player.eaten||0;
  });
  for(let i=0;i<25;i++){
    await page.waitForTimeout(80);
    await page.evaluate(()=>window.__path.push({x:player.x,y:player.y,s:player.state}));
  }
  const path=await page.evaluate(()=>{
    const p=window.__path; let dist=0,turns=0;
    for(let i=1;i<p.length;i++){
      const dx=p[i].x-p[i-1].x,dy=p[i].y-p[i-1].y; dist+=Math.hypot(dx,dy);
      if(i>=2){const dx0=p[i-1].x-p[i-2].x,dy0=p[i-1].y-p[i-2].y;
        let da=Math.atan2(dy,dx)-Math.atan2(dy0,dx0); while(da>Math.PI)da-=Math.PI*2; while(da<-Math.PI)da+=Math.PI*2; turns+=Math.abs(da);}
    }
    const net=Math.hypot(p.at(-1).x-p[0].x,p.at(-1).y-p[0].y);
    return {
      dist:Number(dist.toFixed(1)), net:Number(net.toFixed(1)),
      eff: dist>1?Number((net/dist).toFixed(3)):0,
      turns:Number(turns.toFixed(2)),
      eaten:(player.eaten||0)-(window.__e0||0),
      preyAlive:window.__prey?window.__prey.alive:null,
      state:player.state, energy:player.energy
    };
  });
  console.log('PATH: '+JSON.stringify(path));
  await page.screenshot({path:'screenshots/FIX-final-auto.png'});
  await page.evaluate(()=>{settings.renderMode='realistic'; zoom=4;tZoom=4; if(typeof render==='function')render();});
  await page.waitForTimeout(200);
  await page.screenshot({path:'screenshots/FIX-final-realistic.png'});
  console.log('ERRORS:'+errors.length); errors.forEach(e=>console.log('ERR:'+e));
  console.log('DONE');
});
