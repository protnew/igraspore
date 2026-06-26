const fs = require('fs');

let biologyCode = fs.readFileSync('js/biology.js', 'utf8');

const aiFunctions = [
    'moveOrg',
    'aiOrg'
];

let aiCode = '"use strict";\n\n';

for (let func of aiFunctions) {
    let regex = new RegExp('function ' + func + '\\b[^\\{]*\\{', 'g');
    let match = regex.exec(biologyCode);
    if (match) {
        let startIndex = match.index;
        let openBraces = 1;
        let i = startIndex + match[0].length;
        while (openBraces > 0 && i < biologyCode.length) {
            if (biologyCode[i] === '{') openBraces++;
            if (biologyCode[i] === '}') openBraces--;
            i++;
        }
        let funcStr = biologyCode.substring(startIndex, i);
        aiCode += funcStr + '\n\n';
        biologyCode = biologyCode.substring(0, startIndex) + biologyCode.substring(i);
    } else {
        console.log("Could not find function: " + func);
    }
}

fs.writeFileSync('js/ai.js', aiCode);
fs.writeFileSync('js/biology.js', biologyCode);
console.log('Split biology.js into ai.js successfully!');
