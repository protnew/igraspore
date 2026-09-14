
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(String.raw`C:\Obsidian\New\Projects\08-iGraSpore_V2\.04-Src\js\config.js`,'utf8');
const sandbox = {
  window: {}, document: { getElementById: () => null, createElement: () => ({style:{},appendChild:()=>{}}), body:{appendChild:()=>{}} },
  console, Math, Object, Array, String, Number, Boolean, JSON, parseInt, parseFloat, isFinite, undefined,
  localStorage: { getItem:()=>null, setItem:()=>{} },
  navigator: { language: 'ru' },
  setTimeout, clearTimeout,
};
sandbox.window = sandbox;
try {
  vm.runInNewContext(code, sandbox, {timeout:5000});
} catch(e) {
  console.log('EVAL ERR', e.message);
}
const db = sandbox.SPECIES_DB || [];
console.log('n', db.length);
const cols = db.filter(s=>s&&s.shape==='colony').map(s=>({name:s.name,size:s.size,num:s.num,vis:s.visScale}));
console.log('colonies', JSON.stringify(cols,null,2));
console.log('num0', db[0]&&db[0].num, 'num50', db[50]&&db[50].num);
