const { test, expect } = require('@playwright/test');
const { BASE } = require('./_helpers');
// M1 (TZ v20): XOR силуэтов, аспект, бюджет — через тест-хук снимков канваса

async function startZoomed(page){
  await page.goto(BASE + '/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.click('#startBtn');
  await page.waitForFunction('document.getElementById("introO").className==="ov show" || state==="playing"', null, { timeout: 10000 });
  await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
  await page.waitForFunction('state==="playing"', null, { timeout: 5000 });
  await page.evaluate('window.skipTutorial && window.skipTutorial()');
  await page.evaluate('(function(){ zoom=14; tZoom=14; if(player){cam.x=player.x; cam.y=player.y;} timeScale=1; window.focusTimer=0; window.cinematicTime=1; })()');
  await page.waitForTimeout(1200);
}

async function frameMasks(page, n){
  return page.evaluate(`(function(){
    var c=document.getElementById('c'); var w=c.width,h=c.height;
    var sx0=(player.x-cam.x)*zoom+w/2, sy0=(player.y-cam.y)*zoom+h/2;
    var R=Math.ceil(player.size*zoom*2.4);
    var x0=Math.max(0,Math.floor(sx0-R)), x1=Math.min(w,Math.ceil(sx0+R));
    var y0=Math.max(0,Math.floor(sy0-R)), y1=Math.min(h,Math.ceil(sy0+R));
    var grab=function(){
      // v20.10 R4: offscreen measurement. The player body is drawn by the same drawBody into a transparent
      // canvas (only for the measurement); the visible frame is untouched. Body = alpha>60 inside the ring.
      var oc=window.__membOC||(window.__membOC=document.createElement('canvas'));
      var S=2*R; if(oc.width!==S){oc.width=S;oc.height=S;}
      var c2=oc.getContext('2d'); c2.setTransform(1,0,0,1,0,0); c2.clearRect(0,0,S,S);
      var keep=[player._membVS,player._membAng], vis=ctx;
      try{ ctx=c2; c2.translate(R,R); c2.scale(zoom,zoom); drawBody(player, player.size, '#8c8', '#252'); }
      finally{ ctx=vis; player._membVS=keep[0]; player._membAng=keep[1]; }
      var d=c2.getImageData(0,0,S,S).data, pts=[];
      var Rb=window.__membRb||(window.__membRb=player.size*zoom);
      for(var y=0;y<S;y++) for(var x=0;x<S;x++){
        if(d[(y*S+x)*4+3]<=60) continue;
        var dx=x-R, dy=y-R, dd=Math.sqrt(dx*dx+dy*dy);
        // кольцо тела: органеллы внутри и реснички снаружи не входят в силуэт
        if(dd>=Rb*0.6 && dd<=Rb*1.32) pts.push([dx, dy]);
      }
      return pts;
    };
    return new Promise(function(res){
      var masks=[];
      // AC: кадры движения — поддерживаем скорость клетки
      if(player){ player.vx=4.5; player.vy=2.0; }
      function step(){
        if(player){ player.vx=4.5; player.vy=2.0; }
        masks.push(grab());
        if(masks.length>=${n}) res(masks);
        else requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  })()`);
}

function maskStats(pts){
  var mx=0,my=0; pts.forEach(function(p){mx+=p[0];my+=p[1]}); mx/=pts.length; my/=pts.length;
  var sxx=0,syy=0,sxy=0; pts.forEach(function(p){sxx+=(p[0]-mx)**2; syy+=(p[1]-my)**2; sxy+=(p[0]-mx)*(p[1]-my)});
  var disc=Math.sqrt((sxx-syy)*(sxx-syy)+4*sxy*sxy);
  var len=2*Math.sqrt((sxx+syy+disc)/2), wid=2*Math.sqrt(Math.max(0,(sxx+syy-disc)/2));
  return {len:len, wid:wid};
}

function xorRatio(a, b){
  if(!a || !b) return -1;
  if(!a.mask || !b.mask || a.mask.length < 50 || b.mask.length < 50) return -1;
  const setA = new Set(a.mask.map(p => p[0] + ':' + p[1]));
  const setB = new Set(b.mask.map(p => p[0] + ':' + p[1]));
  let both = 0;
  setB.forEach(k => { if(setA.has(k)) both++; });
  const union = setA.size + setB.size - both;
  return union ? (union - both) / union : 0;
}

test('[M1] membrane ON: XOR >=3% соседние кадры, аспект >=1.10, бюджет <=0.1ms/200', async ({ page }) => {
  await startZoomed(page);
  await page.waitForTimeout(900);
  const masks = await frameMasks(page, 8);
  const ratios = [];
  for (let i = 1; i < masks.length; i++) ratios.push(xorRatio({mask:masks[i-1]}, {mask:masks[i]}));
  const med = ratios.slice().sort((a,b)=>a-b)[Math.floor(ratios.length/2)];
  expect(med, 'XOR neighbor frames: ' + JSON.stringify(ratios.map(x=>+x.toFixed(3)))).toBeGreaterThanOrEqual(0.03);
  const st = maskStats(masks[masks.length-1]);
  const asp = st.len / Math.max(1, st.wid);
  expect(asp, 'aspect len/wid').toBeGreaterThanOrEqual(1.10);
  const budget = await page.evaluate(`(function(){
    var t0=performance.now();
    for(var i=0;i<20;i++) render(cam.x-cv.width/2/zoom, cam.x+cv.width/2/zoom, cam.y-cv.height/2/zoom, cam.y+cv.height/2/zoom);
    return (performance.now()-t0)/20;})()`);
  const visCount = await page.evaluate(`(function(){var n=0;var vL=cam.x-cv.width/2/zoom,vR=cam.x+cv.width/2/zoom,vT=cam.y-cv.height/2/zoom,vB=cam.y+cv.height/2/zoom;for(var i=0;i<orgs.length;i++){var o=orgs[i];if(o&&o.alive&&o.x>vL&&o.x<vR&&o.y>vT&&o.y<vB)n++}return n})()`);
  expect(budget, 'frame ms total for '+visCount+' cells').toBeLessThanOrEqual(0.1 * Math.max(200, visCount));
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-M1-on.png' });
});

test('[M1] membrane OFF: XOR <0.5%', async ({ page }) => {
  await startZoomed(page);
  await page.evaluate('settings.softMembrane=false');
  await page.waitForTimeout(4500);
  const masks = await frameMasks(page, 8);
  const ratios = [];
  for (let i = 1; i < masks.length; i++) ratios.push(xorRatio({mask:masks[i-1]}, {mask:masks[i]}));
  const med = ratios.slice().sort((a,b)=>a-b)[Math.floor(ratios.length/2)];
  expect(med, 'XOR off neighbor frames: ' + JSON.stringify(ratios.map(x=>+x.toFixed(3)))).toBeLessThan(0.005);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-M1-off.png' });
});
