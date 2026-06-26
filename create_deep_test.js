const fs = require('fs');

let worldJS = fs.readFileSync('js/world.js', 'utf8');
let configJS = fs.readFileSync('js/config.js', 'utf8');

let code = `
// Mock Browser Environment
global.window = { innerWidth: 1920, innerHeight: 1080, mouseX: 0, mouseY: 0 };
global.ctxMock = { fillRect:()=>{}, drawImage:()=>{}, beginPath:()=>{}, arc:()=>{}, fill:()=>{}, stroke:()=>{}, createRadialGradient:()=>({addColorStop:()=>{}}), createLinearGradient:()=>({addColorStop:()=>{}}) };
global.cvMock = { width: 1920, height: 1080, getContext: () => global.ctxMock };

global.document = { 
  getElementById: (id) => {
      return global.cvMock;
  },
  createElement: () => ({ style: {}, getContext: () => global.ctxMock })
};

global.cv = global.cvMock;
global.ctx = global.ctxMock;

// State Mocks
global.cam = { x: 0, y: 0, z: 1 };
global.keys = {};
global.mouseDown = false;
global.mx = 0; global.my = 0;
global.moveTarget = null;
global.freeCam = false;
global.autoAI = false;
global.zoom = 1;
global.difficulty = 1;
global.season = 0;

${configJS}
${worldJS}

// Override spawnOrg to catch early NaN
var originalSpawn = global.spawnOrg || spawnOrg;
spawnOrg = function() {
   var o = originalSpawn.apply(this, arguments);
   if (o && isNaN(o.speedMult)) throw new Error("Spawned org with NaN speedMult!");
   return o;
}

try {
  initWorld();
  state = 'playing';

  var dt = 0.016;
  for(var frame=0; frame<5000; frame++){
    tod += dt*0.1;
    if(tod>24) tod=0;
    
    updateWorld(dt); // THIS UPDATES EVERYTHING IN WORLD.JS
    
    for(var i=0; i<orgs.length; i++){
       var o = orgs[i];
       if(isNaN(o.x) || isNaN(o.y) || isNaN(o.size) || isNaN(o.speedMult) || isNaN(o.sizeMult)) {
          throw new Error('NaN detected in org ' + o.sp.id + ' at frame ' + frame);
       }
    }
  }
  console.log("Deep Test SUCCESS: 5000 frames without NaN or crash.");
} catch(e) {
  console.error("Deep Test FAILED:");
  console.error(e.stack);
  process.exit(1);
}
`;

fs.writeFileSync('sim_test_deep.js', code);
