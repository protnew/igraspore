// biology.js — spawn, divide, eat, kill, cyst, viruses
"use strict";


function updateInfections(dt){
  for(var i=0;i<orgs.length;i++){
    var o=orgs[i];
    if(o.infected&&o.alive&&!o.dying){
      o.infectionT+=dt;
      o.flash=Math.max(o.flash,0.2+0.3*Math.sin(o.infectionT*3));o.flashColor='#f44';
      // Infected cell swells as virus replicates inside
      o.sizeMult=Math.min(1.8, 1.0+o.infectionT*0.06);
      // v2: LYSIS after 10-20s — cell bursts, releasing ~100 phage copies (natural lytic cycle)
      if(o.infectionT>10+rng(0,10)){
        // #21 Virus lysis: cell bursts, releasing 80-120 phage copies
        var numNew=80+Math.floor(Math.random()*40); // ~100 copies as in nature
        var burstSp=o.virusType||VIRUS_SPECS[0];
        var maxV=Math.min(numNew, 80-viruses.length); // cap to prevent overload
        for(var v=0;v<Math.min(maxV,3) && viruses.length<15;v++){
          var ang=v/maxV*Math.PI*2+rng(-0.3,0.3);
          var spd=rng(0.05,0.2);
          viruses.push({x:o.x+rng(-3,3),y:o.y+rng(-3,3),
            vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,
            sp:burstSp,target:null,age:0,angle:rng(0,6.28),wobble:rng(0,6.28)});
        }
        killOrg(o,DCODE.LYSIS);
        // Dramatic burst particles: cell debris + viral particles explode outward
        if(settings.particles){
          for(var p=0;p<12;p++)parts.push({x:o.x,y:o.y,vx:rng(-3,3),vy:rng(-3,3),life:1.2,maxL:1.2,size:rng(1,3),color:o.sp.color});
          for(var p=0;p<8;p++)parts.push({x:o.x,y:o.y,vx:rng(-2,2),vy:rng(-2,2),life:0.8,maxL:0.8,size:0.8,color:'#f44'});
        }
        // Screen shake on lysis
        if(typeof cam!=='undefined'&&typeof player!=='undefined'){
          var sd=Math.hypot(o.x-(player?player.x:0),o.y-(player?player.y:0));
          if(sd<200)cam.shake=(cam.shake||0)+Math.max(0,8-sd/30);
        }
      }
    }
  }
}

function updateViruses(dt){
  var vr=settings.virusRate*DIFF[difficulty].virus;
  virusT+=dt;
  if(virusT>1/vr){virusT=0;spawnVirus();}
  for(var i=viruses.length-1;i>=0;i--){
    var v=viruses[i];v.age+=dt;
    v.wobble+=dt*3;
    // Find target bacteria
    if(!v.target||!v.target.alive){
      v.target=null;
      for(var j=0;j<orgs.length;j++){
        var o=orgs[j];
        // Phages only infect prokaryotes (bacteria/archaea = producer + consumer1).
      // Neuro-Parasite (type=parasite) targets player specifically.
      var isTarget;
      if (v.sp.type === 'parasite') {
        isTarget = o.isPlayer;
      } else if (v.sp.target) {
        isTarget = o.sp.cat === v.sp.target;
      } else {
        // Default phage targets: bacteria only (not eukaryotes like ciliates/fungi)
        isTarget = (o.sp.cat === 'producer' || o.sp.cat === 'consumer1') && !o.sp.isEuk;
      }
        if(o.alive&&!o.infected&&isTarget&&dist2(v,o)<500*500){v.target=o;break;}
      }
    }
    if(v.target&&v.target.alive){
      var dx=v.target.x-v.x,dy=v.target.y-v.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<15){
          // v2: NATURAL LYTIC CYCLE — virus penetrates cell, replicates, bursts it
          // Only 20% of contacts result in infection (realistic MOI)
          if(Math.random() < 0.40 && Math.random() > (v.target.virusResist || 0)){
            if(!v.target.cyst && !v.target.infected){
              v.target.infected = true;
              v.target.infectionT = 0;
              v.target.virusType = v.sp;
              v.target.flashColor = '#f44';
              v.target.flashT = 1.0;
              if(v.sp.type === 'parasite') v.target.parasiticInfection = true;
              viruses.splice(i,1); // virus penetrates — now inside cell
              continue;
            }
          }
          // 80% bounce: failed attachment
          v.target=null;
          v.vx*=-0.2;v.vy*=-0.2; // gentle bounce
          continue;
      }
      // NO active swimming. Only tiny chemotactic bias (Brownian + mild host bias).
      // Real phages: non-motile; contact by diffusion/currents only.
      v.vx+=dx/d*0.012*dt*60;v.vy+=dy/d*0.012*dt*60;
    }
    // Passive Brownian ALWAYS (with or without target) — phages do not swim in packs
    v.vx+=(Math.random()-0.5)*0.008;
    v.vy+=(Math.random()-0.5)*0.008;
    var vsp=Math.sqrt(v.vx*v.vx+v.vy*v.vy);
    if(vsp>0.25){v.vx=v.vx/vsp*0.25;v.vy=v.vy/vsp*0.25;} // hard cap passive
    v.vx*=0.90;v.vy*=0.90; // strong damping
    v.x+=v.vx*dt*30;v.y+=v.vy*dt*30;
    v.angle=Math.atan2(v.vy,v.vx);
    // Remove old viruses
    if(v.age>300)viruses.splice(i,1);
  }
}

function spawnVirus(){
  if(viruses.length>12)return; // passive phages: few in water column at any time
  var vi=Math.floor(Math.random()*VIRUS_SPECS.length);
  var vs=VIRUS_SPECS[vi];
  // Spawn near surface where bacteria density is highest (natural for aquatic phages)
  var d=rng(30,200),hw=Math.max(60,halfW(d)-20);
  // Sometimes spawn near an existing bacterium cluster
  if(orgs.length>10 && Math.random()<0.5){
    var near=orgs[Math.floor(Math.random()*Math.min(orgs.length,200))];
    if(near&&near.alive){ d=near.y+rng(-30,30); }
  }
  viruses.push({x:rng(-hw,hw),y:Math.max(20,Math.min(PD-20,d)),vx:rng(-0.15,0.15),vy:rng(-0.15,0.15),
    sp:vs,target:null,age:0,angle:rng(0,Math.PI*2),wobble:rng(0,Math.PI*2)});
}
