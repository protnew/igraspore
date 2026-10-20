"use strict";

function genOrgans(o){
  var b=o.sp.bio,sz=o.size,org=[];
  if(b.nucleus){
    var nx=rng(-sz*0.1,sz*0.1),ny=rng(-sz*0.1,sz*0.1);
    org.push({t:'nuc',x:nx,y:ny,r:sz*0.24,c:'#9358a0'});
    org.push({t:'nuc2',x:nx,y:ny,r:sz*0.09,c:'#c060c0'});
  }
  if(b.macro){
    org.push({t:'mac',x:-sz*0.3,y:0,r:sz*0.3,c:'#a050a0'});
    org.push({t:'mic',x:sz*0.3,y:-sz*0.15,r:sz*0.08,c:'#c070c0'});
  }
  if(b.chloro){
    var cn=3+Math.floor(sz/3);
    for(var i=0;i<cn;i++){var a=i/cn*Math.PI*2;
      org.push({t:'chl',x:Math.cos(a)*sz*0.45,y:Math.sin(a)*sz*0.4,rx:sz*0.2,ry:sz*0.1,rot:a,c:'#2a8a2a'});}
  }
  if(b.plastid){
    org.push({t:'plastid',x:sz*0.2,y:sz*0.2,rx:sz*0.15,ry:sz*0.08,rot:0.5,c:'#8a2a8a'});
  }
  if(b.mito){
    var mn=2+Math.floor(sz/5);
    for(var i=0;i<mn;i++){var a=rng(0,Math.PI*2),r=rng(sz*0.2,sz*0.5);
      org.push({t:'mito',x:Math.cos(a)*r,y:Math.sin(a)*r,rx:sz*0.12,ry:sz*0.05,rot:a,c:'#c44'});}
  }
  if(b.golgi){
    org.push({t:'golgi',x:-sz*0.25,y:sz*0.25,r:sz*0.12,c:'#e8e'});
    for(var i=0;i<3;i++){
      org.push({t:'golgiS',x:-sz*0.25,y:sz*0.25+(i-1)*sz*0.06,rx:sz*0.1,ry:sz*0.02,rot:0,c:'#c4c'});
    }
  }
  if(b.er){
    for(var i=0;i<2;i++){
      org.push({t:'er',x:rng(-sz*0.4,sz*0.4),y:rng(-sz*0.35,sz*0.35),rx:sz*0.18,ry:sz*0.04,rot:rng(0,Math.PI),c:'#aac'});
    }
  }
  if(b.nucleoid) org.push({t:'nucleoid',x:0,y:0,r:sz*0.35,c:'#90a0ff'});
  if(b.thylakoid) org.push({t:'thylakoid',x:0,y:0,r:sz*0.6,c:'#1f8f5f'});
  if(b.vac){
    var vn=1+Math.floor(sz/6);
    for(var i=0;i<vn;i++)org.push({t:'vac',x:rng(-sz*0.45,sz*0.45),y:rng(-sz*0.4,sz*0.4),r:sz*0.1,c:'#ccaa44'});
  }
  if(b.contractile)org.push({t:'cv',x:sz*0.4,y:-sz*0.3,r:sz*0.12,c:'#66ccff'});
  if(b.ribo){
    var rn=4+Math.floor(sz/4);
    for(var i=0;i<rn;i++){
      org.push({t:'ribo',x:rng(-sz*0.5,sz*0.5),y:rng(-sz*0.45,sz*0.45),r:sz*0.04,c:'#ddd'});
    }
  }
  if(b.trich){
    var tn=5+Math.floor(sz/4);
    for(var i=0;i<tn;i++){var a=i/tn*Math.PI*2;
      org.push({t:'trich',x:Math.cos(a)*sz*0.85,y:Math.sin(a)*sz*0.85,r:sz*0.03,c:'#fcc'});
    }
  }
  if(b.eye)org.push({t:'eye',x:sz*0.5,y:0,r:sz*0.08,c:'#ff6600'});
  if(b.oral)org.push({t:'oral',x:sz*0.3,y:sz*0.2,r:sz*0.12,c:'#dd8844'});
  return org;
}
