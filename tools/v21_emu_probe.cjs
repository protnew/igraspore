// v21: быстрый пробник DOM WebView эмулятора через CDP (бanner пула, язык, состояние)
const { execFileSync } = require('child_process');
const ADB = process.env.LOCALAPPDATA + '\\Android\\Sdk\\platform-tools\\adb.exe';
const DEV = process.argv[2] || '127.0.0.1:5585';
const EXPR = process.argv[3] || `(function(){
  var ms=document.getElementById('menuSub');
  var pb=document.getElementById('poolBanner');
  var any=[].slice.call(document.querySelectorAll('#menuO *')).filter(function(e){return /pool|Pool|организм|organism/i.test(e.textContent||'')&&e.children.length<3;}).map(function(e){return (e.id||e.className)+'='+e.textContent.trim().slice(0,80);}).slice(0,4);
  return {curLang:typeof curLang!=='undefined'?curLang:'?', state:typeof state!=='undefined'?state:'?',
    menuSub:ms?ms.textContent.slice(0,120):'none', poolBanner:pb?pb.textContent:'none', any:any};
})()`;
const out = execFileSync(ADB, ['-s', DEV, 'shell', 'cat /proc/net/unix'], { encoding: 'utf8' });
const m = out.match(/webview_devtools_remote_(\d+)/);
if (!m) { console.log('NO SOCKET'); process.exit(1); }
execFileSync(ADB, ['-s', DEV, 'forward', 'tcp:9222', 'localabstract:webview_devtools_remote_' + m[1]]);
fetch('http://127.0.0.1:9222/json/list').then(r => r.json()).then(async list => {
  const page = list.find(t => t.type === 'page');
  if (!page) { console.log('NO PAGE', list.map(t => t.url)); process.exit(2); }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  const p = new Promise(res => { ws.onmessage = ev => { const mm = JSON.parse(ev.data); if (mm.id === 1) res(mm); }; });
  ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: EXPR, returnByValue: true } }));
  const r2 = await p;
  console.log(JSON.stringify(r2.result && r2.result.result && r2.result.result.value, null, 1));
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(3); });
