"use strict";
function render(){_mmFrame++;if(_mmFrame%12!==0&&_mmCache){ctx.drawImage(_mmCache,0,0);return;}
  var grad=ctx.createLinearGradient(0,-PD*0.2,0,PD);grad.addColorStop(0,'#0a2a4a');grad.addColorStop(1,'#000814');ctx.fillStyle=grad;ctx.fillRect(0,0,cv.width,cv.height);
  ctx.save();ctx.translate(cv.width/2,cv.height/2);ctx.scale(zoom,zoom);ctx.translate(-cam.x,-cam.y);
  var vw=cv.width/zoom,vh=cv.height/zoom,vL=cam.x-vw/2,vR=cam.x+vw/2,vT=cam.y-vh/2,vB=cam.y+vh/2;
  renderSky(vL,vR,vT);renderWater(vL,vR,vT,vB);renderSunRays(vL,vR);renderSediment(vL,vR,vB);
  renderNutrients(vL,vR,vT,vB);renderShore(vL,vR,vT);
  if(settings.shadows)renderShadows(vL,vR,vT,vB);
  if(settings.bubbles)renderBubbles(vL,vR,vT,vB);
  renderParallax(vL,vR,vT,vB);
  renderNutrients(vL,vR,vT,vB);
  renderTrails(vL,vR,vT,vB);
  renderOrganisms(vL,vR,vT,vB);
  renderViruses(vL,vR,vT,vB);
  renderParticles(vL,vR,vT,vB);
  if(isRaining)renderRain(vL,vR,vT);
  if(moveTarget)renderTarget();
  ctx.restore();
  renderDayNight();
  if(window.eventManager) window.eventManager.draw(ctx, cv.width, cv.height);
  if(settings.healthBars)renderHealthBars();
  renderTooltip();
  renderEventLogs();
  
  if (window.dmgIndicators && settings.healthBars && fc%3===0) {
     ctx.save();
     ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
     for(var i=window.dmgIndicators.length-1; i>=0; i--){
         var ind = window.dmgIndicators[i];
         ind.life -= 1/60; // Assuming 60fps, reduce life
         ind.y -= 0.5; // Float upwards
         ctx.fillStyle = 'rgba(255, 50, 50, '+Math.max(0, ind.life)+')';
         ctx.fillText('-'+ind.val, cv.width/2 + (ind.x - cam.x)*zoom, cv.height/2 + (ind.y - cam.y)*zoom);
         if(ind.life <= 0) window.dmgIndicators.splice(i, 1);
     }
     ctx.restore();
  }

  // UI Hover Scanner
  if(typeof window !== 'undefined' && window.mouseX) {
     var wmx = (window.mouseX - window.innerWidth/2)/cam.z + cam.x;
     var wmy = (window.mouseY - window.innerHeight/2)/cam.z + cam.y;
     for(var i=0; i<orgs.length; i++){
        var org = orgs[i];
        if(org.alive && dist2({x:wmx,y:wmy}, org) < org.size*org.size) {
           ctx.fillStyle='#fff'; ctx.font='10px Arial';
           ctx.fillText('Spd: x'+(org.speedMult||1.0).toFixed(2), window.mouseX+10, window.mouseY);
           ctx.fillText('Sz: x'+(org.sizeMult||1.0).toFixed(2), window.mouseX+10, window.mouseY+12);
           if(org.parasite) ctx.fillText('INFECTED', window.mouseX+10, window.mouseY+24);
           break;
        }
     }
  }

}

function renderEventLogs() {
  if(!window.eventLog || window.eventLog.length === 0) return;
  ctx.save();
  ctx.textAlign = 'left';
  var startY = 80;
  for(var i=0; i<window.eventLog.length; i++) {
     var log = window.eventLog[i];
     log.life -= 1/60;
     if(log.life <= 0) { window.eventLog.splice(i, 1); i--; continue; }
     ctx.fillStyle = log.color;
     ctx.globalAlpha = Math.min(1.0, log.life);
     ctx.font = 'bold 13px sans-serif';
     ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
     ctx.fillText(log.text, 200, startY + i*20);
  }
  ctx.restore();
}














var shoreCache = null;
function initShoreCache() {
  shoreCache = document.createElement('canvas');
  shoreCache.width = shoreDecor.length * 40; shoreCache.height = 40;
  var c = shoreCache.getContext('2d');
  for(var i=0;i<shoreDecor.length;i++){
    var d=shoreDecor[i]; c.save(); c.translate(i*40 + 20, 20); c.rotate(d.rot);
    if(d.type==='grass'){
      c.strokeStyle='rgba(50,90,30,0.6)'; c.lineWidth=2;
      for(var b=0;b<4;b++){ c.beginPath(); c.moveTo(b*2-3,d.size*0.3); var sway=Math.sin(b)*3; c.quadraticCurveTo(b*2-3+sway,d.size*0.1,b*2-3+sway*2,-d.size); c.stroke(); }
    }else{
      c.fillStyle='rgba(100,85,60,0.7)'; c.beginPath(); c.ellipse(0,0,d.size,d.size*0.7,0,0,Math.PI*2); c.fill();
    }
    c.restore();
  }
}
window.addEventListener('resize', function(){ shoreCache = null; });
function renderShore(vL,vR,vT) {
  if(shoreDecor.length===0) return;
  if(!shoreCache || shoreCache.width !== shoreDecor.length*40) initShoreCache();
  for(var i=0;i<shoreDecor.length;i++){
    var d=shoreDecor[i];
    if(d.x<vL-30||d.x>vR+30||d.y<vT-30||d.y>30) continue;
    ctx.drawImage(shoreCache, i*40, 0, 40, 40, d.x-20, d.y-20, 40, 40);
  }
}

function renderTrails(vL,vR,vT,vB){
  ctx.save();
  for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o.alive||!o.glideTrail||o.glideTrail.length<2)continue;
    ctx.strokeStyle='rgba(180,220,255,0.08)';ctx.lineWidth=1.5;ctx.beginPath();
    for(var j=0;j<o.glideTrail.length;j++){
      var t=o.glideTrail[j];
      if(j===0)ctx.moveTo(t.x,t.y);else ctx.lineTo(t.x,t.y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
function renderOrganisms(vL,vR,vT,vB){
  var batches = {};
  for(var i=0;i<orgs.length;i++){
    var o=orgs[i];
    if(o.x<vL-40||o.x>vR+40||o.y<vT-40||o.y>vB+40)continue;
    var c=o.sp.color;
    if(!batches[c]) batches[c] = [];
    batches[c].push(o);
  }
  for(var c in batches){
    var arr = batches[c];
    ctx.fillStyle = c;
    ctx.beginPath();
    for(var i=0;i<arr.length;i++){
      var o = arr[i];
      if(o.size * zoom < 3) { ctx.fillRect(o.x - o.size, o.y - o.size, o.size*2, o.size*2); continue; }
      if(o.dividing || o.dying || o.cyst || o.infected || o.flash>0) continue; 
      ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.angle+Math.sin(o.wobble)*0.04);
      drawBody(o, o.size, c, c, true);
      ctx.restore();
    }
    ctx.fill();
    for(var i=0;i<arr.length;i++){
      var o = arr[i];
      if(o.size * zoom < 3) continue;
      if(o.dividing || o.dying || o.cyst || o.infected || o.flash>0) renderOrg(o, false);
      else renderOrg(o, true);
    }
  }
}





function renderParticles(vL,vR,vT,vB){
  ctx.save();
  for(var i=0;i<parts.length;i++){var p=parts[i];
    ctx.globalAlpha=clamp(p.life,0,1);
    var col = p.color;
    if(p.life < p.maxL * 0.5 && (col==='#f44' || col==='#ff4444')) col = '#6b4c3a'; // Blood darkens to brown
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function renderTarget(){
  ctx.save();ctx.translate(moveTarget.x,moveTarget.y);var p=1+Math.sin(fc*0.15)*0.3;
  ctx.strokeStyle='rgba(100,255,200,0.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,8*p,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-12*p,0);ctx.lineTo(12*p,0);ctx.moveTo(0,-12*p);ctx.lineTo(0,12*p);ctx.stroke();ctx.restore();
}
function renderDayNight(){
  var dark=1-dayLight;if(dark>0.03){ctx.fillStyle='rgba(0,8,25,'+(dark*0.5)+')';ctx.fillRect(0,0,cv.width,cv.height);}
  if(settings.vignette){var g=ctx.createRadialGradient(cv.width/2,cv.height/2,Math.min(cv.width,cv.height)*0.3,cv.width/2,cv.height/2,Math.max(cv.width,cv.height)*0.7);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+(0.25+dark*0.2)+')');ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);}
}
function renderHealthBars(){
  ctx.save();
  for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o.alive||o.dying)continue;
    var scx=(o.x-cam.x)*zoom+cv.width/2,scy=(o.y-cam.y)*zoom+cv.height/2;
    if(scx<5||scx>cv.width-5||scy<5||scy>cv.height-5)continue;
    if(zoom<2&&!o.isPlayer)continue;if(zoom<1.5)continue;
    var bw=Math.max(14,o.size*zoom*1.1),bh=3,bx=scx-bw/2,by=scy-o.size*zoom-6;
    var er=clamp(o.energy/100,0,1);var col=er>0.6?'#4e4':(er>0.3?'#ee4':'#e44');
    ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(bx-1,by-1,bw+2,bh+2);
    ctx.fillStyle='#234';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle=col;ctx.fillRect(bx,by,bw*er,bh);
    // Infection indicator
    if(o.infected){ctx.fillStyle='#f44';ctx.beginPath();ctx.arc(scx+bw/2+3,by+1,2,0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
}
function renderTooltip(){
  if(mx>9000||state!=='playing')return;
  var wx=cam.x+(mx-cv.width/2)/zoom,wy=cam.y+(my-cv.height/2)/zoom;inspOrg=null;
  for(var i=orgs.length-1;i>=0;i--){var o=orgs[i];if(!o.alive)continue;if(dist2({x:wx,y:wy},o)<(o.size+5)*(o.size+5)){inspOrg=o;break;}}
  var tip=document.getElementById('tip');
  if(inspOrg){
    var o=inspOrg,st='';
    if(o.energy<25)st+=' \u26a0 '+(curLang==='ru'?'\u0413\u043e\u043b\u043e\u0434':'Starving');
    else if(o.energy>85)st+=' \u2714 '+(curLang==='ru'?'\u0417\u0434\u043e\u0440\u043e\u0432':'Healthy');
    if(o.dividing)st+=' \u21bb '+(curLang==='ru'?'\u0414\u0435\u043b\u0438\u0442\u0441\u044f':'Dividing');
    if(o.cyst)st+=' \u2a1d '+(curLang==='ru'?'\u0426\u0438\u0441\u0442\u0430':'Cyst');
    if(o.infected)st+=' \u2620 '+(curLang==='ru'?'\u0417\u0430\u0440\u0430\u0436\u0435\u043d':'Infected');
    var locTxt=o.sp.locomotion||'';
    tip.innerHTML='<b style="color:'+o.sp.color+'">'+o.sp.name+'</b>'+
      '<div style="color:#abc;font-size:9px;margin-top:2px">'+
      (curLang==='ru'?'\u042d\u043d':'E')+': '+Math.round(o.energy)+' '+
      (curLang==='ru'?'\u0412\u0437\u0440':'A')+': '+Math.round(o.age)+'s '+
      (curLang==='ru'?'\u0420\u0437\u043c':'S')+': '+o.size.toFixed(1)+'\u03bcm</div>'+
      '<div style="color:#678;font-size:8px">'+(curLang==='ru'?'\u0414\u0432\u0438\u0436\u0435\u043d\u0438\u0435':'Move')+': '+locTxt+'</div>'+
      (st?'<div style="color:#fc4;font-size:9px">'+st+'</div>':'')+
      (o.isPlayer?'<div style="color:#4ff;font-size:8px">\u2605 '+(curLang==='ru'?'\u042d\u0442\u043e \u0412\u044b':'You')+'</div>':'');
    tip.style.display='block';tip.style.left=clamp(mx+12,0,cv.width-260)+'px';tip.style.top=clamp(my+12,0,cv.height-80)+'px';
  }else tip.style.display='none';
}
var _mmCache=null,_mmFrame=0;
function renderMinimap(){
  mc.clearRect(0,0,110,80);mc.fillStyle='rgba(0,12,28,0.85)';mc.fillRect(0,0,110,80);
  var sx=100/(PW*2),sy=70/PD;mc.save();mc.translate(5,5);
  mc.fillStyle='rgba(20,50,60,0.5)';mc.beginPath();mc.moveTo(0,0);mc.lineTo(100,0);mc.lineTo(100-(PW-BW)*sx,70);mc.lineTo((PW-BW)*sx,70);mc.closePath();mc.fill();
  for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o.alive)continue;mc.fillStyle=o.sp.color;mc.beginPath();mc.arc((o.x+PW)*sx,o.y*sy,o.isPlayer?3:1,0,Math.PI*2);mc.fill();}
  mc.restore();
  var vw=cv.width/zoom,vh=cv.height/zoom;mc.strokeStyle='rgba(100,200,255,0.4)';mc.lineWidth=1;
  mc.strokeRect(5+(cam.x-vw/2+PW)*sx,5+(cam.y-vh/2)*sy,vw*sx,vh*sy);
}
function renderPopGraph(){
  pcc.clearRect(0,0,110,55);pcc.fillStyle='rgba(0,12,28,0.6)';pcc.fillRect(0,0,110,55);
  if(popHist.length<2)return;var maxP=1;
  for(var i=0;i<popHist.length;i++){var t=0;for(var c in popHist[i])t+=popHist[i][c];if(t>maxP)maxP=t;}
  var cats=['producer','consumer1','consumer2','consumer3','decomposer'];
  var cols={producer:'#2c2',consumer1:'#4af',consumer2:'#f80',consumer3:'#c4f',decomposer:'#a86'};
  for(var ci=0;ci<cats.length;ci++){pcc.strokeStyle=cols[cats[ci]];pcc.lineWidth=1.5;pcc.beginPath();
    for(var i=0;i<popHist.length;i++){var x=i/(popHist.length-1)*110;var y=55-(popHist[i][cats[ci]]||0)/maxP*52;if(i===0)pcc.moveTo(x,y);else pcc.lineTo(x,y);}pcc.stroke();}
}
