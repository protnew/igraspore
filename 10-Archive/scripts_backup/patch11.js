const fs = require('fs');

let main = fs.readFileSync('js/main.js', 'utf8');

// Fix the gameover UI bug where it wouldn't show up twice
main = main.replace(
  "if(state==='gameover'&&!document.getElementById('deadStats').style.display) showDeadScreen();",
  "if(state==='gameover'&&document.getElementById('deadStats').style.display!=='block') showDeadScreen();"
);

fs.writeFileSync('js/main.js', main);
console.log('Patched gameover screen loop bug!');
