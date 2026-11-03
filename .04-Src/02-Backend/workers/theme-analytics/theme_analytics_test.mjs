import { ALLOWED, validEvent, emptyAgg } from './index.js';
import mod from './index.js';

const themes = [...ALLOWED];
let fails = 0;
function ok(cond, msg){ if(!cond){ console.error('FAIL', msg); fails++; } else console.log('OK', msg); }

ok(themes.length === 7, '7 themes including classic');
for (const t of ['classic','neon-bio','phase-contrast','glass-lab','cyberpunk-scanner','haeckel-watercolor','engraving']) {
  ok(ALLOWED.has(t), 'allowed '+t);
}
ok(validEvent({ event:'theme_change', from:'classic', to:'neon-bio', screen:'pond', anonId:'anon1', sessionId:'sess1', ts:1 }), 'valid change');
ok(!validEvent({ event:'theme_change', to:'neon-bio', anonId:'a', sessionId:'s', ts:1 }), 'reject short ids');
ok(!validEvent({ event:'theme_change', to:'evil', anonId:'anon1', sessionId:'sess1', ts:1 }), 'reject unknown theme');
ok(!validEvent({ event:'hack', anonId:'anon1', sessionId:'sess1', ts:1 }), 'reject unknown event');
const agg = emptyAgg();
ok(Object.keys(agg.timeMedian).length === 7, 'emptyAgg all themes');

const env = {};
const worker = mod;
async function call(path, method, body, hdrs={}) {
  const init = { method, headers: Object.assign({'Content-Type':'application/json'}, hdrs) };
  if (body) init.body = JSON.stringify(body);
  const req = new Request('http://local'+path, init);
  return worker.fetch(req, env);
}
let r = await call('/health','GET');
let j = await r.json();
ok(r.status===200 && j.ok && j.themes.length===7, 'health all themes');

r = await call('/theme-events','POST',{ events: themes.map((t,i)=>({ event:'theme_assign', themeId:t, screen: i%2?'pond':'bestiary', anonId:'anonX'+i, sessionId:'sessX'+i, ts:Date.now()})) });
j = await r.json();
ok(r.status===200 && j.accepted===7, 'accept assign for all 7 themes got='+j.accepted);

r = await call('/theme-events','POST',{ events:[{ event:'theme_change', from:'neon-bio', to:'phase-contrast', screen:'bestiary', anonId:'anon99', sessionId:'sess99', ts:1 }]});
j = await r.json();
ok(j.accepted===1, 'accept cross-style change');

r = await call('/theme-stats','GET');
j = await r.json();
ok(j.ok && j.themes.length===7 && j.bestiary && j.pond, 'theme-stats shape');

env.STATS_GATE = 'secret';
r = await call('/theme-stats','GET', null, {'X-Stats-Gate':'wrong'});
ok(r.status===403, 'gate rejects');
r = await call('/theme-stats','GET', null, {'X-Stats-Gate':'secret'});
ok(r.status===200, 'gate allows');

if (fails) { console.error('TOTAL FAILS', fails); process.exit(1); }
console.log('ALL TESTS PASSED');
