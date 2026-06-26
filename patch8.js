const fs = require('fs');

// --- 1. Patch world.js ---
let world = fs.readFileSync('js/world.js', 'utf8');

let worldRep1 = `  if(b.nucleoid) org.push({t:'nucleoid',x:0,y:0,r:sz*0.35,c:'#90a0ff'});
  if(b.thylakoid) org.push({t:'thylakoid',x:0,y:0,r:sz*0.6,c:'#1f8f5f'});
  if(b.vac){
    var vn=1+Math.floor(sz/6);
    for(var i=0;i<vn;i++)org.push({t:'vac',x:rng(-sz*0.45,sz*0.45),y:rng(-sz*0.4,sz*0.4),r:sz*0.1,c:'#ccaa44'});
  }
  if(b.contractile)org.push({t:'cv',x:sz*0.4,y:-sz*0.3,r:sz*0.12,c:'#66ccff'});`;

world = world.replace(/if\(b\.vac\)\{[\s\S]*?if\(b\.contractile\)org\.push\(\{t:'cv'[\s\S]*?\}\n/, worldRep1 + '\n');
fs.writeFileSync('js/world.js', world);


// --- 2. Patch render.js ---
let render = fs.readFileSync('js/render.js', 'utf8');

let renderRep1 = `    else if(g.t==='cv'){
      var pr=g.r+Math.sin(o.pulse*2)*g.r*0.3;
      ctx.fillStyle=g.c;ctx.globalAlpha=0.6;
      ctx.beginPath();
      for(var j=0;j<10;j++){
        var a=j/10*Math.PI*2; var rr=(j%2===0)?pr:pr*0.5;
        var vx=g.x+Math.cos(a)*rr, vy=g.y+Math.sin(a)*rr;
        if(j===0) ctx.moveTo(vx,vy); else ctx.lineTo(vx,vy);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(80,160,240,0.5)';ctx.lineWidth=0.5;ctx.stroke();
    }
    else if(g.t==='nucleoid'){
      ctx.strokeStyle='rgba(140,160,255,0.7)'; ctx.lineWidth=1; ctx.beginPath();
      for(var k=0;k<16;k++){
         var a=k/16*Math.PI*2; var rr=g.r*(0.5+Math.sin(k*134)*0.5);
         var px=g.x+Math.cos(a)*rr, py=g.y+Math.sin(a)*rr;
         if(k===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath(); ctx.stroke();
    }
    else if(g.t==='thylakoid'){
      ctx.strokeStyle='rgba(30,120,60,0.4)'; ctx.lineWidth=1;
      for(var k=1;k<=3;k++){
         ctx.beginPath(); ctx.arc(g.x, g.y, g.r*(k/3), 0, Math.PI*2); ctx.stroke();
      }
    }`;

render = render.replace(/else if\(g\.t==='cv'\)\{[\s\S]*?ctx\.stroke\(\);\}/, renderRep1);
fs.writeFileSync('js/render.js', render);


// --- 3. Patch ui.js ---
let ui = fs.readFileSync('js/ui.js', 'utf8');

let uiRep1 = `    if(b.nucleoid){
      ctx2.strokeStyle='rgba(140,160,255,0.7)'; ctx2.lineWidth=1.5; ctx2.beginPath();
      for(var k=0;k<16;k++){
         var a=k/16*Math.PI*2; var rr=sz*0.35*(0.5+Math.sin(k*134)*0.5);
         var px=Math.cos(a)*rr, py=Math.sin(a)*rr;
         if(k===0) ctx2.moveTo(px,py); else ctx2.lineTo(px,py);
      }
      ctx2.closePath(); ctx2.stroke();
    }
    if(b.thylakoid){
      ctx2.strokeStyle='rgba(30,120,60,0.4)'; ctx2.lineWidth=1.5;
      for(var k=1;k<=3;k++){
         ctx2.beginPath(); ctx2.arc(0, 0, sz*0.6*(k/3), 0, 6.283); ctx2.stroke();
      }
    }
    // Contractile vacuole — star shape
    if(b.contractile){
      ctx2.fillStyle='rgba(100,180,255,0.4)';ctx2.strokeStyle='rgba(80,160,240,0.6)';ctx2.lineWidth=1;
      ctx2.beginPath();
      for(var j=0;j<10;j++){
        var a=j/10*Math.PI*2; var rr=(j%2===0)?sz*0.12:sz*0.06;
        var vx=sz*0.35+Math.cos(a)*rr, vy=-sz*0.15+Math.sin(a)*rr;
        if(j===0) ctx2.moveTo(vx,vy); else ctx2.lineTo(vx,vy);
      }
      ctx2.closePath(); ctx2.fill(); ctx2.stroke();
    }`;

ui = ui.replace(/\/\/ Contractile vacuole[\s\S]*?ctx2\.stroke\(\);\}/, uiRep1);
fs.writeFileSync('js/ui.js', ui);

console.log('Patched rendering logic for realism!');
