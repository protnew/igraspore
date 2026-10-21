// igs_v20.js - v20 port helpers for release v2.0.0 (markers: pExit demoExit __igsTest)
"use strict";

window.closeIntroCard = function(){
  var el=document.getElementById('roleCard'); if(el) el.remove();
  if(typeof state!=='undefined' && state==='paused') state='playing';
  if(window._pendingTutorial){ window._pendingTutorial=false; try{ window.startTutorial(false); }catch(e){} }
};
window.showDemoChrome = function(sp){
  var b=document.getElementById('demoBadge'), x=document.getElementById('demoExit');
  if(b){ try{ b.textContent=(typeof tt==='function'?tt('demo'):'DEMO')+' · '+(sp&&sp.name?sp.name:''); }catch(e){ b.textContent='DEMO'; } b.style.display='block'; }
  if(x){ x.style.display='flex'; x.setAttribute('aria-label','Exit demo'); }
};
window.exitDemoCleanup = function(){
  var b=document.getElementById('demoBadge'), x=document.getElementById('demoExit');
  if(b) b.style.display='none';
  if(x) x.style.display='none';
  try{ document.body.classList.remove('demo-on'); }catch(e){}
};
window.exitDemo = function(){
  window.__igsDemo=false;
  window.demoMode=false;
  window.demoPossessed=null;
  window.spectatorMode=false;
  try{ freeCam=false; autoAI=false; }catch(e){}
  window.exitDemoCleanup();
  try{ player=null; state='menu'; }catch(e){}
  var mo=document.getElementById('menuO'); if(mo) mo.className='ov show';
  if(typeof hideGameHud==='function') hideGameHud();
};
window.demoBring = function(n){
  if(!(n>0) || typeof orgs==='undefined' || typeof cam==='undefined') return;
  var far=[];
  for(var k=0;k<orgs.length;k++){
    var o=orgs[k];
    if(o&&o.alive&&!o.isPlayer&&o.sp&&o.sp.cat!=='virus'&&(Math.abs(o.x-cam.x)>220||Math.abs(o.y-cam.y)>180)) far.push(o);
  }
  for(var q=0;q<n&&q<far.length;q++){
    var a=Math.random()*Math.PI*2, r=40+Math.random()*90;
    far[q].x=cam.x+Math.cos(a)*r;
    far[q].y=cam.y+Math.sin(a)*r*0.7;
  }
};

function igsBindV20(){
  var pExit=document.getElementById('pExit');
  if(pExit && !pExit._v20){
    pExit._v20=1;
    pExit.onclick=function(){
      try{ state='paused'; }catch(e){}
      var po=document.getElementById('pauseO'); if(po) po.className='ov show';
      var ec=document.getElementById('exitConfirm'); if(ec) ec.className='ov show';
      var no=document.getElementById('ecNo'); if(no) try{ no.focus(); }catch(e){}
    };
  }
  var menuPause=document.getElementById('menuBtnPause');
  if(menuPause && !menuPause._v20){
    menuPause._v20=1;
    menuPause.addEventListener('click', function(ev){
      ev.preventDefault(); ev.stopPropagation();
      var ec=document.getElementById('exitConfirm'); if(ec) ec.className='ov show';
    }, true);
  }
  var ecNo=document.getElementById('ecNo');
  if(ecNo && !ecNo._v20){
    ecNo._v20=1;
    ecNo.onclick=function(){
      var ec=document.getElementById('exitConfirm'); if(ec) ec.className='ov';
      try{ state='paused'; }catch(e){}
      var po=document.getElementById('pauseO'); if(po) po.className='ov show';
    };
  }
  var ecYes=document.getElementById('ecYes');
  if(ecYes && !ecYes._v20){
    ecYes._v20=1;
    ecYes.onclick=function(){
      var ec=document.getElementById('exitConfirm'); if(ec) ec.className='ov';
      var po=document.getElementById('pauseO'); if(po) po.className='ov';
      window.__igsDemo=false;
      if(window.exitDemoCleanup) window.exitDemoCleanup();
      try{ player=null; state='menu'; }catch(e){}
      var mo=document.getElementById('menuO'); if(mo) mo.className='ov show';
      if(typeof hideGameHud==='function') hideGameHud();
    };
  }
  var dx=document.getElementById('demoExit');
  if(dx && !dx._v20){
    dx._v20=1;
    dx.onclick=function(ev){ if(ev){ev.stopPropagation();ev.preventDefault();} if(window.exitDemo) window.exitDemo(); };
  }
  var introOk=document.getElementById('roleCardOk');
  if(introOk && !introOk._v20){ introOk._v20=1; }
}

if(typeof document!=='undefined'){
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', igsBindV20);
  else igsBindV20();
  setTimeout(igsBindV20, 0);
  setTimeout(igsBindV20, 400);
}

if(typeof location!=='undefined' && location.search.indexOf('test=1')>=0){
  window.__igsTest={
    killPlayer:function(cause){ if(player&&player.alive){ killOrg(player, (typeof cause==='number')?cause:DCODE.STARVE); player=null; } },
    setEnergy:function(v){ if(player){ player.energy=v; } },
    spawnVirusNear:function(){
      var x=(player?player.x:cam.x)+rng(-30,30), y=(player?player.y:cam.y)+rng(-30,30);
      var d=rng(20,Math.max(30,PD*0.3)); var hw=halfW(d)-10;
      viruses.push({x:clamp(x,-hw,hw),y:clamp(y,4,PD-4),vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),
        angle:0,wobble:0,sp:VIRUS_SPECS[0],target:null}); return viruses.length;
    },
    getSizes:function(){
      var b=[];
      for(var i=0;i<orgs.length;i++){
        var o=orgs[i];
        if(o&&o.alive&&o.sp&&(o.sp.cat==='producer'||o.sp.cat==='consumer1'||o.sp.cat==='decomposer')) b.push(o.size||0);
      }
      b.sort(function(a,c){return a-c;});
      return b;
    }
  };
}
