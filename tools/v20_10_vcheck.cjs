// v20.10 V01–V44 checker (AUDIT-VISUAL-ALL-LANG-v20-5): walks the screens, saves PNG + DOM metrics,
// maps every V item to an automatic check (PASS/FAIL) or MANUAL (screenshot to look at) / ENV.
// Usage: node tools/v20_10_vcheck.cjs <baseUrl> <outDir> [langs ru,en,hi] [vps 390,1280]
const { chromium } = require(require('path').join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://127.0.0.1:8821', OUT = process.argv[3] || 'vcheck';
const LANGS = (process.argv[4] || 'ru,en,hi').split(','), VPS = (process.argv[5] || '390,1280').split(',').map(Number);
const OV = ['menuO', 'pauseO', 'setO', 'wikiO', 'deadO', 'introO', 'exitConfirm', 'helpO'];
// one DOM snapshot of everything the V items need
const METRICS = (OVJ) => {
  const vis = e => { if (!e) return false; const s = getComputedStyle(e), r = e.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05 && r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; };
  const byId = id => document.getElementById(id), R = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
  const deepVis = e => { for (let x = e; x && x !== document.body; x = x.parentElement) if (!vis(x)) return false; return true; };
  const name = e => (e.id ? '#' + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''));
  const leaves = [...document.querySelectorAll('body *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && deepVis(e));
  const small = leaves.filter(e => parseFloat(getComputedStyle(e).fontSize) < 13).map(e => name(e) + ':' + getComputedStyle(e).fontSize + ':' + e.textContent.trim().slice(0, 20));
  const ovf = leaves.filter(e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return (e.scrollWidth > e.clientWidth + 2 && s.overflow !== 'visible' && e.clientWidth > 0) || r.right > innerWidth + 1 || r.left < -1; })
    .map(e => { const ov = e.closest('.ov,[id$=O]'); return (ov ? ov.id + '>' : '') + name(e) + ':' + e.textContent.trim().slice(0, 20); });
  const taps = [...document.querySelectorAll('button, .btn, [onclick], input, select, .tg')].filter(deepVis)
    .filter(e => e.getBoundingClientRect().height < 48 || e.getBoundingClientRect().width < 44).map(e => name(e) + ':' + R(e).slice(2).join('x'));
  const txt = id => { const e = byId(id); return e ? e.innerText.trim().slice(0, 300) : null; };
  const ids = {}; ['pauseBtn', 'bPause', 'burgerGame', 'popLabel', 'mapLabel', 'actBar', 'hud', 'langSelWrap', 'menuVer', 'introOk', 'demoExit', 'demoBadge'].forEach(i => { const e = byId(i); ids[i] = e ? { vis: deepVis(e), r: R(e) } : null; });
  const ovs = OVJ.filter(i => vis(byId(i)));
  const cover = {}; ovs.forEach(i => { const e = byId(i), r = e.getBoundingClientRect(), bg = getComputedStyle(e).backgroundColor;
    const a = /rgba?\(([^)]+)\)/.exec(bg); const al = a ? (a[1].split(',')[3] === undefined ? 1 : +a[1].split(',')[3]) : 0;
    cover[i] = { full: r.top <= 1 && r.left <= 1 && r.bottom >= innerHeight - 1 && r.right >= innerWidth - 1, alpha: al, r: R(e) }; });
  const btnH = sel => [...document.querySelectorAll(sel)].filter(deepVis).map(e => [name(e), Math.round(e.getBoundingClientRect().height), parseFloat(getComputedStyle(e).fontSize), getComputedStyle(e).textAlign]);
  const hk = [...document.querySelectorAll('.hk')].filter(deepVis).length;
  const catSel = byId('catSel'); const cat = catSel ? { sw: catSel.scrollWidth, cw: catSel.clientWidth, wrap: getComputedStyle(catSel).flexWrap } : null;
  const setPanel = document.querySelector('#setO .panel, #setO > div'); const setBg = setPanel ? getComputedStyle(setPanel).backgroundColor : null;
  const dlg = document.querySelector('#introO .panel, #introO > div');
  return { state: window.state, ovs, cover, small: small.slice(0, 40), nSmall: small.length, ovf: ovf.slice(0, 20), taps: taps.slice(0, 30), nTaps: taps.length, ids, hk, cat, setBg,
    introDlgW: dlg ? Math.round(dlg.getBoundingClientRect().width) : null,
    t: { ecT: txt('ecT'), ecMsg: txt('ecMsg'), ecNo: txt('ecNo'), ecYes: txt('ecYes'), pExit: txt('pExit'), pMore: txt('pMore'), deadT: txt('deadT'), deadStats: txt('deadStats'),
      helpBody: txt('helpBody'), setBody: txt('setBody'), hud: txt('hud'), spGrid: txt('spGrid'), menuVer: txt('menuVer'), wiki: txt('wikiContent') },
    pauseBtns: btnH('#pauseO button'), diffBtns: btnH('#diffWrap button, #diffWrap .btn, #diffWrap > *'), footBtns: btnH('#menuFooter button'),
    demoBtns: btnH('[id^=demo] button, .demoGrp, #demoBadge button'), wikiSearch: byId('wikiSearch') ? R(byId('wikiSearch')) : null,
    w: innerWidth, h: innerHeight };
};
// NEG=1 (R7 negative check): inject real defects - translucent settings over menu (V09) and an overflowing label inside setO (V10)
const NEGJS = "(function(){var s=document.getElementById('setO');s.style.setProperty('background','rgba(0,0,0,0.4)','important');var d=document.createElement('div');d.id='negOvf';d.style.cssText='width:80px;overflow:hidden;white-space:nowrap';d.textContent='NEGATIVE CHECK very long untruncated label';var pn=s.querySelector('.panel')||s.firstElementChild||s;pn.insertBefore(d,pn.firstChild);})()";
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const snaps = {};
  for (const W of VPS) for (const L of LANGS) {
    const mob = W < 600, H = mob ? 844 : 800;
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    const key = `${L}_${W}`; snaps[key] = { errs };
    const snap = async (st) => { const f = path.join(OUT, `${key}_${st}.png`); await p.screenshot({ path: f });
      snaps[key][st] = Object.assign({ file: f }, await p.evaluate(METRICS, OV).catch(e => ({ err: String(e.message).slice(0, 150) }))); };
    const ev = s => p.evaluate(s).catch(() => null), wait = ms => p.waitForTimeout(ms);
    const clk = id => ev(`(function(){var e=document.getElementById('${id}');if(e)e.click();return !!e;})()`);
    try {
      await p.goto(`${base}/?test=1&pool=300&lang=${L}`, { waitUntil: 'load', timeout: 60000 });
      await p.waitForFunction("document.getElementById('startBtn')&&document.getElementById('startBtn').offsetParent", null, { timeout: 30000 }).catch(() => 0);
      await wait(800); await snap('menu');
      await clk('helpBtn'); await wait(500); await snap('help'); await clk('helpClose'); await wait(300);
      await clk('setBtn2'); await wait(500); if (process.env.NEG === '1') await ev(NEGJS); await snap('settings'); await clk('setClose'); await wait(300);
      await clk('wikiBtnMenu'); await wait(800); await snap('wiki'); await clk('wikiClose'); await wait(300);
      await clk('startBtn');
      await p.waitForFunction("window.state==='playing'||window.state==='paused'", null, { timeout: 30000 }).catch(() => 0);
      await wait(1200); await snap('intro');
      await ev("(function(){try{if(window.closeIntroCard)closeIntroCard();}catch(e){};['introOk','roleCardOk','tutSkip'].forEach(function(i){var e=document.getElementById(i);if(e&&e.offsetParent)e.click();});})()");
      await wait(1500); await snap('game');
      await ev("(function(){var b=document.getElementById('bPause');if(b&&b.offsetParent){b.click();return}var a=document.getElementById('pauseBtn');if(a)a.click();})()");
      await wait(500); await snap('pause');
      await clk('pExit'); await wait(500); await snap('exit'); await clk('ecNo'); await wait(300);
      await clk('resBtn'); await wait(300);
      await ev("window.__igsTest&&__igsTest.killPlayer&&__igsTest.killPlayer()"); await wait(1500); await snap('death');
      await p.goto(`${base}/?test=1&pool=300&lang=${L}`, { waitUntil: 'load', timeout: 60000 }); await wait(1500);
      await clk('demoBtn'); await wait(2500); await snap('demo');
    } catch (e) { snaps[key].crash = String(e.message).slice(0, 200); }
    await ctx.close(); process.stdout.write(key + ' ');
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'metrics.json'), JSON.stringify(snaps, null, 1));
  require('./v20_10_vmap.cjs')(snaps, OUT, LANGS, VPS);
})();
