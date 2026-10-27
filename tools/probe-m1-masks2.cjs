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
        if(d[(y*(x1-x0)+x)*4+3]>60){
          var dx=x+x0-sx, dy=y+y0-sy;
          pts.push(Math.round(dx)+':'+Math.round(dy));
        }
      }
      return pts;
    }
    return new Promise(function(res){
      var ms=[];
      function step(){
        if(player){ player.vx=4.5; player.vy=2.0; }
        ms.push(grab());
        if(ms.length>=8) res(ms); else requestAnimationFrame(step);
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
  console.log('first3 mask0:', JSON.stringify((masks[0]||[]).slice(0,3)));
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
