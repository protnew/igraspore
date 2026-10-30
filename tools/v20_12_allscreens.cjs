// v20.12 full run: ALL languages x 10 screens x viewports, PNG + automatic visual-bug findings + traffic light.
// Usage: node tools/v20_12_allscreens.cjs <base> <outDir> [langs=all20] [vps=390,1280]
// Findings: tap<48 (yellow), clip (yellow), overlap / lowContrast / emptyPlaque / untranslated / crash (red).
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));
const ALL = 'en,ru,pt-BR,es,hi,id,tr,de,fr,ja,vi,ko,th,fil,it,pl,uk,zh-TW,ms,bn';
const base = process.argv[2] || 'http://127.0.0.1:8821', OUT = process.argv[3] || 'allscreens';
const LANGS = (process.argv[4] || ALL).split(','), VPS = (process.argv[5] || '390,1280').split(',').map(Number);
const SCREENS = ['menu', 'help', 'settings', 'wiki', 'intro', 'game', 'pause', 'death', 'demo', 'aquarium'];
// DOM probe: returns findings + texts of UI controls (for untranslated check against en)
const PROBE = () => {
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05 && r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const deep = e => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) if (!vis(x)) return false; return true; };
  const nm = e => e.id ? '#' + e.id : e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className ? '.' + e.className.split(' ')[0] : '');
  const rgba = c => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; const v = m[1].split(',').map(Number); return [v[0], v[1], v[2], v[3] === undefined ? 1 : v[3]]; };
  const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const bgOf = e => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) { const c = rgba(getComputedStyle(x).backgroundColor); if (c && c[3] >= 0.85) return c; if (getComputedStyle(x).backgroundImage !== 'none') return null; } return null; };
  const topAt = (e, r) => { const x = r.left + r.width / 2, y = r.top + r.height / 2; if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false; const t = document.elementFromPoint(x, y); return !!t && (t === e || e.contains(t) || t.contains(e)); };
  // visible rect = element rect clipped by every overflow-clipping ancestor (scrolled-away text is not an overlap)
  const vr = e => { let r = e.getBoundingClientRect(), L = r.left, T = r.top, Rr = r.right, B = r.bottom; for (let x = e.parentElement; x && x !== document.documentElement; x = x.parentElement) { const s = getComputedStyle(x); if (s.overflowX !== 'visible' || s.overflowY !== 'visible') { const q = x.getBoundingClientRect(); L = Math.max(L, q.left); T = Math.max(T, q.top); Rr = Math.min(Rr, q.right); B = Math.min(B, q.bottom); } } return { left: L, top: T, right: Rr, bottom: B, width: Math.max(0, Rr - L), height: Math.max(0, B - T) }; };
  const F = [];
  const leaves = [...document.querySelectorAll('body *')].filter(e => !/^(SCRIPT|STYLE|CANVAS|OPTION)$/.test(e.tagName) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && deep(e)).slice(0, 400);
  const onTop = leaves.filter(e => topAt(e, e.getBoundingClientRect()));
  // contrast (light on light / dark on dark) for visible-on-top text
  for (const e of onTop) { const s = getComputedStyle(e), fg = rgba(s.color), bg = bgOf(e); if (!fg || !bg || fg[3] < 0.3) continue;
    const L1 = lum(fg), L2 = lum(bg), cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    if (cr < 2.5) F.push(['lowContrast', nm(e) + ':' + e.textContent.trim().slice(0, 24) + ':' + cr.toFixed(2)]); }
  // clipping: text cut by its box or by the viewport
  for (const e of leaves) { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    if ((e.scrollWidth > e.clientWidth + 2 && s.overflowX !== 'visible' && e.clientWidth > 0) || (s.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) || r.right > innerWidth + 1 || r.left < -1)
      F.push(['clip', nm(e) + ':' + e.textContent.trim().slice(0, 24)]); }
  // overlap between unrelated visible text boxes (both on top somewhere)
  const bx = onTop.map(e => [e, vr(e)]).filter(x => x[1].width > 2 && x[1].height > 2);
  for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) { const [a, ra] = bx[i], [b, rb] = bx[j]; if (a.contains(b) || b.contains(a)) continue;
    let hit = false; for (const qa of a.getClientRects()) for (const qb of b.getClientRects()) { const w = Math.min(qa.right, qb.right, ra.right) - Math.max(qa.left, qb.left, ra.left), h = Math.min(qa.bottom, qb.bottom, ra.bottom) - Math.max(qa.top, qb.top, ra.top);
      if (w > 2 && h > 2 && w * h > 0.25 * Math.min(qa.width * qa.height, qb.width * qb.height)) hit = true; } // line boxes, not inline bounding boxes
    if (hit) F.push(['overlap', nm(a) + ' x ' + nm(b) + ':' + a.textContent.trim().slice(0, 14)]); }
  // taps < 48px (height) / < 44 width for real controls
  for (const e of document.querySelectorAll('button, .btn, select, input:not([type=hidden]), .tg')) { if (!deep(e)) continue; const r = e.getBoundingClientRect();
    if (topAt(e, r) && (r.height < 47.5 || r.width < 44)) F.push(['tap48', nm(e) + ':' + Math.round(r.width) + 'x' + Math.round(r.height) + ':' + (e.innerText || e.value || '').trim().slice(0, 16)]); }
  // empty dark plaques: opaque box, no text, no media, no painted child
  for (const e of document.querySelectorAll('body div, body span, body button')) { if (!deep(e)) continue; const r = e.getBoundingClientRect(); if (r.width < 30 || r.height < 18) continue;
    const c = rgba(getComputedStyle(e).backgroundColor); if (!c || c[3] < 0.5 || lum(c) > 0.2) continue;
    if ((e.innerText || '').trim() || e.querySelector('canvas,img,svg,video,input,select')) continue;
    if (e.matches('.tg,[role=switch],[id$=Tg]') || e.closest('.tg,[role=switch]')) continue; // toggles are controls, not plaques
    if (/^(cv|gameCanvas|glCanvas)$/.test(e.id) || r.width >= innerWidth - 2 && r.height >= innerHeight - 2) continue;
    if (getComputedStyle(e).backgroundImage !== 'none') continue;
    if ([...e.querySelectorAll('*')].some(x => { const q = rgba(getComputedStyle(x).backgroundColor); const rr = x.getBoundingClientRect(); return q && q[3] > 0.3 && rr.width > 0 && rr.height > 0; })) continue; // painted child (e.g. bar fill) if (!topAt(e, r)) continue;
    F.push(['emptyPlaque', nm(e) + ':' + Math.round(r.width) + 'x' + Math.round(r.height)]); }
  const ctl = {}; for (const e of document.querySelectorAll('button[id], .btn[id], h1[id], h2[id], h3[id], label[id], [data-k]')) { if (!deep(e)) continue; const t = (e.innerText || '').trim(); if (t) ctl[e.id || e.getAttribute('data-k')] = t.slice(0, 60); }
  return { F, ctl, state: window.state };
};
// NEG=1: inject 5 real defects into the menu; each class must be reported (checker self-test)
const NEGJS = "(function(){var m=document.getElementById('menuO')||document.body;function d(c,t){var e=document.createElement('div');e.style.cssText='position:fixed;z-index:99999;'+c;if(t)e.textContent=t;document.body.appendChild(e);return e;}d('left:20px;top:300px;width:120px;height:40px;background:#050a12','');d('left:200px;top:300px;background:#eee;color:#ddd;padding:4px','light on light');d('left:200px;top:360px;color:#fff;font:16px sans-serif','OVERLAP-A');d('left:205px;top:362px;color:#fff;font:16px sans-serif','OVERLAP-B');var b=document.createElement('button');b.textContent='tiny';b.style.cssText='position:fixed;z-index:99999;left:20px;top:420px;height:30px;width:60px';document.body.appendChild(b);d('left:20px;top:470px;width:60px;overflow:hidden;white-space:nowrap;color:#fff','clipped very long label text');})()";
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome', headless: true }); const R = {};
  const order = LANGS.includes('en') ? ['en', ...LANGS.filter(l => l !== 'en')] : LANGS;
  for (const W of VPS) for (const L of order) {
    const key = L + '_' + W, mob = W < 600; R[key] = {};
    const ctx = await b.newContext({ viewport: { width: W, height: mob ? 844 : 800 }, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    const ev = s => p.evaluate(s).catch(() => null), wait = ms => p.waitForTimeout(ms);
    const clk = id => ev(`(function(){var e=document.getElementById('${id}');if(e)e.click();return !!e;})()`);
    const load = async () => { await p.goto(`${base}/?test=1&pool=300&lang=${L}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await p.waitForFunction("(function(){var e=document.getElementById('startBtn');return e&&e.offsetParent&&e.textContent.trim().length>0})()", null, { timeout: 120000, polling: 100 }).catch(() => 0); await wait(1200); };
    const snap = async st => { const f = path.join(OUT, `${key}_${st}.png`); await p.screenshot({ path: f }).catch(() => 0); R[key][st] = Object.assign({ file: path.basename(f) }, await p.evaluate(PROBE).catch(e => ({ err: String(e.message).slice(0, 120), F: [['crash', 'probe']] }))); };
    try {
      await load(); if (process.env.NEG === '1') await ev(NEGJS); await snap('menu');
      await clk('helpBtn'); await wait(600); await snap('help'); await clk('helpClose'); await wait(300);
      await clk('setBtn2'); await wait(600); await snap('settings'); await clk('setClose'); await wait(300);
      await clk('wikiBtnMenu'); await wait(1200); await snap('wiki'); await clk('wikiClose'); await wait(300);
      await clk('startBtn'); await p.waitForFunction("window.state==='playing'||window.state==='paused'", null, { timeout: 60000 }).catch(() => 0);
      await wait(1500); await snap('intro');
      await ev("(function(){try{if(window.closeIntroCard)closeIntroCard();}catch(e){};['introOk','roleCardOk','tutSkip'].forEach(function(i){var e=document.getElementById(i);if(e&&e.offsetParent)e.click();});})()");
      await wait(1800); await snap('game');
      await ev("(function(){var b=document.getElementById('bPause');if(b&&b.offsetParent){b.click();return}var a=document.getElementById('pauseBtn');if(a)a.click();})()");
      await wait(600); await snap('pause'); await clk('resBtn'); await wait(300);
      await ev("window.__igsTest&&__igsTest.killPlayer&&__igsTest.killPlayer()"); await wait(1800); await snap('death');
      await load(); await clk('demoBtn'); await wait(3000); await snap('demo');
      await load(); await clk('screensaverBtn'); await wait(3000); await snap('aquarium');
    } catch (e) { R[key].crash = String(e.message).slice(0, 200); }
    R[key].errs = errs.slice(0, 5); await ctx.close(); process.stdout.write(key + ' ');
  }
  await b.close();
  // untranslated: same control text as en (latin letters, >3 chars) on the same screen/viewport
  // v24 задача 9: карта когнатов читается из i18n/i18n_identity.allow.json (cognates); clip на кнопках/смерти/HUD — RED
  const ALLOW = /^(iGraSpore|OK|DEMO|WIKI|Wiki|HUD|FPS|UI|μm|v\d.*|[\d\s.,:%×x+\-–—\/()#]+)$/;
  const COG = (() => { try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), '.04-Src/i18n/i18n_identity.allow.json'), 'utf8')).cognates || {}; } catch (e) { return {}; } })();
  for (const k in R) { const [L, W] = k.split('_'); if (L === 'en' || !R['en_' + W]) continue;
    for (const st of SCREENS) { const a = R[k][st], e = R['en_' + W][st]; if (!a || !e || !a.ctl || !e.ctl) continue;
      for (const id in a.ctl) if (e.ctl[id] && a.ctl[id] === e.ctl[id] && /[A-Za-z]{4,}/.test(a.ctl[id]) && !ALLOW.test(a.ctl[id])) { const cg = COG[a.ctl[id].toUpperCase()]; if (cg && cg.includes(L)) continue; (a.F = a.F || []).push([L === 'fil' ? 'untranslatedLocked' : 'untranslated', id + ':' + a.ctl[id].slice(0, 30)]); } } }
  // v24z9: clip на кнопках управления / заголовке смерти / HUD — дефект уровня RED (правило 3 ТЗ)
  for (const k in R) for (const st of SCREENS) { const a = R[k][st]; if (!a || !a.F) continue;
    const clipCtl = a.F.filter(f => f[0] === 'clip' && /^(startBtn|helpBtn|wikiBtnMenu|setBtn2|demoBtn|helpClose|wikiClose|setClose|ecYes|ecNo|deadT|pauseO|hud)/i.test(f[1])).length;
    if (clipCtl) a.F.push(['clipCtl', clipCtl + ' clip on ctl/death/hud']); }
  const RED = ['crash', 'overlap', 'lowContrast', 'emptyPlaque', 'untranslated', 'clipCtl']; // v24z9: clip на кнопках/HUD/заголовке смерти — RED (критик: clip был YELLOW)
  const light = s => !s ? 'RED' : (s.F || []).some(f => RED.includes(f[0])) ? 'RED' : (s.F || []).length ? 'YELLOW' : 'GREEN';
  const rows = []; for (const W of VPS) for (const L of order) { const k = L + '_' + W; rows.push([k, ...SCREENS.map(st => light(R[k][st]) + (R[k].crash && !R[k][st] ? '*' : ''))]); }
  const md = ['| lang_vp | ' + SCREENS.join(' | ') + ' |', '|' + '---|'.repeat(SCREENS.length + 1), ...rows.map(r => '| ' + r.join(' | ').replace(/GREEN/g, '🟢').replace(/YELLOW/g, '🟡').replace(/RED/g, '🔴') + ' |')].join('\n');
  const tally = {}; for (const k in R) for (const st of SCREENS) for (const f of ((R[k][st] || {}).F || [])) { const t = f[0] + ' ' + f[1].replace(/:\d+(\.\d+)?$/, ''); tally[t] = (tally[t] || 0) + 1; }
  fs.writeFileSync(path.join(OUT, 'allscreens.json'), JSON.stringify(R, null, 1)); fs.writeFileSync(path.join(OUT, 'table.md'), md);
  fs.writeFileSync(path.join(OUT, 'tally.json'), JSON.stringify(Object.entries(tally).sort((a, b) => b[1] - a[1]), null, 1));
  const cnt = { GREEN: 0, YELLOW: 0, RED: 0 }; rows.forEach(r => r.slice(1).forEach(c => cnt[c.replace('*', '')]++)); console.log('\n' + JSON.stringify(cnt));
})();
