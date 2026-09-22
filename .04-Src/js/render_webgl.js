/* iGraSpore — WebGL water style (from .04-Src/v3-webgl). Active only when settings.renderMode==="webgl". */
(function(){
  var WATER_VERT = "attribute vec2 aPosition; attribute vec2 aTexCoord; uniform float uTime; varying vec2 vTexCoord; varying float vWaveHeight;\n"+
"float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}\n"+
"float sn(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}\n"+
"void main(){vTexCoord=aTexCoord;vec2 wp=aPosition*1000.0;float w=sn(wp*0.02+uTime*0.3)*2.0+sn(wp*0.05+uTime*0.5);vWaveHeight=w;gl_Position=vec4(aPosition,0.0,1.0);}";

  var WATER_FRAG = "precision highp float; varying vec2 vTexCoord; varying float vWaveHeight; uniform float uTime; uniform float uDayLight; uniform vec2 uResolution;\n"+
"float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n"+
"float pn(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}\n"+
"float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*pn(p);p*=2.;a*=.5;}return v;}\n"+
"void main(){\n"+
"  vec2 uv=vTexCoord; float t=uTime*0.12;\n"+
"  vec3 surfaceColor=vec3(0.12,0.50,0.45);\n"+
"  vec3 midColor=vec3(0.05,0.25,0.28);\n"+
"  vec3 deepColor=vec3(0.01,0.06,0.10);\n"+
"  float depth=1.0-uv.y;\n"+
"  vec3 waterColor;\n"+
"  if(depth<0.5) waterColor=mix(surfaceColor,midColor,depth*2.0);\n"+
"  else waterColor=mix(midColor,deepColor,(depth-0.5)*2.0);\n"+
"  waterColor*=(0.4+uDayLight*0.6);\n"+
"  float r1=fbm(uv*5.0+vec2(t,t*0.7));\n"+
"  float r2=fbm(uv*10.0+vec2(-t*0.5,t));\n"+
"  float r3=fbm(uv*20.0+vec2(t*0.3,-t*0.2));\n"+
"  float ripples=r1*0.5+r2*0.3+r3*0.2;\n"+
"  float caustic=pow(ripples,2.0)*1.2;\n"+
"  vec3 causticColor=vec3(0.6,0.95,0.85)*caustic*uDayLight*0.5;\n"+
"  float sunY=0.85;\n"+
"  float ds=length((uv-vec2(0.5,sunY))*uResolution)/uResolution.x;\n"+
"  float sg=exp(-ds*ds*12.0)*uDayLight;\n"+
"  float sparkle=pow(max(r2-0.3,0.0),4.0)*sg*3.0;\n"+
"  vec3 glitter=vec3(1.0,0.95,0.7)*sparkle;\n"+
"  float vig=1.0-length(uv-0.5)*0.35;\n"+
"  vec3 col=waterColor+causticColor+glitter;\n"+
"  col*=vig;\n"+
"  col+=vec3(vWaveHeight*0.015);\n"+
"  gl_FragColor=vec4(col,1.0);\n"+
"}";

  var glCanvas=null, gl=null, waterProgram=null, waterBuffer=null, webglReady=false, webglLoopOn=false;

  function compileShader(type, source){
    var s=gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
      console.error('WebGL shader error', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function ensureCanvas(){
    glCanvas=document.getElementById('glCanvas');
    if(!glCanvas){
      glCanvas=document.createElement('canvas');
      glCanvas.id='glCanvas';
      glCanvas.setAttribute('aria-hidden','true');
      glCanvas.style.cssText='position:absolute;top:0;left:0;z-index:0;pointer-events:none;display:none;';
      var c=document.getElementById('c');
      if(c && c.parentNode) c.parentNode.insertBefore(glCanvas, c);
      else document.body.insertBefore(glCanvas, document.body.firstChild);
    }
    return glCanvas;
  }

  function initWaterShader(){
    try{
      ensureCanvas();
      gl=glCanvas.getContext('webgl',{antialias:true, alpha:false, preserveDrawingBuffer:true}) ||
         glCanvas.getContext('experimental-webgl',{antialias:true, alpha:false, preserveDrawingBuffer:true});
      if(!gl){ webglReady=false; return false; }
      var vs=compileShader(gl.VERTEX_SHADER, WATER_VERT);
      var fs=compileShader(gl.FRAGMENT_SHADER, WATER_FRAG);
      if(!vs||!fs){ webglReady=false; return false; }
      waterProgram=gl.createProgram();
      gl.attachShader(waterProgram, vs);
      gl.attachShader(waterProgram, fs);
      gl.linkProgram(waterProgram);
      if(!gl.getProgramParameter(waterProgram, gl.LINK_STATUS)){
        console.error('WebGL link error', gl.getProgramInfoLog(waterProgram));
        webglReady=false; return false;
      }
      var verts=new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
      var tcs=new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1]);
      waterBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, waterBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, verts.byteLength+tcs.byteLength, gl.STATIC_DRAW);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts);
      gl.bufferSubData(gl.ARRAY_BUFFER, verts.byteLength, tcs);
      webglReady=true;
      return true;
    }catch(e){
      console.error('WebGL init failed', e);
      webglReady=false;
      return false;
    }
  }

  function resizeGLCanvas(){
    if(!glCanvas) return;
    var w=window.innerWidth||800, h=window.innerHeight||600;
    if(glCanvas.width!==w || glCanvas.height!==h){
      glCanvas.width=w; glCanvas.height=h;
    }
  }

  function renderWaterGL(time, dayLight){
    if(!waterProgram || !gl || !webglReady) return;
    resizeGLCanvas();
    var w=glCanvas.width, h=glCanvas.height;
    gl.viewport(0,0,w,h);
    gl.clearColor(0.01,0.03,0.05,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(waterProgram);
    var posLoc=gl.getAttribLocation(waterProgram,'aPosition');
    var tcLoc=gl.getAttribLocation(waterProgram,'aTexCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, waterBuffer);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(tcLoc);
    gl.vertexAttribPointer(tcLoc,2,gl.FLOAT,false,0,6*2*4);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uTime'), time);
    gl.uniform1f(gl.getUniformLocation(waterProgram,'uDayLight'), (typeof dayLight==='number'?dayLight:0.85));
    gl.uniform2f(gl.getUniformLocation(waterProgram,'uResolution'), w, h);
    gl.drawArrays(gl.TRIANGLES,0,6);
  }

  function setMainCanvasTransparent(on){
    var c=document.getElementById('c');
    if(!c) return;
    if(on){
      c.style.background='transparent';
      c.style.position=c.style.position||'absolute';
      c.style.zIndex='1';
    } else {
      c.style.background='';
    }
  }

  function waterLoop(){
    webglLoopOn=true;
    if(typeof settings!=='undefined' && settings.renderMode==='webgl' && webglReady){
      if(glCanvas) glCanvas.style.display='block';
      var dl=(typeof dayLight!=='undefined')?dayLight:0.85;
      renderWaterGL(performance.now()/1000, dl);
    } else if(glCanvas){
      glCanvas.style.display='none';
    }
    requestAnimationFrame(waterLoop);
  }

  window.initIgrasporWebGLStyle=function(){
    var ok=initWaterShader();
    resizeGLCanvas();
    window.addEventListener('resize', resizeGLCanvas);
    if(!webglLoopOn) waterLoop();
    return ok;
  };

  window.enableWebGLRenderMode=function(){
    if(!webglReady){
      if(!initWaterShader()){
        if(window.showToast) window.showToast('WebGL недоступен — возврат в мультяшный');
        return false;
      }
    }
    if(glCanvas) glCanvas.style.display='block';
    setMainCanvasTransparent(true);
    window.HYBRID_GL=true;
    return true;
  };

  window.disableWebGLRenderMode=function(){
    if(glCanvas) glCanvas.style.display='none';
    setMainCanvasTransparent(false);
    window.HYBRID_GL=false;
  };

  window.webglStyleReady=function(){ return !!webglReady; };

  // Compare report helper
  window.webglCompareNotes=function(){
    return {
      same: ['Мир и организмы на Canvas 2D', 'Управление/еда/движение без смены симуляции'],
      different: ['Фон воды рисует WebGL-шейдер (рябь, каустика, блик)', 'Основной canvas прозрачный поверх GL'],
      source: '.04-Src/v3-webgl (shaders + inline water loop)'
    };
  };
})();