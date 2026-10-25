// world_bake.js — готовые миры (решение 93.1) и запасной живой путь
"use strict";
window._bake = window._bake || {};
window.transformBake = function(rows){
  var out = [];
  var ang = Math.random() * Math.PI * 2;
  var c = Math.cos(ang), s = Math.sin(ang);
  var dx = (Math.random() - 0.5) * 280;
  for(var i=0;i<rows.length;i++) out.push(rows[i]);
  for(var i=out.length-1;i>0;i--){
    var j = (Math.random() * (i + 1)) | 0;
    var t = out[i]; out[i] = out[j]; out[j] = t;
  }
  for(var k=0;k<out.length;k++){
    var r = out[k], x = r[1], y = r[2];
    out[k] = [r[0], x * c + dx, y + x * 0.012 * s];
  }
  return out;
};
function preloadBakedWorlds(){
  ['easy','normal','hard'].forEach(function(diff){
    var k = (Math.random() * 8) | 0;
    fetch('04-Src/js/data/worlds/' + diff + '-' + k + '.json').then(function(r){
      if(!r.ok) throw new Error('bake');
      return r.json();
    }).then(function(rows){
      if(rows && rows.length) window._bake[diff] = rows;
    }).catch(function(){});
  });
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', preloadBakedWorlds);
  else preloadBakedWorlds();
}
