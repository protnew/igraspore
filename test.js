const fs = require('fs');
const html = fs.readFileSync('src/index.html', 'utf8');
const js = html.split('<script>')[1].split('</script>')[0];

const mockEnv = `
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
`;

fs.writeFileSync('test_run.js', mockEnv + js + `
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
`);
