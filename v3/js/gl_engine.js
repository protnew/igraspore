// iGraSpore V3 — WebGL Engine
// Replaces Canvas 2D with raw WebGL + shaders

var gl, waterProgram, orgProgram;
var waterBuffer, orgBuffer;
var canvas3d;

function initWebGL() {
  canvas3d = document.getElementById('glCanvas');
  if (!canvas3d) {
    canvas3d = document.createElement('canvas');
    canvas3d.id = 'glCanvas';
    document.body.insertBefore(canvas3d, document.body.firstChild);
  }
  canvas3d.width = window.innerWidth;
  canvas3d.height = window.innerHeight;
  canvas3d.style.position = 'absolute';
  canvas3d.style.top = '0';
  canvas3d.style.left = '0';
  canvas3d.style.zIndex = '0';
  
  gl = canvas3d.getContext('webgl', { antialias: true, alpha: false, preserveDrawingBuffer: true });
  if (!gl) { console.error('WebGL not supported'); return false; }
  
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  
  // Compile shaders
  waterProgram = createProgram(WATER_VERT, WATER_FRAG);
  orgProgram = createProgram(ORG_VERT, ORG_FRAG);
  
  // Fullscreen quad for water
  waterBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, waterBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1, 0,0,  1,-1, 1,0,  -1,1, 0,1,
    -1,1, 0,1,   1,-1, 1,0,  1,1, 1,1
  ]), gl.STATIC_DRAW);
  
  console.log('WebGL initialized:', canvas3d.width + 'x' + canvas3d.height);
  return true;
}

function createShader(type, source) {
  var s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

function createProgram(vsSource, fsSource) {
  var vs = createShader(gl.VERTEX_SHADER, vsSource);
  var fs = createShader(gl.FRAGMENT_SHADER, fsSource);
  var p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

// Render water
function renderWaterGL(time, dayLight, camX, camY, zoom) {
  if (!waterProgram || !gl) return;
  gl.useProgram(waterProgram);
  
  // Debug: check if we're actually drawing
  if (typeof window._waterDebug === 'undefined') {
    window._waterDebug = 0;
  }
  window._waterDebug++;
  
  // Set uniforms
  gl.uniform1f(gl.getUniformLocation(waterProgram, 'uTime'), time);
  gl.uniform1f(gl.getUniformLocation(waterProgram, 'uDayLight'), dayLight);
  gl.uniform2f(gl.getUniformLocation(waterProgram, 'uResolution'), canvas3d.width, canvas3d.height);
  gl.uniform2f(gl.getUniformLocation(waterProgram, 'uSunPos'), canvas3d.width * 0.5, canvas3d.height * 0.2);
  
  // Bind quad
  gl.bindBuffer(gl.ARRAY_BUFFER, waterBuffer);
  var posLoc = gl.getAttribLocation(waterProgram, 'aPosition');
  var texLoc = gl.getAttribLocation(waterProgram, 'aTexCoord');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(texLoc);
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 16, 8);
  
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

// Render organisms (instanced)
var orgInstanceData = null;
function updateOrganismBuffers(orgs) {
  // Build instance data: x, y, size, r, g, b, rotation per organism
  var data = new Float32Array(orgs.length * 7);
  for (var i = 0; i < orgs.length; i++) {
    var o = orgs[i];
    if (!o || !o.sp) continue;
    var c = hexToRgb(o.sp.color || '#4a9');
    data[i*7]   = o.x || 0;
    data[i*7+1] = o.y || 0;
    data[i*7+2] = o.size || 4;
    data[i*7+3] = c.r;
    data[i*7+4] = c.g;
    data[i*7+5] = c.b;
    data[i*7+6] = o.angle || 0;
  }
  
  if (!orgBuffer) orgBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, orgBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  orgInstanceData = { count: orgs.length };
}

function renderOrganismsGL() {
  if (!orgInstanceData || orgInstanceData.count === 0) return;
  gl.useProgram(orgProgram);
  // TODO: instanced draw
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substr(0,2), 16) / 255,
    g: parseInt(hex.substr(2,2), 16) / 255,
    b: parseInt(hex.substr(4,2), 16) / 255
  };
}

function resizeGL() {
  canvas3d.width = window.innerWidth;
  canvas3d.height = window.innerHeight;
  gl.viewport(0, 0, canvas3d.width, canvas3d.height);
}
