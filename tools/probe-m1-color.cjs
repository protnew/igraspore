// v20.7: mask lengths + XOR — прямой прогон кода спеки (упрощённо, без новых Function)
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto('http://127.0.0.1:8798/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await p.waitForTimeout(2000);
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction('document.getElementById("introO").className==="ov show" || state==="playing"', null, { timeout: 10000 });
  await p.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await p.waitForFunction('state==="playing"', null, { timeout: 5000 });
  await p.evaluate('window.skipTutorial && window.skipTutorial()');
  await p.evaluate('(function(){ zoom=14; tZoom=14; if(player){cam.x=player.x; cam.y=player.y;} timeScale=1; window.focusTimer=0; window.cinematicTime=1; })()');
  await p.waitForTimeout(1200);

  const masks = await p.evaluate(`(function(){
    var c=document.getElementById('c'); var w=c.width,h=c.height;
    function grab(){
      var sx=(player.x-cam.x)*zoom+w/2, sy=(player.y-cam.y)*zoom+h/2;
      var R=Math.ceil(player.size*zoom*2.4);
      var x0=Math.max(0,Math.floor(sx-R)), x1=Math.min(w,Math.ceil(sx+R));
      var y0=Math.max(0,Math.floor(sy-R)), y1=Math.min(h,Math.ceil(sy+R));
      var d=ctx.getImageData(x0,y0,x1-x0,y1-y0).data;
      var pts=[];
      for(var y=0;y<y1-y0;y+=1) for(var x=0;x<x1-x0;x+=1){
        var px=(y*(x1-x0)+x)*4; var dr=d[px]-44, dg=d[px+1]-204, db=d[px+2]-68; if(dr*dr+dg*dg+db*db<12000){
          var dx=x+x0-sx, dy=y+y0-sy;
          pts.push(Math.round(dx)+':'+Math.round(dy));
        }
      }
      return pts;
    }
    return new Promise(function(res){
      var ms=[];
      var vmax=Math.max(0.8,(player&&player.sp&&player.sp.speed?player.sp.speed:3)*1.6);
      var keep=setInterval(function(){ if(player){ player.vx=vmax*0.95; player.vy=vmax*0.31; } }, 4);
      var warm=0; function step(){
        if(!window.__tp && player){ window.__tp=1; player.x+=6000; player.y=Math.max(60,player.y); player.vx=0; player.vy=0; player.aiTarget=null; cam.x=player.x; cam.y=player.y; } player.vx=4.5; player.vy=2.0;
        if(warm<3){warm++;requestAnimationFrame(step);return;} ms.push(grab());
        if(ms.length>=8){clearInterval(keep); res(ms);} else requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  })()`);

  function xr(a, b){
    if (!a || !b || a.length < 50 || b.length < 50) return -1;
    const A = new Set(a), B = new Set(b);
    let both = 0; B.forEach(k => { if (A.has(k)) both++; });
    const union = A.size + B.size - both;
    return union ? (union - both) / union : 0;
  }
  const lens = masks.map(m => m.length);
  const ratios = [];
  for (let i = 1; i < masks.length; i++) ratios.push(+xr(masks[i-1], masks[i]).toFixed(4));
  console.log('lens:', JSON.stringify(lens));
  console.log('xor:', JSON.stringify(ratios));
  
  // аспект последней маски
  function stats(pts){
    var xs=pts.map(p=>+p.split(':')[0]), ys=pts.map(p=>+p.split(':')[1]);
    var mx=xs.reduce((a,b)=>a+b,0)/xs.length, my=ys.reduce((a,b)=>a+b,0)/ys.length;
    var sxx=0,syy=0,sxy=0;
    for(var i=0;i<xs.length;i++){sxx+=(xs[i]-mx)**2;syy+=(ys[i]-my)**2;sxy+=(xs[i]-mx)*(ys[i]-my);}
    var disc=Math.sqrt((sxx-syy)**2+4*sxy*sxy);
    var l1=Math.sqrt((sxx+syy+disc)/2), l2=Math.sqrt(Math.max(0,(sxx+syy-disc)/2));
    return {len:2*Math.sqrt(l1), wid:2*Math.sqrt(l2), asp:(2*Math.sqrt(l1))/(2*Math.sqrt(l2))};
  }
  console.log('aspect(last):', JSON.stringify(stats(masks[masks.length-1])));
  console.log('first3 mask0:', JSON.stringify((masks[0]||[]).slice(0,3)));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
