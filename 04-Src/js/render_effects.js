"use strict";

function renderSky(vL,vR,vT){
  if(vT>=0)return;
  var g=ctx.createLinearGradient(0,vT,0,0);
  if(dayLight>0.5){g.addColorStop(0,'#1a3050');g.addColorStop(1,'#3a6090');}
  else{g.addColorStop(0,'#050818');g.addColorStop(1,'#0a1228');}
  ctx.fillStyle=g;ctx.fillRect(vL,vT,vR-vL,-vT);
  ctx.fillStyle=g;ctx.fillRect(vL,vT,vR-vL,-vT);
  if(dayLight>0.05 && tod > 5 && tod < 19){
    var dayProg = (tod-6)/12; // 0 to 1
    var sunX = -PW*0.8 + dayProg * PW*1.6;
    var sunY = -Math.sin(dayProg * Math.PI) * 400 + 50;
    if(sunY>vT){
      ctx.save();ctx.globalAlpha=dayLight;
      var sg=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,80);
      sg.addColorStop(0,'rgba(255,240,180,0.9)');sg.addColorStop(0.3,'rgba(255,200,100,0.4)');sg.addColorStop(1,'rgba(255,180,50,0)');
      ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sunX,sunY,80,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
  }
  
  if(window.skyClouds && dayLight>0.2) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,'+(0.6*dayLight)+')';
      for(var i=0; i<window.skyClouds.length; i++) {
          var c = window.skyClouds[i];
          if(c.x+c.w < vL || c.x-c.w > vR) continue;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y, c.w*0.5, c.h*0.5, 0, 0, Math.PI*2);
          ctx.fill();
      }
      ctx.restore();
  }
}

function renderWater(vL,vR,vT,vB){
  ctx.save();
  var grad = ctx.createLinearGradient(0, 0, 0, PD);
  var lightTop = lightAt(0), lightMid = lightAt(PD*0.5), lightBot = lightAt(PD);
  
  // Smoothly blend photic, twilight, and benthic zones
  grad.addColorStop(0, 'rgb('+Math.round(10+lightTop*15)+','+Math.round(40+lightTop*40)+','+Math.round(60+lightTop*40)+')');
  grad.addColorStop(0.5, 'rgb('+Math.round(10+lightMid*10)+','+Math.round(25+lightMid*20)+','+Math.round(50+lightMid*30)+')');
  grad.addColorStop(1, 'rgb('+Math.round(15+lightBot*10)+','+Math.round(30+lightBot*10)+','+Math.round(25+lightBot*15)+')');
  if(season===3) grad.addColorStop(0, 'rgba(180,195,210,0.8)'); // Winter surface
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-halfW(0), 0);
  for(var dd=10; dd<=PD; dd+=10) ctx.lineTo(-halfW(dd), dd);
  for(var dd=PD; dd>=0; dd-=10) ctx.lineTo(halfW(dd), dd);
  ctx.closePath();
  ctx.fill();
  
  // Volumetric Shadows from Clouds
  var isDay = (tod>6 && tod<18);
  if (isDay && window.skyClouds && dayLight > 0.3) {
      ctx.save();
      for(var i=0; i<window.skyClouds.length; i++) {
          var c = window.skyClouds[i];
          if(c.x+c.w < vL || c.x-c.w > vR) continue;
          var sg = ctx.createLinearGradient(0, 0, 0, PD);
          sg.addColorStop(0, 'rgba(0, 5, 15, 0.4)');
          sg.addColorStop(1, 'rgba(0, 5, 15, 0)');
          ctx.fillStyle = sg;
          ctx.beginPath();
          var sx1 = c.x - c.w*0.4;
          var sx2 = c.x + c.w*0.4;
          var sunAngle = (tod - 12) / 6; // -1 to 1
          var spread = 300;
          ctx.moveTo(sx1, 0); ctx.lineTo(sx2, 0);
          ctx.lineTo(sx2 + sunAngle*spread, PD); ctx.lineTo(sx1 + sunAngle*spread, PD);
          ctx.fill();
      }
      ctx.restore();
  }
  
  // Ocean snow
  if(window.oceanSnow && zoom>1.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      for(var i=0; i<window.oceanSnow.length; i++) {
          var s = window.oceanSnow[i];
          if(s.x < vL || s.x > vR || s.y < vT || s.y > vB) continue;
          ctx.moveTo(s.x, s.y);
          ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      }
      ctx.fill();
  }
  
  ctx.restore();
  ctx.strokeStyle='rgba(140,200,240,'+(0.3+dayLight*0.3)+')';ctx.lineWidth=2;ctx.beginPath();
  var surfW=halfW(0);
  for(var x=-surfW;x<=surfW;x+=8){var wave=Math.sin(x*0.02+fc*0.05)*2;if(x===-surfW)ctx.moveTo(x,wave);else ctx.lineTo(x,wave);}
  ctx.stroke();
  
  // Lilypads on surface
  ctx.save();
  for(var lp=-surfW+50; lp<surfW; lp+=600) {
      if(Math.abs(lp) % 3 === 0) continue; // Random sparsity
      var wy = Math.sin(lp*0.02+fc*0.05)*2;
      ctx.fillStyle = '#1b4a22'; // Dark green lilypad
      ctx.beginPath(); ctx.ellipse(lp, wy-1, 250, 40, 0, 0, Math.PI*1.8); ctx.fill();
      ctx.fillStyle = '#2d6a36'; // Lighter green top
      ctx.beginPath(); ctx.ellipse(lp, wy-2, 220, 35, 0, 0, Math.PI*1.8); ctx.fill();
  }
  ctx.restore();
  
  // Ice layer
  if(SEASONS[season].ice > 0) {
      ctx.save();
      var iceAlpha = SEASONS[season].ice * 0.7;
      ctx.fillStyle = 'rgba(210, 240, 255, '+iceAlpha+')';
      ctx.beginPath();
      for(var x=-surfW;x<=surfW;x+=10){var wave=Math.sin(x*0.02+fc*0.05)*0.5;if(x===-surfW)ctx.moveTo(x,wave);else ctx.lineTo(x,wave);}
      ctx.lineTo(surfW, SEASONS[season].ice * 30);
      ctx.lineTo(-surfW, SEASONS[season].ice * 30);
      ctx.closePath();
      ctx.fill();
      
      // Ice bottom jagged edge
      ctx.strokeStyle = 'rgba(230, 250, 255, '+(iceAlpha+0.2)+')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for(var x=-surfW;x<=surfW;x+=15){
          var bot = SEASONS[season].ice * 30 + Math.sin(x*0.1 + fc*0.01)*3 + Math.cos(x*0.05)*4;
          if(x===-surfW) ctx.moveTo(x, bot); else ctx.lineTo(x, bot);
      }
      ctx.stroke();
      ctx.restore();
  }
  
  if(dayLight>0.3){ctx.fillStyle='rgba(200,230,255,'+(dayLight*0.06)+')';ctx.beginPath();
    for(var x=-surfW;x<=surfW;x+=10){var wave=Math.sin(x*0.02+fc*0.05)*2;if(x===-surfW)ctx.moveTo(x,wave);else ctx.lineTo(x,wave);}
    ctx.lineTo(surfW,5);ctx.lineTo(-surfW,5);ctx.closePath();ctx.fill();}
  // Solid Dirt/Rock Walls outside the pond
  ctx.fillStyle='#0f0c08'; // very dark brown
  // Left wall
  ctx.beginPath();
  ctx.moveTo(vL-500, 0);
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(-halfW(dd), dd);
  ctx.lineTo(-halfW(PD), vB+500);
  ctx.lineTo(vL-500, vB+500);
  ctx.closePath(); ctx.fill();
  
  // Right wall
  ctx.beginPath();
  ctx.moveTo(vR+500, 0);
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(halfW(dd), dd);
  ctx.lineTo(halfW(PD), vB+500);
  ctx.lineTo(vR+500, vB+500);
  ctx.closePath(); ctx.fill();

  // Left shore edge
  ctx.strokeStyle='rgba(80,65,40,0.8)';ctx.lineWidth=5;ctx.beginPath();
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(-halfW(dd),dd);
  ctx.stroke();
  // Right shore edge
  ctx.beginPath();
  for(var dd=0;dd<=PD;dd+=10) ctx.lineTo(halfW(dd),dd);
  ctx.stroke();
  // Shore highlight (lighter top edge)
  ctx.strokeStyle='rgba(120,100,60,0.3)';ctx.lineWidth=3;
  ctx.beginPath();
  for(var dd=0;dd<=PD*0.3;dd+=10){ctx.lineTo(-halfW(dd)+3,dd);}
  ctx.stroke();
  ctx.beginPath();
  for(var dd=0;dd<=PD*0.3;dd+=10){ctx.lineTo(halfW(dd)-3,dd);}
  ctx.stroke();

  if(typeof isWinter !== 'undefined' && isWinter) {
    ctx.fillStyle = 'rgba(200,255,255,0.3)';
    ctx.fillRect(-PW, 0, PW*2, 20);
  }

  // Abyss boundary
  ctx.fillStyle = 'rgba(0, 5, 12, 0.95)';
  ctx.fillRect(-PW*2, PD, PW*4, 4000);
  ctx.strokeStyle = 'rgba(20, 40, 60, 0.8)';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 15]);
  ctx.beginPath(); ctx.moveTo(-PW*2, PD); ctx.lineTo(PW*2, PD); ctx.stroke();
  ctx.setLineDash([]);
}

function renderParallax(vL,vR,vT,vB){
  // 3 Layers of dust/plankton moving at different speeds
  ctx.save();
  var pLayers = [
     {speed: 0.1, count: 50, size: 1, color: 'rgba(200,255,200,0.1)'},
     {speed: 0.3, count: 40, size: 2, color: 'rgba(150,255,150,0.15)'},
     {speed: 0.6, count: 30, size: 3, color: 'rgba(100,255,100,0.2)'}
  ];
  for (var l=0; l<pLayers.length; l++) {
     var layer = pLayers[l];
     ctx.fillStyle = layer.color;
     for (var i=0; i<layer.count; i++) {
        // pseudo-random but deterministic placement based on layer and index
        var x = (((i*173 + l*91) * 13) % (PW*4)) - PW*2;
        var y = (((i*311 + l*17) * 7) % (PD*1.5)) - PD*0.2;
        
        // apply parallax shift based on camera
        x += cam.x * (1 - layer.speed);
        y += cam.y * (1 - layer.speed);
        
        // wrap around
        var pWidth = PW*2;
        x = ((x + PW) % pWidth);
        if(x < 0) x += pWidth;
        x -= PW;

        if (x > vL && x < vR && y > vT && y < vB) {
           ctx.beginPath();
           ctx.arc(x, y, layer.size, 0, Math.PI*2);
           ctx.fill();
        }
     }
  }
  ctx.restore();
}

function renderSunRays(vL,vR){
  if(dayLight<0.15)return;ctx.save();ctx.globalCompositeOperation='screen';
  for(var i=0;i<sunRays.length;i++){
    var sr=sunRays[i];if(sr.x<vL-100||sr.x>vR+100)continue;
    var opacity=dayLight*0.12;
    var g=ctx.createLinearGradient(sr.x,0,sr.x+sr.angle*300,PD*0.7);
    g.addColorStop(0,'rgba(255,245,200,'+opacity+')');g.addColorStop(0.5,'rgba(255,235,150,'+opacity*0.5+')');g.addColorStop(1,'rgba(255,230,100,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(sr.x-sr.w/2,0);ctx.lineTo(sr.x+sr.w/2,0);
    ctx.lineTo(sr.x+sr.w/2+sr.angle*PD*0.7+sr.w*0.3,PD*0.7);ctx.lineTo(sr.x-sr.w/2+sr.angle*PD*0.7-sr.w*0.3,PD*0.7);
    ctx.closePath();ctx.fill();
  }
  ctx.restore();
}

function renderSediment(vL,vR,vB){
  // Organic curved bottom — multiple layers of sediment
  var sx0=Math.max(vL-50,-PW),sx1=Math.min(vR+50,PW);
  // Deep mud layer
  ctx.fillStyle='#2a1d0e';ctx.beginPath();
  ctx.moveTo(sx0,PD+50);
  for(var x=sx0;x<=sx1;x+=10){
    var hw=halfW(PD);
    if(Math.abs(x)>hw){continue;}
    var bump=Math.sin(x*0.015)*8+Math.sin(x*0.04+2)*5+Math.sin(x*0.08+1)*3;
    var mudY=PD-15+bump;
    ctx.lineTo(x,mudY);
  }
  ctx.lineTo(sx1,PD+50);ctx.closePath();ctx.fill();
  // Lighter sediment layer on top
  ctx.fillStyle='#3d2a15';ctx.beginPath();
  for(var x=sx0;x<=sx1;x+=8){
    var hw=halfW(PD);
    if(Math.abs(x)>hw)continue;
    var bump=Math.sin(x*0.02+1)*5+Math.sin(x*0.06)*3;
    ctx.lineTo(x,PD-8+bump);
  }
  ctx.lineTo(sx1,PD+20);ctx.lineTo(sx0,PD+20);ctx.closePath();ctx.fill();
  // Sand/silt specks
  ctx.fillStyle='rgba(90,70,40,0.5)';
  for(var x=sx0;x<=sx1;x+=6){
    var hw=halfW(PD);
    if(Math.abs(x)>hw)continue;
    var bump=Math.sin(x*0.015)*8+Math.sin(x*0.04+2)*5;
    var yy=PD-12+bump+rng(-2,2);
    ctx.beginPath();ctx.ellipse(x,yy,rng(3,8),rng(1,3),0,0,Math.PI*2);ctx.fill();
  }
  // Decaying leaves/organic matter
  for(var i=0;i<sedimentClumps.length;i++){var sc=sedimentClumps[i];if(sc.x<vL-30||sc.x>vR+30)continue;
    ctx.save();ctx.translate(sc.x,sc.y);ctx.rotate(sc.rot);
    ctx.fillStyle='rgba(50,35,15,0.8)';ctx.beginPath();ctx.ellipse(0,0,sc.w,sc.h,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(70,50,25,0.5)';ctx.beginPath();ctx.ellipse(-sc.w*0.3,-sc.h*0.2,sc.w*0.4,sc.h*0.3,0,0,Math.PI*2);ctx.fill();
    ctx.restore();}
  // Small rocks
  ctx.fillStyle='rgba(60,55,50,0.6)';
  for(var i=0;i<15;i++){
    var seed=i*7919;var rx=((seed%2000)/2000-0.5)*BW*1.5;
    var bump=Math.sin(rx*0.015)*8;var ry=PD-10+bump+rng(-1,3);
    if(rx<vL-20||rx>vR+20)continue;
    ctx.beginPath();ctx.ellipse(rx,ry,rng(4,10),rng(3,6),rng(0,3),0,Math.PI*2);ctx.fill();
  }
}

function renderNutrients(vL,vR,vT,vB){
  for(var i=0;i<nutrientClouds.length;i++){var nc=nutrientClouds[i];
    if(nc.x<vL-nc.r||nc.x>vR+nc.r||nc.y<vT-nc.r||nc.y>vB+nc.r)continue;
    var g=ctx.createRadialGradient(nc.x,nc.y,0,nc.x,nc.y,nc.r);
    g.addColorStop(0,'rgba(100,140,70,'+(nc.intensity*0.1)+')');g.addColorStop(1,'rgba(100,140,70,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(nc.x,nc.y,nc.r,0,Math.PI*2);ctx.fill();}
    
  if (window.toxicClouds) {
      for(var i=0;i<window.toxicClouds.length;i++){
          var tc=window.toxicClouds[i];
          if(tc.x<vL-tc.r||tc.x>vR+tc.r||tc.y<vT-tc.r||tc.y>vB+tc.r)continue;
          var tg=ctx.createRadialGradient(tc.x,tc.y,0,tc.x,tc.y,tc.r);
          tg.addColorStop(0,'rgba(50,255,50,'+(Math.max(0, tc.life*0.5))+')');
          tg.addColorStop(1,'rgba(50,255,50,0)');
          ctx.fillStyle=tg;ctx.beginPath();ctx.arc(tc.x,tc.y,tc.r,0,Math.PI*2);ctx.fill();
      }
  }
}

function renderShore(vL,vR,vT){
  for(var i=0;i<shoreDecor.length;i++){var d=shoreDecor[i];
    if(d.x<vL-30||d.x>vR+30||d.y<vT-30||d.y>30)continue;
    ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.rot);
    if(d.type==='grass'){ctx.strokeStyle='rgba(50,90,30,0.6)';ctx.lineWidth=2;
      for(var b=0;b<4;b++){ctx.beginPath();ctx.moveTo(b*2-3,d.size*0.3);var sway=Math.sin(fc*0.02+b)*3;
      ctx.quadraticCurveTo(b*2-3+sway,d.size*0.1,b*2-3+sway*2,-d.size);ctx.stroke();}}
    else{ctx.fillStyle='rgba(100,85,60,0.7)';ctx.beginPath();ctx.ellipse(0,0,d.size,d.size*0.7,0,0,Math.PI*2);ctx.fill();}
    ctx.restore();}
}

function renderShadows(vL,vR,vT,vB){
  ctx.save();
  for(var i=0;i<orgs.length;i++){var o=orgs[i];if(!o.alive)continue;
    if(o.x<vL-20||o.x>vR+20||o.y<vT-20||o.y>vB+20)continue;
    var depthR=o.y/PD;ctx.fillStyle='rgba(0,0,0,'+(0.08*(1-depthR))+')';
    ctx.beginPath();ctx.ellipse(o.x,o.y+o.size*0.5,o.size*0.8,o.size*0.4,0,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function renderBubbles(vL,vR,vT,vB){
  ctx.save();ctx.strokeStyle='rgba(180,230,255,0.35)';ctx.lineWidth=1;
  for(var i=0;i<o2Bubbles.length;i++){var b=o2Bubbles[i];
    if(b.x<vL||b.x>vR||b.y<vT||b.y>vB)continue;
    ctx.globalAlpha=b.life*0.5;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

function renderRain(vL,vR,vT){
  ctx.save();ctx.strokeStyle='rgba(150,180,220,0.35)';ctx.lineWidth=1;
  for(var i=0;i<rainDrops.length;i++){var r=rainDrops[i];if(r.x<vL||r.x>vR||r.y<vT)continue;
    ctx.globalAlpha=r.life*0.5;ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-r.vx*2,r.y-r.vy*2);ctx.stroke();}
  ctx.restore();
}

