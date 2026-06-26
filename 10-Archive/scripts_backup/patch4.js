const fs = require('fs');

function patchFile(path, replacer) {
  let content = fs.readFileSync(path, 'utf8');
  let newContent = replacer(content);
  if(content !== newContent) {
    fs.writeFileSync(path, newContent, 'utf8');
    console.log(`Patched ${path}`);
  } else {
    console.log(`No changes made to ${path}`);
  }
}

// 1. Fix config.js (Duplicate IDs)
patchFile('js/config.js', txt => {
  // Add loop to fix IDs after SPECIES_DB is concatenated
  if (!txt.includes('for(var i=0;i<SPECIES_DB.length;i++){SPECIES_DB[i].id=i;}')) {
    txt = txt.replace(
      "var VIRUS_SPECS=[];", 
      "for(var i=0;i<SPECIES_DB.length;i++){SPECIES_DB[i].id=i;}\nvar VIRUS_SPECS=[];"
    );
  }
  return txt;
});

// 2. Fix index.html CSS (Revert scrollbox to prevent layout collapse)
patchFile('index.html', txt => {
  // Revert scrollbox to standard
  txt = txt.replace(
    '.scrollbox{flex:1;min-height:0;max-height:60vh;overflow-y:auto;max-width:900px;padding:5px;}',
    '.scrollbox{max-height:60vh;overflow-y:auto;max-width:900px;width:100%;padding:10px;}'
  );
  // Ensure menuO is scrollable and displays children properly
  txt = txt.replace(
    '#menuO{background:rgba(0,5,15,.97);overflow-y:auto;padding:20px 0;justify-content:flex-start;}',
    '#menuO{background:rgba(0,5,15,.97);overflow-y:auto;padding:40px 0;justify-content:flex-start;}'
  );
  return txt;
});

// 3. Fix world.js (isPlayer reassignment & null safety)
patchFile('js/world.js', txt => {
  let oldGO = `if(orgs[i]._remove){
      if(orgs[i].isPlayer&&state==='playing'){
        let found=false;
        for(let j=0;j<orgs.length;j++){
          if(orgs[j].alive && orgs[j].sp.id===player.sp.id && orgs[j]!==orgs[i]){
            player=orgs[j]; found=true; break;
          }
        }
        if(!found) state='gameover';
      }
      orgs.splice(i,1);
    }`;
    
  let newGO = `if(orgs[i]._remove){
      if(orgs[i].isPlayer&&state==='playing'){
        let found=false;
        let pId = player ? player.sp.id : orgs[i].sp.id;
        for(let j=0;j<orgs.length;j++){
          if(orgs[j].alive && orgs[j].sp.id===pId && orgs[j]!==orgs[i]){
            player=orgs[j]; 
            player.isPlayer=true; // FIX: Must set the new cell as player!
            found=true; 
            break;
          }
        }
        if(!found) state='gameover';
      }
      orgs.splice(i,1);
    }`;
    
  if (txt.includes(oldGO)) {
    txt = txt.replace(oldGO, newGO);
  } else {
    // Fallback if formatting was slightly different
    txt = txt.replace(/if\(orgs\[i\]\.isPlayer&&state==='playing'\)\{[\s\S]*?if\(!found\) state='gameover';\s*\}/, 
    `if(orgs[i].isPlayer&&state==='playing'){
        let found=false;
        let pId = player ? player.sp.id : orgs[i].sp.id;
        for(let j=0;j<orgs.length;j++){
          if(orgs[j].alive && orgs[j].sp.id===pId && orgs[j]!==orgs[i]){
            player=orgs[j]; player.isPlayer=true; found=true; break;
          }
        }
        if(!found) state='gameover';
      }`);
  }
  return txt;
});
