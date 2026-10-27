// v20.7: двухполосный зонд — tight-аспект и wide-XOR, 3 прогона
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
(async () => {
  for (let run = 0; run < 3; run++) {
    const b = await chromium.launch({ channel: 'chrome', headless: true });
    const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
    await p.goto('http://127.0.0.1:8798/?lang=en&test=1&t=' + Date.now(), { waitUntil: 'load' });
    await p.waitForTimeout(2000);
    await p.evaluate('(function(){ var i=SPECIES_DB.findIndex(function(s){return (s.locomotion==="flagella"||s.locomotion==="cilia")&&s.shape==="circle";}); if(i>=0) window.selSpecies=i; })()');
    await p.evaluate("document.getElementById('startBtn').click()");
    await p.waitForFunction('document.getElementById("introO").className==="ov show" || state==="playing"', null, { timeout: 10000 });
    await p.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
    await p.waitForFunction('state==="playing"', null, { timeout: 5000 });
    await p.evaluate('window.skipTutorial && window.skipTutorial()');
    await p.evaluate('(function(){ zoom=14; tZoom=14; timeScale=1; window.focusTimer=0; window.cinematicTime=1; })()');
    await p.waitForTimeout(1000);
    const out = await p.evaluate(`(function(){
      function hex2rgb(hx){ var n=parseInt(hx.slice(1),16); return [(n>>16)&255,(n>>8)&255,n&255]; }
      var c=document.getElementById('c'), w=c.width,h=c.height;
      var org=hex2rgb(player.sp.color||'#2c2');
      var Rb=window.__membRb||(window.__membRb=player.size*zoom);
      function grab(){
        var sx=(player.x-cam.x)*zoom+w/2, sy=(player.y-cam.y)*zoom+h/2;
        var R=Math.ceil(Rb*2.0);
        var x0=Math.max(0,Math.floor(sx-R)), x1=Math.min(w,Math.ceil(sx+R));
        var y0=Math.max(0,Math.floor(sy-R)), y1=Math.min(h,Math.ceil(sy+R));
        var d=ctx.getImageData(x0,y0,x1-x0,y1-y0).data;
        var wide=[], tight=[];
        for(var y=0;y<y1-y0;y++) for(var x=0;x<x1-x0;x++){
          var i=(y*(x1-x0)+x)*4, dr=d[i]-org[0], dg=d[i+1]-org[1], db=d[i+2]-org[2];
          var dd=dr*dr+dg*dg+db*db;
          if(dd>12000) continue;
          var dx=x+x0-sx, dy=y+y0-sy, dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<Rb*0.55||dist>Rb*1.35) continue;
          var k=Math.round(dx)+':'+Math.round(dy);
          wide.push(k); // rim-полоса 3000..12000 = контур
        }
        var imw=x1-x0;
        for(var a2=0;a2<180;a2++){
          var ang=a2/180*Math.PI*2, c3=Math.cos(ang), s3=Math.sin(ang);
          for(var rr=Rb*1.5; rr>Rb*0.3; rr-=1){
            var qx=Math.round(sx+c3*rr)-x0, qy=Math.round(sy+s3*rr)-y0;
            if(qx<0||qy<0||qx>=imw||qy>=(y1-y0)) continue;
            var j=(qy*imw+qx)*4, r4=d[j]-org[0], g4=d[j+1]-org[1], b4=d[j+2]-org[2];
            if(r4*r4+g4*g4+b4*b4<12000){ tight.push(Math.round(c3*rr)+':'+Math.round(s3*rr)); break; }
          }
        }
        return {wide:wide,tight:tight};
      }
      return new Promise(function(res){
        if(player){ player.x+=6000; player.y=Math.max(60,player.y); player.vx=0; player.vy=0; player.aiTarget=null; cam.x=player.x; cam.y=player.y; }
        var vmax=Math.max(0.8,(player.sp.speed||3)*1.6);
        var keep=setInterval(function(){ if(player){ player.vx=vmax*1.9; player.vy=vmax*0.62; } },2);
        var ms=[], warm=0;
        function step(){
          if(!player){ clearInterval(keep); res(ms); return; }
          if(warm<70){ warm++; requestAnimationFrame(step); return; }
          ms.push(grab());
          if(ms.length>=8){ clearInterval(keep); res(ms); } else requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    })()`);
    function xr(a,b){ if(!a||!b||a.length<50||b.length<50) return -1; const A=new Set(a),B=new Set(b); let both=0; B.forEach(k=>{if(A.has(k))both++;}); const u=A.size+B.size-both; return u?(u-both)/u:0; }
    function stats(pts){ var xs=pts.map(p=>+p.split(':')[0]), ys=pts.map(p=>+p.split(':')[1]);
      var mx=xs.reduce((a,b)=>a+b,0)/xs.length, my=ys.reduce((a,b)=>a+b,0)/ys.length;
      var sxx=0,syy=0,sxy=0; for(var i=0;i<xs.length;i++){sxx+=(xs[i]-mx)**2;syy+=(ys[i]-my)**2;sxy+=(xs[i]-mx)*(ys[i]-my);}
      var disc=Math.sqrt((sxx-syy)**2+4*sxy*sxy);
      return 2*Math.sqrt((sxx+syy+disc)/2)/(2*Math.sqrt(Math.max(0,(sxx+syy-disc)/2))||1);
    }
    const ratios=[]; for(let i=1;i<out.length;i++) ratios.push(+xr(out[i-1].wide,out[i].wide).toFixed(3));
    const med=a=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length/2)];
    const asps=out.slice(-3).map(m=>stats(m.tight));
    console.log('run'+run, 'wideMed='+med(ratios), 'tightAsps='+asps.map(a=>+a.toFixed(2)).join(','), 'tightLens='+out.slice(-3).map(m=>m.tight.length).join(','));
    await b.close();
  }
})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
