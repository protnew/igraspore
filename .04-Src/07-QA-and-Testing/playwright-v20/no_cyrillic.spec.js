const { test, expect } = require('@playwright/test');
const { BASE, collectErrs } = require('./_helpers');
// B8 (TZ v20): 0 кириллических строк на en/es/tr/fil/th (кроме названий языков в списке)
const LANGS = ['en', 'es', 'tr', 'fil', 'th'];
for (const lang of LANGS) {
  test(`[B8] no cyrillic on ${lang} (menu+game+pause+settings+wiki+dead)`, async ({ page }) => {
    const errs = collectErrs(page);
    await page.goto(BASE + '/?lang=' + lang + '&test=1&t=' + Date.now(), { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    // меню
    let bad = await page.evaluate(`(function(){
      var drop=document.getElementById('langSelDrop'); var hid=drop?drop.innerHTML:''; if(drop)drop.style.display='none';
      var t=(document.body.innerText||'');
      if(drop){drop.style.display='';}
      return (t.match(/[\\u0400-\\u04FF]+/g)||[]).slice(0,5);
    })()`);
    expect(bad, 'menu cyrillic: ' + JSON.stringify(bad)).toEqual([]);
    // игра + карточка + пауза
    await page.click('#startBtn'); await page.waitForTimeout(400);
    await page.evaluate('window.closeIntroCard && document.getElementById("introO").className==="ov show" ? window.closeIntroCard() : 0');
    await page.keyboard.press('Escape'); await page.waitForTimeout(250);
    bad = await page.evaluate(`(document.getElementById('pauseO').innerText||'').match(/[\\u0400-\\u04FF]+/g)||[]`);
    expect(bad, 'pause cyrillic').toEqual([]);
    // настройки
    await page.evaluate(`buildSettings(); document.getElementById('setO').className='ov show';`);
    await page.waitForTimeout(250);
    bad = await page.evaluate(function(){
      var sl=document.getElementById('setLang'); var d=sl?sl.style.display:'';
      if(sl)sl.style.display='none';
      var m=(document.getElementById('setBody').innerText.match(/[Ѐ-ӿ]+/g)||[]).slice(0,5);
      if(sl)sl.style.display=d; return m; });
    expect(bad, 'settings cyrillic').toEqual([]);
    // вики
    await page.evaluate(`buildWiki(); document.getElementById('wikiO').className='ov show'; document.getElementById('setO').className='ov';`);
    await page.waitForTimeout(250);
    bad = await page.evaluate(`(document.getElementById('wikiContent').innerText.match(/[\\u0400-\\u04FF]+/g)||[]).slice(0,5)`);
    expect(bad, 'wiki cyrillic').toEqual([]);
    // смерть
    await page.evaluate(`document.getElementById('wikiO').className='ov'; document.getElementById('setO').className='ov'; document.getElementById('pauseO').className='ov'; state='playing'; window.__igsTest.killPlayer();`);
    await page.waitForFunction(`document.getElementById('deadO').className==='ov show'`, null, { timeout: 4000 });
    bad = await page.evaluate(`(document.getElementById('deadStats').innerText.match(/[\\u0400-\\u04FF]+/g)||[]).slice(0,5)`);
    expect(bad, 'dead cyrillic').toEqual([]);
    await page.screenshot({ path: 'C:/Obsidian/New/Projects/08-iGraSpore_V2/09-Docs/out-dev-factory/ACCEPT-v20-1854/v20-B8-' + lang + '.png' });
    expect(errs.length).toBe(0);
  });
}
