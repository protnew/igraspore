const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8795';
async function startGame(page, opts){
  opts = opts || {};
  await page.goto(BASE + '/?lang=' + (opts.lang||'en') + (opts.test?'&test=1':'') + '&t=' + Date.now(), { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await page.click('#startBtn');
  await page.waitForTimeout(400);
  await page.evaluate('window.closeIntroCard && window.closeIntroCard()');
  await page.evaluate(`(function(){ var b=document.getElementById('roleCardOk'); if(b) b.click(); var el=document.getElementById('roleCard'); if(el) el.remove(); if(typeof state!=='undefined' && state==='paused') state='playing'; })()`);
  await page.evaluate(`(function(){ var b=[].slice.call(document.querySelectorAll('button')).find(function(x){return /Пропустить|Skip/.test(x.textContent||'');}); if(b&&b.style.display!=='none') b.click(); })()`);
  await page.waitForTimeout(600);
}
function collectErrs(page){
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0,200)));
  page.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,200)); });
  page.on('response', r => { if (r.status()>=400) errs.push('HTTP'+r.status()+':'+r.url()); });
  return errs;
}
module.exports = { BASE, startGame, collectErrs };
