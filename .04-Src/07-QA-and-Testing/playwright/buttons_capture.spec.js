const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const PHASE = process.env.IGS_PHASE === 'after' ? 'after' : 'before';
const OUT = path.resolve(__dirname, '../../../09-Docs/out-dev-factory/shots-release-ready-2026-10-14/buttons-' + PHASE);
const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8792/';
const AUDIT = [
  ['M1','menu','#startBtn'],['M2','menu','#demoBtn'],['M3','menu','#screensaverBtn'],['M4','menu','#starSelect'],
  ['M5','menu','#helpBtn'],['M6','menu','#setBtn2'],['M7','menu','#wikiBtnMenu'],['M8','menu','#langSelWrap'],
  ['M9','menu','#spGrid'],['M10','menu','#diffWrap'],
  ['O1','help','#helpClose'],['O2','settings','#setClose'],['O3','settings','#setBody input[type=range]'],
  ['O4','wiki','#wikiSearch'],['O5','wiki','#wikiClose'],['O6','pause','#resBtn'],['O7','pause','#pHelp'],
  ['O8','tutorial','#tutSkip'],['O9','tutorial','#roleCardOk'],
  ['G1','game','#bEat'],['G2','game','#bDiv'],['G3','game','#bCyst'],['G4','game','#bFeed'],
  ['G5','game','#bAuto'],['G6','game','#bFree'],['G7','game','#bMicro'],['G8','game','#bRender'],
  ['G9','game','#renderModeBtn'],['G10','game','#bFol'],['G11','game','#bWiki'],['G12','game','#bPause'],
  ['G13','game','#bZI'],['G14','game','#bZO'],['G15','game','#bSandbox'],
  ['G16','game','#btnAcid'],['G17','game','#spdBar'],['G18','game','#legToggle'],['G19','game','#khToggle'],
  ['G20','game','#starSelectGame'],['G21','game','#apkBtn'],['G22','game','#mm'],
  ['G23','game','#mActs .ma'],['G24','game','#mTop .ma'],['G25','game','#mJoy'],
  ['G26','demo','#demoGroups button, #demoBar button, .demo-btn'],['G27','demo','#demoLabelsBtn'],
  ['G28','demo','#actBar'],['G29','game','#dnaModal']
];
const VIEWS = [{ name: '1280', width: 1280, height: 800, touch: false }, { name: '390', width: 390, height: 844, touch: true }];

function judge(selector, before, after) {
  const toast = (after.toast || '') !== (before.toast || '') ? (after.toast || '') : '';
  const woke = /проснул/i.test(toast) && !after.cyst;
  const dead = ['#bSandbox', '#btnAcid', '#btnEclipse', '#btnLeaderboard'];
  const meaningful = toast || after.cyst !== before.cyst || after.dividing !== before.dividing || after.autoAI !== before.autoAI || after.freeCam !== before.freeCam || after.state !== before.state || after.tZoom !== before.tZoom || after.ov !== before.ov || after.curLang !== before.curLang || after.tutStep !== before.tutStep || after.roleCard !== before.roleCard || after.settings !== before.settings;
  if (selector === '#bCyst' && (woke || !after.cyst)) return 'broken';
  if (selector === '#bEat' && !toast && !after.dividing) return 'broken';
  if (dead.some((s) => selector.indexOf(s) >= 0) && !toast && after.cyst === before.cyst && after.state === before.state) return 'no-code';
  if (selector === '#bDiv' && !after.dividing) return toast ? 'partial' : 'partial';
  if (meaningful) return 'work';
  return 'partial';
}

async function snapGlobals(page) {
  return page.evaluate(() => ({
    state: typeof state === 'undefined' ? null : state,
    cyst: !!(typeof player !== 'undefined' && player && player.cyst),
    dividing: !!(typeof player !== 'undefined' && player && player.dividing),
    orgs: typeof orgs === 'undefined' ? 0 : orgs.length,
    autoAI: typeof autoAI === 'undefined' ? null : !!autoAI,
    freeCam: typeof freeCam === 'undefined' ? null : !!freeCam,
    tZoom: typeof tZoom === 'undefined' ? null : tZoom,
    ov: Array.from(document.querySelectorAll('.ov.show')).map(function(e){return e.id;}).join(','),
    curLang: typeof curLang === 'undefined' ? null : curLang,
    tutStep: typeof tutorialStep === 'undefined' ? null : tutorialStep,
    roleCard: !!document.getElementById('roleCard'),
    settings: typeof settings === 'undefined' ? '' : JSON.stringify(settings),
    toast: (document.getElementById('toast') || {}).textContent || ''
  })).catch(() => ({}));
}

async function openScreen(page, screen) {
  await page.goto(BASE + '?v=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  if (screen === 'menu') return;
  if (screen === 'help') { await page.click('#helpBtn').catch(() => {}); return; }
  if (screen === 'settings') { await page.click('#setBtn2').catch(() => {}); return; }
  if (screen === 'wiki') { await page.click('#wikiBtnMenu').catch(() => {}); return; }
  if (screen === 'demo') { await page.click('#demoBtn').catch(() => {}); await page.waitForTimeout(1200); return; }
  if (screen === 'tutorial') { await page.click('#startBtn').catch(() => {}); await page.waitForTimeout(1200); return; }
  if (screen === 'aquarium') { await page.click('#screensaverBtn').catch(() => {}); await page.waitForTimeout(1200); return; }
  await page.click('#startBtn').catch(() => {});
  await page.waitForTimeout(900);
  await page.click('#roleCardOk').catch(() => {});
  await page.click('#tutSkip').catch(() => {});
  await page.click('text=Пропустить').catch(() => {});
  if (screen === 'pause') {
    await page.keyboard.press('p').catch(() => {});
    await page.click('#bPause').catch(() => {});
  }
}

test('capture visible controls', async ({ browser }) => {
  fs.mkdirSync(OUT, { recursive: true });
  const rows = [];
  for (const view of VIEWS) {
    for (const item of AUDIT) {
      const id = item[0];
      const screen = item[1];
      const selector = item[2];
      const context = await browser.newContext({
        viewport: { width: view.width, height: view.height },
        hasTouch: view.touch,
        recordVideo: { dir: OUT, size: { width: view.width, height: view.height } }
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      let verdict = 'no-code';
      let before = {};
      let after = {};
      let label = '';
      let rect = null;
      const pngBefore = path.join(OUT, id + '-' + view.name + '-before.png');
      const pngAfter = path.join(OUT, id + '-' + view.name + '-after.png');
      try {
        await openScreen(page, screen);
        const loc = page.locator(selector).first();
        const visible = await loc.isVisible().catch(() => false);
        if (!visible) verdict = 'hidden';
        else {
          label = ((await loc.innerText().catch(() => '')) || '').slice(0, 80);
          rect = await loc.boundingBox().catch(() => null);
          before = await snapGlobals(page);
          await page.screenshot({ path: pngBefore });
          await loc.click({ timeout: 4000 }).catch(() => {});
          await page.waitForTimeout(1500);
          after = await snapGlobals(page);
          await page.screenshot({ path: pngAfter });
          verdict = judge(selector, before, after);
        }
        if (!fs.existsSync(pngBefore)) await page.screenshot({ path: pngBefore }).catch(() => {});
        if (!fs.existsSync(pngAfter)) await page.screenshot({ path: pngAfter }).catch(() => {});
      } catch (err) {
        verdict = 'broken';
        label = String(err.message || err).slice(0, 180);
      }
      const vid = page.video();
      await context.close();
      let webm = '';
      try {
        if (vid) {
          const src = await vid.path();
          webm = path.join(OUT, id + '-' + view.name + '.webm');
          fs.copyFileSync(src, webm);
        }
      } catch (e) { webm = ''; }
      rows.push({ id, screen, viewport: view.name, selector, label, rect, handlerFound: verdict !== 'no-code' && verdict !== 'hidden', effect: { globalsBefore: before, globalsAfter: after, toast: after.toast || '' }, verdict, png: [pngBefore, pngAfter], webm, consoleErrors: errors.length });
    }
  }
  fs.writeFileSync(path.join(OUT, 'buttons.json'), JSON.stringify({ phase: PHASE, count: rows.length, rows }, null, 2));
});
