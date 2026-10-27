// v20.10 R6 negative check: mutants of density_pref.js must break the invariants
const fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.resolve(__dirname,'../../.04-Src/js/density_pref.js'),'utf8');
function run(s,mem,d){const sb={settings:{density:d},localStorage:{getItem:k=>k in mem?mem[k]:null,setItem:(k,v)=>mem[k]=String(v)},parseFloat,isFinite};sb.window=sb;vm.createContext(sb);vm.runInContext(s,sb);return sb;}
for(const [name,s] of [['real',src],['mutant-no-manual',src.replace('manual && valid(v)','false')],['mutant-no-migration',src.replace("s.density = 1.0; res = 'migrated'","res = 'migrated'")]]){
  const a=run(s,{igs_density:'0.6',igs_density_manual:'1'},1), b=run(s,{},0.3);
  const ok=a.settings.density===0.6&&b.settings.density===1;
  console.log(name.padEnd(20),'manual->',a.settings.density,'oldInstall->',b.settings.density,ok?'INVARIANTS OK':'INVARIANTS BROKEN');
}
