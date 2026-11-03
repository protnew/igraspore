const fs = require('fs');
const p = 'tools/v29_shots_all.cjs';
let s = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
s = s.replace(
  "try{ if(typeof enableWebGLRenderMode==='function'){ settings.renderMode='webgl'; enableWebGLRenderMode(); }catch(e){}",
  "try{ if(typeof enableWebGLRenderMode==='function'){ settings.renderMode='webgl'; enableWebGLRenderMode(); } }catch(e){}"
);
fs.writeFileSync(p, s);
console.log('fixed', s.includes("} }catch(e){}"));
