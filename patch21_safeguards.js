const fs = require('fs');

// 1. Safeguard render.js UI Scanner
let r = fs.readFileSync('js/render.js', 'utf8');
r = r.replace(/org\.speedMult\.toFixed\(2\)/g, "(org.speedMult||1.0).toFixed(2)");
r = r.replace(/org\.sizeMult\.toFixed\(2\)/g, "(org.sizeMult||1.0).toFixed(2)");
fs.writeFileSync('js/render.js', r);

// 2. Safeguard world.js finishDivide and spawnOrg just in case
let w = fs.readFileSync('js/world.js', 'utf8');
w = w.replace(/o\.speedMult\*/g, "(o.speedMult||1.0)*");
w = w.replace(/o\.sizeMult\*/g, "(o.sizeMult||1.0)*");
w = w.replace(/p\.speedMult\*/g, "(p.speedMult||1.0)*");
w = w.replace(/p\.sizeMult\*/g, "(p.sizeMult||1.0)*");
w = w.replace(/o\.speedMult \+/g, "(o.speedMult||1.0) +");
w = w.replace(/p\.speedMult \+/g, "(p.speedMult||1.0) +");
w = w.replace(/o\.sizeMult \+/g, "(o.sizeMult||1.0) +");
w = w.replace(/p\.sizeMult \+/g, "(p.sizeMult||1.0) +");
fs.writeFileSync('js/world.js', w);

console.log('Safeguards applied to prevent any possible NaN crash.');
