// v20.10 R7: classify the 116 lint findings one by one: endonym / translation (own language) / REAL ERROR (non-en value == English)
const fs=require('fs');
const inv=JSON.parse(fs.readFileSync('09-Docs/out-dev-factory/logs-release-ready-2026-10-14/i18n-inventory-before.json','utf8'));
const src=fs.readFileSync('.04-Src/js/config.js','utf8').split(/\r?\n/);
const allow=JSON.parse(fs.readFileSync('.04-Src/tools/i18n/i18n_lint.allow.json','utf8')).filter(a=>/^v20.10 L1/.test(a.reason||''));
// English values of the same keys
const en={}; src.forEach(L=>{let m,re=/T\.en\.([A-Za-z0-9_]+)\s*=\s*(['"])(.*?)\2;/g;while((m=re.exec(L)))en[m[1]]=m[3];});
const rows=[];
for(const a of allow){const L=src[a.line-1]||'';let cls,lang='',key='';
  const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const m=new RegExp("T(?:\\.([a-zA-Z-]+)|\\[['\"]([a-zA-Z-]+)['\"]\\])\\.([A-Za-z0-9_]+)\\s*=\\s*(['\"])"+esc(a.exact)+"\\4").exec(L);
  if(/LANG_NAME/.test(L)&&!m)cls='endonym';
  else if(a.exact==='ru'&&/curLang:'ru'/.test(L))cls='code';
  else if(m){lang=m[1]||m[2];key=m[3];
    if(lang!=='en'&&en[key]!==undefined&&en[key]===a.exact&&!/^[A-Z0-9 .·%−-]+$/.test(a.exact)===false?false:lang!=='en'&&en[key]===a.exact)cls='REAL-untranslated';
    else cls='translation';}
  else cls='unknown';
  rows.push({line:a.line,lang,key,text:a.exact.slice(0,60),cls});}
const by={};rows.forEach(r=>by[r.cls]=(by[r.cls]||0)+1);console.log(JSON.stringify(by));
rows.filter(r=>r.cls!=='translation').forEach(r=>console.log(r.cls,r.line,r.lang,r.key,JSON.stringify(r.text)));
const bl={};rows.filter(r=>r.cls==='translation').forEach(r=>bl[r.lang]=(bl[r.lang]||0)+1);console.log('translations by lang',JSON.stringify(bl));
fs.writeFileSync(process.env.TEMP+'/lintrows.json',JSON.stringify(rows,null,1));
