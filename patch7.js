const fs = require('fs');

let config = fs.readFileSync('js/config.js', 'utf8');

// Replace bioFlags
const newBioFlags = `function bioFlags(cat,i){
  var b={nucleus:false,chloro:false,vac:false,flag:false,cilia:false,eye:false,pseudo:false,wall:false,biolum:false,stalk:false,oral:false,bud:false,chain:false,mito:false,golgi:false,er:false,trich:false,macro:false,ribo:false,plastid:false,contractile:false,pellicle:false,glide:false,nucleoid:false,thylakoid:false};
  if(cat==='producer'){
    b.wall=true; b.ribo=true; b.biolum=(i===2||i===5||i===14);
    b.chain=(i===2||i===3||i===7||i===10);
    var sh=SHAPES.producer[i];
    b.glide=(sh==='circle'&&i<8)||sh==='rod';
    if(i<8){ // Cyanobacteria (Prokaryote)
      b.nucleoid=true; b.thylakoid=true;
    } else { // Eukaryotic Algae & Diatoms
      b.nucleus=true; b.chloro=true; b.mito=true; b.vac=true;
      if(i>=8&&i<=14){ b.flag=(i===8||i===11||i===13||i===14); b.eye=b.flag; b.contractile=true; }
    }
  }
  if(cat==='consumer1'){ // Bacteria (Prokaryote)
    b.nucleoid=true; b.ribo=true; b.wall=true;
    var sh=SHAPES.consumer1[i];
    b.glide=(sh==='rod'); b.flag=!b.glide;
  }
  if(cat==='consumer2'){ // Ciliates
    b.nucleus=true; b.macro=true; b.vac=true; b.cilia=true; b.oral=true; b.mito=true; b.er=true; b.pellicle=true; b.contractile=true;
  }
  if(cat==='consumer3'){ // Predators
    b.nucleus=true; b.vac=true; b.mito=true; b.contractile=true; b.er=true;
    var sh=SHAPES.consumer3[i];
    b.pseudo=(sh==='star'||sh==='irregular'); b.cilia=(sh==='bell'); b.flag=(sh==='rod'||sh==='oval');
  }
  if(cat==='decomposer'){ // Fungi/Yeast
    b.nucleus=true; b.vac=true; b.wall=true; b.mito=true; b.ribo=true;
    b.stalk=(i>=2&&i<=5); b.bud=(i<2); b.chain=(i>=2&&i<=8);
  }
  return b;
}`;

// Replace getLocomotion
const newGetLocomotion = `function getLocomotion(cat,i){
  if(cat==='producer'){
    var sh=SHAPES.producer[i];
    if(sh==='spiral'||i===8||i===11||i===13||i===14)return'flagella';
    if(i<8||sh==='rod')return'glide';
    return'drift';
  }
  if(cat==='consumer1')return SHAPES.consumer1[i]==='rod'?'glide':'flagella';
  if(cat==='consumer2'){
    var sh=SHAPES.consumer2[i];
    if(sh==='bell')return'cilia+stalk';
    if(sh==='slipper'||sh==='oval'||sh==='rod')return'cilia';
    return'pseudopodia';
  }
  if(cat==='consumer3'){
    var sh=SHAPES.consumer3[i];
    if(sh==='bell')return'cilia';
    if(sh==='rod'||sh==='oval')return'flagella';
    return'pseudopodia';
  }
  if(cat==='decomposer')return SHAPES.decomposer[i]==='circle'?'budding':'growth';
  return'drift';
}`;

// Replace mkSp
const newMkSp = `function mkSp(arr,cat,minSz,maxSz,minSp,maxSp){
  var o=[];
  for(var i=0;i<arr.length;i++){
    var ti=i/arr.length; var sz=minSz+(maxSz-minSz)*ti; var baseSp=minSp+(maxSp-minSp)*(0.6+ti*0.4)+0.5;
    var loc=getLocomotion(cat,i);
    var finalSp=baseSp;
    if(loc==='drift') finalSp*=0.05;
    else if(loc==='budding'||loc==='growth') finalSp*=0.02;
    else if(loc==='pseudopodia') finalSp*=0.1;
    else if(loc==='glide') finalSp*=0.3;
    else if(loc==='flagella') finalSp*=1.5;
    else if(loc==='cilia') finalSp*=8.0;
    else if(loc==='cilia+stalk') finalSp*=1.0;
    
    o.push({
      id:o.length, name:arr[i], cat:cat, shape:SHAPES[cat]?SHAPES[cat][i%SHAPES[cat].length]:'circle',
      color:(cat==='producer'?hslToHex(((100+i*15)%160),90,(40+i%3*10)):CC[cat]),
      size:Math.round(sz*10)/10, speed:Math.round(finalSp*1000)/1000,
      energy:55+Math.floor(Math.random()*25), repEnergy:60+Math.floor(Math.random()*8),
      minAge:4+Math.floor(Math.random()*5), isEuk:cat!=='consumer1'&&!(cat==='producer'&&i<8),
      tempRange:[5+Math.floor(Math.random()*10),28+Math.floor(Math.random()*10)],
      bio:bioFlags(cat,i), biolum:(cat==='producer')&&(i===2||i===5||i===14), locomotion:loc
    });
    o[o.length-1].id=o.length-1;
  }
  return o;
}`;

config = config.replace(/function bioFlags[\s\S]*?return b;}/, newBioFlags);
config = config.replace(/function getLocomotion[\s\S]*?return'drift';}/, newGetLocomotion);
config = config.replace(/function mkSp[\s\S]*?return o;}/, newMkSp);

fs.writeFileSync('js/config.js', config);
console.log('Patched config.js with realism logic!');
