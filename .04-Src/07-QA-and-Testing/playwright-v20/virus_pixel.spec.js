const { test, expect } = require('@playwright/test');
const { startGame, collectErrs } = require('./_helpers');

test('[B1px] phage on screen is at least 3px and has a dark outline', async ({ page }) => {
  const errs = collectErrs(page);
  await startGame(page, { test: true });
  await page.locator('#roleCardOk').click({ timeout: 8000 }).catch(() => {});
  await page.locator('#tutSkip').click({ timeout: 5000 }).catch(() => {});
  await page.evaluate('window.__igsTest.spawnVirusNear()');
  await page.evaluate('(function(){ var v=viruses[0]; zoom=8; tZoom=8; if(v){ cam.x=v.x; cam.y=v.y; } })()');
  await page.waitForTimeout(700);
  const m = await page.evaluate(`(function(){
    var cv=document.getElementById('c');
    var z=(typeof zoom==='number'&&zoom>0)?zoom:1;
    var v=viruses&&viruses[0];
    if(!cv||!v) return {ok:false, why:'no canvas or virus'};
    var sx=(v.x-cam.x)*z+cv.width/2;
    var sy=(v.y-cam.y)*z+cv.height/2;
    var ctx=cv.getContext('2d');
    var box=28;
    var x0=Math.max(0, Math.floor(sx-box));
    var y0=Math.max(0, Math.floor(sy-box));
    var w=Math.min(box*2, cv.width-x0);
    var h=Math.min(box*2, cv.height-y0);
    var img=ctx.getImageData(x0,y0,w,h);
    var fill=[];
    var minx=999,miny=999,maxx=-1,maxy=-1,nf=0;
    for(var y=0;y<img.height;y++){
      for(var x=0;x<img.width;x++){
        var i=(y*img.width+x)*4;
        var R=img.data[i], G=img.data[i+1], B=img.data[i+2];
        if(R>160 && R>G+40 && R>B+40){
          fill.push(x+','+y); nf++;
          if(x<minx)minx=x; if(y<miny)miny=y; if(x>maxx)maxx=x; if(y>maxy)maxy=y;
        }
      }
    }
    var outline=0;
    var seen={};
    for(var k=0;k<fill.length;k++) seen[fill[k]]=1;
    for(var y2=1;y2<img.height-1;y2++){
      for(var x2=1;x2<img.width-1;x2++){
        var i2=(y2*img.width+x2)*4;
        var R2=img.data[i2], G2=img.data[i2+1], B2=img.data[i2+2];
        if(!(R2<90 && G2<50 && B2<50)) continue;
        var near=seen[(x2+1)+','+y2]||seen[(x2-1)+','+y2]||seen[x2+','+(y2+1)]||seen[x2+','+(y2-1)];
        if(near) outline++;
      }
    }
    var head=(typeof virusHeadR==='function')?virusHeadR():0;
    var screenR=Math.max(head, 3/z)*z;
    return {ok:true, nf:nf, bw:maxx-minx+1, bh:maxy-miny+1, outline:outline, screenR:screenR, z:z, sx:sx, sy:sy};
  })()`);
  expect(m.ok, JSON.stringify(m)).toBe(true);
  expect(m.nf).toBeGreaterThan(4);
  expect(Math.min(m.bw, m.bh)).toBeGreaterThanOrEqual(3);
  expect(m.screenR).toBeGreaterThanOrEqual(3);
  expect(m.outline).toBeGreaterThan(0);
  await page.screenshot({ path: 'C:/Users/Space/agent-transfer/igraspore-v20-3/virus-pixel.png' });
  const hard = errs.filter(e => !/favicon|sw\.js|404/.test(e));
  expect(hard).toEqual([]);
});
