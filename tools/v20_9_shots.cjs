// v20_9_shots.cjs — E2 screenshot matrix: langs x viewports x screens; each screen verifies its overlay is visible, else FAIL.
// Usage: node tools/v20_9_shots.cjs <baseUrl> <outDir> <langs comma|all> [viewports 1280,390]
const { chromium } = require('C:/Obsidian/New/Projects/08-iGraSpore_V2/.04-Src/node_modules/playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://127.0.0.1:8821', OUT = process.argv[3] || 'shots';
const ALL = JSON.parse(fs.readFileSync(path.join(__dirname, '../.04-Src/i18n/languages.json'), 'utf8')).map(l => l.code);
const LANGS = (!process.argv[4] || process.argv[4] === 'all') ? ALL : process.argv[4].split(',');
const VPS = (process.argv[5] || '1280,390').split(',').map(Number);
const vis = id => `(function(){var e=document.getElementById('${id}');if(!e)return false;var s=getComputedStyle(e),r=e.getBoundingClientRect();
return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>0.05&&r.width>0&&r.height>0;})()`;
const click = id => `(function(){var e=document.getElementById('${id}');if(e)e.click();return !!e;})()`;
const overflow = `(function(){var bad=[];document.querySelectorAll('.show button, .show .btn, .show h1, .show h2, #menuO button').forEach(function(e){
var r=e.getBoundingClientRect();if(r.width===0)return;if(e.scrollWidth>e.clientWidth+2||r.right>innerWidth+1||r.left<-1)bad.push((e.id||e.className||e.tagName)+'');});return bad.slice(0,6);})()`;
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const res = [];
  for (const W of VPS) for (const L of LANGS) {
    const mob = W < 600, H = mob ? 844 : 800;
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    const shot = async (name, ok) => { const f = path.join(OUT, `${L}_${W}_${name}.png`);
      await p.screenshot({ path: f }); const ov = await p.evaluate(overflow).catch(() => []);
      res.push({ lang: L, w: W, screen: name, status: ok ? (ov.length ? 'WARN' : 'OK') : 'FAIL', overflow: ov, file: f }); };
    const waitVis = async id => { try { await p.waitForFunction(vis(id), null, { timeout: 8000 }); return true; } catch { return false; } };
    try {
      await p.goto(`${base}/?test=1&pool=200&lang=${L}`, { waitUntil: 'load', timeout: 60000 });
      await shot('menu', await waitVis('menuO'));
      await p.evaluate(click('startBtn'));
      let ok = await p.waitForFunction("window.state==='playing'||window.state==='paused'", null, { timeout: 30000 }).then(() => true, () => false);
      await p.evaluate("(function(){try{if(window.closeIntroCard)closeIntroCard();}catch(e){};['roleCardOk','tutSkip'].forEach(function(i){var e=document.getElementById(i);if(e&&e.offsetParent)e.click();});})()");
      await p.waitForTimeout(1500); await shot('game', ok);
      await p.evaluate(`(function(){var b=document.getElementById('bPause');if(b&&b.offsetParent){b.click();return}var a=document.getElementById('pauseBtn');if(a)a.click();})()`);
      await shot('pause', await waitVis('pauseO'));
      await p.evaluate(click('pSet')); await shot('settings', await waitVis('setO'));
      await p.evaluate(click('setClose')); await p.waitForTimeout(300);
      await p.evaluate(click('pWiki')); await shot('bestiary', await waitVis('wikiO'));
      await p.evaluate(click('wikiClose')); await p.waitForTimeout(300);
      await p.evaluate(click('pauseBtn')); await p.evaluate("(function(){if(window.state==='paused'){var e=document.getElementById('bPause');if(e)e.click();}})()");
      await p.evaluate("window.__igsTest&&__igsTest.killPlayer&&__igsTest.killPlayer()");
      await shot('death', await waitVis('deadO'));
    } catch (e) { res.push({ lang: L, w: W, screen: 'crash', status: 'FAIL', err: String(e.message).slice(0, 200) }); }
    if (errs.length) res.push({ lang: L, w: W, screen: 'pageerror', status: 'FAIL', err: errs.slice(0, 3) });
    await ctx.close(); process.stdout.write(L + '@' + W + ' ');
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'status.json'), JSON.stringify(res, null, 1));
  const c = s => res.filter(r => r.status === s).length;
  console.log('\nSUMMARY OK=' + c('OK') + ' WARN=' + c('WARN') + ' FAIL=' + c('FAIL'));
  res.filter(r => r.status !== 'OK').forEach(r => console.log(r.status, r.lang, r.w, r.screen, JSON.stringify(r.overflow || r.err)));
})();
