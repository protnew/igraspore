const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(__dirname, '..', '.04-Src', 'node_modules', 'playwright'));

const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8820';
const OUT = path.resolve('09-Docs/out-dev-factory/theme-shots-v29');
const THEMES = ['classic', 'neon-bio', 'phase-contrast'];
const LANGS = ['en', 'ru', 'ar', 'hi'];
const VIEWS = [
  { name: '375', width: 375, height: 812 },
  { name: '1400', width: 1400, height: 900 },
];

fs.mkdirSync(OUT, { recursive: true });

async function dismissOverlays(page) {
  await page.evaluate(`(function(){
    try { if (typeof closeIntroCard==='function') closeIntroCard(); } catch(e){}
    var rc=document.getElementById('roleCardOk'); if(rc) try{rc.click();}catch(e){}
    var skip=document.getElementById('tutSkip'); if(skip) try{skip.click();}catch(e){}
    var res=document.getElementById('resBtn'); if(res) try{res.click();}catch(e){}
    ['introO','roleCard','tutO','pauseO'].forEach(function(id){
      var el=document.getElementById(id); if(el){ el.classList.remove('show'); }
    });
    try { if (typeof state!=='undefined' && state==='paused') state='playing'; } catch(e){}
  })()`);
}

async function startPlaying(page, lang) {
  await page.goto(BASE + '/?lang=' + lang + '&t=' + Date.now(), {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await page.waitForSelector('#startBtn', { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.evaluate("document.getElementById('startBtn').click()");
  await page.waitForFunction(`(function(){
    if (typeof state==='undefined') return false;
    try { if (typeof closeIntroCard==='function' && document.getElementById('introO') && document.getElementById('introO').className.indexOf('show')>=0) closeIntroCard(); } catch(e){}
    var rc=document.getElementById('roleCardOk'); if(rc) try{rc.click();}catch(e){}
    var skip=document.getElementById('tutSkip'); if(skip && skip.offsetParent!==null) try{skip.click();}catch(e){}
    return !!(window.player && player.alive) && (state==='playing' || state==='paused');
  })()`, null, { timeout: 60000, polling: 150 });
  await dismissOverlays(page);
  await page.waitForTimeout(400);
  await page.waitForFunction('!!window.igsThemeEngine', null, { timeout: 10000 });
}

async function applyThemes(page, bestiary, pond) {
  await page.evaluate(`(function(b,p){
    localStorage.setItem('igs.theme.bestiary', b);
    localStorage.setItem('igs.theme.pond', p);
    if (window.igsThemeEngine) {
      window.igsThemeEngine.applyThemePond(p);
      window.igsThemeEngine.applyThemeBestiary(b);
    }
  })(${JSON.stringify(bestiary)}, ${JSON.stringify(pond)})`);
  await page.waitForTimeout(250);
}

async function openWiki(page) {
  await page.evaluate(`(function(){
    var b = document.getElementById('bWiki') || document.getElementById('wikiBtnMenu');
    if (b) b.click();
    else {
      var w=document.getElementById('wikiO'); if(w) w.className='ov show';
      if (typeof buildWiki==='function') try{buildWiki();}catch(e){}
    }
    if (window.igsThemeEngine && window.igsThemeEngine.injectWikiSwitcher) window.igsThemeEngine.injectWikiSwitcher();
  })()`);
  await page.waitForTimeout(500);
}

async function closeWiki(page) {
  await page.evaluate(`(function(){
    var c=document.getElementById('wikiClose'); if(c) c.click();
    var w=document.getElementById('wikiO'); if(w){ w.classList.remove('show'); w.className='ov'; }
  })()`);
  await page.waitForTimeout(200);
}

async function measureFps(page, ms) {
  return page.evaluate(`(function(ms){
    return new Promise(function(res){
      var dts=[], last=performance.now(), t0=last;
      function fr(now){
        dts.push(now-last); last=now;
        if(now-t0<ms) requestAnimationFrame(fr);
        else {
          dts.sort(function(a,b){return a-b;});
          var fps=dts.map(function(d){return 1000/Math.max(d,0.001);});
          var med=fps[Math.floor(fps.length/2)];
          var p5=fps[Math.max(0,Math.floor(fps.length*0.05))];
          res({n:fps.length, med:+med.toFixed(1), p5:+p5.toFixed(1)});
        }
      }
      requestAnimationFrame(fr);
    });
  })(${ms})`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const report = { shots: [], fps: {}, hitTargets: {}, errors: [], base: BASE, startedAt: new Date().toISOString() };
  let shotCount = 0;

  for (const view of VIEWS) {
    for (const lang of LANGS) {
      const context = await browser.newContext({
        viewport: { width: view.width, height: view.height },
        locale: lang === 'ar' ? 'ar' : lang === 'hi' ? 'hi-IN' : lang === 'ru' ? 'ru-RU' : 'en-US',
      });
      const page = await context.newPage();
      page.on('pageerror', e => report.errors.push(String(e.message).slice(0, 180)));

      try {
        await startPlaying(page, lang);

        if (lang === 'en') {
          await applyThemes(page, 'neon-bio', 'neon-bio');
          await openWiki(page);
          const boxes = await page.evaluate(`(function(){
            function box(id){ var el=document.getElementById(id); if(!el) return null; var r=el.getBoundingClientRect(); return {id:id,w:+r.width.toFixed(1),h:+r.height.toFixed(1)}; }
            return { bestiary: box('themeSelBestiary'), pond: box('themeSelPond') };
          })()`);
          report.hitTargets[view.name] = boxes;
          await closeWiki(page);
        }

        for (const theme of THEMES) {
          await applyThemes(page, theme, theme);
          await closeWiki(page);
          await dismissOverlays(page);
          await page.waitForTimeout(300);
          const pondName = 'pond_' + theme + '_' + view.name + '_' + lang + '.png';
          await page.screenshot({ path: path.join(OUT, pondName), fullPage: false });
          shotCount++;
          report.shots.push({ file: pondName, screen: 'pond', theme: theme, view: view.name, lang: lang, ok: true });

          await openWiki(page);
          const wikiName = 'bestiary_' + theme + '_' + view.name + '_' + lang + '.png';
          await page.screenshot({ path: path.join(OUT, wikiName), fullPage: false });
          shotCount++;
          report.shots.push({ file: wikiName, screen: 'bestiary', theme: theme, view: view.name, lang: lang, ok: true });
          await closeWiki(page);
        }

        if (lang === 'en' && view.name === '1400') {
          for (const theme of THEMES) {
            await applyThemes(page, theme, theme);
            await closeWiki(page);
            await dismissOverlays(page);
            await page.waitForTimeout(500);
            const m = await measureFps(page, 30000);
            report.fps[theme] = m;
            console.log('FPS', theme, JSON.stringify(m));
          }
        }
        console.log('OK', view.name, lang, 'shots so far', shotCount);
      } catch (e) {
        report.errors.push(view.name + '/' + lang + ': ' + String(e.message || e).slice(0, 200));
        console.error('ERR', view.name, lang, e.message || e);
      }

      await context.close();
    }
  }

  try {
    const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    const page = await context.newPage();
    const labUrl = 'http://127.0.0.1:8793/lab/theme-stats.html?fixture=1';
    const resp = await page.goto(labUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    report.lab = { status: resp && resp.status(), url: labUrl };
    await page.screenshot({ path: path.join(OUT, 'lab_theme_stats_fixture.png'), fullPage: false });
    shotCount++;
    await context.close();
  } catch (e) {
    report.lab = { error: String(e.message || e) };
  }

  report.shotCount = shotCount;
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'matrix-report.json'), JSON.stringify(report, null, 2));
  console.log('DONE shots', shotCount, 'errors', report.errors.length);
  console.log('FPS', JSON.stringify(report.fps));
  console.log('hitTargets', JSON.stringify(report.hitTargets));
  await browser.close();
  process.exit(shotCount >= 48 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
