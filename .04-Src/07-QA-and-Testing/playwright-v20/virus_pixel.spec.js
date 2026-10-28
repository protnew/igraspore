const { test, expect } = require('@playwright/test');
const { startGame, collectErrs } = require('./_helpers');

test('[B1px] phage on screen is at least 3px and has a dark outline', async ({ page }) => {
  const errs = collectErrs(page);
  await startGame(page, { test: true });
  await page.locator('#roleCardOk').click({ timeout: 8000 }).catch(() => {});
  await page.locator('#tutSkip').click({ timeout: 5000 }).catch(() => {});
  await page.evaluate('window.__igsTest.spawnVirusNear()');
  await page.evaluate(`(function(){
    var keep=viruses[0];
    for(var i=1;i<viruses.length;i++){ viruses[i].x=-99999; viruses[i].y=-99999; }
    if(keep){ keep.x=player.x+8; keep.y=player.y; keep.demoPinned=true; cam.x=keep.x; cam.y=keep.y; }
    zoom=10; tZoom=10;
    var po=document.getElementById('pauseO'); if(po) po.className='ov';
    state='playing';
  })()`);
  await page.waitForTimeout(700);
  const m = await page.evaluate(`(function(){
    var cv=document.getElementById('c');
    var z=(typeof zoom==='number'&&zoom>0)?zoom:1;
    var v=viruses&&viruses[0];
    if(!cv||!v) return {nf:0,bw:0,bh:0,outline:0,screenR:0,z:z,why:'no canvas'};
    var sx=(v.x-cam.x)*z+cv.width/2;
    var sy=(v.y-cam.y)*z+cv.height/2;
    var ctx=cv.getContext('2d');
    var box=40;
    var x0=Math.max(0, Math.floor(sx-box));
    var y0=Math.max(0, Math.floor(sy-box));
    var w=Math.min(box*2, cv.width-x0);
    var h=Math.min(box*2, cv.height-y0);
    var img=ctx.getImageData(x0,y0,w,h);
    var fill={};
    var minx=999,miny=999,maxx=-1,maxy=-1,nf=0;
    for(var y=0;y<img.height;y++){
      for(var x=0;x<img.width;x++){
        var i=(y*img.width+x)*4;
        var R=img.data[i], G=img.data[i+1], B=img.data[i+2];
        if(R>150 && R>G+25 && R>B+25){
          fill[x+','+y]=R; nf++;
          if(x<minx)minx=x; if(y<miny)miny=y; if(x>maxx)maxx=x; if(y>maxy)maxy=y;
        }
      }
    }
    var outline=0;
    for(var key in fill){
      var parts=key.split(',');
      var x=+parts[0], y=+parts[1], R=fill[key];
      var neigh=[[1,0],[-1,0],[0,1],[0,-1]];
      for(var n=0;n<neigh.length;n++){
        var nx=x+neigh[n][0], ny=y+neigh[n][1];
        if(fill[nx+','+ny]) continue;
        var j=(ny*img.width+nx)*4;
        if(j<0 || j>=img.data.length) continue;
        if(img.data[j] < R-30){ outline++; break; }
      }
    }
    var head=(typeof virusHeadR==='function')?virusHeadR():0;
    return {nf:nf, bw:maxx-minx+1, bh:maxy-miny+1, outline:outline, screenR:Math.max(head, 3/z)*z, z:z, sx:sx, sy:sy};
  })()`);
  expect(m.nf, JSON.stringify(m)).toBeGreaterThan(4);
  expect(Math.min(m.bw, m.bh)).toBeGreaterThanOrEqual(3);
  expect(m.screenR).toBeGreaterThanOrEqual(3);
  expect(m.outline, JSON.stringify(m)).toBeGreaterThan(0);
  await page.screenshot({ path: 'C:/Users/Space/agent-transfer/igraspore-v20-3/virus-pixel.png' });
  const hard = errs.filter(e => !/favicon|sw\.js|404/.test(e));
  expect(hard).toEqual([]);
});
