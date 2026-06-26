const fs = require('fs');

let uiCode = fs.readFileSync('js/ui.js', 'utf8');

const menuFunctions = [
    'buildLangBar',
    'buildDiff',
    'buildCatSel',
    'drawSpeciesPreview',
    'buildSpeciesGrid',
    'updateMenuTexts',
    'showDeadScreen',
    'buildSettings',
    'toggleSet',
    'buildWiki'
];

let menusCode = '"use strict";\n\n';

for (let func of menuFunctions) {
    let regex = new RegExp('function ' + func + '\\b[^\\{]*\\{', 'g');
    let match = regex.exec(uiCode);
    if (match) {
        let startIndex = match.index;
        let openBraces = 1;
        let i = startIndex + match[0].length;
        while (openBraces > 0 && i < uiCode.length) {
            if (uiCode[i] === '{') openBraces++;
            if (uiCode[i] === '}') openBraces--;
            i++;
        }
        let funcStr = uiCode.substring(startIndex, i);
        menusCode += funcStr + '\n\n';
        uiCode = uiCode.substring(0, startIndex) + uiCode.substring(i);
    } else {
        console.log("Could not find function: " + func);
    }
}

fs.writeFileSync('js/ui_menus.js', menusCode);
fs.writeFileSync('js/ui.js', uiCode);
console.log('Split ui.js successfully!');
