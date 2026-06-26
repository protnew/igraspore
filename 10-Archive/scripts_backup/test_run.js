
var window = { AudioContext: function(){}, webkitAudioContext: function(){}, addEventListener: function(){} };
var document = { 
  getElementById: function(id){ 
    return { 
      style: {}, 
      getContext: function(){ return { fillStyle:'', fillRect:()=>{}, beginPath:()=>{}, arc:()=>{}, fill:()=>{}, strokeStyle:'', stroke:()=>{}, moveTo:()=>{}, lineTo:()=>{}, save:()=>{}, restore:()=>{}, translate:()=>{}, rotate:()=>{}, font:'', fillText:()=>{}, drawImage:()=>{}, setTransform:()=>{} }; },
      width: 800, height: 600,
      addEventListener: function(){}
    }; 
  },
  createElement: function(tag){ return { style: {}, innerHTML: '', appendChild: function(){} }; },
  querySelector: function(){ return { innerHTML: '', appendChild: function(){} }; }
};
var requestAnimationFrame = function(cb){ setTimeout(cb, 16); };
var innerWidth = 800; var innerHeight = 600;

// ===== iGraSpore v1.0 — Single-file microorganism sim =====

// --- Constants ---
var CHUNK_SIZE = 512;
var GRID_CELL = 32;
var MAX_POP = 5000;
var SPAWN_INTERVAL = 5;
var MAX_ZOOM = 5, MIN_ZOOM = 0.5;
var FSM_STATES = ['idle','moving','feeding','dividing','cyst','dead'];
var TROPHIC = ['producer','consumer1','consumer2','consumer3','reducer'];
var TROPHIC_COLORS = {producer:'#2ecc71',consumer1:'#f39c12',consumer2:'#e74c3c',consumer3:'#9b59b6',reducer:'#636e72'};
var SHAPES = ['circle','rod','spiral','slipper','bell','star','irregular','filament'];

// --- Species Data: 100 real species ---
var SPECIES = [
// PRODUCERS (25) — cyanobacteria, green algae, diatoms, euglenoids
{n:'Synechocystis',lv:0,sz:3,sp:0.3,e:0.4,sh:'circle',c:'#0a6640',d:0},
{n:'Anabaena',lv:0,sz:4,sp:0.2,e:0.5,sh:'filament',c:'#0d7a4f',d:0},
{n:'Spirulina',lv:0,sz:5,sp:0.15,e:0.6,sh:'spiral',c:'#1a8c5e',d:0},
{n:'Nostoc',lv:0,sz:6,sp:0.1,e:0.5,sh:'irregular',c:'#0b5e3a',d:0},
{n:'Oscillatoria',lv:0,sz:5,sp:0.25,e:0.4,sh:'filament',c:'#147a50',d:0},
{n:'Microcystis',lv:0,sz:4,sp:0.2,e:0.5,sh:'irregular',c:'#1e8c62',d:0},
{n:'Chlamydomonas',lv:0,sz:3,sp:0.5,e:0.3,sh:'circle',c:'#27ae60',d:0},
{n:'Chlorella',lv:0,sz:2,sp:0.1,e:0.4,sh:'circle',c:'#2ecc71',d:0},
{n:'Volvox',lv:0,sz:8,sp:0.3,e:0.5,sh:'circle',c:'#55efc4',d:0},
{n:'Euglena',lv:0,sz:5,sp:0.6,e:0.4,sh:'slipper',c:'#00b894',d:0},
{n:'Scenedesmus',lv:0,sz:3,sp:0.15,e:0.35,sh:'rod',c:'#6ab04c',d:0},
{n:'Cladophora',lv:0,sz:10,sp:0.1,e:0.6,sh:'filament',c:'#badc58',d:0},
{n:'Spirogyra',lv:0,sz:7,sp:0.12,e:0.5,sh:'spiral',c:'#7bed9f',d:0},
{n:'Zygnema',lv:0,sz:5,sp:0.1,e:0.45,sh:'filament',c:'#2ed573',d:0},
{n:'Navicula',lv:0,sz:3,sp:0.2,e:0.3,sh:'rod',c:'#a3cb38',d:0},
{n:'Pinnularia',lv:0,sz:4,sp:0.15,e:0.35,sh:'rod',c:'#c7ecee',d:0},
{n:'Cymbella',lv:0,sz:3,sp:0.2,e:0.3,sh:'slipper',c:'#dfe6e9',d:0},
{n:'Gomphonema',lv:0,sz:3,sp:0.15,e:0.3,sh:'rod',c:'#b2bec3',d:0},
{n:'Fragilaria',lv:0,sz:4,sp:0.12,e:0.35,sh:'rod',c:'#636e72',d:0},
{n:'Asterionella',lv:0,sz:4,sp:0.1,e:0.3,sh:'star',c:'#dcdde1',d:0},
{n:'Tabellaria',lv:0,sz:5,sp:0.1,e:0.35,sh:'rod',c:'#f5f6fa',d:0},
{n:'Cosmarium',lv:0,sz:5,sp:0.12,e:0.4,sh:'irregular',c:'#7158e2',d:0},
{n:'Staurastrum',lv:0,sz:5,sp:0.1,e:0.4,sh:'star',c:'#3d3d3d',d:0},
{n:'Closterium',lv:0,sz:6,sp:0.1,e:0.4,sh:'rod',c:'#6ab04c',d:0},
{n:'Micrasterias',lv:0,sz:7,sp:0.08,e:0.5,sh:'star',c:'#78e08f',d:0},

// CONSUMERS I (20) — predatory bacteria, flagellates
{n:'Bdellovibrio',lv:1,sz:2,sp:1.2,e:0.6,sh:'rod',c:'#e17055',d:1},
{n:'Vampirococcus',lv:1,sz:2,sp:0.8,e:0.5,sh:'circle',c:'#d63031',d:1},
{n:'Myxococcus',lv:1,sz:3,sp:0.6,e:0.7,sh:'rod',c:'#e74c3c',d:1},
{n:'Monas',lv:1,sz:3,sp:0.9,e:0.4,sh:'circle',c:'#fd79a8',d:1},
{n:'Monosiga',lv:1,sz:3,sp:0.7,e:0.4,sh:'bell',c:'#fab1a0',d:1},
{n:'Salpingoeca',lv:1,sz:4,sp:0.5,e:0.5,sh:'bell',c:'#ff7675',d:1},
{n:'Bicosoeca',lv:1,sz:3,sp:0.6,e:0.4,sh:'bell',c:'#fdcb6e',d:1},
{n:'Pseudobodo',lv:1,sz:3,sp:0.8,e:0.4,sh:'slipper',c:'#f8a5c2',d:1},
{n:'Ochromonas',lv:1,sz:4,sp:0.7,e:0.5,sh:'circle',c:'#ffeaa7',d:1},
{n:'Dinobryon',lv:1,sz:4,sp:0.5,e:0.5,sh:'bell',c:'#fdcb6e',d:1},
{n:'Chromulina',lv:1,sz:3,sp:0.8,e:0.35,sh:'circle',c:'#f9ca24',d:1},
{n:'Mallomonas',lv:1,sz:4,sp:0.5,e:0.5,sh:'rod',c:'#f0932b',d:1},
{n:'Synura',lv:1,sz:4,sp:0.4,e:0.45,sh:'circle',c:'#ffbe76',d:1},
{n:'Peridinium',lv:1,sz:5,sp:0.6,e:0.6,sh:'circle',c:'#f6b93b',d:1},
{n:'Ceratium',lv:1,sz:6,sp:0.4,e:0.65,sh:'star',c:'#e58e26',d:1},
{n:'Gymnodinium',lv:1,sz:4,sp:0.7,e:0.5,sh:'circle',c:'#fa983a',d:1},
{n:'Heteronema',lv:1,sz:4,sp:0.6,e:0.45,sh:'slipper',c:'#f8c291',d:1},
{n:'Petalomonas',lv:1,sz:3,sp:0.7,e:0.4,sh:'slipper',c:'#e55039',d:1},
{n:'Peranema',lv:1,sz:4,sp:0.8,e:0.5,sh:'slipper',c:'#eb2f06',d:1},
{n:'Entosiphon',lv:1,sz:3,sp:0.6,e:0.4,sh:'slipper',c:'#b71540',d:1},

// CONSUMERS II (25) — ciliates, amoebas
{n:'Paramecium',lv:2,sz:8,sp:0.8,e:0.7,sh:'slipper',c:'#74b9ff',d:2},
{n:'Stentor',lv:2,sz:12,sp:0.3,e:0.8,sh:'bell',c:'#0984e3',d:2},
{n:'Vorticella',lv:2,sz:6,sp:0.1,e:0.6,sh:'bell',c:'#0652DD',d:2},
{n:'Didinium',lv:2,sz:7,sp:1.0,e:0.7,sh:'circle',c:'#6c5ce7',d:2},
{n:'Amoeba proteus',lv:2,sz:10,sp:0.4,e:0.8,sh:'irregular',c:'#a29bfe',d:2},
{n:'Arcella',lv:2,sz:7,sp:0.2,e:0.6,sh:'circle',c:'#dfe6e9',d:2},
{n:'Difflugia',lv:2,sz:8,sp:0.2,e:0.65,sh:'irregular',c:'#b2bec3',d:2},
{n:'Stylonychia',lv:2,sz:6,sp:0.9,e:0.6,sh:'slipper',c:'#55efc4',d:2},
{n:'Euplotes',lv:2,sz:5,sp:0.7,e:0.55,sh:'slipper',c:'#81ecec',d:2},
{n:'Tetrahymena',lv:2,sz:5,sp:0.8,e:0.5,sh:'slipper',c:'#00cec9',d:2},
{n:'Blepharisma',lv:2,sz:7,sp:0.5,e:0.6,sh:'slipper',c:'#fd79a8',d:2},
{n:'Spirostomum',lv:2,sz:14,sp:0.4,e:0.7,sh:'rod',c:'#e84393',d:2},
{n:'Loxodes',lv:2,sz:8,sp:0.3,e:0.6,sh:'slipper',c:'#a29bfe',d:2},
{n:'Coleps',lv:2,sz:5,sp:0.6,e:0.5,sh:'rod',c:'#dfe6e9',d:2},
{n:'Nassula',lv:2,sz:6,sp:0.5,e:0.55,sh:'slipper',c:'#ffeaa7',d:2},
{n:'Frontonia',lv:2,sz:9,sp:0.5,e:0.65,sh:'slipper',c:'#fab1a0',d:2},
{n:'Oxytricha',lv:2,sz:5,sp:0.8,e:0.5,sh:'slipper',c:'#fdcb6e',d:2},
{n:'Halteria',lv:2,sz:4,sp:1.2,e:0.4,sh:'circle',c:'#55efc4',d:2},
{n:'Cinetochilum',lv:2,sz:3,sp:0.9,e:0.4,sh:'circle',c:'#74b9ff',d:2},
{n:'Dileptus',lv:2,sz:10,sp:0.5,e:0.7,sh:'rod',c:'#e17055',d:2},
{n:'Lacrymaria',lv:2,sz:8,sp:0.6,e:0.6,sh:'rod',c:'#fd79a8',d:2},
{n:'Trachelius',lv:2,sz:7,sp:0.5,e:0.6,sh:'slipper',c:'#a29bfe',d:2},
{n:'Pelomyxa',lv:2,sz:15,sp:0.2,e:0.9,sh:'irregular',c:'#636e72',d:2},
{n:'Chaos',lv:2,sz:18,sp:0.3,e:0.95,sh:'irregular',c:'#2d3436',d:2},
{n:'Actinophrys',lv:2,sz:9,sp:0.3,e:0.7,sh:'star',c:'#ffeaa7',d:2},

// CONSUMERS III (15) — large protozoa, rotifers
{n:'Rotaria',lv:3,sz:10,sp:0.4,e:0.7,sh:'rod',c:'#a29bfe',d:3},
{n:'Brachionus',lv:3,sz:8,sp:0.5,e:0.6,sh:'circle',c:'#6c5ce7',d:3},
{n:'Asplanchna',lv:3,sz:10,sp:0.6,e:0.7,sh:'bell',c:'#e056fd',d:3},
{n:'Chaetonotus',lv:3,sz:4,sp:0.7,e:0.5,sh:'slipper',c:'#f8a5c2',d:3},
{n:'Macrostomum',lv:3,sz:8,sp:0.5,e:0.65,sh:'slipper',c:'#c44569',d:3},
{n:'Heliozoa',lv:3,sz:12,sp:0.15,e:0.75,sh:'star',c:'#f9ca24',d:3},
{n:'Daphnia',lv:3,sz:6,sp:0.6,e:0.6,sh:'slipper',c:'#e17055',d:3},
{n:'Cyclops',lv:3,sz:7,sp:0.7,e:0.65,sh:'rod',c:'#e74c3c',d:3},
{n:'Bdelloid rotifer',lv:3,sz:5,sp:0.5,e:0.5,sh:'rod',c:'#be2edd',d:3},
{n:'Colurella',lv:3,sz:4,sp:0.6,e:0.45,sh:'slipper',c:'#8854d0',d:3},
{n:'Keratella',lv:3,sz:5,sp:0.5,e:0.5,sh:'circle',c:'#3867d6',d:3},
{n:'Filinia',lv:3,sz:4,sp:0.4,e:0.45,sh:'circle',c:'#4b7bec',d:3},
{n:'Polyarthra',lv:3,sz:3,sp:0.8,e:0.4,sh:'star',c:'#45aaf2',d:3},
{n:'Synchaeta',lv:3,sz:5,sp:0.7,e:0.5,sh:'slipper',c:'#2d98da',d:3},
{n:'Trichocerca',lv:3,sz:6,sp:0.5,e:0.55,sh:'rod',c:'#0fb9b1',d:3},

// REDUCERS (15) — fungi, decomposer bacteria
{n:'Saccharomyces',lv:4,sz:4,sp:0.1,e:0.4,sh:'circle',c:'#dfe6e9',d:4},
{n:'Candida',lv:4,sz:3,sp:0.15,e:0.35,sh:'circle',c:'#ffeaa7',d:4},
{n:'Mucor',lv:4,sz:6,sp:0.08,e:0.5,sh:'filament',c:'#b2bec3',d:4},
{n:'Penicillium',lv:4,sz:5,sp:0.06,e:0.45,sh:'filament',c:'#74b9ff',d:4},
{n:'Aspergillus',lv:4,sz:5,sp:0.07,e:0.5,sh:'filament',c:'#a29bfe',d:4},
{n:'Rhizopus',lv:4,sz:7,sp:0.05,e:0.55,sh:'filament',c:'#636e72',d:4},
{n:'Bacillus subtilis',lv:4,sz:3,sp:0.3,e:0.3,sh:'rod',c:'#55efc4',d:4},
{n:'Pseudomonas',lv:4,sz:2,sp:0.4,e:0.3,sh:'rod',c:'#00cec9',d:4},
{n:'Thermus aquaticus',lv:4,sz:2,sp:0.2,e:0.35,sh:'rod',c:'#ff7675',d:4},
{n:'Streptomyces',lv:4,sz:4,sp:0.1,e:0.4,sh:'filament',c:'#fdcb6e',d:4},
{n:'Cellulomonas',lv:4,sz:2,sp:0.3,e:0.25,sh:'rod',c:'#badc58',d:4},
{n:'Cytophaga',lv:4,sz:3,sp:0.25,e:0.3,sh:'rod',c:'#6ab04c',d:4},
{n:'Saprolegnia',lv:4,sz:8,sp:0.05,e:0.5,sh:'filament',c:'#dfe6e9',d:4},
{n:'Trichoderma',lv:4,sz:5,sp:0.08,e:0.45,sh:'filament',c:'#78e08f',d:4},
{n:'Agaricus',lv:4,sz:6,sp:0.03,e:0.5,sh:'bell',c:'#f5f6fa',d:4}
];

// --- Globals ---
var canvas, ctx, mmCanvas, mmCtx;
var W, H;
var gameState = 'menu'; // menu, playing, paused, dead
var organisms = [];
var player = null;
var camera = {x:0, y:0, zoom:1};
var keys = {};
var mouse = {x:0, y:0};
var gameTime = 0;
var spawnTimer = 0;
var lastTime = 0;
var fpsArr = [];
var fpsTimer = 0;
var chunks = new Map();
var playerStats = {eaten:0, divided:0, score:0};
var spectatorMode = false;
var audioCtx = null;

function initAudio(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type){
  if(!audioCtx) return;
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  var now = audioCtx.currentTime;
  if(type === 'eat'){
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if(type === 'divide'){
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

// --- Utility ---
function rand(a,b){return a+Math.random()*(b-a)}
function randInt(a,b){return Math.floor(rand(a,b+1))}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v}
function lerp(a,b,t){return a+(b-a)*t}
function chunkKey(cx,cy){return cx+','+cy}

// --- Simple hash noise for world gen ---
function hash2d(x,y){
  var h=x*374761393+y*668265263;
  h=(h^(h>>13))*1274126177;
  return((h^(h>>16))&0x7fffffff)/0x7fffffff;
}
function smoothNoise(x,y){
  var ix=Math.floor(x),iy=Math.floor(y);
  var fx=x-ix,fy=y-iy;
  fx=fx*fx*(3-2*fx); fy=fy*fy*(3-2*fy);
  var a=hash2d(ix,iy),b=hash2d(ix+1,iy),c=hash2d(ix,iy+1),d=hash2d(ix+1,iy+1);
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;
}


// ===== CHUNK SYSTEM =====
// Chunks: 512x512, LRU cache 9x9 visible area
// Each chunk: {cx,cy,light,temp,pH,O2,nutrients,generated}

function getChunk(cx,cy){
  var k=chunkKey(cx,cy);
  if(!chunks.has(k)) chunks.set(k, generateChunk(cx,cy));
  return chunks.get(k);
}

function generateChunk(cx,cy){
  var ch={cx:cx,cy:cy,light:0,temp:0,pH:0,O2:0,nutrients:0,generated:true};
  // World coords for noise
  var wx=cx*CHUNK_SIZE, wy=cy*CHUNK_SIZE;
  // Light: day/night cycle based on gameTime
  ch.light = 0.5; // base, updated dynamically
  // Temperature: 15-30°C, noise-based
  ch.temp = 15 + smoothNoise(wx*0.001,wy*0.001)*15;
  // pH: 5.0-9.0, smooth noise
  ch.pH = 5.0 + smoothNoise(wx*0.002+100,wy*0.002+100)*4.0;
  // O2: global for MVP, 40-100%
  ch.O2 = 60 + smoothNoise(wx*0.0005,wy*0.0005)*40;
  // Nutrients: 0-100, noisy
  ch.nutrients = 20 + smoothNoise(wx*0.003,wy*0.003)*60;
  // Organic matter deposits
  ch.organic = [];
  return ch;
}

function getEnvAt(x,y){
  var cx=Math.floor(x/CHUNK_SIZE), cy=Math.floor(y/CHUNK_SIZE);
  var ch=getChunk(cx,cy);
  return {light:getDayLight(), temp:ch.temp, pH:ch.pH, O2:ch.O2, nutrients:ch.nutrients};
}

function getDayLight(){
  return 0.5 + 0.5*Math.sin(gameTime*0.05); // cycle ~2 min
}

// Evict far chunks (keep 9x9 around camera)
function evictChunks(){
  var ccx=Math.floor(camera.x/CHUNK_SIZE), ccy=Math.floor(camera.y/CHUNK_SIZE);
  chunks.forEach(function(ch, k) {
    var p=k.split(','), cx=parseInt(p[0]), cy=parseInt(p[1]);
    if(Math.abs(cx-ccx)>6 || Math.abs(cy-ccy)>6) chunks.delete(k);
  });
}

// ===== SPATIAL HASH =====
var spatialGrid = {};
var SPATIAL_CELL = 64;

function spatialKey(x,y){return Math.floor(x/SPATIAL_CELL)+','+Math.floor(y/SPATIAL_CELL)}

function spatialClear(){spatialGrid={}}

function spatialInsert(org){
  var k=spatialKey(org.x,org.y);
  if(!spatialGrid[k]) spatialGrid[k]=[];
  spatialGrid[k].push(org);
}

function spatialQuery(x,y,radius){
  var results=[];
  var cr=Math.ceil(radius/SPATIAL_CELL);
  var cx=Math.floor(x/SPATIAL_CELL), cy=Math.floor(y/SPATIAL_CELL);
  for(var dx=-cr;dx<=cr;dx++){
    for(var dy=-cr;dy<=cr;dy++){
      var k=(cx+dx)+','+(cy+dy);
      var cell=spatialGrid[k];
      if(cell){
        for(var i=0;i<cell.length;i++){
          var o=cell[i];
          if(o.state!=='dead' && dist({x:x,y:y},o)<=radius) results.push(o);
        }
      }
    }
  }
  return results;
}


// ===== ORGANISM =====
function createOrganism(specIdx,x,y,isPlayer){
  var sp=SPECIES[specIdx];
  return {
    x:x, y:y, vx:0, vy:0,
    species:specIdx,
    size:sp.sz, speed:sp.sp, energy:sp.e*100,
    maxEnergy:100, age:0,
    state:'idle', stateTimer:0,
    isPlayer:!!isPlayer,
    target:null, // for feeding
    divideCooldown:0,
    flash:0 // visual flash on eat/divide
  };
}

// ===== FSM AI =====
function updateAI(org,dt){
  if(org.isPlayer) return; // player controls self
  if(org.state==='dead'){
    org.size -= dt * 0.2; // slow decompose
    org.y += dt * 5; // sink down
    if(org.size <= 0.2) org.markedForDelete = true;
    return;
  }

  var sp=SPECIES[org.species];
  org.age += dt;
  org.divideCooldown = Math.max(0, org.divideCooldown-dt);
  org.flash = Math.max(0, org.flash-dt*3);

  var env = getEnvAt(org.x, org.y);
  var tempDiff = Math.abs(env.temp - sp.optT);
  var badEnvCost = tempDiff > 3 ? (tempDiff - 3)*0.01 : 0;
  // Energy drain
  var drain = 0.5 * dt; // base drain
  if(org.state==='moving') drain = 1.0*dt;
  if(org.state==='cyst') drain = 0.1*dt;
  org.energy -= (drain + badEnvCost * dt);

  // Death check
  if(org.energy<=0){
    org.state='dead';
    return;
  }

  // Producers: photosynthesis when idle
  if(sp.lv===0 && (org.state==='idle' || org.state==='cyst')){
    var env=getEnvAt(org.x,org.y);
    org.energy += env.light * 2 * dt;
  }

  // Reducers: decompose nearby dead organisms
  if(sp.lv===4){
    for(var i=0;i<organisms.length;i++){
      var om=organisms[i];
      if(om.state==='dead' && dist(org,om)<org.size*3){
        org.energy += Math.min(om.size, 3*dt);
        om.size -= 3*dt;
        if(om.size<=0.2) om.markedForDelete = true;
      }
    }
  }

  // FSM transitions
  switch(org.state){
    case 'idle':
      org.stateTimer -= dt;
      if(org.stateTimer<=0){
        // Decide next action
        if(org.energy>80 && org.divideCooldown<=0 && org.age>3){
          org.state='dividing';
          org.stateTimer=1.0;
        } else {
          // Look for food
          var nearby=spatialQuery(org.x,org.y,org.size*8);
          var prey=null;
          for(var i=0;i<nearby.length;i++){
            var n=nearby[i];
            if(n===org) continue;
            var nsp=SPECIES[n.species];
            // Can eat? Must be smaller by 20%+ and different trophic level
            if(canEat(org,n) && (!prey || dist(org,n)<dist(org,prey))){
              prey=n;
            }
          }
          if(prey){
            org.target=prey;
            org.state='feeding';
            org.stateTimer=3.0;
          } else {
            // Wander
            org.state='moving';
            var angle=rand(0,Math.PI*2);
            org.vx=Math.cos(angle)*sp.sp*60;
            org.vy=Math.sin(angle)*sp.sp*60;
            org.stateTimer=rand(1,4);
          }
        }
      }
      // Brownian jitter
      org.vx+=rand(-1,1)*dt*10;
      org.vy+=rand(-1,1)*dt*10;
      break;

    case 'moving':
      org.stateTimer -= dt;
      org.x += org.vx*dt;
      org.y += org.vy*dt;
      // Friction
      org.vx *= 0.95;
      org.vy *= 0.95;
      if(org.stateTimer<=0 || org.energy<30){
        org.state='idle';
        org.stateTimer=rand(1,3);
        org.vx=0; org.vy=0;
      }
      break;

    case 'feeding':
      org.stateTimer -= dt;
      if(org.target && org.target.state!=='dead'){
        // Move toward prey
        var dx=org.target.x-org.x, dy=org.target.y-org.y;
        var d=Math.hypot(dx,dy);
        if(d>0){
          org.vx=(dx/d)*sp.sp*100;
          org.vy=(dy/d)*sp.sp*100;
        }
        org.x+=org.vx*dt;
        org.y+=org.vy*dt;
        // Eat if close enough
        if(d < org.size+org.target.size){
          if(canEat(org,org.target)){
            org.energy = Math.min(org.maxEnergy, org.energy+org.target.size*5);
            org.target.state='dead';
            org.target.size = org.target.size * 0.5; // leaving a carcass
            org.flash=1;
            playSound('eat');
            org.target=null;
            org.state='idle';
            org.stateTimer=rand(1,2);
          }
        }
      } else {
        org.state='idle';
        org.stateTimer=rand(1,2);
      }
      break;

    case 'dividing':
      org.stateTimer -= dt;
      if(org.stateTimer<=0){
        // Spawn offspring
        var offset=org.size*2;
        var nx=org.x+rand(-offset,offset);
        var ny=org.y+rand(-offset,offset);
        var child=createOrganism(org.species,nx,ny,false);
        child.energy=org.energy*0.4;
        child.size=org.size*0.8;
        organisms.push(child);
        org.energy*=0.4;
        org.divideCooldown=8;
        playSound('divide');
        org.flash=1;
        org.state='idle';
        org.stateTimer=rand(2,4);
      }
      break;

    case 'cyst':
      org.stateTimer -= dt;
      if(org.stateTimer<=0 || org.energy>60){
        org.state='idle';
        org.stateTimer=rand(1,2);
      }
      break;
  }

  // Cyst trigger: bad conditions
  if(org.state!=='cyst' && org.energy<20){
    org.state='cyst';
    org.stateTimer=rand(5,15);
    org.vx=0; org.vy=0;
  }

  // Clamp energy
  org.energy = clamp(org.energy,0,org.maxEnergy);
}

function canEat(predator,prey){
  if(prey===predator) return false;
  if(prey.state==='dead') return false;
  var psp=SPECIES[predator.species], prsp=SPECIES[prey.species];
  // Player can eat anything smaller (regardless of trophic level)
  if(predator.isPlayer){
    return predator.size >= prey.size*1.2;
  }
  // AI: producers don't eat, reducers don't eat organisms
  if(psp.lv===0) return false;
  if(psp.lv===4) return false;
  // Must be >=20% larger
  if(predator.size < prey.size*1.2) return false;
  // Consumers eat lower or same trophic level
  return prsp.lv <= psp.lv;
}


// ===== POPULATION MANAGEMENT =====
function getPopulationByLevel(lv){
  var count=0;
  for(var i=0;i<organisms.length;i++){
    if(organisms[i].state!=='dead' && SPECIES[organisms[i].species].lv===lv) count++;
  }
  return count;
}

function spawnBatch(){
  if(organisms.length>=MAX_POP) return;
  var targets=[25,20,25,15,15]; // target per trophic level
  for(var lv=0;lv<5;lv++){
    var cur=getPopulationByLevel(lv);
    var deficit=targets[lv]-cur;
    if(deficit<=0) continue;
    var toSpawn=Math.min(deficit, 5); // max 5 per batch per level
    var candidates=[];
    for(var i=0;i<SPECIES.length;i++){
      if(SPECIES[i].lv===lv) candidates.push(i);
    }
    for(var s=0;s<toSpawn;s++){
      var spIdx=candidates[randInt(0,candidates.length-1)];
      // Spawn near camera but not on top
      var angle=rand(0,Math.PI*2);
      var dist2=rand(200,800);
      var sx=camera.x+Math.cos(angle)*dist2;
      var sy=camera.y+Math.sin(angle)*dist2;
      organisms.push(createOrganism(spIdx,sx,sy,false));
    }
  }
}

// ===== PLAYER UPDATE =====
var EVOLUTION_CHAIN = [25,43,47,71]; // Bdellovibrio→Paramecium→Amoeba→Actinophrys
var evolutionIndex = 0;

function updatePlayer(dt){
  if(!player || player.state==='dead') return;

  var sp=SPECIES[player.species];
  player.age += dt;
  player.divideCooldown = Math.max(0, player.divideCooldown-dt);
  player.flash = Math.max(0, player.flash-dt*3);

  // Movement
  var mx=0, my=0;
  if(keys['KeyW']||keys['ArrowUp']) my=-1;
  if(keys['KeyS']||keys['ArrowDown']) my=1;
  if(keys['KeyA']||keys['ArrowLeft']) mx=-1;
  if(keys['KeyD']||keys['ArrowRight']) mx=1;

  var dashing = keys['Space'];
  var speedMul = dashing ? 3 : 1;
  var energyCost = dashing ? 3*dt : 0.5*dt;

  if(mx!==0 || my!==0){
    var len=Math.hypot(mx,my);
    player.vx = (mx/len)*sp.sp*80*speedMul;
    player.vy = (my/len)*sp.sp*80*speedMul;
    player.state='moving';
  } else {
    player.vx *= 0.85;
    player.vy *= 0.85;
    if(Math.abs(player.vx)<0.5 && Math.abs(player.vy)<0.5){
      player.state='idle';
    }
  }

  player.x += player.vx*dt;
  player.y += player.vy*dt;

  // Energy drain
  var sp = SPECIES[player.species];
  var env = getEnvAt(player.x, player.y);
  var tempDiff = Math.abs(env.temp - sp.optT);
  var badEnvCost = tempDiff > 3 ? (tempDiff - 3)*0.01 : 0;
  player.energy -= (energyCost + badEnvCost * dt);

  // Photosynthesis for producers
  if(sp.lv===0 && player.state==='idle'){
    player.energy += getDayLight()*3*dt;
  }

  // Face mouse
  // (mouse coords are screen, convert to world)
  var wmx = (mouse.x - W/2)/camera.zoom + camera.x;
  var wmy = (mouse.y - H/2)/camera.zoom + camera.y;
  player.angle = Math.atan2(wmy-player.y, wmx-player.x);

  // Eat (E key)
  if(keys['KeyE']){
    var nearby=spatialQuery(player.x,player.y,player.size*4);
    for(var i=0;i<nearby.length;i++){
      var n=nearby[i];
      if(n!==player && n.state!=='dead' && canEat(player,n)){
        player.energy = Math.min(player.maxEnergy, player.energy+n.size*5);
        n.state='dead';
        n.size = n.size * 0.5; // leaving a carcass
        player.flash=1;
        playSound('eat');
        playerStats.eaten++;
        playerStats.score += Math.floor(n.size*10);
        keys['KeyE']=false; // one eat per press
        break;
      }
    }
  }

  // Divide (Q key)
  if(keys['KeyQ'] && player.energy>80 && player.divideCooldown<=0 && player.age>3){
    var offset=player.size*2;
    var nx=player.x+rand(-offset,offset);
    var ny=player.y+rand(-offset,offset);
    var child=createOrganism(player.species,nx,ny,false);
    child.energy=player.energy*0.3;
    organisms.push(child);
    player.energy*=0.4;
    player.divideCooldown=8;
    playSound('divide');
    player.flash=1;
    playerStats.divided++;
    keys['KeyQ']=false;
  }

  // Cyst (R key)
  if(keys['KeyR'] && player.state!=='cyst'){
    player.state='cyst';
    player.stateTimer=5;
    player.vx=0; player.vy=0;
    keys['KeyR']=false;
  }
  if(player.state==='cyst'){
    player.stateTimer-=dt;
    player.energy-=0.1*dt;
    if(player.stateTimer<=0 || player.energy>60){
      player.state='idle';
    }
  }

  // Death
  if(player.energy<=0){
    player.state='dead';
    gameState='dead';
    document.getElementById('d-species').textContent='Species: '+sp.n;
    document.getElementById('d-age').textContent='Age: '+player.age.toFixed(1)+'s';
    document.getElementById('d-eaten').textContent='Organisms eaten: '+playerStats.eaten;
    document.getElementById('d-score').textContent='Score: '+playerStats.score;
    document.getElementById('death-screen').style.display='flex';
    return;
  }

  // Evolution check
  checkEvolution();
  player.energy = clamp(player.energy,0,player.maxEnergy);
}

function checkEvolution(){
  if(evolutionIndex>=EVOLUTION_CHAIN.length-1) return;
  // Evolve after eating enough and surviving long enough
  var threshold = (evolutionIndex+1)*5; // 5,10,15 eaten to evolve
  if(playerStats.eaten >= threshold && player.energy > 70){
    evolutionIndex++;
    var newSpecies = EVOLUTION_CHAIN[evolutionIndex];
    player.species = newSpecies;
    player.size = SPECIES[newSpecies].sz;
    player.speed = SPECIES[newSpecies].sp;
    player.energy = player.maxEnergy;
    player.flash = 2;
    playerStats.score += 500;
  }
}


// ===== CAMERA =====
function updateCamera(dt){
  if(spectatorMode) {
    document.getElementById('h-species').textContent = 'AI Spectator';
    return;
  }
  if(!player) return;
  var tx=player.x, ty=player.y;
  camera.x=lerp(camera.x,tx,3*dt);
  camera.y=lerp(camera.y,ty,3*dt);
}

function worldToScreen(wx,wy){
  return {
    x:(wx-camera.x)*camera.zoom+W/2,
    y:(wy-camera.y)*camera.zoom+H/2
  };
}

function isOnScreen(wx,wy,margin){
  var s=worldToScreen(wx,wy);
  return s.x>-margin && s.x<W+margin && s.y>-margin && s.y<H+margin;
}

// ===== RENDERING =====
function drawBackground(){
  // Water background with depth gradient
  ctx.fillStyle='#0a1628';
  ctx.fillRect(0,0,W,H);

  // Draw visible chunks as subtle grid
  var cz=CHUNK_SIZE*camera.zoom;
  var startCX=Math.floor((camera.x-W/2/camera.zoom)/CHUNK_SIZE);
  var endCX=Math.floor((camera.x+W/2/camera.zoom)/CHUNK_SIZE);
  var startCY=Math.floor((camera.y-H/2/camera.zoom)/CHUNK_SIZE);
  var endCY=Math.floor((camera.y+H/2/camera.zoom)/CHUNK_SIZE);

  for(var cx=startCX;cx<=endCX;cx++){
    for(var cy=startCY;cy<=endCY;cy++){
      var ch=getChunk(cx,cy);
      var s=worldToScreen(cx*CHUNK_SIZE,cy*CHUNK_SIZE);
      // Depth darkening based on noise
      var depth=smoothNoise(cx*0.5+100,cy*0.5+100);
      var brightness=8+depth*12;
      ctx.fillStyle='rgb('+brightness+','+Math.floor(brightness*1.3)+','+Math.floor(brightness*2)+')';
      ctx.fillRect(s.x,s.y,cz+1,cz+1);
      // Grid lines
      ctx.strokeStyle='rgba(30,50,80,0.3)';
      ctx.lineWidth=0.5;
      ctx.strokeRect(s.x,s.y,cz,cz);
    }
  }

  // Light overlay (day/night)
  var light=getDayLight();
  ctx.fillStyle='rgba(100,180,255,'+light*0.05+')';
  ctx.fillRect(0,0,W,H);
}

function drawOrganismShape(org){
  var sp=SPECIES[org.species];
  var s=worldToScreen(org.x,org.y);
  var sz=org.size*camera.zoom;
  if(sz<0.5) return; // too small

  ctx.save();
  ctx.translate(s.x,s.y);
  if(org.angle!==undefined) ctx.rotate(org.angle);

  // Flash effect
  if(org.flash>0){
    ctx.globalAlpha=0.5+org.flash*0.5;
    ctx.shadowColor='#fff';
    ctx.shadowBlur=org.flash*10;
  }

  // Player glow
  if(org.isPlayer){
    ctx.shadowColor='#48dbfb';
    ctx.shadowBlur=8;
  }

  ctx.fillStyle=org.state==='dead' ? 'rgba(139,119,101,0.5)' : sp.c;
  ctx.strokeStyle=org.isPlayer?'#48dbfb':'rgba(255,255,255,0.3)';
  ctx.lineWidth=org.isPlayer?2:0.5;

  switch(sp.sh){
    case 'circle':
      ctx.beginPath();
      ctx.arc(0,0,sz,0,Math.PI*2);
      ctx.fill();
      ctx.stroke();
      break;
    case 'rod':
      ctx.beginPath();
      ctx.ellipse(0,0,sz*1.5,sz*0.5,0,0,Math.PI*2);
      ctx.fill();
      ctx.stroke();
      break;
    case 'spiral':
      ctx.beginPath();
      for(var t=0;t<Math.PI*4;t+=0.2){
        var r2=t*sz*0.15;
        ctx.lineTo(Math.cos(t)*r2,Math.sin(t)*r2);
      }
      ctx.strokeStyle=sp.c;
      ctx.lineWidth=sz*0.3;
      ctx.stroke();
      break;
    case 'slipper':
      ctx.beginPath();
      ctx.ellipse(0,0,sz*1.2,sz*0.6,0,0,Math.PI*2);
      ctx.fill();
      ctx.stroke();
      // Notch
      ctx.beginPath();
      ctx.arc(sz*0.8,0,sz*0.3,Math.PI*0.5,Math.PI*1.5);
      ctx.fillStyle='rgba(0,0,0,0.3)';
      ctx.fill();
      break;
    case 'bell':
      ctx.beginPath();
      ctx.arc(0,sz*0.3,sz,Math.PI,0);
      ctx.lineTo(0,sz);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case 'star':
      ctx.beginPath();
      for(var i=0;i<8;i++){
        var a=i*Math.PI/4;
        var r3=i%2===0?sz*1.2:sz*0.4;
        if(i===0) ctx.moveTo(Math.cos(a)*r3,Math.sin(a)*r3);
        else ctx.lineTo(Math.cos(a)*r3,Math.sin(a)*r3);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case 'irregular':
      ctx.beginPath();
      ctx.moveTo(-sz,sz*0.3);
      ctx.lineTo(-sz*0.5,-sz*0.8);
      ctx.lineTo(sz*0.3,-sz);
      ctx.lineTo(sz,sz*0.2);
      ctx.lineTo(sz*0.5,sz);
      ctx.lineTo(-sz*0.3,sz*0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case 'filament':
      ctx.beginPath();
      ctx.moveTo(-sz*2,0);
      for(var t=-sz*2;t<=sz*2;t+=2){
        ctx.lineTo(t,Math.sin(t*0.3)*sz*0.3);
      }
      ctx.strokeStyle=sp.c;
      ctx.lineWidth=sz*0.4;
      ctx.stroke();
      break;
  }

  // Energy bar (small, above organism)
  if(sz>3){
    var bw=sz*2, bh=2;
    ctx.fillStyle='rgba(0,0,0,0.5)';
    ctx.fillRect(-bw/2,-sz-5,bw,bh);
    ctx.fillStyle=org.energy>50?'#2ecc71':org.energy>20?'#f39c12':'#e74c3c';
    ctx.fillRect(-bw/2,-sz-5,bw*(org.energy/org.maxEnergy),bh);
  }

  ctx.restore();
}

function render(){
  drawBackground();

  // Draw organisms (sorted by Y for pseudo-depth)
  var sorted=organisms.filter(function(o){return isOnScreen(o.x,o.y,50)});
  sorted.sort(function(a,b){return a.y-b.y});
  for(var i=0;i<sorted.length;i++){
    drawOrganismShape(sorted[i]);
  }

  // Death screen organisms fade
  if(gameState==='dead'){
    ctx.fillStyle='rgba(255,100,100,0.1)';
    ctx.fillRect(0,0,W,H);
  }
}

// ===== MINIMAP =====
function drawMinimap(){
  mmCtx.fillStyle='#0a0e14';
  mmCtx.fillRect(0,0,150,150);

  var scale=0.05; // world units per pixel
  for(var i=0;i<organisms.length;i++){
    var o=organisms[i];
    if(o.state==='dead') continue;
    var mx=75+(o.x-camera.x)*scale;
    var my=75+(o.y-camera.y)*scale;
    if(mx<0||mx>150||my<0||my>150) continue;
    mmCtx.fillStyle=TROPHIC_COLORS[TROPHIC[SPECIES[o.species].lv]];
    mmCtx.fillRect(mx,my,2,2);
  }

  // Player indicator
  if(player && player.state!=='dead'){
    tx=player.x; ty=player.y;
  } else if (spectatorMode && organisms.length > 0) {
    var largest = organisms[0];
    for(var i=1; i<organisms.length; i++) {
      if(organisms[i].state!=='dead' && organisms[i].size > largest.size) largest = organisms[i];
    }
    if(largest) { tx = largest.x; ty = largest.y; }
  }
  if(false){
    mmCtx.fillStyle='#48dbfb';
    mmCtx.fillRect(73,73,4,4);
  }

  // Border
  mmCtx.strokeStyle='#2d3436';
  mmCtx.lineWidth=1;
  mmCtx.strokeRect(0,0,150,150);
}


// ===== HUD =====
function updateHUD(){
  if(!player) return;
  var sp=SPECIES[player.species];
  document.getElementById('h-energy').textContent=Math.floor(player.energy);
  document.getElementById('h-size').textContent=player.size.toFixed(1);
  document.getElementById('h-species').textContent=sp.n;
  document.getElementById('h-age').textContent=player.age.toFixed(1)+'s';
  var env = getEnvAt(player.x, player.y);
  document.getElementById('h-temp').textContent=Math.floor(env.temp);
  var alive=0;
  for(var i=0;i<organisms.length;i++) if(organisms[i].state!=='dead') alive++;
  document.getElementById('h-pop').textContent=alive;
}

// ===== SPECIES TABLE =====
window.currentFilter = 'all';
window.filterSpecies = function(f){
  window.currentFilter = f;
  buildSpeciesTable();
};

function buildSpeciesTable(){
  var tbody=document.querySelector('#sp-table tbody');
  tbody.innerHTML='';
  for(var i=0;i<SPECIES.length;i++){
    var sp=SPECIES[i];
    var trph = TROPHIC[sp.lv];
    if(window.currentFilter !== 'all' && trph !== window.currentFilter) continue;
    var tr=document.createElement('tr');
    if(player && player.species===i) tr.style.background='rgba(72,219,251,0.2)';
    tr.innerHTML='<td style="color:'+sp.c+'">'+sp.n+'</td><td>'+trph+'</td><td>'+sp.sz+' мкм</td><td>'+sp.sp+'</td><td>'+sp.optT+' °C</td>';
    tbody.appendChild(tr);
  }
}

// ===== INPUT =====
function setupInput(){
  window.addEventListener('keydown',function(e){
    keys[e.code]=true;
    if(e.code==='Tab'){
      e.preventDefault();
      var modal=document.getElementById('species-modal');
      modal.style.display=modal.style.display==='block'?'none':'block';
    }
    if(e.code==='Space') e.preventDefault();
  });
  window.addEventListener('keyup',function(e){keys[e.code]=false});
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY});

  canvas.addEventListener('wheel',function(e){
    e.preventDefault();
    camera.zoom *= e.deltaY<0?1.1:0.9;
    camera.zoom = clamp(camera.zoom,MIN_ZOOM,MAX_ZOOM);
  },{passive:false});

  // Touch controls for mobile
  var touchId=null, touchStart={x:0,y:0};
  canvas.addEventListener('touchstart',function(e){
    e.preventDefault();
    var t=e.touches[0];
    touchId=t.identifier;
    touchStart={x:t.clientX,y:t.clientY};
    mouse.x=t.clientX; mouse.y=t.clientY;
  });
  canvas.addEventListener('touchmove',function(e){
    e.preventDefault();
    var t=e.touches[0];
    if(t.identifier===touchId){
      var dx=t.clientX-touchStart.x, dy=t.clientY-touchStart.y;
      if(player && player.state!=='cyst'){
        var sp=SPECIES[player.species];
        player.vx=(dx/50)*sp.sp*80;
        player.vy=(dy/50)*sp.sp*80;
        player.state='moving';
      }
    }
    mouse.x=t.clientX; mouse.y=t.clientY;
  });
  canvas.addEventListener('touchend',function(e){
    if(player && player.state!=='cyst'){player.vx=0;player.vy=0;player.state='idle'}
  });

  if('ontouchstart' in window) {
    document.getElementById('mobile-controls').style.display='block';
    document.getElementById('btn-dash').addEventListener('touchstart', function(e){ e.preventDefault(); keys['Space']=true; });
    document.getElementById('btn-dash').addEventListener('touchend', function(e){ e.preventDefault(); keys['Space']=false; });
    document.getElementById('btn-eat').addEventListener('touchstart', function(e){ e.preventDefault(); keys['KeyE']=true; });
    document.getElementById('btn-eat').addEventListener('touchend', function(e){ e.preventDefault(); keys['KeyE']=false; });
    document.getElementById('btn-div').addEventListener('touchstart', function(e){ e.preventDefault(); keys['KeyQ']=true; });
    document.getElementById('btn-div').addEventListener('touchend', function(e){ e.preventDefault(); keys['KeyQ']=false; });
    document.getElementById('btn-cyst').addEventListener('touchstart', function(e){ e.preventDefault(); keys['KeyR']=true; });
    document.getElementById('btn-cyst').addEventListener('touchend', function(e){ e.preventDefault(); keys['KeyR']=false; });
  }
}

// ===== SAVE / LOAD =====
function saveGame(){
  if(!player) return;
  var data={
    player:{x:player.x,y:player.y,species:player.species,energy:player.energy,
            age:player.age,size:player.size,evolutionIndex:evolutionIndex},
    stats:playerStats,
    gameTime:gameTime,
    organisms:[]
  };
  // Save nearest 200 organisms
  var sorted=organisms.filter(function(o){return !o.isPlayer});
  sorted.sort(function(a,b){return dist(player,a)-dist(player,b)});
  for(var i=0;i<Math.min(200,sorted.length);i++){
    var o=sorted[i];
    data.organisms.push({x:o.x,y:o.y,species:o.species,energy:o.energy,age:o.age,size:o.size});
  }
  try{localStorage.setItem('igraspore_save',JSON.stringify(data))}catch(e){}
}

function loadGame(){
  try{
    var raw=localStorage.getItem('igraspore_save');
    if(!raw) return false;
    var data=JSON.parse(raw);
    gameTime=data.gameTime;
    playerStats=data.stats;
    evolutionIndex=data.player.evolutionIndex;
    player=createOrganism(data.player.species,data.player.x,data.player.y,true);
    player.energy=data.player.energy;
    player.age=data.player.age;
    player.size=data.player.size;
    organisms=[player];
    for(var i=0;i<data.organisms.length;i++){
      var d=data.organisms[i];
      var o=createOrganism(d.species,d.x,d.y,false);
      o.energy=d.energy;o.age=d.age;o.size=d.size;
      organisms.push(o);
    }
    camera.x=player.x; camera.y=player.y;
    return true;
  }catch(e){return false}
}

// ===== GAME LOOP =====
function gameLoop(timestamp){
  if(!lastTime) lastTime=timestamp;
  var dt=Math.min((timestamp-lastTime)/1000, 0.05); // cap at 50ms
  lastTime=timestamp;

  // FPS counter
  fpsArr.push(1/dt);
  if(fpsArr.length>30) fpsArr.shift();
  var avgFps=fpsArr.reduce(function(a,b){return a+b},0)/fpsArr.length;
  fpsTimer += dt;
  if(fpsTimer >= 0.5){
    document.getElementById('h-fps').textContent=Math.floor(avgFps);
    fpsTimer = 0;
  }

  if(gameState==='playing'){
    gameTime += dt;
    spawnTimer += dt;

    // Rebuild spatial hash
    spatialClear();
    for(var i=0;i<organisms.length;i++){
      if(organisms[i].state!=='dead') spatialInsert(organisms[i]);
    }

    // Update AI
    for(var i=0;i<organisms.length;i++){
      updateAI(organisms[i],dt);
    }

    // Update player
    updatePlayer(dt);

    // Spawn batch
    if(spawnTimer>=SPAWN_INTERVAL){
      spawnTimer=0;
      spawnBatch();
    }

    // Clean marked organisms immediately
    organisms=organisms.filter(function(o){return !o.markedForDelete});

    updateCamera(dt);
    evictChunks();
    updateHUD();

    // Auto-save every 30s
    if(Math.floor(gameTime)%30===0 && Math.floor(gameTime)>0){
      saveGame();
    }
  }

  render();

  if(gameState==='playing'){
    drawMinimap();
  }

  requestAnimationFrame(gameLoop);
}

// ===== INIT =====

function startSpectator(){
  spectatorMode = true;
  initAudio();
  startGame();
}

function startGame(){
  initAudio();
  for(var i=0; i<SPECIES.length; i++){
    if(!SPECIES[i].optT) SPECIES[i].optT = 15 + (i % 16);
  }
  document.getElementById('menu-screen').style.display='none';
  document.getElementById('death-screen').style.display='none';
  gameState='playing';
  buildSpeciesTable();

  // Try load
  if(!loadGame()){
    // Start fresh
    organisms=[];
    chunks=new Map();
    playerStats={eaten:0,divided:0,score:0};
    gameTime=0; spawnTimer=0;
    evolutionIndex=0;

    if(!spectatorMode){
      // Player starts as Chlamydomonas
      player=createOrganism(EVOLUTION_CHAIN[0],0,0,true);
      organisms.push(player);
    }
    camera.x=0; camera.y=0;

    // Initial population
    for(var lv=0;lv<5;lv++){
      var count=[15,12,15,8,10][lv];
      var candidates=[];
      for(var i=0;i<SPECIES.length;i++) if(SPECIES[i].lv===lv) candidates.push(i);
      for(var s=0;s<count;s++){
        var spIdx=candidates[randInt(0,candidates.length-1)];
        var angle=rand(0,Math.PI*2);
        var d2=rand(50,600);
        organisms.push(createOrganism(spIdx,Math.cos(angle)*d2,Math.sin(angle)*d2,false));
      }
    }
  }
}

function restartGame(){
  localStorage.removeItem('igraspore_save');
  startGame();
}

function init(){
  canvas=document.getElementById('c');
  ctx=canvas.getContext('2d');
  mmCanvas=document.getElementById('mm');
  mmCtx=mmCanvas.getContext('2d');

  function resize(){
    W=window.innerWidth; H=window.innerHeight;
    var dpr = window.devicePixelRatio || 1;
    canvas.width=W*dpr; canvas.height=H*dpr;
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize',resize);

  setupInput();
  buildSpeciesTable();
  requestAnimationFrame(gameLoop);
}

init();

console.log('Mock setup done.');
try {
  startGame();
  for(let i=0; i<100; i++){
    var dt = 0.016;
    if(organisms.length > 0) updateAI(organisms[0], dt);
    if(player) updatePlayer(dt);
    updateCamera(dt);
  }
  console.log('Test passed: 100 frames simulated without crash.');
} catch(e) {
  console.error('Test failed:', e);
  process.exit(1);
}
