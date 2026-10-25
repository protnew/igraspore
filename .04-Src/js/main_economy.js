// v20.7: economy mode stays off until the player turns it on.
window.camBadge = function(){
  var coarse = window.matchMedia && matchMedia('(pointer:coarse),(max-width:500px)').matches;
  return coarse ? tt('camFlyTouch') : tt('cam.flyBtn');
};
window.igsFpsWatch = function(fps){
  if(settings.economy && typeof parts!=='undefined' && parts.length>12) parts.length=12;
  if(settings.economy || window._ecoOffered) return;
  if(typeof state==='undefined' || state!=='playing'){ window._ecoLow=0; return; }
  if(fps>0 && fps<25){
    window._ecoLow=(window._ecoLow||0)+0.5;
    if(window._ecoLow>=10){
      window._ecoOffered=1;
      if(window.showToast) window.showToast(tt('economyAsk'), '#fc8', 6000);
    }
  } else window._ecoLow=0;
};
