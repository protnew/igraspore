const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix global canvas CSS rule which ruined the species grid cards
html = html.replace('canvas{display:block;position:absolute;top:0;left:0;touch-action:none}', 
  'canvas{display:block;touch-action:none} #c{position:absolute;top:0;left:0;}');

// 2. Fix #keyHint overlaps
html = html.replace('#keyHint{position:absolute;bottom:38px;left:50%;transform:translateX(-50%);z-index:9;padding:2px 6px;display:flex;gap:3px;flex-wrap:wrap;justify-content:center;max-width:55%;',
  '#keyHint{position:absolute;bottom:38px;left:50%;transform:translateX(-50%);z-index:9;padding:2px 6px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;max-width:85%;');

fs.writeFileSync('index.html', html);
console.log('CSS fixed: canvas position and keyHint gaps.');
