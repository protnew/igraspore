/* theme_analytics.js — local buffer + optional Worker POST (no secrets in client). */
(function (w) {
  var LS_E = 'igs.theme.events';
  var LS_OPT = 'igs.theme.analytics';
  var LS_SID = 'igs.theme.session';
  var MAX = 500;
  function lsGet(k){ try{ return w.localStorage?w.localStorage.getItem(k):null;}catch(e){return null;} }
  function lsSet(k,v){ try{ if(w.localStorage) w.localStorage.setItem(k,v);}catch(e){} }
  function enabled(){ return lsGet(LS_OPT) !== '0'; }
  function setEnabled(on){ lsSet(LS_OPT, on ? '1' : '0'); }
  function anonId(){ var id=lsGet('igs.anon.id'); if(!id){ id='a'+Math.random().toString(36).slice(2); lsSet('igs.anon.id', id);} return id; }
  function sessionId(){ var id=lsGet(LS_SID); if(!id){ id='s'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); lsSet(LS_SID,id);} return id; }
  function readBuf(){ try{ return JSON.parse(lsGet(LS_E)||"[]"); }catch(e){ return []; } }
  function writeBuf(arr){ if(arr.length>MAX) arr=arr.slice(arr.length-MAX); lsSet(LS_E, JSON.stringify(arr)); }
  function endpoint(){ if(typeof w.IGS_THEME_ANALYTICS_URL==="string" && w.IGS_THEME_ANALYTICS_URL) return w.IGS_THEME_ANALYTICS_URL; var m=document.querySelector && document.querySelector("meta[name=igs-theme-analytics-url]"); return m && m.content ? m.content : ""; }
  function track(type, fields){ if(!enabled()) return null; var ev={ event:type, ts:Date.now(), anonId:anonId(), sessionId:sessionId() }; if(fields){ Object.keys(fields).forEach(function(k){ ev[k]=fields[k]; }); } var buf=readBuf(); buf.push(ev); writeBuf(buf); flushSoon(); return ev; }
  var flushTimer=null;
  function flushSoon(){ if(flushTimer) return; flushTimer=setTimeout(function(){ flushTimer=null; flush(); }, 800); }
  function flush(){ var url=endpoint(); if(!url) return { sent:0, local:true }; if(!enabled()) return { sent:0, optedOut:true }; var buf=readBuf(); if(!buf.length) return { sent:0 }; var body=JSON.stringify({ events: buf.slice(-50) }); try{ if(navigator.sendBeacon){ navigator.sendBeacon(url, new Blob([body],{type:"application/json"})); } else { fetch(url,{ method:"POST", headers:{"Content-Type":"application/json"}, body:body, keepalive:true }).catch(function(){}); } }catch(e){} return { sent: Math.min(50, buf.length) }; }
  function clear(){ writeBuf([]); }
  w.igsThemeAnalytics = { track:track, flush:flush, readBuf:readBuf, clear:clear, enabled:enabled, setEnabled:setEnabled, endpoint:endpoint, anonId:anonId };
  if(typeof document!=="undefined"){ document.addEventListener("visibilitychange", function(){ if(document.visibilityState==="hidden") flush(); }); }
w.__igsToggleThemeAnalytics=function(el){var on=!el.classList.contains('on'); if(w.igsThemeAnalytics) w.igsThemeAnalytics.setEnabled(on); el.className='tg'+(on?' on':'');};
})(typeof window !== 'undefined' ? window : globalThis);
