// iGraSpore V3 — main3d.js
// Minimal game loop using WebGL instead of Canvas 2D
// Reuses V2 config.js, world.js, organs.js, biology.js, ai.js

"use strict";

// === V2 COMPATIBILITY STUBS ===
// These functions exist in V2 but reference Canvas 2D.
// We stub them so V2 modules don't crash when loaded.
function updateWorld(dt) {}
function spawnOrg(sp, x, y, isPlayer, parentEnergy) {
  // Minimal spawn for V3
  var o = {
    x: x, y: y, vx: 0, vy: 0,
    size: (sp.size_min + sp.size_max) / 2 || 4,
    energy: 60, hp: 100, mass: 2, age: 0,
    sp: sp, species: sp.name, state: 'idle',
    facing: 0, angle: 0, alive: true,
    divideTimer: 0, eats: 0, isPlayer: isPlayer || false
  };
  orgs.push(o);
  return o;
}
function rng(min, max) { return min + Math.random() * (max - min); }
function halfW(d) { return 800; }
var PD = 1000;
var dayLight = 0.85;
var stats = {births:0, deaths:0, deathCauses:[0,0,0,0,0]};
var gameStats = {startTime:0, maxPop:0, maxPlayerSize:0, evoLvl:0};
var speciesPop = {};
var nutrientClouds = [];
var shoreDecor = [];
var globalCO2 = 150, globalO2 = 100;

function initWorld3D() {
  orgs = [];
  parts = [];
  viruses = [];
  tod = 9.0;
  dayLight = 0.85;
  console.log('V3: initWorld3D done, SPECIES_DB=' + (typeof SPECIES_DB !== 'undefined' ? SPECIES_DB.length : 'N/A'));
}


// === GLOBALS (V2 compatibility stubs) ===
var cv = { width: 0, height: 0 };  // stub — real canvas is glCanvas
var ctx = null;                     // no Canvas 2D in V3
var state = 'menu';
var gt = 0, fc = 0, lastT = 0, fAcc = 0;
var tod = 9;  // morning start
var keys = {};
var mouse = { x: 0, y: 0, down: false };
var difficulty = 'normal';

// === INIT ===
window.addEventListener('load', function() {
  // Initialize WebGL first
  if (!initWebGL()) {
    document.getElementById('loading').textContent = 'WebGL не поддерживается!';
    return;
  }
  
  cv.width = canvas3d.width;
  cv.height = canvas3d.height;
  
  // V3: do NOT call V2 initWorld() — it uses Canvas-specific code
  // Initialize our own world
  initWorld3D();
  
  // Spawn player as single bacterium near surface
  spawnInitialOrganisms();
  
  // Hide loading, show HUD
  document.getElementById('loading').style.display = 'none';
  document.getElementById('hud').style.display = 'block';
  
  state = 'playing';
  lastT = performance.now();
  requestAnimationFrame(gameLoop3D);
});

function spawnInitialOrganisms() {
  // Spawn player near surface
  if (typeof SPECIES_DB !== 'undefined' && SPECIES_DB.length > 0) {
    // Find a simple bacterium species
    var playerSp = SPECIES_DB.find(function(s) { return s.cat === 'producer' && s.shape !== 'colony'; }) || SPECIES_DB[0];
    
    player = {
      x: 0, y: 20,  // near surface
      vx: 0, vy: 0,
      size: 4,
      energy: 80,
      hp: 100,
      mass: 2,
      age: 0,
      sp: playerSp,
      species: playerSp.name,
      state: 'idle',
      facing: 0,
      angle: 0,
      alive: true,
      divideTimer: 0,
      eats: 0,
      isPlayer: true
    };
    orgs.push(player);
    
    // Spawn ambient organisms
    for (var i = 0; i < 100; i++) {
      var sp = SPECIES_DB[Math.floor(Math.random() * Math.min(8, SPECIES_DB.length))];
      if (!sp || sp.shape === 'colony') continue;
      orgs.push({
        x: (Math.random() - 0.5) * 2000,
        y: Math.random() * 800 + 20,
        vx: 0, vy: 0,
        size: sp.size_min || 3 + Math.random() * 3,
        energy: 50 + Math.random() * 50,
        hp: 100,
        mass: 1 + Math.random() * 2,
        age: Math.random() * 30,
        sp: sp,
        species: sp.name,
        state: 'idle',
        facing: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        alive: true,
        divideTimer: Math.random() * 10,
        eats: 0,
        isPlayer: false
      });
    }
  }
  
  console.log('V3: spawned ' + orgs.length + ' organisms, player=' + (player ? player.species : 'none'));
}

// === GAME LOOP (WebGL) ===
function gameLoop3D(time) {
  if (!gl || !canvas3d) { requestAnimationFrame(gameLoop3D); return; }
  
  var dt = Math.min(0.05, (time - lastT) / 1000);
  lastT = time;
  fc++;
  gt += dt;
  
  // Update day/night
  tod += dt * 0.01;  // slow day cycle
  if (tod > 24) tod -= 24;
  var dayLight = Math.max(0, Math.sin((tod - 6) / 24 * Math.PI * 2));
  dayLight = Math.max(0.05, dayLight);  // never fully dark
  window.dayLight = dayLight;
  
  // V3: own world update (no V2 Canvas code)
  
  // Simple movement for organisms if V2 ai fails
  for (var i = 0; i < orgs.length; i++) {
    var o = orgs[i];
    if (!o || !o.alive) continue;
    
    // Brownian motion
    o.vx += (Math.random() - 0.5) * 0.5 * dt;
    o.vy += (Math.random() - 0.5) * 0.5 * dt;
    o.vx *= 0.95;
    o.vy *= 0.95;
    o.x += o.vx;
    o.y += o.vy;
    o.angle = Math.atan2(o.vy, o.vx);
    
    // Keep near viable depth
    if (o.y < 5) o.vy += 0.1;
    if (o.y > 900) o.vy -= 0.1;
  }
  
  // Player movement (WASD)
  if (player && player.alive) {
    var spd = 60;
    if (keys['w'] || keys['arrowup']) player.vy -= spd * dt;
    if (keys['s'] || keys['arrowdown']) player.vy += spd * dt;
    if (keys['a'] || keys['arrowleft']) player.vx -= spd * dt;
    if (keys['d'] || keys['arrowright']) player.vx += spd * dt;
    player.vx *= 0.9;
    player.vy *= 0.9;
    player.x += player.vx;
    player.y += player.vy;
    player.angle = Math.atan2(player.vy, player.vx);
    
    // Camera follow
    cam.x += (player.x - cam.x) * 0.05;
    cam.y += (player.y - cam.y) * 0.05;
  }
  
  // === RENDER ===
  // Clear
  gl.clearColor(0.1, 0.4, 0.35, 1.0);  // teal test
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  // Render water shader
  renderWaterGL(time / 1000, dayLight, cam.x, cam.y, zoom);
  
  // Update HUD
  if (fc % 30 === 0) {
    var hudSp = document.getElementById('hudSpecies');
    var hudEn = document.getElementById('hudEnergy');
    var hudPop = document.getElementById('hudPop');
    var hudFps = document.getElementById('hudFps');
    if (hudSp && player) hudSp.textContent = 'Вид: ' + (player.species || '?');
    if (hudEn && player) hudEn.textContent = 'Энергия: ' + Math.round(player.energy);
    if (hudPop) hudPop.textContent = 'Поп: ' + orgs.length;
    if (hudFps) hudFps.textContent = 'FPS: ' + Math.round(1 / dt);
  }
  
  requestAnimationFrame(gameLoop3D);
}

// === INPUT ===
window.addEventListener('keydown', function(e) {
  keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', function(e) {
  keys[e.key.toLowerCase()] = false;
});
window.addEventListener('resize', function() {
  resizeGL();
  cv.width = canvas3d.width;
  cv.height = canvas3d.height;
});

// Prevent context menu on canvas
window.addEventListener('contextmenu', function(e) { e.preventDefault(); });
