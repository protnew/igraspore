const fs = require('fs');

let worldCode = fs.readFileSync('js/world.js', 'utf8');

// The functions to extract: spawnOrg, genOrgans, doDivide, finishDivide, eatOrg, killOrg, doCyst, infectOrg, updateInfections, updateViruses
const biologyFunctions = [
    'spawnOrg',
    'genOrgans',
    'doDivide',
    'finishDivide',
    'eatOrg',
    'killOrg',
    'doCyst',
    'infectOrg',
    'updateInfections',
    'updateViruses'
];

let biologyCode = '"use strict";\n\n';

for (let func of biologyFunctions) {
    let regex = new RegExp('function ' + func + '\\b[^\\{]*\\{', 'g');
    let match = regex.exec(worldCode);
    if (match) {
        let startIndex = match.index;
        let openBraces = 1;
        let i = startIndex + match[0].length;
        while (openBraces > 0 && i < worldCode.length) {
            if (worldCode[i] === '{') openBraces++;
            if (worldCode[i] === '}') openBraces--;
            i++;
        }
        let funcStr = worldCode.substring(startIndex, i);
        biologyCode += funcStr + '\n\n';
        worldCode = worldCode.substring(0, startIndex) + worldCode.substring(i);
    } else {
        console.log("Could not find function: " + func);
    }
}

fs.writeFileSync('js/biology.js', biologyCode);
fs.writeFileSync('js/world.js', worldCode);
console.log('Split world.js successfully!');
