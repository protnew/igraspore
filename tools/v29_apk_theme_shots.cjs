const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const OUT = path.resolve('09-Docs/out-dev-factory/theme-shots-v29-all/apk');
fs.mkdirSync(OUT, { recursive: true });
const THEMES = ['classic','phase-contrast','neon-bio','glass-lab','cyberpunk-scanner','haeckel-watercolor','engraving'];
const WS_URL = process.env.IGS_CDP || 'ws://127.0.0.1:9333/devtools/page/B53548DB9BD7BEB4CE9FF3B5B8F79C08';

function adbShot(name){
  const p = path.join(OUT, name);
  execSync(`adb exec-out screencap -p > "${p}"`, { shell: 'cmd.exe', stdio: 'ignore' });
  return p;
}

function cdp(){
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    let id = 0;
    const pending = new Map();
    ws.addEventListener('open', () => resolve({
      ws,
      send(method, params={}){
        const i = ++id;
        return new Promise((res, rej) => {
          pending.set(i, {res, rej});
          ws.send(JSON.stringify({ id:i, method, params }));
          setTimeout(() => { if(pending.has(i)){ pending.delete(i); rej(new Error('timeout '+method)); } }, 60000);
        });
      }
    }));
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const {res, rej} = pending.get(msg.id); pending.delete(msg.id);
        if (msg.error) rej(new Error(JSON.stringify(msg.error))); else res(msg.result);
      }
    });
    ws.addEventListener('error', reject);
  });
}

(async () => {
  const { ws, send } = await cdp();
  await send('Runtime.enable');
  await send('Page.enable');
  // dismiss / start
  await send('Runtime.evaluate', { expression: `(async function(){
    function click(id){ var el=document.getElementById(id); if(el) el.click(); }
    click('startBtn');
    await new Promise(r=>setTimeout(r,1500));
    try{ if(typeof closeIntroCard==='function') closeIntroCard(); }catch(e){}
    ['roleCardOk','tutSkip','resBtn'].forEach(click);
    ['introO','roleCard','tutO','pauseO'].forEach(function(id){var el=document.getElementById(id); if(el) el.classList.remove('show');});
    try{ if(state==='paused') state='playing'; }catch(e){}
    // wait player
    for(var i=0;i<40;i++){ if(window.player&&player.alive) break; await new Promise(r=>setTimeout(r,500)); }
    return !!(window.player&&player.alive&&window.igsThemeEngine);
  })()`, awaitPromise: true, returnByValue: true });
  const report = { apkShots: [], errors: [] };
  for (const th of THEMES) {
    try {
      await send('Runtime.evaluate', { expression: `(function(th){
        if(!window.igsThemeEngine) return 'no-engine';
        igsThemeEngine.applyThemePond(th);
        igsThemeEngine.applyThemeBestiary(th);
        try{ if(typeof enableWebGLRenderMode==='function'){ settings.renderMode='webgl'; enableWebGLRenderMode(); } }catch(e){}
        // close wiki
        var w=document.getElementById('wikiO'); if(w){ w.classList.remove('show'); w.className='ov'; }
        return igsThemeEngine.currentPond()+':'+igsThemeEngine.currentBestiary();
      })(${JSON.stringify(th)})`, returnByValue: true });
      await new Promise(r=>setTimeout(r,800));
      const pond = `apk_pond_${th}.png`;
      adbShot(pond); report.apkShots.push(pond);
      // open wiki
      await send('Runtime.evaluate', { expression: `(function(){
        var b=document.getElementById('bWiki')||document.getElementById('wikiBtnMenu');
        if(b) b.click(); else { var w=document.getElementById('wikiO'); if(w) w.className='ov show'; if(typeof buildWiki==='function') try{buildWiki()}catch(e){} }
        if(window.igsThemeEngine&&igsThemeEngine.injectWikiSwitcher) igsThemeEngine.injectWikiSwitcher();
        return document.getElementById('wikiO') && document.getElementById('wikiO').className;
      })()`, returnByValue: true });
      await new Promise(r=>setTimeout(r,700));
      const best = `apk_bestiary_${th}.png`;
      adbShot(best); report.apkShots.push(best);
      // close wiki
      await send('Runtime.evaluate', { expression: `(function(){var c=document.getElementById('wikiClose'); if(c)c.click(); var w=document.getElementById('wikiO'); if(w){w.classList.remove('show'); w.className='ov';}})()` });
      console.log('OK', th);
    } catch (e) {
      report.errors.push(th+':'+e.message);
      console.error('FAIL', th, e.message);
    }
  }
  fs.writeFileSync(path.join(OUT,'apk-report.json'), JSON.stringify(report,null,2));
  console.log('DONE', report.apkShots.length, 'errors', report.errors.length);
  ws.close();
  process.exit(report.errors.length?1:0);
})().catch(e=>{ console.error(e); process.exit(2); });
