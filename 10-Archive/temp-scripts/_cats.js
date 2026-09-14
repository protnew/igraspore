
const fs=require('fs');const vm=require('vm');
const code=fs.readFileSync(String.raw`C:\Obsidian\New\Projects\08-iGraSpore_V2\.04-Src\js\config.js`,'utf8');
const s={window:{},document:{getElementById:()=>null,createElement:()=>({style:{},appendChild:()=>{}}),body:{appendChild:()=>{}}},console,Math,Object,Array,String,Number,Boolean,JSON,parseInt,parseFloat,isFinite,undefined,localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{language:'ru'},setTimeout,clearTimeout};
s.window=s;
try{vm.runInNewContext(code,s,{timeout:5000});}catch(e){console.log('err',e.message);}
const db=s.SPECIES_DB||[];
const counts={};
db.forEach(sp=>{counts[sp.cat]=(counts[sp.cat]||0)+1});
console.log(JSON.stringify(counts));
console.log('c3 sample', db.filter(s=>s.cat==='consumer3').slice(0,3).map(s=>s.name));
