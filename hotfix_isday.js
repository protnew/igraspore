const fs = require('fs');
let world = fs.readFileSync('js/world.js', 'utf8');

world = world.replace("if(o.sp.cat === 'producer' && isDay)", "var isDay = (tod>6&&tod<18);\n  if(o.sp.cat === 'producer' && isDay)");

fs.writeFileSync('js/world.js', world);
console.log('Hotfix applied');
