const fs = require('fs');

let renderCode = fs.readFileSync('js/render.js', 'utf8');

const entityFunctions = [
    'drawBody',
    'drawVirus',
    'drawMacrophage',
    'drawFlagella',
    'drawCilia',
    'drawSpikes',
    'drawOrganelles',
    'drawSessileSponge'
];

let entitiesCode = '"use strict";\n\n';

for (let func of entityFunctions) {
    let regex = new RegExp('function ' + func + '\\b[^\\{]*\\{', 'g');
    let match = regex.exec(renderCode);
    if (match) {
        let startIndex = match.index;
        let openBraces = 1;
        let i = startIndex + match[0].length;
        while (openBraces > 0 && i < renderCode.length) {
            if (renderCode[i] === '{') openBraces++;
            if (renderCode[i] === '}') openBraces--;
            i++;
        }
        let funcStr = renderCode.substring(startIndex, i);
        entitiesCode += funcStr + '\n\n';
        renderCode = renderCode.substring(0, startIndex) + renderCode.substring(i);
    } else {
        console.log("Could not find function: " + func);
    }
}

fs.writeFileSync('js/render_entities.js', entitiesCode);
fs.writeFileSync('js/render.js', renderCode);
console.log('Split render.js successfully!');
