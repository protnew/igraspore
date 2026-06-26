const fs = require('fs');

let world = fs.readFileSync('js/world.js', 'utf8');

if (world.includes('if(speciesPop[o.species])')) {
  world = world.replace(
    'if(speciesPop[o.species]){speciesPop[o.species].alive--;speciesPop[o.species].deaths[cause]++;}',
    'if(o.sp && speciesPop[o.sp.id]){speciesPop[o.sp.id].alive--;speciesPop[o.sp.id].deaths[cause]++;}'
  );
  fs.writeFileSync('js/world.js', world);
  console.log('Patched world.js to fix speciesPop decrementing');
} else {
  console.log('world.js already patched or pattern not found');
}
