const fs = require('fs');
const path = require('path');
const root = process.cwd();
function w(rel, s) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, 'utf8');
  console.log('wrote', rel, s.split(/\n/).length);
}

w('.04-Src/02-Backend/workers/theme-analytics/wrangler.toml.example', [
'name = "igraspore-theme-analytics"',
'main = "src/index.js"',
'compatibility_date = "2026-10-01"',
'',
'# DO NOT commit real account_id or tokens.',
'# account_id = "YOUR_ACCOUNT_ID"',
'',
'[[analytics_engine_datasets]]',
'binding = "THEME_AE"',
'dataset = "igs_theme_events"',
'',
'# Secrets via: wrangler secret put CF_API_TOKEN / STATS_GATE',
'# [vars]',
'# ALLOWED_ORIGINS = "http://127.0.0.1:8795,http://127.0.0.1:8793,https://igraspore.pages.dev"',
''
].join('\n'));

w('.04-Src/02-Backend/workers/theme-analytics/src/index.js', [
'/** Cloudflare Worker: theme analytics ingest (Analytics Engine). No secrets in responses. */',
'const ALLOWED = new Set([\"classic\",\"neon-bio\",\"phase-contrast\",\"glass-lab\",\"cyberpunk-scanner\",\"haeckel-watercolor\",\"engraving\"]);',
'const SCREENS = new Set([\"bestiary\",\"pond\"]);',
'const EVENTS = new Set([\"theme_assign\",\"theme_change\",\"theme_time\",\"session_len\",\"return_d1\",\"return_d7\"]);',
'',
'function cors(origin, env) {',
'  const list = String((env && env.ALLOWED_ORIGINS) || \"http://127.0.0.1:8795,http://127.0.0.1:8793,https://igraspore.pages.dev\").split(\",\").map(s=>s.trim());',
'  const ok = list.includes(origin);',
'  return {',
'    \"Access-Control-Allow-Origin\": ok ? origin : list[0],',
'    \"Access-Control-Allow-Methods\": \"POST, GET, OPTIONS\",',
'    \"Access-Control-Allow-Headers\": \"Content-Type, X-Stats-Gate\",',
'    \"Vary\": \"Origin\"',
'  };',
'}',
'',
'function json(data, status, headers) {',
'  return new Response(JSON.stringify(data), { status, headers: Object.assign({ \"Content-Type\": \"application/json\" }, headers||{}) });',
'}',
'',
'function validEvent(ev) {',
'  if (!ev || typeof ev !== \"object\") return false;',
'  if (!EVENTS.has(ev.event)) return false;',
'  if (ev.screen && !SCREENS.has(ev.screen)) return false;',
'  if (ev.themeId && !ALLOWED.has(ev.themeId)) return false;',
'  if (ev.to && !ALLOWED.has(ev.to)) return false;',
'  if (ev.from && ev.from !== \"classic\" && !ALLOWED.has(ev.from) && ev.from !== \"unknown\") return false;',
'  if (typeof ev.anonId !== \"string\" || ev.anonId.length < 4 || ev.anonId.length > 80) return false;',
'  if (typeof ev.sessionId !== \"string\" || ev.sessionId.length < 4 || ev.sessionId.length > 80) return false;',
'  if (typeof ev.ts !== \"number\") return false;',
'  return true;',
'}',
'',
'export default {',
'  async fetch(request, env) {',
'    const origin = request.headers.get(\"Origin\") || \"\";',
'    const headers = cors(origin, env);',
'    if (request.method === \"OPTIONS\") return new Response(null, { status: 204, headers });',
'    const url = new URL(request.url);',
'    if (url.pathname === \"/theme-events\" && request.method === \"POST\") {',
'      let body;',
'      try { body = await request.json(); } catch (e) { return json({ ok:false, error:\"bad_json\" }, 400, headers); }',
'      const events = Array.isArray(body.events) ? body.events.slice(0, 50) : [];',
'      let n = 0;',
'      for (const ev of events) {',
'        if (!validEvent(ev)) continue;',
'        if (env.THEME_AE && env.THEME_AE.writeDataPoint) {',
'          env.THEME_AE.writeDataPoint({',
'            blobs: [ev.event, ev.screen || \"\", ev.themeId || ev.to || \"\", ev.anonId, ev.sessionId, ev.from || \"\"],',
'            doubles: [ev.ts, ev.ms || 0],',
'            indexes: [ev.anonId]',
'          });',
'          n++;',
'        } else { n++; }',
'      }',
'      return json({ ok:true, accepted:n }, 200, headers);',
'    }',
'    if (url.pathname === \"/theme-stats\" && request.method === \"GET\") {',
'      const gate = request.headers.get(\"X-Stats-Gate\") || \"\";',
'      if (env.STATS_GATE && gate !== env.STATS_GATE) {',
'        return json({ ok:false, error:\"forbidden\" }, 403, headers);',
'      }',
'      // Live SQL requires CF_API_TOKEN in env — never echoed. Placeholder aggregate for wrangler dev.',
'      return json({ ok:true, source: env.CF_API_TOKEN ? \"ae-pending-query\" : \"dev-empty\", bestiary: {}, pond: {}, note: \"Configure CF_API_TOKEN + account to enable SQL\" }, 200, headers);',
'    }',
'    if (url.pathname === \"/health\") return json({ ok:true }, 200, headers);',
'    return json({ ok:false, error:\"not_found\" }, 404, headers);',
'  }',
'};',
''
].join('\n'));

w('.04-Src/02-Backend/workers/theme-analytics/README.md', [
'# theme-analytics Worker',
'',
'Ingests anonymous theme events into Cloudflare Analytics Engine.',
'',
'## Owner checklist before prod deploy',
'1. Cloudflare account with Workers + Analytics Engine enabled',
'2. Create dataset `igs_theme_events`',
'3. Copy `wrangler.toml.example` to `wrangler.toml`, set account_id',
'4. `wrangler secret put STATS_GATE`',
'5. Optional: `wrangler secret put CF_API_TOKEN` (Account Analytics Read) for SQL dashboard',
'6. `wrangler deploy` (explicit owner approval — not part of wave-1 automation)',
'7. Set client `IGS_THEME_ANALYTICS_URL` to the Worker URL (no tokens)',
'',
'Local: `npx wrangler dev` from this folder.',
''
].join('\n'));

// dashboard
w('.04-Src/dist-lab/lab/theme-stats.html', `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"/>
<meta name="robots" content="noindex"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Theme stats — iGraSpore</title>
<style>
:root{--bg:#0c1020;--panel:#161d33;--link:#7ab8ff;--text:#e8eefc;--warn:#f6c945}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.45 system-ui,sans-serif}
header{display:flex;gap:12px;flex-wrap:wrap;padding:12px 16px;background:#101628;position:sticky;top:0}
a{color:var(--link)}
main{padding:16px;max-width:1100px;margin:0 auto}
.card{background:var(--panel);border-radius:10px;padding:12px 14px;margin:12px 0}
table{width:100%;border-collapse:collapse} th,td{border-bottom:1px solid #2a3558;padding:6px 8px;text-align:left;font-size:13px}
.fixture{background:#4a3a00;color:var(--warn);padding:8px 12px;border-radius:8px;font-weight:700;display:none}
.fixture.on{display:block}
.tabs button{min-height:48px;min-width:48px;margin-right:8px;padding:8px 12px;border-radius:8px;border:1px solid #3a4a7a;background:#1a2444;color:#fff;cursor:pointer}
.tabs button.on{background:#2a5a9a}
</style>
</head>
<body>
<header>
  <strong>Theme A/B stats</strong>
  <a href="/lab/">Lab</a>
  <a href="/lab/tests.html">Tests</a>
  <a href="/lab/theme-stats.html">Theme stats</a>
</header>
<main>
  <div id="fixtureBanner" class="fixture">FIXTURE / НЕ ПРОД — тестовые данные</div>
  <div class="tabs">
    <button type="button" class="on" data-tab="bestiary">Бестиарий</button>
    <button type="button" data-tab="pond">Водоём</button>
  </div>
  <div class="card" id="summary"></div>
  <div class="card"><h3>Смены стилей</h3><table id="changes"><thead><tr><th>from</th><th>to</th><th>n</th></tr></thead><tbody></tbody></table></div>
  <div class="card"><h3>Время в стиле (ms median)</h3><table id="times"><thead><tr><th>theme</th><th>median ms</th><th>sessions</th></tr></thead><tbody></tbody></table></div>
  <div class="card"><h3>D1 / D7</h3><div id="ret"></div></div>
</main>
<script>
const FIXTURE = {
  bestiary: {
    sessions: 240,
    d1: 0.31, d7: 0.12,
    timeMedian: { classic: 120000, 'neon-bio': 180000, 'phase-contrast': 150000 },
    changes: [ { from:'classic', to:'neon-bio', n:40 }, { from:'neon-bio', to:'phase-contrast', n:12 } ]
  },
  pond: {
    sessions: 240,
    d1: 0.28, d7: 0.11,
    timeMedian: { classic: 200000, 'neon-bio': 160000, 'phase-contrast': 210000 },
    changes: [ { from:'classic', to:'phase-contrast', n:33 }, { from:'phase-contrast', to:'neon-bio', n:9 } ]
  }
};
let screen = 'bestiary';
let data = { bestiary: { sessions:0,d1:0,d7:0,timeMedian:{},changes:[] }, pond: { sessions:0,d1:0,d7:0,timeMedian:{},changes:[] } };
const params = new URLSearchParams(location.search);
const useFixture = params.get('fixture') === '1' || params.get('fixture') === 'true';
if (useFixture) {
  document.getElementById('fixtureBanner').classList.add('on');
  data = FIXTURE;
}
function render() {
  const d = data[screen] || {};
  document.getElementById('summary').innerHTML = '<p>Экран: <b>'+screen+'</b></p><p>Сессии: <b>'+(d.sessions||0)+'</b></p><p>D1: <b>'+((d.d1||0)*100).toFixed(1)+'%</b> · D7: <b>'+((d.d7||0)*100).toFixed(1)+'%</b></p>';
  const ct = document.querySelector('#changes tbody'); ct.innerHTML = '';
  (d.changes||[]).forEach(r => { ct.innerHTML += '<tr><td>'+r.from+'</td><td>'+r.to+'</td><td>'+r.n+'</td></tr>'; });
  const tt = document.querySelector('#times tbody'); tt.innerHTML = '';
  Object.keys(d.timeMedian||{}).forEach(k => { tt.innerHTML += '<tr><td>'+k+'</td><td>'+(d.timeMedian[k])+'</td><td>—</td></tr>'; });
  document.getElementById('ret').textContent = 'D1='+(d.d1||0)+' D7='+(d.d7||0)+' (порог смены дефолта: n>=200 и +3 п.п.)';
}
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    screen = btn.getAttribute('data-tab');
    render();
  };
});
render();
</script>
</body>
</html>
`);

console.log('worker+dash ok');
