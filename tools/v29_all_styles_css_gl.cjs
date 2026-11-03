const fs = require('fs');

const css = `/* v29 theme styles — all 7 approved themes */
.theme-sel-wrap{display:flex;flex-direction:column;gap:4px;min-width:120px}
.theme-sel-label{font-size:11px;color:#bcd}
.theme-sel-wrap select,.theme-set-row select,#themeBestiaryBar select,#themePondBar select{
  min-height:48px;min-width:48px;font-size:14px;background:#123a66;color:#fff;border:1px solid #4af;border-radius:8px;padding:6px 8px
}
/* Pond bar: left of #pauseBtn (top:8px;right:8px;48x48) — never overlap */
#themePondBar{
  position:fixed;top:max(8px,env(safe-area-inset-top));right:64px;z-index:85;
  display:flex;flex-direction:column;gap:4px;pointer-events:auto;
  background:rgba(0,12,28,.78);padding:6px 8px;border-radius:10px;border:1px solid #1a3a55;max-width:min(220px,42vw)
}
body.in-menu #themePondBar{display:none!important}
@media (max-width:500px){
  #themePondBar{right:auto;left:max(8px,env(safe-area-inset-left));top:max(8px,env(safe-area-inset-top));max-width:46vw}
}
#themeBestiaryBar{margin:0 0 8px 0;display:flex;justify-content:flex-end}

#wikiO[data-theme-bestiary]{
  background:var(--theme-panel,rgba(0,12,28,.92))!important;
  color:var(--theme-text,#fff)!important;
  border-color:var(--theme-border,#1a3a55);
  font-family:var(--theme-font-ui,system-ui,sans-serif)
}
#wikiO[data-theme-bestiary] .tt{
  color:var(--theme-title,#4ef)!important;
  font-family:var(--theme-font-title,system-ui,sans-serif)
}
#wikiO[data-theme-bestiary] .wiki-entry{
  background:var(--theme-card,rgba(0,15,35,.6))!important;
  border:1px solid var(--theme-border,#234)!important;
  color:var(--theme-text,#fff)!important
}
#wikiO[data-theme-bestiary] .wiki-entry b{color:var(--theme-entry-b,#4df)!important}
#wikiO[data-theme-bestiary] .wiki-entry .wa,#wikiO[data-theme-bestiary] .wiki-entry .wf{color:var(--theme-text,#d8ecff)!important}
#wikiO[data-theme-bestiary] .wiki-entry .wl,#wikiO[data-theme-bestiary] .wiki-entry .wo{color:var(--theme-muted,#789)!important}
#wikiO[data-theme-bestiary] .wiki-entry .ww a{color:var(--theme-accent,#7cf)!important}
#wikiO[data-theme-bestiary] #wikiSearch{
  background:var(--theme-card,#123)!important;color:var(--theme-text,#fff)!important;border:1px solid var(--theme-border,#345)!important
}
#wikiO[data-theme-bestiary] .btn,#wikiO[data-theme-bestiary] #wikiClose{
  color:var(--theme-text,#fff)!important;border-color:var(--theme-border,#345)!important;background:var(--theme-card,#123)!important
}

/* neon */
#wikiO[data-theme-bestiary="neon-bio"] .wiki-entry{box-shadow:0 0 12px #ff00aa44, inset 0 0 20px #00ffff11}
#wikiO[data-theme-bestiary="neon-bio"] .tt{text-shadow:0 0 10px #00ffffaa,0 0 20px #ff00aa66}
html[data-theme-pond="neon-bio"],body[data-theme-pond="neon-bio"]{background:#000!important}

/* phase-contrast — light microscopic */
#wikiO[data-theme-bestiary="phase-contrast"]{box-shadow:inset 0 0 40px rgba(0,0,0,.08)}
#wikiO[data-theme-bestiary="phase-contrast"] .wiki-entry{box-shadow:0 1px 3px rgba(0,0,0,.12)}
html[data-theme-pond="phase-contrast"],body[data-theme-pond="phase-contrast"]{background:#cfd8da!important}

/* glass-lab — light glass, dark text */
#wikiO[data-theme-bestiary="glass-lab"]{
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:0 8px 32px rgba(40,80,120,.18), inset 0 1px 0 rgba(255,255,255,.6)
}
#wikiO[data-theme-bestiary="glass-lab"] .wiki-entry{
  backdrop-filter:blur(8px);box-shadow:0 4px 16px rgba(30,60,90,.12), inset 0 1px 0 #fff;
  border:1px solid rgba(255,255,255,.75)!important
}
#wikiO[data-theme-bestiary="glass-lab"] .tt{text-shadow:0 1px 0 #fff}
html[data-theme-pond="glass-lab"],body[data-theme-pond="glass-lab"]{background:#c8daf0!important}

/* cyberpunk */
#wikiO[data-theme-bestiary="cyberpunk-scanner"] .wiki-entry{box-shadow:0 0 8px #00ff6644;border-style:dashed!important}
#wikiO[data-theme-bestiary="cyberpunk-scanner"] .tt{text-shadow:0 0 8px #00ff88,0 0 16px #ff00aa55;letter-spacing:.04em}
html[data-theme-pond="cyberpunk-scanner"],body[data-theme-pond="cyberpunk-scanner"]{background:#050010!important}

/* haeckel parchment */
#wikiO[data-theme-bestiary="haeckel-watercolor"]{
  background-image:radial-gradient(ellipse at 30% 20%,#fff8e8 0%,transparent 50%),linear-gradient(180deg,#faf3e6,#f0e2c8)!important
}
#wikiO[data-theme-bestiary="haeckel-watercolor"] .wiki-entry{box-shadow:2px 3px 0 rgba(100,70,40,.15)}
html[data-theme-pond="haeckel-watercolor"],body[data-theme-pond="haeckel-watercolor"]{background:#e8dcc0!important}

/* engraving */
#wikiO[data-theme-bestiary="engraving"]{
  background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 3px)!important
}
#wikiO[data-theme-bestiary="engraving"] .wiki-entry{border-width:2px!important;border-radius:0!important}
#wikiO[data-theme-bestiary="engraving"] .tt{letter-spacing:.06em;text-transform:uppercase;font-size:28px}
html[data-theme-pond="engraving"],body[data-theme-pond="engraving"]{background:#ddd6c8!important}
`;
fs.writeFileSync('style-themes-v29.css', css);
console.log('css ok', css.split(/\n/).length);

// Patch render_webgl.js — theme uniforms
let gl = fs.readFileSync('.04-Src/js/render_webgl.js', 'utf8').replace(/^\uFEFF/, '');
if (!gl.includes('uSurface')) {
  const newFrag = `var WATER_FRAG = "precision highp float; varying vec2 vTexCoord; varying float vWaveHeight; uniform float uTime; uniform float uDayLight; uniform vec2 uResolution;\\n"+
"uniform vec3 uSurface; uniform vec3 uMid; uniform vec3 uDeep; uniform vec3 uCaustic; uniform float uCausticAmt; uniform float uBloom; uniform float uSat; uniform float uVig; uniform float uFx;\\n"+
"float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\\n"+
"float pn(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}\\n"+
"float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*pn(p);p*=2.;a*=.5;}return v;}\\n"+
"void main(){\\n"+
"  vec2 uv=vTexCoord; float t=uTime*0.12;\\n"+
"  vec3 surfaceColor=uSurface; vec3 midColor=uMid; vec3 deepColor=uDeep;\\n"+
"  float depth=1.0-uv.y;\\n"+
"  vec3 waterColor;\\n"+
"  if(depth<0.5) waterColor=mix(surfaceColor,midColor,depth*2.0);\\n"+
"  else waterColor=mix(midColor,deepColor,(depth-0.5)*2.0);\\n"+
"  waterColor*=(0.4+uDayLight*0.6);\\n"+
"  float r1=fbm(uv*5.0+vec2(t,t*0.7));\\n"+
"  float r2=fbm(uv*10.0+vec2(-t*0.5,t));\\n"+
"  float r3=fbm(uv*20.0+vec2(t*0.3,-t*0.2));\\n"+
"  float ripples=r1*0.5+r2*0.3+r3*0.2;\\n"+
"  float caustic=pow(ripples,2.0)*uCausticAmt*uFx;\\n"+
"  vec3 causticColor=uCaustic*caustic*uDayLight*0.5;\\n"+
"  float sunY=0.85;\\n"+
"  float ds=length((uv-vec2(0.5,sunY))*uResolution)/uResolution.x;\\n"+
"  float sg=exp(-ds*ds*12.0)*uDayLight*uBloom;\\n"+
"  float sparkle=pow(max(r2-0.3,0.0),4.0)*sg*3.0*uFx;\\n"+
"  vec3 glitter=vec3(1.0,0.95,0.7)*sparkle;\\n"+
"  float vig=1.0-length(uv-0.5)*uVig;\\n"+
"  vec3 col=waterColor+causticColor+glitter;\\n"+
"  float luma=dot(col,vec3(0.299,0.587,0.114));\\n"+
"  col=mix(vec3(luma),col,uSat);\\n"+
"  col*=vig;\\n"+
"  col+=vec3(vWaveHeight*0.015*uFx);\\n"+
"  gl_FragColor=vec4(col,1.0);\\n"+
"}";`;

  gl = gl.replace(/var WATER_FRAG = [\s\S]*?";\n/, newFrag + ';\n');

  // replace renderWaterGL uniform section
  const oldUniforms = `    gl.uniform1f(gl.getUniformLocation(waterProgram,'uTime'), time);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uDayLight'), (typeof dayLight==='number'?dayLight:0.85));
    gl.uniform2f(gl.getUniformLocation(waterProgram,'uResolution'), w, h);
    gl.drawArrays(gl.TRIANGLES,0,6);`;

  const newUniforms = `    var sh=(window.__igsThemePondShader)||{};
    function v3(a,d){a=a||d; return a;}
    var surf=v3(sh.surface,[0.12,0.50,0.45]), mid=v3(sh.mid,[0.05,0.25,0.28]), deep=v3(sh.deep,[0.01,0.06,0.10]), cau=v3(sh.caustic,[0.6,0.95,0.85]);
    var fx=(sh.fallback==='low')?Math.min(sh.fx||0.4,0.4):(typeof sh.fx==='number'?sh.fx:1.0);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uTime'), time);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uDayLight'), (typeof dayLight==='number'?dayLight:0.85));
    gl.uniform2f(gl.getUniformLocation(waterProgram,'uResolution'), w, h);
    gl.uniform3f(gl.getUniformLocation(waterProgram,'uSurface'), surf[0],surf[1],surf[2]);
    gl.uniform3f(gl.getUniformLocation(waterProgram,'uMid'), mid[0],mid[1],mid[2]);
    gl.uniform3f(gl.getUniformLocation(waterProgram,'uDeep'), deep[0],deep[1],deep[2]);
    gl.uniform3f(gl.getUniformLocation(waterProgram,'uCaustic'), cau[0],cau[1],cau[2]);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uCausticAmt'), typeof sh.causticAmt==='number'?sh.causticAmt:1.2);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uBloom'), typeof sh.bloom==='number'?sh.bloom:1.0);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uSat'), typeof sh.sat==='number'?sh.sat:1.0);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uVig'), typeof sh.vignette==='number'?sh.vignette:0.35);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uFx'), fx);
    gl.drawArrays(gl.TRIANGLES,0,6);`;

  if (!gl.includes(oldUniforms)) throw new Error('uniform block not found');
  gl = gl.replace(oldUniforms, newUniforms);

  gl = gl.replace(
    'window.webglStyleReady=function(){ return !!webglReady; };',
    `window.webglStyleReady=function(){ return !!webglReady; };
  window.igsThemeApplyWebGL=function(sh){ window.__igsThemePondShader = sh || window.__igsThemePondShader; };`
  );

  fs.writeFileSync('.04-Src/js/render_webgl.js', gl);
  console.log('webgl patched', gl.split(/\\n/).length);
} else console.log('webgl already patched');

// Patch render_effects 2D water colors
let fx = fs.readFileSync('.04-Src/js/render_effects.js', 'utf8').replace(/^\uFEFF/, '');
if (!fx.includes('__igsThemePondShader') || !fx.includes('rgbTop')) {
  const needle = `  // Natural pond colors ALWAYS (swiss mode only changes organism drawing, not world)
  var lt=lightTop, lm=lightMid, lb=lightBot;
  grad.addColorStop(0, 'rgb('+Math.round(12+lt*28)+','+Math.round(70+lt*65)+','+Math.round(85+lt*55)+')');
  grad.addColorStop(0.12, 'rgb('+Math.round(10+lt*20)+','+Math.round(55+lt*48)+','+Math.round(75+lt*50)+')');
  grad.addColorStop(0.45, 'rgb('+Math.round(8+lm*12)+','+Math.round(30+lm*28)+','+Math.round(55+lm*35)+')');
  grad.addColorStop(0.75, 'rgb('+Math.round(10+lb*8)+','+Math.round(22+lb*14)+','+Math.round(40+lb*22)+')');
  grad.addColorStop(1, 'rgb('+Math.round(12+lb*6)+','+Math.round(18+lb*8)+','+Math.round(22+lb*10)+')');`;

  const repl = `  // Theme-aware pond colors (2D path); swiss still draws organisms same
  var lt=lightTop, lm=lightMid, lb=lightBot;
  var _sh=(typeof window!=='undefined' && window.__igsThemePondShader) ? window.__igsThemePondShader : null;
  var _rt=_sh&&_sh.rgbTop ? _sh.rgbTop : [12,70,85];
  var _rm=_sh&&_sh.rgbMid ? _sh.rgbMid : [8,30,55];
  var _rb=_sh&&_sh.rgbBot ? _sh.rgbBot : [12,18,22];
  function _mixC(base, light, gain){ return Math.round(clamp(base[0]+light*gain[0],0,255))+','+Math.round(clamp(base[1]+light*gain[1],0,255))+','+Math.round(clamp(base[2]+light*gain[2],0,255)); }
  grad.addColorStop(0, 'rgb('+_mixC(_rt,lt,[28,65,55])+')');
  grad.addColorStop(0.12, 'rgb('+_mixC(_rt,lt,[20,48,50])+')');
  grad.addColorStop(0.45, 'rgb('+_mixC(_rm,lm,[12,28,35])+')');
  grad.addColorStop(0.75, 'rgb('+_mixC(_rb,lb,[8,14,22])+')');
  grad.addColorStop(1, 'rgb('+_mixC(_rb,lb,[6,8,10])+')');`;

  if (!fx.includes(needle)) {
    console.error('render_effects needle missing');
  } else {
    fx = fx.replace(needle, repl);
    fs.writeFileSync('.04-Src/js/render_effects.js', fx);
    console.log('render_effects patched');
  }
} else console.log('render_effects already themed');
