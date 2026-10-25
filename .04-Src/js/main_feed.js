// main_feed.js — ручное кормление (вынесено из main_events.js, лимит 500 строк)
"use strict";
window._manualFeedCD = 0;
window.manualFeed = function(){
  if(!player||!player.alive||player.cyst) return false;
  if(window._manualFeedCD > 0) {
    if(window.showToast) window.showToast(tt('toast.digest',{s:Math.ceil(window._manualFeedCD)}), '#fa0');
    return false;
  }
  var range = player.size + 30;
  var range2 = range*range;
  var best = null, bestSize = 1e18;
  for(var i=0;i<orgs.length;i++){
    var p=orgs[i];
    if(!p||!p.alive||p===player||p.cyst) continue;
    if(p.size > player.size*1.5) continue;
    if(dist2(player,p) <= range2){
      if(p.size < bestSize){ bestSize = p.size; best = p; }
    }
  }
  if(best){
    best.divCD = 0; best.invuln = 0;
    var ate = true;
    if(typeof forceEat==='function') ate = !!forceEat(player, best);
    else eatOrg(player, best);
    if(!ate) return false;
    window._manualFeedCD = 0.5;
    player.flash = 1; player.flashColor = '#ff0';
    if(window.showToast) window.showToast(tt('toast.bite',{name:best.sp.name}), '#8f8');
    return true;
  }
  if(window.showToast) window.showToast(tt('toast.eat.none'), '#faa');
  return false;
};
(function(){
  var b = document.getElementById('bFeed');
  if(b) b.onclick = function(){ window.tryPlayerEat&&window.tryPlayerEat(); };
})();
