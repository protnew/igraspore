const BASE = process.env.GATE_BASE_URL || 'http://127.0.0.1:8795';

// v20.6 G2: boot = evaluate-клик (page.click ловит pointer-захват оверлеев)
// + ожидание state==='playing' до 60 с. Никаких фиксированных пауз.
async function startGame(page, opts){
  opts = opts || {};
  const testSuffix = opts.test ? '&test=1' + (opts.pool ? '&pool=' + opts.pool : '&pool=200') : '';
  const errs = collectErrs(page);
  await page.goto(BASE + '/?lang=' + (opts.lang||'en') + testSuffix + '&t=' + Date.now(), { waitUntil: 'load', timeout: 45000 });
  await page.waitForSelector('#startBtn', { timeout: 30000 });
  await page.evaluate("document.getElementById('startBtn').click()");
  await page.waitForFunction(`(function(){
    if (typeof state === 'undefined') return false;
    if (state !== 'paused' && state !== 'playing') return false;
    var io = document.getElementById('introO');
    var rc = document.getElementById('roleCardOk');
    if (io && io.className.indexOf('show') >= 0 && typeof window.closeIntroCard === 'function') { window.closeIntroCard(); }
    if (rc) { try { rc.click(); } catch(e){} }
    var skip = document.getElementById('tutSkip');
    if (skip && skip.offsetParent !== null) { try { skip.click(); } catch(e){} }
    return state === 'playing' && window.player && player.alive;
  })()`, undefined, { timeout: 60000, polling: 120 });
  return errs;
}

function collectErrs(page){
  const errs = [];
  page.on('pageerror', e => errs.push(e.message.slice(0,200)));
  page.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,200)); });
  page.on('response', r => { if (r.status()>=400) errs.push('HTTP'+r.status()+':'+r.url()); });
  return errs;
}
module.exports = { BASE, startGame, collectErrs };
