const fs = require('fs');

const code = fs.readFileSync('04-Src/js/render.js', 'utf8');

const effectsFunctions = [
    'renderSky', 'renderWater', 'renderParallax', 'renderSunRays', 
    'renderSediment', 'renderNutrients', 'renderShore', 'renderShadows', 
    'renderBubbles', 'renderRain'
];

let effectsCode = '"use strict";\n\n';
let remainingCode = code;

for (const fn of effectsFunctions) {
    const fnRegex = new RegExp(`function\\s+${fn}\\s*\\([^)]*\\)\\s*\\{`, 'g');
    const match = fnRegex.exec(remainingCode);
    if (match) {
        let start = match.index;
        let braceCount = 0;
        let end = start;
        let foundFirstBrace = false;
        
        for (let i = start; i < remainingCode.length; i++) {
            if (remainingCode[i] === '{') {
                braceCount++;
                foundFirstBrace = true;
            } else if (remainingCode[i] === '}') {
                braceCount--;
            }
            
            if (foundFirstBrace && braceCount === 0) {
                end = i + 1;
                break;
            }
        }
        
        const fnCode = remainingCode.substring(start, end);
        effectsCode += fnCode + '\n\n';
        
        remainingCode = remainingCode.substring(0, start) + remainingCode.substring(end);
    }
}

fs.writeFileSync('04-Src/js/render_effects.js', effectsCode);
fs.writeFileSync('04-Src/js/render.js', remainingCode);
console.log('Successfully split render.js');
