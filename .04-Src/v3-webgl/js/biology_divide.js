"use strict";

function finishDivide(o){
  o.dividing=false;
  o.energy = Math.max(5, (o.energy||0)*0.5);
  // Parent becomes ~half size (clearly visible), then slowly regrows via normal growth
  var base = o.preDivSize || o.size || (o.sp.size||4);
  var half = Math.max(1.6, base * 0.5);
  o.size = half;
  // MUST re-accumulate mass/eats before next divide
  o.massFood = 0;
  o.eatsSinceDiv = 0;
  o.birthSize = half;
  // Longer cooldown for predators — no spam divide
  var cd = (typeof DIV_COOLDOWN==='number' ? DIV_COOLDOWN : 6);
  if(o.sp && o.sp.cat && o.sp.cat.indexOf('consumer')===0) cd = Math.max(cd, 8);
  if(o.sp && (o.sp.cat==='consumer2'||o.sp.cat==='consumer3')) cd = Math.max(cd, 12);
  o.divCD = cd;
  try{ if(o===player||window.spectatorMode) window.playSound("divide"); }catch(_e){}
  // KEY FIX: push child AWAY with separation impulse + cooldown
  var pushAng=(typeof rng==='function'?rng(0,Math.PI*2):Math.random()*Math.PI*2);
  var sep = (typeof DIV_SEPARATION==='number'?DIV_SEPARATION:12);
  var cx=o.x+Math.cos(pushAng)*sep;
  var cy=o.y+Math.sin(pushAng)*sep;
  // Clamp child to puddle
  try{
    var hw=(typeof halfW==='function'?halfW(cy):500)-15;
    cx=clamp(cx,-hw,hw); cy=clamp(cy,5,(typeof PD==='number'?PD:1000)-10);
  }catch(_e){}
  var child=null;
  try{ child=spawnOrg(o.sp,cx,cy,false,o.energy); }catch(_e){ child=null; }
  if(child){
    child.generation=o.generation+1;child.energy=o.energy*0.9;
    child.size=Math.max(1.6, base * 0.5 * rng(0.95,1.05));
    child.massFood=0; child.eatsSinceDiv=0; child.birthSize=child.size;
    var ccd = (typeof DIV_COOLDOWN==='number'?DIV_COOLDOWN:4);
    if(o.sp.cat && o.sp.cat.indexOf('consumer')===0) ccd=Math.max(ccd,8);
    child.divCD=ccd;
    child.flash=0.7; child.flashColor='#8ff';
    
    // Genetics & Mutations
    child.speedMult = o.speedMult;
    child.sizeMult = o.sizeMult;
    child.tempOffset = o.tempOffset;
    child.o2Offset = o.o2Offset;
    child.acidResist = o.acidResist;

    if(Math.random() < 0.15) {
       var gene = Math.floor(Math.random()*5);
       if(gene===0) child.speedMult *= rng(0.9, 1.1);
       if(gene===1) child.sizeMult *= rng(0.9, 1.1);
       if(gene===2) child.tempOffset += rng(-2, 2);
       if(gene===3) child.o2Offset += rng(-5.0, 5.0);
       if(gene===4) child.acidResist += rng(-0.2, 0.2);
       
       child.acidResist = Math.max(0, Math.min(1, child.acidResist));
       child.speedMult = Math.max(0.1, Math.min(5.0, child.speedMult));
    }

    // Push apart
    var pushForce=3;
    o.vx+=Math.cos(pushAng)*pushForce;o.vy+=Math.sin(pushAng)*pushForce;
    child.vx-=Math.cos(pushAng)*pushForce;child.vy-=Math.sin(pushAng)*pushForce;
    o.offspring++;
  }
  o.flash=0.8;o.flashColor='#8ff';
  if(settings.particles)for(var i=0;i<18;i++)parts.push({x:o.x,y:o.y,vx:rng(-4,4),vy:rng(-4,4),life:1.2,maxL:1.2,size:rng(2,6),color:i%2?'#8ff':'#fff'});
  if(o===player && window.showToast) window.showToast('Деление!', '#8ff');
  if (typeof window !== 'undefined' && state === 'menu' && window.focusTimer <= 0 && Math.random() < 0.2) { window.focusTarget = o; window.focusTimer = 2.0; }
}
