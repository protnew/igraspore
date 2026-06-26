const fs = require('fs');

// 1. Fix world.js spawnOrg genetics initialization
let world = fs.readFileSync('js/world.js', 'utf8');
world = world.replace(/generation:0,offspring:0,eaten:0,/, 
  "generation:0,offspring:0,eaten:0, speedMult:1.0, sizeMult:1.0, stomach:[],");
fs.writeFileSync('js/world.js', world);

// 2. Fix UI overlapping and glued cards in index.html
let index = fs.readFileSync('index.html', 'utf8');
index = index.replace(/#langB\{position:absolute;top:40px;left:6px;z-index:10;display:flex;gap:2px;flex-wrap:wrap;max-width:180px\}/, 
  "#langB{position:absolute;top:50px;left:6px;z-index:10;display:flex;gap:4px;flex-wrap:wrap;max-width:180px}");
index = index.replace(/#ecoP\{position:absolute;top:120px;/, "#ecoP{position:absolute;top:180px;");
index = index.replace(/#actBar\{position:absolute;bottom:6px;left:50%;transform:translateX\(-50%\);z-index:12;display:none;gap:3px;/,
  "#actBar{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);z-index:12;display:none;gap:8px;");
fs.writeFileSync('index.html', index);

console.log('UI and NaN fixed!');
