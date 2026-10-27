// v21_eco_run.cjs — C0: долгий прогон бассейна, 101 вид, сиды, ускорение, JSONL.
// Usage: node tools/v21_eco_run.cjs <base> <outDir> [seeds=1,2,3,4,5] [minutes=60] [speed=100]
//   minutes — игровых минут на сид; speed — timeScale (×). NEG=1 — отключает питание
//   одному виду-продуценту и деление одного консумента (оба должны стать 🔴).
// Рендер отключается (window.render=noop) — замеряется только симуляция.
const fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));

const BASE = process.argv[2] || 'http://127.0.0.1:8821';
const OUT = process.argv[3] || 'eco';
const SEEDS = (process.argv[4] || '1,2,3,4,5').split(',').map(Number);
const MINUTES = parseFloat(process.argv[5] || '60');
const SPEED = parseFloat(process.argv[6] || '100');
const NEG = process.env.NEG === '1';
fs.mkdirSync(OUT, { recursive: true });

const SEED_JS = (seed) => `(function(){
  // mulberry32 — детерминированный Math.random
  var s = ${seed} >>> 0;
  function rnd(){ s |= 0; s = (s + 0x6D2B79F5) | 0; var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
  Math.random = rnd;
  window.__igsSeed = ${seed};
  ${NEG ? `window.__neg = { starveCat: 'producer', noDivideCat: 'consumer1' };` : ''}
  return 1;
})()`;

const START_JS = `(function(){
  // события/механики — обёртки над настоящими функциями игры
  window.__ev = { eat: {}, div: {}, die: {}, dieCause: {}, virus: 0, spawnOK: 0, spawnRej: 0, virusLysis: 0, corpsesEaten: {} };
  var oEat = window.eatOrg, oDiv = window.doDivide, oKill = window.killOrg, oSpawn = window.spawnOrg;
  if (oEat) window.eatOrg = function(p, pr){ try { window.__ev.eat[pr.sp.name] = (window.__ev.eat[pr.sp.name] || 0) + 1;
      if (!pr.alive) { /* труп съеден */ window.__ev.corpsesEaten[pr.sp.cat || 'x'] = (window.__ev.corpsesEaten[pr.sp.cat || 'x'] || 0) + 1; } } catch(e){} return oEat.apply(this, arguments); };
  if (oDiv) window.doDivide = function(o){ var r;
    if (window.__neg && o.sp.cat === window.__neg.noDivideCat) { window.__ev.div[o.sp.name] = 0; return false; }
    r = oDiv.apply(this, arguments);
    try { if (r || o.dividing) window.__ev.div[o.sp.name] = (window.__ev.div[o.sp.name] || 0) + 1; } catch(e){}
    return r; };
  if (oKill) window.killOrg = function(o, c){ try { window.__ev.die[o.sp.name] = (window.__ev.die[o.sp.name] || 0) + 1;
      window.__ev.dieCause[c] = (window.__ev.dieCause[c] || 0) + 1; } catch(e){} return oKill.apply(this, arguments); };
  if (oSpawn) window.spawnOrg = function(sp){ var r = oSpawn.apply(this, arguments); try { if (r) window.__ev.spawnOK++; else window.__ev.spawnRej++; } catch(e){} return r; };
  // NEG: продуцент без света (энергия падает вдвое быстрее), деление консумента запрещено
  if (window.__neg) {
    var oU = window.updateOrg;
    if (oU) window.updateOrg = function(o, dt){
      if (o && o.sp && o.sp.cat === window.__neg.starveCat && !o.isPlayer) { o.energy = (o.energy || 0) - (dt || 0.016) * 6; }
      return oU.apply(this, arguments);
    };
  }
  return 1;
})()`;

const SNAP_JS = `(function(){
  var per = {}, bio = {}, vel = {}, cats = {};
  var tot = 0, bioAll = 0;
  for (var i = 0; i < orgs.length; i++){
    var o = orgs[i]; if (!o || !o.alive) continue;
    var nm = o.sp.name, c = o.sp.cat;
    tot++; bioAll += o.size * o.size;
    per[nm] = (per[nm] || 0) + 1;
    bio[nm] = (bio[nm] || 0) + o.size * o.size;
    cats[c] = (cats[c] || 0) + 1;
    var v = Math.hypot(o.vx || 0, o.vy || 0);
    if (!vel[nm] || v > vel[nm]) vel[nm] = v;
  }
  return JSON.stringify({ t: window.__gt2 || 0, total: tot, biomass: +bioAll.toFixed(1), cats: cats,
    per: per, bio: bio, vel: vel, viruses: (typeof viruses !== 'undefined' ? viruses.length : 0),
    ev: JSON.parse(JSON.stringify(window.__ev)) });
})()`;

async function runSeed(browser, seed, minutes, speed, neg) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 150)));
  await p.addInitScript(SEED_JS(seed));
  await p.goto(BASE + '/?test=1&lang=en&eco=' + seed, { waitUntil: 'load', timeout: 45000 });
  await p.waitForSelector('#startBtn', { timeout: 30000 });
  await p.evaluate(START_JS);
  // рендер выкл: замеряем только updateWorld
  await p.evaluate('(function(){ window.__orender = window.render; window.render = function(){}; return 1; })()');
  await p.evaluate("document.getElementById('startBtn').click()");
  await p.waitForFunction(`(function(){
    if (typeof state === 'undefined') return false;
    var rc = document.getElementById('roleCardOk'); if (rc) { try { rc.click(); } catch(e){} }
    var skip = document.getElementById('tutSkip');
    if (skip && skip.offsetParent !== null) { try { skip.click(); } catch(e){} }
    return state === 'playing' && window.player && player.alive;
  })()`, undefined, { timeout: 60000, polling: 150 });
  await p.evaluate('(function(){ window.state = "playing"; timeScale = ' + speed + '; window.__gt2 = 0; return 1; })()');

  const gameSecTotal = minutes * 60;
  const LOOP_JS = `(function(){
    var out = [];
    var speed = ${speed};
    var total = ${gameSecTotal};
    var next = 10, gt2 = 0;
    var t0 = Date.now();
    while (gt2 < total) {
      try { updateWorld(0.05); } catch (e) { return JSON.stringify({ fatal: 'err:' + e.message, t: gt2 }); }
      gt2 += 0.05 * speed;
      if (gt2 >= next || gt2 >= total) {
        var per = {}, bio = {}, vel = {}, cats = {};
        var tot = 0, bioAll = 0;
        if (!window.__velAny) window.__velAny = {};
        for (var i = 0; i < orgs.length; i++) {
          var o = orgs[i]; if (!o || !o.alive) continue;
          var nm = o.sp.name;
          tot++; bioAll += o.size * o.size;
          per[nm] = (per[nm] || 0) + 1;
          bio[nm] = (bio[nm] || 0) + o.size * o.size;
          cats[o.sp.cat] = (cats[o.sp.cat] || 0) + 1;
          var v = Math.hypot(o.vx || 0, o.vy || 0);
          if (!vel[nm] || v > vel[nm]) vel[nm] = +v.toFixed(3);
          if (v > 0.001 && v > (window.__velAny[nm] || 0)) window.__velAny[nm] = +v.toFixed(3);
        }
        out.push({ t: +gt2.toFixed(1), total: tot, biomass: +bioAll.toFixed(1), cats: cats,
          per: per, bio: bio, vel: vel, velAny: window.__velAny || {}, viruses: (typeof viruses !== 'undefined' ? viruses.length : 0),
          ev: JSON.parse(JSON.stringify(window.__ev)) });
        next += 10;
      }
    }
    return JSON.stringify({ snaps: out, wallMs: Date.now() - t0 });
  })()`;
  const resRaw = await p.evaluate(LOOP_JS);
  const res = JSON.parse(resRaw);
  const jsonl = fs.createWriteStream(path.join(OUT, 'seed' + seed + (neg ? '-neg' : '') + '.jsonl'));
  for (const snap of (res.snaps || [])) jsonl.write(JSON.stringify(snap) + String.fromCharCode(10));
  if (res.fatal) errs.push(res.fatal);
  jsonl.end();
  const wall = (res.wallMs ? (res.wallMs / 1000).toFixed(1) : '?');
  await ctx.close();
  return { seed, wallSec: wall, errs: errs.slice(0, 3) };
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const s of SEEDS) {
    const r = await runSeed(b, s, MINUTES, SPEED, NEG);
    results.push(r);
    console.error('seed', s, 'done in', r.wallSec + 's', r.errs.length ? ('errs:' + r.errs.join('|')) : '');
  }
  fs.writeFileSync(path.join(OUT, (NEG ? 'summary-neg.json' : 'summary.json')), JSON.stringify({ base: BASE, minutes: MINUTES, speed: SPEED, seeds: SEEDS, results }, null, 1));
  await b.close();
  console.log('ECO RUN DONE ->', OUT);
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
