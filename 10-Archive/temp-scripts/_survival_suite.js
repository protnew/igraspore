const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const URL = process.env.URL || 'https://igraspore.pages.dev';
const OUT = path.join(__dirname, 'screenshots', 'SURVIVAL-REPORT.json');
const SS = path.join(__dirname, 'screenshots');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0,120)));
  console.log('goto...');
  await page.goto(URL + '/?t=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2000);
  console.log('loaded');

  // ===== A) ECOSYSTEM: 60s accelerated via game loop helpers =====
  console.log('eco start');
  const eco = await page.evaluate(async () => {
    function snap() {
      const by = {};
      let alive = 0;
      for (let i = 0; i < orgs.length; i++) {
        const o = orgs[i];
        if (!o || !o.alive || !o.sp) continue;
        alive++;
        const id = (o.sp.id != null) ? String(o.sp.id) : o.sp.name;
        if (!by[id]) by[id] = { name: o.sp.name, cat: o.sp.cat, n: 0 };
        by[id].n++;
      }
      return { alive, speciesAlive: Object.keys(by).length, by, viruses: (viruses||[]).length };
    }

    selSpecies = 0;
    difficulty = 'easy';
    startGame();
    try { document.getElementById('roleCardOk')?.click(); } catch(e){}
    // freeze visual render if possible by not calling requestAnimationFrame path
    const hasUW = typeof updateWorld === 'function';
    const hasUW2 = typeof worldUpdate === 'function';
    const hasTick = typeof tick === 'function';
    const hasMain = typeof update === 'function';

    const t0 = snap();
    // 45 real sim-seconds in chunks of 0.1s, but only update every other org for speed if needed
    const DT = 0.1;
    const TOTAL = 45; // seconds
    const steps = Math.floor(TOTAL / DT);
    const marks = [0, 15, 30, 45];
    const series = [{ t: 0, ...t0 }];
    let markIdx = 1;
    let simT = 0;

    // Prefer single world updater
    function step(dt) {
      if (hasUW) { updateWorld(dt); return; }
      if (hasUW2) { worldUpdate(dt); return; }
      if (hasMain) { update(dt); return; }
      // minimal: update all orgs
      if (typeof updateOrg === 'function') {
        for (let i = 0; i < orgs.length; i++) {
          const o = orgs[i];
          if (o && o.alive) {
            try { updateOrg(o, dt); } catch (e) {}
          }
        }
      }
      if (typeof updateViruses === 'function') try { updateViruses(dt); } catch(e){}
      if (typeof spawnNatural === 'function') try { spawnNatural(dt); } catch(e){}
    }

    for (let i = 0; i < steps; i++) {
      step(DT);
      simT += DT;
      if (markIdx < marks.length && simT + 1e-6 >= marks[markIdx]) {
        series.push({ t: marks[markIdx], ...snap() });
        markIdx++;
      }
    }
    if (series[series.length-1].t < TOTAL) series.push({ t: TOTAL, ...snap() });

    const final = series[series.length - 1];
    const allIds = new Set();
    for (const s of series) Object.keys(s.by).forEach(id => allIds.add(id));
    const outcomes = [];
    for (const id of allIds) {
      const a0 = (series[0].by[id] || { n: 0 }).n;
      const aF = (final.by[id] || { n: 0 }).n;
      const meta = final.by[id] || series[0].by[id] || { name: String(id), cat: '?' };
      const name = meta.name || String(id);
      const cat = meta.cat || '?';
      let status = 'stable';
      if (a0 > 0 && aF === 0) status = 'extinct';
      else if (a0 > 0 && aF < a0 * 0.3) status = 'crash';
      else if (a0 > 0 && aF > a0 * 1.5) status = 'boom';
      else if (a0 === 0 && aF > 0) status = 'emerged';
      else status = 'stable';
      const mid = series.find(s => s.t === 30);
      outcomes.push({
        id, name, cat, n0: a0,
        n15: (series.find(s=>s.t===15)||{by:{}}).by[id]?.n || 0,
        n30: mid?.by[id]?.n || 0,
        n45: aF, status
      });
    }
    outcomes.sort((a,b) => String(a.cat).localeCompare(b.cat) || a.name.localeCompare(b.name));
    const cats = {};
    for (const o of outcomes) {
      if (!cats[o.cat]) cats[o.cat] = { n0:0, n45:0, sp0:0, sp45:0 };
      if (o.n0>0){ cats[o.cat].n0+=o.n0; cats[o.cat].sp0++; }
      if (o.n45>0){ cats[o.cat].n45+=o.n45; cats[o.cat].sp45++; }
    }
    return {
      updater: hasUW ? 'updateWorld' : hasUW2 ? 'worldUpdate' : hasMain ? 'update' : 'updateOrg',
      series: series.map(s => ({ t:s.t, alive:s.alive, speciesAlive:s.speciesAlive, viruses:s.viruses })),
      outcomes, cats,
      totalSpeciesEver: allIds.size,
      extinct: outcomes.filter(o=>o.status==='extinct').length,
      stable: outcomes.filter(o=>o.status==='stable'||o.status==='boom').length,
      crash: outcomes.filter(o=>o.status==='crash').length,
      boom: outcomes.filter(o=>o.status==='boom').length,
      player: player ? { name: player.sp?.name, energy: +(player.energy||0).toFixed(1), alive: !!player.alive } : null
    };
  });
  console.log('eco done', eco.updater, eco.series);

  // ===== B) PER-SPECIES: 8s each, lightweight (player only + 40 neighbors) =====
  console.log('per-species start', 'count will query');
  const perSp = await page.evaluate(async () => {
    const results = [];
    const N = SPECIES_DB.length;
    const DT = 0.1;
    const TICKS = 80; // 8 seconds
    for (let si = 0; si < N; si++) {
      try {
        selSpecies = si;
        difficulty = 'easy';
        startGame();
        try { document.getElementById('roleCardOk')?.click(); } catch(e){}
        if (!player || !player.alive) {
          results.push({ i:si, name:SPECIES_DB[si].name, cat:SPECIES_DB[si].cat, ok:false, reason:'no_player' });
          continue;
        }
        const e0 = player.energy||0, s0 = player.size||0;
        for (let t=0; t<TICKS; t++) {
          if (!player || !player.alive) break;
          // update player
          try { updateOrg(player, DT); } catch(e){}
          // sample neighbors near player for predation/food
          let nUpd = 0;
          for (let k=0; k<orgs.length && nUpd<50; k++) {
            const o = orgs[k];
            if (!o || !o.alive || o===player) continue;
            const dx=o.x-player.x, dy=o.y-player.y;
            if (dx*dx+dy*dy < 40000) { // ~200 units
              try { updateOrg(o, DT); } catch(e){}
              nUpd++;
            }
          }
          if (typeof updateViruses === 'function' && (t%5===0)) try { updateViruses(DT); } catch(e){}
        }
        const alive = !!(player && player.alive);
        results.push({
          i:si, name:SPECIES_DB[si].name, cat:SPECIES_DB[si].cat,
          ok: alive,
          reason: alive ? ((player.energy||0) >= e0*0.4 ? 'stable' : 'weak') : 'died',
          e0:+e0.toFixed(1), e1:+(player?player.energy||0:0).toFixed(1),
          s0:+s0.toFixed(2), s1:+(player?player.size||0:0).toFixed(2)
        });
      } catch (e) {
        results.push({ i:si, name:SPECIES_DB[si]?.name||'?', cat:SPECIES_DB[si]?.cat||'?', ok:false, reason:'err:'+String(e).slice(0,60) });
      }
    }
    return results;
  });
  console.log('per-species done', perSp.length);

  await page.screenshot({ path: path.join(SS, 'SURVIVAL-end.png') }).catch(()=>{});

  const okN = perSp.filter(x=>x.ok).length;
  const report = {
    url: URL, ts: new Date().toISOString(), jsErrors: errs.slice(0,15),
    ecosystem: eco,
    perSpecies: perSp,
    summary: {
      ecoSurviveSpeciesPct: eco.totalSpeciesEver ? +((eco.stable/eco.totalSpeciesEver)*100).toFixed(1) : 0,
      ecoExtinct: eco.extinct, ecoStable: eco.stable, ecoCrash: eco.crash, ecoBoom: eco.boom,
      playerSurvivePct: perSp.length ? +((okN/perSp.length)*100).toFixed(1) : 0,
      playerOk: okN, playerFail: perSp.length-okN,
      catsWith2plus: Object.entries(eco.cats||{}).filter(([,v])=>v.sp45>=2).map(([c])=>c),
      emptyCatsAtEnd: Object.entries(eco.cats||{}).filter(([,v])=>v.sp45===0).map(([c])=>c),
      goalHalfSurvive: (eco.stable/Math.max(1,eco.totalSpeciesEver)) >= 0.5,
      goalTwoPerNiche: Object.values(eco.cats||{}).filter(v=>v.sp45>=2).length
    }
  };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log('=== ECO ===');
  console.log(JSON.stringify(eco.series,null,2));
  console.log('=== CATS ===');
  console.log(JSON.stringify(eco.cats,null,2));
  console.log('=== SUMMARY ===');
  console.log(JSON.stringify(report.summary,null,2));
  const fails = perSp.filter(x=>!x.ok);
  console.log('FAIL by cat', fails.reduce((a,x)=>{a[x.cat]=(a[x.cat]||0)+1;return a;},{}));
  console.log('fail sample', fails.slice(0,12));
  console.log('weak', perSp.filter(x=>x.reason==='weak').slice(0,10));
  console.log('OUT', OUT);
  await browser.close();
  process.exit(0);
})().catch(e => { console.error('FATAL', e); process.exit(1); });
