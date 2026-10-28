#!/usr/bin/env node
// v21 D3/D4: проход экранов и языков на эмуляторе через CDP (WebView debuggable в debug-сборке).
// Язык и все навигации — по селекторам/тексту DOM (не по координатам). Скрины — adb screencap.
// Использование: node tools/v21_emu_cdp.cjs [--device emulator-5584] [--out dir]
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ADB = process.env.ADB || process.env.LOCALAPPDATA + '\\Android\\Sdk\\platform-tools\\adb.exe';
const DEVICE = (process.argv.includes('--device') ? process.argv[process.argv.indexOf('--device') + 1] : 'emulator-5584');
const OUT = (process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : 'C:\\Users\\Space\\agent-transfer\\igraspore-v21\\emu');
const LANGS = ['en','ru','de','es','fr','it','pt','pl','uk','tr','ko','ja','zh','hi','bn','vi','id','ms','fil','ar'];
const FULL5 = ['en','ru','de','hi','ja']; // все 10 экранов; death в релизном APK без debug-хука — ENV-LIMITED (покрыт вебом на 20 языках)

function adb(args, opts) { return execFileSync(ADB, ['-s', DEVICE].concat(args), Object.assign({ encoding: 'buffer', timeout: 30000 }, opts || {})); }
function adbStr(args) { return adb(args, { encoding: 'utf8' }).toString(); }

function shot(name) {
  const buf = adb(['exec-out', 'screencap', '-p']);
  fs.writeFileSync(path.join(OUT, name + '.png'), buf);
  process.stdout.write('  [shot] ' + name + '\n');
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  // 1. найти webview socket
  const unix = adbStr(['shell', 'cat /proc/net/unix']);
  const m = unix.match(/webview_devtools_remote_(\d+)/);
  if (!m) { console.error('NO webview_devtools socket. App running?'); process.exit(2); }
  const sock = 'localabstract:webview_devtools_remote_' + m[1];
  adb(['forward', 'tcp:9222', sock]);
  const list = await fetch('http://127.0.0.1:9222/json/list').then(r => r.json());
  const page = list.find(t => t.type === 'page');
  if (!page) { console.error('NO page target: ' + JSON.stringify(list.map(t => t.type + ':' + t.url))); process.exit(3); }
  console.log('CDP target: ' + page.url);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let idc = 1; const pend = new Map();
  ws.onmessage = ev => { const msg = JSON.parse(ev.data); if (msg.id && pend.has(msg.id)) { pend.get(msg.id)(msg); pend.delete(msg.id); } };
  async function evalJS(expr) {
    const id = idc++;
    const p = new Promise(res => pend.set(id, res));
    ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true, awaitPromise: true } }));
    const r = await p;
    if (r.error) return JSON.stringify({ __err: r.error.message });
    const res = r.result && r.result.result;
    if (res && res.subtype === 'promise') return JSON.stringify({ __err: 'promise' });
    return res ? res.value : undefined;
  }
  async function click(sel) { return evalJS(`(function(){var e=document.querySelector('${sel}'); if(!e) return 'NOEL'; e.click(); return 'ok';})()`); }
  async function waitFor(expr, ms, tag) {
    const t0 = Date.now();
    while (Date.now() - t0 < (ms || 8000)) {
      const v = await evalJS(expr);
      if (v) return true;
      await sleep(250);
    }
    console.error('  [timeout] ' + (tag || expr));
    return false;
  }
  const hasOv = id => `document.getElementById('${id}').className.indexOf('show')>=0`;

  // helpers: экраны
  async function toMenu() {
    await evalJS(`(function(){ var mo=document.getElementById('menuO'); if(mo&&mo.className.indexOf('show')>=0&&state==='menu')return 1;
      if(state==='playing'){ var b=document.getElementById('bPause'); if(b)b.click(); } return 0;})()`);
    await sleep(200);
    await evalJS(`(function(){ var mp=document.getElementById('menuBtnPause'); if(mp&&document.getElementById('pauseO').className.indexOf('show')>=0) mp.click(); return 1;})()`);
    await waitFor(`(function(){var ec=document.getElementById('exitConfirm'); return ec&&ec.className.indexOf('show')>=0;})()||document.getElementById('menuO').className.indexOf('show')>=0&&state==='menu'`, 3000, 'toMenu-confirm');
    await click('#ecYes');
    await waitFor(`state==='menu'&&document.getElementById('menuO').className.indexOf('show')>=0`, 5000, 'toMenu-menu');
    await sleep(300);
  }
  async function setLang(l) {
    const r = await evalJS(`(function(){ var it=document.querySelector('.lang-item[data-lang="${l}"]'); if(!it) return 'NOEL';
      it.click(); return 'ok';})()`);
    await waitFor(`curLang==='${l}'`, 6000, 'lang=' + l);
    await sleep(500);
    return r;
  }
  async function startGame() {
    await click('#startBtn');
    const ok = await waitFor(`state==='playing'||document.getElementById('introO').className.indexOf('show')>=0`, 30000, 'start-playing');
    const introShow = await evalJS(hasOv('introO'));
    if (introShow) { await sleep(400); }
    await click('#introOk');
    await evalJS(`(function(){var r=document.getElementById('roleCardOk'); if(r)r.click(); return 1;})()`);
    await waitFor(`state==='playing'`, 20000, 'playing2');
    await evalJS(`(function(){var t=document.getElementById('tutSkip'); if(t)t.click(); return 1;})()`);
    await sleep(1200);
    return ok;
  }

  const report = { langMenu: {}, langSettings: {}, langGame: {}, langPause: {}, full5: {} };

  // 2. языковой проход
  for (const l of LANGS) {
    await toMenu();
    const code = l === 'pt' ? 'pt-BR' : (l === 'zh' ? 'zh-TW' : l);
    const r = await setLang(code);
    if (r !== 'ok') { report.langMenu[l] = 'SETFAIL:' + r; continue; }
    await shot(l + '_menu');
    report.langMenu[l] = await evalJS(`(document.getElementById('curLangTxt').textContent||'').slice(0,20)`);
    // settings
    await click('#setBtn2');
    await waitFor(hasOv('setO'), 4000, 'setO');
    await sleep(600);
    await shot(l + '_settings');
    report.langSettings[l] = await evalJS(`(document.getElementById('setT').textContent||'').slice(0,20)`);
    await click('#setClose');
    // game + pause
    const started = await startGame();
    await shot(l + '_game');
    report.langGame[l] = started ? 'playing' : 'FAIL';
    await click('#bPause');
    await waitFor(hasOv('pauseO'), 4000, 'pauseO');
    await sleep(300);
    await shot(l + '_pause');
    report.langPause[l] = await evalJS(`(document.getElementById('pauseO').textContent||'').slice(0,24).replace(/\\s+/g,' ')`);
  }

  // 3. полный 10-экранный проход на 5 языках (death — ENV-LIMITED: релизный APK без ?test=1 хука)
  for (const l of FULL5) {
    await toMenu();
    const code = l === 'pt' ? 'pt-BR' : l;
    await setLang(code);
    const st = {};
    // help
    await click('#helpBtn'); await waitFor(hasOv('helpO'), 4000, 'helpO'); await sleep(400);
    await shot(l + '_help'); st.help = await evalJS(`(document.getElementById('helpT').textContent||'').slice(0,20)`);
    await click('#helpClose');
    // wiki
    await click('#wikiBtnMenu'); await waitFor(hasOv('wikiO'), 4000, 'wikiO'); await sleep(700);
    await shot(l + '_wiki'); st.wiki = await evalJS(`(document.getElementById('wikiT').textContent||'').slice(0,20)`);
    await click('#wikiClose');
    // intro (экран после START до игры)
    await click('#startBtn');
    await waitFor(hasOv('introO') + '||state===\'playing\'', 30000, 'intro');
    await sleep(400);
    await shot(l + '_intro');
    await evalJS(`(function(){var i=document.getElementById('introOk'); if(i)i.click(); return 1;})()`);
    await evalJS(`(function(){var r=document.getElementById('roleCardOk'); if(r)r.click(); return 1;})()`);
    await waitFor(`state==='playing'`, 20000, 'playing-full5');
    await evalJS(`(function(){var t=document.getElementById('tutSkip'); if(t)t.click(); return 1;})()`);
    await sleep(1000);
    await shot(l + '_game_full');
    // exit? dialog
    await click('#bPause'); await waitFor(hasOv('pauseO'), 4000, 'pause2');
    await evalJS(`(function(){var mp=document.getElementById('menuBtnPause'); if(mp)mp.click(); return 1;})()`);
    await waitFor(hasOv('exitConfirm'), 4000, 'exitConfirm');
    await sleep(300);
    await shot(l + '_exit');
    st.exit = await evalJS(`(document.getElementById('ecT').textContent||'').slice(0,12)`);
    // demo
    await click('#ecNo');
    await waitFor(`state==='playing'`, 3000, 'back-to-playing');
    await evalJS(`(function(){var mp=document.getElementById('menuBtnPause'); if(mp)mp.click(); return 1;})()`);
    await waitFor(hasOv('exitConfirm'), 3000, 'exit2');
    await click('#ecYes');
    await waitFor(`state==='menu'`, 5000, 'menu-again');
    await sleep(400);
    await click('#demoBtn');
    await waitFor(`window.demoMode===true`, 15000, 'demoMode');
    await sleep(2500);
    await shot(l + '_demo'); st.demo = 'demo';
    await evalJS(`(function(){var d=document.getElementById('demoExit'); if(d){d.style.display='';d.click();} return 1;})()`);
    await sleep(600);
    report.full5[l] = st;
  }

  // 4. D4: 60 c геймплея + FPS
  await toMenu();
  await setLang('en');
  await startGame();
  adbStr(['shell', 'dumpsys', 'gfxinfo', 'com.igraspore.app', 'reset']);
  const t0 = Date.now();
  let swipeN = 0;
  while (Date.now() - t0 < 60000) {
    await sleep(5000);
    adbStr(['shell', 'input', 'swipe', '540', '1900', String(540 + (swipeN % 3 - 1) * 200), '1500', '300']);
    swipeN++;
  }
  const gfx = adbStr(['shell', 'dumpsys', 'gfxinfo', 'com.igraspore.app']);
  fs.writeFileSync(path.join(OUT, 'gfxinfo-60s.txt'), gfx);
  const fpsLine = (gfx.match(/Total frames rendered: \d+/) || [''])[0];
  const janky = (gfx.match(/Janky frames: \d+ \([^)]*\)/) || [''])[0];
  const p50 = (gfx.match(/50th percentile: \d+ ms/) || [''])[0];
  const p90 = (gfx.match(/90th percentile: \d+ ms/) || [''])[0];
  const p95 = (gfx.match(/95th percentile: \d+ ms/) || [''])[0];
  const p99 = (gfx.match(/99th percentile: \d+ ms/) || [''])[0];
  console.log('FPS 60s: ' + fpsLine + ' | ' + janky + ' | ' + [p50, p90, p95, p99].join(' | '));
  await shot('en_gameplay_60s');
  // logcat
  const log = adbStr(['shell', 'logcat', '-d', '-t', '500']);
  const fatal = (log.match(/FATAL EXCEPTION[\s\S]{0,400}/g) || []).join('\n---\n');
  fs.writeFileSync(path.join(OUT, 'logcat-tail.txt'), fatal || 'NO FATAL');
  console.log('FATAL count: ' + (fatal ? fatal.split('---').length : 0));

  fs.writeFileSync(path.join(OUT, 'cdp-report.json'), JSON.stringify({ report, fps: { fpsLine, janky, p50, p90, p95, p99 } }, null, 2));
  console.log('DONE. Report: ' + path.join(OUT, 'cdp-report.json'));
  ws.close(); process.exit(0);
}
main().catch(e => { console.error('FATAL ' + e.message); process.exit(1); });
