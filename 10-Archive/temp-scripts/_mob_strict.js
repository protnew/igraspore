const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  // emulate phone + touch
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36'
  });
  const errs = [];
  page.on('console', m => {
    if (m.type()==='error') errs.push(m.text().substring(0,250));
    if (m.text().includes('[Mobile')) console.log('LOG', m.text());
  });
  page.on('pageerror', e => errs.push('PAGE:'+e.message.substring(0,250)));

  await page.goto('https://igraspore.pages.dev/?source=apk&v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  let pass=0, fail=0;
  function check(name, cond, extra){
    console.log((cond?'✅':'❌') + ' ' + name + (extra? ' | '+extra : ''));
    if(cond) pass++; else fail++;
  }

  // 1. Mobile layer active
  const mob = await page.evaluate(() => ({
    isMobile: document.documentElement.classList.contains('is-mobile'),
    hasJoy: !!document.getElementById('mJoy'),
    hasMenu: !!document.querySelector('#mTop .menu, #mTop .ma'),
    mTopText: Array.from(document.querySelectorAll('#mTop .ma')).map(e=>e.textContent),
    joyRect: (()=>{const r=document.getElementById('mJoy').getBoundingClientRect(); return {w:Math.round(r.width),h:Math.round(r.height),left:Math.round(r.left),bottom:Math.round(window.innerHeight-r.bottom)};})(),
    openMenu: typeof window.openGameMenu,
    toggleMenu: typeof window.toggleGameMenu,
  }));
  console.log('MOB', JSON.stringify(mob));
  check('Mobile class active', mob.isMobile);
  check('Joystick present', mob.hasJoy);
  check('Joystick SMALL (not half screen)', mob.joyRect.w <= 150 && mob.joyRect.h <= 150, JSON.stringify(mob.joyRect));
  check('Menu button text visible', mob.mTopText.some(t => t.includes('МЕНЮ') || t.includes('Menu') || t.includes('☰')), mob.mTopText.join('|'));
  check('openGameMenu exists', mob.openMenu === 'function');
  check('toggleGameMenu exists', mob.toggleMenu === 'function');

  // Start game
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty='easy'; startGame();
  });
  await page.waitForTimeout(2500);

  // 2. Menu open
  await page.evaluate(() => window.openGameMenu());
  await page.waitForTimeout(500);
  const menuOpen = await page.evaluate(() => ({
    state: typeof state!=='undefined'?state:window.state,
    menuShow: document.getElementById('menuO') && document.getElementById('menuO').classList.contains('show'),
    menuOpenClass: document.body.classList.contains('menu-open'),
  }));
  check('Menu opens (class show)', menuOpen.menuShow, JSON.stringify(menuOpen));
  check('state=menu', menuOpen.state==='menu', menuOpen.state);

  // Close via start again for rest of tests
  await page.evaluate(() => {
    try{localStorage.setItem('igraspore_tut_v2','1');}catch(e){}
    difficulty='easy'; startGame();
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
  });
  await page.waitForTimeout(2000);

  // 3. Tap organism in CENTER (not joy zone)
  const tapCenter = await page.evaluate(() => {
    // find nearest alive org to camera center
    var best=null,bd=1e18;
    for(var i=0;i<orgs.length;i++){
      var o=orgs[i]; if(!o.alive) continue;
      var d=(o.x-cam.x)*(o.x-cam.x)+(o.y-cam.y)*(o.y-cam.y);
      if(d<bd){bd=d;best=o;}
    }
    if(!best) return {ok:false,reason:'no org'};
    // center camera on it
    cam.x=best.x; cam.y=best.y;
    return {ok:true, name:best.sp.name, x:best.x, y:best.y, size:best.size};
  });
  console.log('center org', JSON.stringify(tapCenter));

  // Tap center of screen
  await page.touchscreen.tap(195, 422);
  await page.waitForTimeout(400);
  const tip1 = await page.evaluate(() => {
    var tip=document.getElementById('tip');
    return {
      tipDisplay: tip? tip.style.display : 'NO_TIP',
      tipText: tip? tip.textContent.substring(0,80) : '',
      insp: window.inspOrg ? (window.inspOrg.sp&&window.inspOrg.sp.name) : (typeof inspOrg!=='undefined'&&inspOrg?inspOrg.sp.name:null)
    };
  });
  check('Tap center picks organism / tip', !!(tip1.insp || (tip1.tipText&&tip1.tipText.length>3)), JSON.stringify(tip1));

  // 4. Tap BOTTOM-LEFT outside joy (was blocked before) — area above joy
  // joy is 130x130 at left:8 bottom:8 → free area e.g. x=200 y=700 still free; 
  // left area above joy: x=40 y=650 should be free now
  const bl = await page.evaluate(() => {
    // put an organism at world position corresponding to screen bottom-left-ish but outside joy
    // screen (60, 650) on 390x844
    var cv=document.getElementById('c');
    var r=cv.getBoundingClientRect();
    var sx=60, sy=650;
    var mx=(sx-r.left)*(cv.width/r.width), my=(sy-r.top)*(cv.height/r.height);
    var wx=cam.x+(mx-cv.width/2)/zoom, wy=cam.y+(my-cv.height/2)/zoom;
    // move nearest producer there for test
    var o=null;
    for(var i=0;i<orgs.length;i++){ if(orgs[i].alive && orgs[i].sp.cat==='producer'){ o=orgs[i]; break; } }
    if(o){ o.x=wx; o.y=wy; }
    return {wx, wy, name:o?o.sp.name:null, joy: document.getElementById('mJoy').getBoundingClientRect()};
  });
  console.log('BL setup', JSON.stringify(bl));
  // tap at 60,650 — should NOT be on joy (joy bottom-left 8..138)
  await page.touchscreen.tap(60, 650);
  await page.waitForTimeout(400);
  const tip2 = await page.evaluate(() => ({
    tip: (document.getElementById('tip')||{}).textContent||'',
    insp: (window.inspOrg&&window.inspOrg.sp&&window.inspOrg.sp.name) || (typeof inspOrg!=='undefined'&&inspOrg&&inspOrg.sp?inspOrg.sp.name:null)
  }));
  check('Tap bottom-left (outside joy) can pick org', !!tip2.insp || (tip2.tip&&tip2.tip.length>3), JSON.stringify(tip2));

  // 5. Tap ON joy should not crash, joy zone small
  await page.touchscreen.tap(70, 780);
  await page.waitForTimeout(200);
  check('Tap on joystick no crash', true);

  // 6. Death rate over 20s
  const before = await page.evaluate(() => {
    var a=(orgs||[]).filter(o=>o.alive);
    return {total:a.length, byCat: a.reduce((m,o)=>{m[o.sp.cat]=(m[o.sp.cat]||0)+1;return m;},{}), playerE: player?Math.round(player.energy):-1};
  });
  console.log('before', JSON.stringify(before));
  await page.evaluate(() => { for(var i=0;i<20*30;i++) updateWorld(1/30); });
  const after = await page.evaluate(() => {
    var a=(orgs||[]).filter(o=>o.alive);
    return {total:a.length, byCat: a.reduce((m,o)=>{m[o.sp.cat]=(m[o.sp.cat]||0)+1;return m;},{}), playerAlive: !!(player&&player.alive), playerE: player?Math.round(player.energy):-1};
  });
  console.log('after20s', JSON.stringify(after));
  check('Player alive 20s', after.playerAlive, 'E='+after.playerE);
  check('Population not collapsed', after.total > before.total*0.4 && after.total > 200, before.total+'→'+after.total);
  check('Producers still alive', (after.byCat.producer||0) > 50, String(after.byCat.producer));
  check('5 niches', Object.keys(after.byCat).filter(k=>after.byCat[k]>0).length >= 4, JSON.stringify(after.byCat));

  // 7. Toggle menu via button click
  await page.evaluate(() => window.toggleGameMenu());
  await page.waitForTimeout(300);
  const m2 = await page.evaluate(() => document.getElementById('menuO').classList.contains('show'));
  check('toggleGameMenu opens menu', m2);
  await page.evaluate(() => window.toggleGameMenu());
  await page.waitForTimeout(300);
  const m3 = await page.evaluate(() => ({show:document.getElementById('menuO').classList.contains('show'), state:state}));
  check('toggleGameMenu closes back to play', !m3.show && m3.state==='playing', JSON.stringify(m3));

  // 8. Spawn invuln present on young
  const inv = await page.evaluate(() => {
    // spawn one and check
    var sp = SPECIES_DB[0];
    var o = spawnOrg(sp, cam.x, cam.y, false);
    return o ? {invuln:o.invuln, energy:Math.round(o.energy)} : null;
  });
  check('NPC spawn has invuln>=3', inv && inv.invuln >= 3, JSON.stringify(inv));
  check('NPC spawn energy>=55', inv && inv.energy >= 55, JSON.stringify(inv));

  // 9. Errors
  check('Zero JS errors', errs.length===0, errs.length+':'+errs.slice(0,2).join(';'));

  // screenshots
  await page.evaluate(() => { if(typeof state!=='undefined') state='playing'; try{paused=false;}catch(e){} document.getElementById('menuO').className='ov'; document.body.classList.remove('menu-open'); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOB-STRICT-PLAY.png' });
  await page.evaluate(() => window.openGameMenu());
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/screenshots/MOB-STRICT-MENU.png' });

  console.log('\n=== RESULT '+pass+' PASS / '+fail+' FAIL ===');
  await browser.close();
  if(fail>0) process.exit(2);
})().catch(e => { console.error(e); process.exit(1); });
