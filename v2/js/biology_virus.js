// biology.js — spawn, divide, eat, kill, cyst, viruses
"use strict";


function updateInfections(dt){
  for(var i=0;i<orgs.length;i++){
    var o=orgs[i];
    if(o.infected&&o.alive&&!o.dying){
      o.infectionT+=dt;
      o.flash=Math.max(o.flash,0.15);o.flashColor='#f44';
      // Lysis after 15-25 seconds
      if(o.infectionT>15+rng(0,10)){
        // #21 Virus lysis: cell bursts, releasing phages (dramatic visual)
        var numNew=4+Math.floor(Math.random()*4);
        for(var v=0;v<numNew;v++){
          viruses.push({x:o.x+rng(-5,5),y:o.y+rng(-5,5),vx:rng(-3,3),vy:rng(-3,3),
            sp:VIRUS_SPECS[Math.floor(Math.random()*VIRUS_SPECS.length)],
            target:null,age:0,angle:rng(0,Math.PI*2),wobble:rng(0,Math.PI*2)});
        }
        killOrg(o,DCODE.LYSIS);
        // Burst particles: cell debris + viral particles
        if(settings.particles){
          for(var p=0;p<4;p++)parts.push({x:o.x,y:o.y,vx:rng(-1,1),vy:rng(-1,1),life:0.8,maxL:0.8,size:rng(0.5,1.5),color:o.sp.color});
        }
      }
    }
  }
}

function updateViruses(dt){
  var vr=settings.virusRate*DIFF[difficulty].virus;
  virusT+=dt;
  if(virusT>8/vr){virusT=0;spawnVirus();}
  for(var i=viruses.length-1;i>=0;i--){
    var v=viruses[i];v.age+=dt;
    v.wobble+=dt*3;
    // Find target bacteria
    if(!v.target||!v.target.alive){
      v.target=null;
      for(var j=0;j<orgs.length;j++){
        var o=orgs[j];
        var isTarget = (v.sp.type === 'parasite') ? o.isPlayer : (v.sp.target ? o.sp.cat===v.sp.target : true);
        if(o.alive&&!o.infected&&isTarget&&dist2(v,o)<300*300){v.target=o;break;}
      }
    }
    if(v.target&&v.target.alive){
      var dx=v.target.x-v.x,dy=v.target.y-v.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<15){
          if(Math.random() > (v.target.virusResist || 0)){
            if(!v.target.cyst){v.target.infected=true;}
            v.target.infectionT=0;
            if(v.sp.type === 'parasite') v.target.parasiticInfection = true;
          }
          viruses.splice(i,1);continue;
      }
      v.vx+=dx/d*0.5*dt*60;v.vy+=dy/d*0.5*dt*60;
    }
    v.vx*=0.95;v.vy*=0.95;
    v.x+=v.vx*dt*60;v.y+=v.vy*dt*60;
    v.angle=Math.atan2(v.vy,v.vx);
    // Remove old viruses
    if(v.age>60)viruses.splice(i,1);
  }
}

function spawnVirus(){
  if(viruses.length>30)return;
  var vi=Math.floor(Math.random()*VIRUS_SPECS.length);
  var vs=VIRUS_SPECS[vi];
  var d=rng(50,PD-50),hw=halfW(d)-20;
  viruses.push({x:rng(-hw,hw),y:d,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),
    sp:vs,target:null,age:0,angle:rng(0,Math.PI*2),wobble:rng(0,Math.PI*2)});
}
