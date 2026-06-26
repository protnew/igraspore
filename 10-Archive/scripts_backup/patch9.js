const fs = require('fs');

let world = fs.readFileSync('js/world.js', 'utf8');

world = world.replace(
  'var metab=0.05*DIFF[difficulty].metab;',
  'var metab=(0.02 + o.sp.speed * 0.03)*DIFF[difficulty].metab;'
);

fs.writeFileSync('js/world.js', world);
console.log('Patched metabolism logic based on speed!');
