const fs = require('fs');

let config = fs.readFileSync('js/config.js', 'utf8');

let hslToHexFunc = `function hslToHex(h,s,l){l/=100;var a=s*Math.min(l,1-l)/100;var f=function(n){var k=(n+h/30)%12;var color=l-a*Math.max(Math.min(k-3,9-k,1),-1);var hex=Math.round(255*color).toString(16);if(hex.length<2)hex='0'+hex;return hex;};return '#'+f(0)+f(8)+f(4);}\n`;

if (!config.includes('function hslToHex')) {
  config = hslToHexFunc + config;
}

config = config.replace(
  "'hsl('+((100+i*15)%160)+', 90%, '+(40+i%3*10)+'%)'",
  "hslToHex(((100+i*15)%160), 90, (40+i%3*10))"
);

fs.writeFileSync('js/config.js', config);
console.log('Patched config.js to fix hsl -> hex conversion issue');
