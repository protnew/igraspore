const fs = require('fs');
let world = fs.readFileSync('js/world.js', 'utf8');

let globals = `var O2_GRID = new Array(20).fill(100);
var TEMP_GRID = new Array(20).fill(20);`;

world = world.replace('"use strict";', '"use strict";\n' + globals);

fs.writeFileSync('js/world.js', world);
console.log('Globals hotfix applied');
