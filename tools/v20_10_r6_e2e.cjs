// v20.10 R6 e2e: fresh phone install -> full pool; slider 0.6 -> reload -> 0.6 kept (390x844)
const { chromium } = require(require('path').join(__dirname,'..','.04-Src','node_modules','playwright'));
const out = process.env.USERPROFILE + '/agent-transfer/igraspore-v20-9-1/';
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13) Mobile'});
const p=await c.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8821/index.html?test=1'); await p.waitForFunction('typeof startGame==="function"');
const r1=await p.evaluate(()=>({res:window.igsDensityMigrateResult,d:settings.density,ver:localStorage.getItem('igs_density_ver')}));
await p.evaluate(()=>{ buildSettings(); document.getElementById('setO').classList.add('show'); document.getElementById('setO').style.display='flex'; });
await p.waitForTimeout(500);
const moved=await p.evaluate(()=>{const i=[...document.querySelectorAll('input[type=range]')].find(x=>x.min==='0.3'&&x.max==='2');if(!i)return false;i.value='0.6';i.dispatchEvent(new Event('input',{bubbles:true}));return true;});
await p.screenshot({path:out+'R6-settings-slider-0.6.png'});
await p.reload(); await p.waitForFunction('typeof startGame==="function"');
const r2=await p.evaluate(()=>({res:window.igsDensityMigrateResult,d:settings.density}));
console.log(JSON.stringify({r1,moved,r2,errs:errs.length})); await b.close();
process.exit(r1.d===1&&r1.res==='migrated'&&moved&&r2.d===0.6&&r2.res==='manual'?0:1);})();
