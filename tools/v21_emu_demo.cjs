// v21: демо-экран на эмуляторе для 5 языков (исправленный флоу: только меню → demoBtn → demoMode → shot)
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ADB = process.env.LOCALAPPDATA + '\\Android\\Sdk\\platform-tools\\adb.exe';
const DEV = process.argv[2] || '127.0.0.1:5585';
const OUT = 'C:\\Users\\Space\\agent-transfer\\igraspore-v21\\emu';
const LANGS = process.argv[3] ? process.argv[3].split(',') : ['en', 'ru', 'de', 'hi', 'ja'];
function adbS(args) { return execFileSync(ADB, ['-s', DEV].concat(args), { encoding: 'utf8', timeout: 30000 }); }
function shot(name) { fs.writeFileSync(path.join(OUT, name + '.png'), execFileSync(ADB, ['-s', DEV, 'exec-out', 'screencap', '-p'])); console.log('  [shot] ' + name); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const unix = adbS(['shell', 'cat /proc/net/unix']);
  const m = unix.match(/webview_devtools_remote_(\d+)/);
  if (!m) { console.error('NO SOCKET'); process.exit(2); }
  execFileSync(ADB, ['-s', DEV, 'forward', 'tcp:9222', 'localabstract:webview_devtools_remote_' + m[1]]);
  const list = await fetch('http://127.0.0.1:9222/json/list').then(r => r.json());
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let idc = 1; const pend = new Map();
  ws.onmessage = ev => { const mm = JSON.parse(ev.data); if (mm.id && pend.has(mm.id)) { pend.get(mm.id)(mm); pend.delete(mm.id); } };
  async function ev(expr) {
    const id = idc++; const p = new Promise(res => pend.set(id, res));
    ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true, awaitPromise: true } }));
    const r = await p; return r.result && r.result.result && r.result.result.value;
  }
  async function waitFor(expr, ms, tag) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { if (await ev(expr)) return true; await sleep(250); }
    console.error('  [timeout] ' + tag); return false;
  }
  for (const l of LANGS) {
    // жёсткий сброс в меню: если что-то открыто — закрыть
    await ev(`(function(){
      ['exitConfirm','pauseO','setO','helpO','wikiO'].forEach(function(id){var e=document.getElementById(id); if(e)e.className='ov';});
      var mo=document.getElementById('menuO');
      if(state!=='menu'||!mo||mo.className.indexOf('show')<0){ state='menu'; player=null; if(mo)mo.className='ov show'; if(typeof hideGameHud==='function')hideGameHud(); if(window.demoMode){ if(typeof stopDemoMode==='function')stopDemoMode(); else window.demoMode=false; } }
      return 1;})()`);
    await sleep(400);
    // язык
    await ev(`(function(){var it=document.querySelector('.lang-item[data-lang="${l}"]'); if(it)it.click(); return 1;})()`);
    await waitFor(`curLang==='${l}'`, 6000, 'lang=' + l);
    await sleep(500);
    // демо
    await ev(`(function(){var b=document.getElementById('demoBtn'); if(b)b.click(); return 1;})()`);
    const ok = await waitFor(`window.demoMode===true`, 20000, 'demoMode ' + l);
    await sleep(3000);
    await shot(l + '_demo');
    console.log(l + ' demo=' + ok);
    // выход из демо
    await ev(`(function(){var d=document.getElementById('demoExit'); if(d){d.style.display='';d.click();} if(typeof stopDemoMode==='function')stopDemoMode(); window.demoMode=false; return 1;})()`);
    await sleep(800);
  }
  process.exit(0);
})().catch(e => { console.error('FATAL ' + e.message); process.exit(1); });
