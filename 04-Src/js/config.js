function hslToHex(h,s,l){l/=100;var a=s*Math.min(l,1-l)/100;var f=function(n){var k=(n+h/30)%12;var color=l-a*Math.max(Math.min(k-3,9-k,1),-1);var hex=Math.round(255*color).toString(16);if(hex.length<2)hex='0'+hex;return hex;};return '#'+f(0)+f(8)+f(4);}
"use strict";
var LANGS={ru:'\u0420\u0443',en:'EN',zh:'\u4e2d',es:'ES',hi:'Hi',ar:'\u0639',pt:'PT',fr:'FR',de:'DE',ja:'\u65e5',ko:'\ud55c'};
var curLang='ru',T={};
T.ru={menuSub:'\u0421\u0438\u043c\u0443\u043b\u044f\u0446\u0438\u044f \u043c\u0438\u043a\u0440\u043e\u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c\u043e\u0432 \u2014 100 \u0432\u0438\u0434\u043e\u0432 + \u0432\u0438\u0440\u0443\u0441\u044b. \u0420\u0430\u0437\u0440\u0435\u0437 \u0432\u043e\u0434\u043e\u0451\u043c\u0430 \u0441\u0431\u043e\u043a\u0443.',start:'\u041d\u0410\u0427\u0410\u0422\u042c',help:'\u041a\u0410\u041a \u0418\u0413\u0420\u0410\u0422\u042c',set:'\u041d\u0410\u0421\u0422\u0420\u041e\u0419\u041a\u0418',wiki:'\u0412\u0418\u041a\u0418',diffE:'\u041b\u0451\u0433\u043a\u0438\u0439',diffN:'\u041e\u0431\u044b\u0447\u043d\u044b\u0439',diffH:'\u0421\u043b\u043e\u0436\u043d\u044b\u0439',all:'\u0412\u0441\u0435',producer:'\u0412\u043e\u0434\u043e\u0440\u043e\u0441\u043b\u0438',consumer1:'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u0438',consumer2:'\u0418\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438',consumer3:'\u0425\u0438\u0449\u043d\u0438\u043a\u0438',decomposer:'\u0413\u0440\u0438\u0431\u043a\u0438',virus:'\u0412\u0438\u0440\u0443\u0441\u044b',paused:'\u041f\u0410\u0423\u0417\u0410',resume:'\u041f\u0420\u041e\u0414\u041e\u041b\u0416\u0418\u0422\u042c',dead:'\u0412\u042b\u041c\u0418\u0420\u0410\u041d\u0418\u0415',restart:'\u0417\u0410\u041d\u041e\u0412\u041e',menu:'\u0412 \u041c\u0415\u041d\u042e',close:'\u0417\u0410\u041a\u0420\u042b\u0422\u042c',energy:'\u042d\u043d\u0435\u0440\u0433\u0438\u044f',age:'\u0412\u043e\u0437\u0440\u0430\u0441\u0442',eaten:'\u0421\u044a\u0435\u0434\u0435\u043d\u043e',divs:'\u0414\u0435\u043b\u0435\u043d\u0438\u0439',pop:'\u041f\u043e\u043f-\u0446\u0438\u044f',fps:'FPS',light:'\u0421\u0432\u0435\u0442',temp:'\u0422\u0435\u043c\u043f',days:'\u0414\u043d\u0435\u0439',selectSp:'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c',autoOn:'\u0410\u0412\u0422\u041e',season0:'\u0412\u0435\u0441\u043d\u0430',season1:'\u041b\u0435\u0442\u043e',season2:'\u041e\u0441\u0435\u043d\u044c',season3:'\u0417\u0438\u043c\u0430',clear:'\u042f\u0441\u043d\u043e',rainy:'\u0414\u043e\u0436\u0434\u044c',gameTime:'\u0412\u0440\u0435\u043c\u044f',maxPop:'\u041c\u0430\u043a\u0441. \u043f\u043e\u043f',offspring:'\u041f\u043e\u0442\u043e\u043c\u043a\u043e\u0432',dStarve:'\u0413\u043e\u043b\u043e\u0434',dEaten:'\u0421\u044a\u0435\u0434\u0435\u043d\u043e',dTemp:'\u0422\u0435\u043c\u043f',dAge:'\u0421\u0442\u0430\u0440\u043e\u0441\u0442\u044c',dLysis:'\u041b\u0438\u0437\u0438\u0441',dCauses:'\u041f\u0440\u0438\u0447\u0438\u043d\u044b \u0433\u0438\u0431\u0435\u043b\u0438',settingsT:'\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438',particles:'\u0427\u0430\u0441\u0442\u0438\u0446\u044b',bubbles:'\u041f\u0443\u0437\u044b\u0440\u044c\u043a\u0438',currents:'\u0422\u0435\u0447\u0435\u043d\u0438\u044f',vignette:'\u0412\u0438\u043d\u044c\u0435\u0442\u043a\u0430',healthBars:'\u0428\u043a\u0430\u043b\u044b',shadows:'\u0422\u0435\u043d\u0438',freeCam:'\u0421\u0432\u043e\u0431. \u043a\u0430\u043c\u0435\u0440\u0430',density:'\u041f\u043b\u043e\u0442\u043d\u043e\u0441\u0442\u044c',lightInt:'\u0418\u043d\u0442. \u0441\u0432\u0435\u0442\u0430',virusRate:'\u0427\u0430\u0441\u0442\u043e\u0442\u0430 \u0432\u0438\u0440\u0443\u0441\u043e\u0432',wikiT:'\u0412\u0438\u043a\u0438: \u0436\u0438\u0442\u0435\u043b\u0438 \u043b\u0443\u0436\u0438'};
T.en={menuSub:'Microorganism Simulation — 100 species + viruses. Pond cross-section view.',start:'START',help:'HOW TO PLAY',set:'SETTINGS',wiki:'WIKI',diffE:'Easy',diffN:'Normal',diffH:'Hard',all:'All',producer:'Algae',consumer1:'Bacteria',consumer2:'Ciliates',consumer3:'Predators',decomposer:'Fungi',virus:'Viruses',paused:'PAUSED',resume:'RESUME',dead:'EXTINCT',restart:'RESTART',menu:'MENU',close:'CLOSE',energy:'Energy',age:'Age',eaten:'Eaten',divs:'Divisions',pop:'Pop',fps:'FPS',light:'Light',temp:'Temp',days:'Days',selectSp:'Select organism',autoOn:'AUTO',season0:'Spring',season1:'Summer',season2:'Autumn',season3:'Winter',clear:'Clear',rainy:'Rain',gameTime:'Time',maxPop:'Max Pop',offspring:'Offspring',dStarve:'Starved',dEaten:'Eaten',dTemp:'Temp',dAge:'Old age',dLysis:'Lysis',dCauses:'Death Causes',settingsT:'Settings',particles:'Particles',bubbles:'Bubbles',currents:'Currents',vignette:'Vignette',healthBars:'Health Bars',shadows:'Shadows',freeCam:'Free Cam',density:'Density',lightInt:'Light Intensity',virusRate:'Virus Rate',wikiT:'Wiki: Pond Life'};
for(var l in LANGS){if(!T[l]){T[l]={};var ks=Object.keys(T.en);for(var k=0;k<ks.length;k++)T[l][ks[k]]=T.en[ks[k]];}}
function tt(k){return(T[curLang]&&T[curLang][k])||T.en[k]||k;}

// === SPECIES DATABASE — 100 species + 5 virus types ===
var PN=["Synechocystis sp.","Anabaena variabilis","Spirulina platensis","Nostoc punctiforme","Oscillatoria limnetica","Microcystis aeruginosa","Gloeocapsa sp.","Lyngbya majuscula","Chlamydomonas reinhardtii","Chlorella vulgaris","Volvox globator","Euglena gracilis","Scenedesmus quadricauda","Haematococcus pluvialis","Dunaliella salina","Micrasterias rotata","Navicula sp.","Pinnularia viridis","Cyclotella meneghiniana","Diatoma vulgare","Rhodospirillum rubrum","Chromatium vinosum","Porphyridium cruentum","Prochlorococcus marinus","Chroococcidiopsis thermalis"];
var CN1=["Bdellovibrio bacteriovorus","Vampirococcus sp.","Daptobacter sp.","Myxococcus xanthus","Bacteriovorax stolpii","Halobacteriovorax sp.","Peredibacter starrii","Monas guttula","Oikomonas termo","Anthophysa vegetans","Chilomonas paramecium","Cercomonas longicauda","Heteromita globosa","Bodo saltans","Procryptobia sorokini","Trypanosoma brucei","Leishmania donovani","Monosiga brevicollis","Salpingoeca rosetta","Codonosiga botrytis"];
var CN2=["Paramecium caudatum","Paramecium bursaria","Stentor coeruleus","Stentor polymorphus","Vorticella campanula","Vorticella microstoma","Didinium nasutum","Spirostomum ambiguum","Blepharisma americanum","Euplotes patella","Stylonychia pustulata","Oxytricha trifallax","Tetrahymena thermophila","Coleps hirtus","Litonotus lamella","Dileptus anser","Urocentrum turbo","Zoothamnium arbuscula","Opercularia coarctata","Amoeba proteus","Arcella vulgaris","Difflugia oblonga","Euglypha alveolata","Nebela collaris","Centropyxis aculeata"];
var CN3=["Actinophrys sol","Actinosphaerium eichhorni","Raphidiophrys pallida","Rotaria rotatoria","Philodina roseola","Brachionus plicatilis","Keratella cochlearis","Asplanchna priodonta","Chaetonotus maximus","Lepidodermella squamata","Macrostomum lignano","Stenostomum leucops","Microstomum lineare","Prostoma graecense","Trichoplax adhaerens"];
var DN=["Saccharomyces cerevisiae","Candida albicans","Mucor mucedo","Rhizopus stolonifer","Penicillium chrysogenum","Aspergillus niger","Batrachochytrium dendrobatidis","Chytriomyces aureus","Allomyces macrogynus","Bacillus subtilis","Pseudomonas putida","Streptomyces coelicolor","Cellulomonas fimi","Thermus aquaticus","Deinococcus radiodurans"];
var VN=["T4 Bacteriophage","Lambda Phage","T7 Bacteriophage","Phi-6 Phage","MS2 Phage"];
var CC={producer:"#2c2",consumer1:"#4af",consumer2:"#f80",consumer3:"#c4f",decomposer:"#a86",virus:"#f44",macrophage:"#eeeeee"};
var SHAPES={producer:["circle","rod","spiral","filament","filament","circle","circle","filament","circle","circle","colony","spiral","rod","circle","circle","star","rod","rod","circle","rod","spiral","rod","circle","circle","circle"],consumer1:["rod","circle","rod","rod","rod","rod","rod","circle","circle","circle","circle","circle","circle","circle","circle","spiral","circle","circle","bell","bell"],consumer2:["slipper","slipper","bell","bell","bell","bell","bell","bell","bell","oval","oval","oval","slipper","rod","rod","oval","bell","bell","bell","irregular","star","irregular","star","irregular","irregular"],consumer3:["star","star","star","rod","rod","bell","bell","bell","rod","rod","oval","rod","rod","rod","irregular"],decomposer:["circle","circle","filament","filament","filament","filament","circle","circle","filament","rod","rod","filament","rod","rod","circle"]};
function bioFlags(cat,i){
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
  if(cat==='consumer3'){ // Predators — full internals (not empty ovals)
    b.nucleus=true; b.vac=true; b.mito=true; b.contractile=true; b.er=true; b.golgi=true; b.oral=true;
    var sh=SHAPES.consumer3[i];
    b.pseudo=(sh==='star'||sh==='irregular');
    b.cilia=(sh==='bell'||sh==='oval'||sh==='slipper');
    b.flag=(sh==='rod') || (!b.cilia && !b.pseudo);
    b.pellicle = b.cilia;
    if (i > 8) b.venom = true;
  }
  if(cat==='decomposer'){ // Fungi/Yeast
    b.nucleus=true; b.vac=true; b.wall=true; b.mito=true; b.ribo=true;
    b.stalk=(i>=2&&i<=5); b.bud=(i<2); b.chain=(i>=2&&i<=8);
  }
  return b;
}
function mkSp(arr,cat,minSz,maxSz,minSp,maxSp){
  var o=[];
  for(var i=0;i<arr.length;i++){
    var ti=i/arr.length; var sz=minSz+(maxSz-minSz)*ti; var baseSp=minSp+(maxSp-minSp)*(0.6+ti*0.4)+0.5;
    var loc=getLocomotion(cat,i);
    var finalSp=baseSp;
    if(loc==='drift') finalSp*=0.05;
    else if(loc==='budding'||loc==='growth') finalSp*=0.02;
    else if(loc==='pseudopodia') finalSp*=0.1;
    else if(loc==='glide') finalSp*=0.3;
    else if(loc==='flagella') finalSp*=1.25;
    else if(loc==='cilia') finalSp*=1.55; // filter cruise, not rocket
    else if(loc==='cilia+stalk') finalSp*=1.0;
    
    var flags = {};
    var bioName = arr[i].toLowerCase();
    if(cat==='producer') {
       // Diatoms (Silicon shell)
       if(bioName.includes('navicula') || bioName.includes('pinnularia') || bioName.includes('cyclotella') || bioName.includes('diatoma')) {
           flags.shell = true;
       }
       // Green algae with spikes
       if(bioName.includes('scenedesmus') || bioName.includes('micrasterias')) {
           flags.spikes = true;
       }
       // Toxic Cyanobacteria
       if(bioName.includes('microcystis') || bioName.includes('lyngbya')) {
           // Lyngbya toxin removed — was causing energy drain at game start
       }
    } else {
       // Venomous carnivores
       if(bioName.includes('didinium') || bioName.includes('dileptus') || bioName.includes('litonotus')) {
           flags.venom = true;
       }
    }
    
    o.push({
      id:o.length, name:arr[i], cat:cat, shape:SHAPES[cat]?SHAPES[cat][i%SHAPES[cat].length]:'circle',
      color:(cat==='producer'?hslToHex(((100+i*15)%160),90,(40+i%3*10)):CC[cat]),
      size:Math.round(sz*10)/10, speed:Math.round(finalSp*1000)/1000,
      energy:55+Math.floor(Math.random()*25), repEnergy:60+Math.floor(Math.random()*8),
      minAge:4+Math.floor(Math.random()*5), isEuk:cat!=='consumer1'&&!(cat==='producer'&&i<8),
      tempRange:[5+Math.floor(Math.random()*10),28+Math.floor(Math.random()*10)],
      bio:bioFlags(cat,i), biolum:(cat==='producer')&&(i===2||i===5||i===14), locomotion:loc,
      flags: flags
    });
    o[o.length-1].id=o.length-1;
  }
  return o;
}
function getLocomotion(cat,i){
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
}
var SPECIES_DB=mkSp(PN,'producer',3,5,0.04,0.15).concat(mkSp(CN1,'consumer1',3,7,1.0,2.4)).concat(mkSp(CN2,'consumer2',4,7,1.6,3.0)).concat(mkSp(CN3,'consumer3',5,8,2.2,4.2)).concat(mkSp(DN,'decomposer',3,6,0.8,2.0));
// Virus species
for(var i=0;i<SPECIES_DB.length;i++){SPECIES_DB[i].id=i;}
var VIRUS_SPECS=[];
for(var vi=0;vi<VN.length;vi++){VIRUS_SPECS.push({id:100+vi,name:VN[vi],cat:'virus',shape:'phage',color:'#f44',size:4,speed:2.5,infectRate:0.3,energy:0,repEnergy:0,minAge:0,isEuk:false,tempRange:[0,40],locomotion:'drift'});}
VIRUS_SPECS.push({id:200,name:'Neuro-Parasite',cat:'virus',shape:'phage',color:'#f0f',size:4,speed:3.5,infectRate:0.5,energy:0,repEnergy:0,minAge:0,isEuk:false,tempRange:[0,40],locomotion:'drift',type:'parasite'});

var MACROPHAGE_SP = {
    id: 999, name: "\u041c\u0430\u043a\u0440\u043e\u0444\u0430\u0433 (\u0418\u043c\u043c\u0443\u043d\u0438\u0442\u0435\u0442)", cat: "macrophage", shape: "circle", color: "#eeeeee",
    size: 20, speed: 1.2, energy: 100, repEnergy: 200, minAge: 5, isEuk: true,
    tempRange: [0, 40], locomotion: "pseudopodia", flags: { noRandomSpawn: true, immune: true, shell: true }, bio: {nucleus:true, vac:true, pseudo:true, mito:true, er:true, golgi:true}
};
// SPECIES_DB.push(MACROPHAGE_SP); // disabled mega immune cell

var SPONGE_SP = {
    id: 1000, name: "Sponge (Filter Feeder)", cat: "consumer2", shape: "irregular", color: "#5a7a62",
    size: 8, speed: 0, energy: 100, repEnergy: 9999, minAge: 10, isEuk: true,
    tempRange: [0, 40], locomotion: "sessile",
    // noRandomSpawn: never flood pond with giant green killers
    flags: { filter_feeder: true, shell: true, noRandomSpawn: true }, bio: {nucleus:true, vac:true}
};
// SPONGE not in random pool — too big/wrong scale for micro game
// // SPECIES_DB.push(SPONGE_SP); // disabled giant green filter

var GENDERED_SP = {
    id: 1001, name: "Sexual Eukaryote", cat: "consumer3", shape: "oval", color: "#d9534f",
    size: 15, speed: 2.0, energy: 80, repEnergy: 160, minAge: 5, isEuk: true,
    tempRange: [0, 40], locomotion: "flagella", flags: { gendered: true }, bio: {nucleus:true, vac:true, flag:true}
};
SPECIES_DB.push(GENDERED_SP);
/* COLONY_PATCH */
(function(){
  for(var i=0;i<SPECIES_DB.length;i++){
    var s=SPECIES_DB[i]; if(!s||!s.name) continue;
    var n=s.name.toLowerCase();
    if(n.indexOf('volvox')>=0 || n.indexOf('gloeocapsa')>=0 || n.indexOf('microcystis')>=0 ||
       n.indexOf('pandorina')>=0 || n.indexOf('eudorina')>=0){
      s.shape='colony';
      s.bio=Object.assign({}, s.bio||{}, {colony:true, daughter:true});
      s.flags=Object.assign({}, s.flags||{}, {noRandomSpawn:true}); // No green blob at start!
      // colonial algae are bigger than single cells but still micro (not lily-pad scale)
      if(s.size<5) s.size=Math.min(8, s.size+2.5);
      if(n.indexOf('microcystis')>=0){
        s.flags=Object.assign({}, s.flags||{}, {toxic:true});
      }
    }
  }
})();


var VIRUS_ID_START=100;
// Wiki facts
var WIKI={};
WIKI['999']={loc:'\u041f\u0441\u0435\u0432\u0434\u043e\u043f\u043e\u0434\u0438\u0438',div:'\u041d\u0435\u0442',food:'\u0412\u0438\u0440\u0443\u0441\u044b',pred:'-'};
WIKI['0']={loc:'\u041f\u043b\u0430\u0432\u0430\u0435\u0442, \u0444\u043e\u0442\u043e\u0441\u0438\u043d\u0442\u0435\u0437',div:'\u0414\u0435\u043b\u0435\u043d\u0438\u0435 \u043d\u0430\u0434\u0432\u043e\u0435',food:'\u0421\u043e\u043b\u043d\u0446\u0435 + CO\u2082 + \u043c\u0438\u043d\u0435\u0440\u0430\u043b\u044b',pred:'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u0438-\u0445\u0438\u0449\u043d\u0438\u043a\u0438, \u0438\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['25']={loc:'\u0416\u0433\u0443\u0442\u0438\u043a, \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0434\u043e 100 \u0434\u043b\u0438\u043d \u0442\u0435\u043b\u0430/\u0441',div:'\u041f\u043e\u043f\u0435\u0440\u0435\u0447\u043d\u043e\u0435 \u0434\u0435\u043b\u0435\u043d\u0438\u0435',food:'\u0414\u0440\u0443\u0433\u0438\u0435 \u0431\u0430\u043a\u0442\u0435\u0440\u0438\u0438',pred:'\u0418\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['45']={loc:'\u0420\u0435\u0441\u043d\u0438\u0447\u043a\u0438 (\u0434\u043e 17\u0442\u044b\u0441. \u0440\u0435\u0441\u043d\u0438\u0447\u0435\u043a)',div:'\u041f\u043e\u043f\u0435\u0440\u0435\u0447\u043d\u043e\u0435 \u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u043d\u0430\u0434\u0432\u043e\u0435',food:'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u0438, \u0434\u0435\u0442\u0440\u0438\u0442',pred:'Didinium, \u0445\u0438\u0449\u043d\u044b\u0435 \u0438\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['47']={loc:'\u0420\u0435\u0441\u043d\u0438\u0447\u043a\u0438 + \u0441\u0442\u0435\u0431\u0435\u043b\u0451\u043a (\u0441\u043e\u043a\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044f)',div:'\u041f\u0440\u043e\u0434\u043e\u043b\u044c\u043d\u043e\u0435 \u0434\u0435\u043b\u0435\u043d\u0438\u0435',food:'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u0438',pred:'\u0425\u0438\u0449\u043d\u044b\u0435 \u0438\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['65']={loc:'\u041f\u0441\u0435\u0432\u0434\u043e\u043f\u043e\u0434\u0438\u0438 (\u043b\u043e\u0436\u043d\u043e\u043d\u043e\u0436\u043a\u0438)',div:'\u0428\u043c\u043e\u0433\u0430\u043d\u0438\u0435 \u043d\u0430 \u0434\u0432\u043e\u0435',food:'\u041c\u0435\u043b\u043a\u0438\u0435 \u0432\u043e\u0434\u043e\u0440\u043e\u0441\u043b\u0438, \u0431\u0430\u043a\u0442\u0435\u0440\u0438\u0438',pred:'\u041a\u0440\u0443\u043f\u043d\u044b\u0435 \u0445\u0438\u0449\u043d\u0438\u043a\u0438'};
WIKI['85']={loc:'\u041f\u043e\u0447\u043a\u043e\u0432\u0430\u043d\u0438\u0435 (\u043f\u043e\u0447\u043a\u0438)',div:'\u041f\u043e\u0447\u043a\u043e\u0432\u0430\u043d\u0438\u0435',food:'\u041e\u0440\u0433\u0430\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0434\u0435\u0442\u0440\u0438\u0442',pred:'\u0418\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
function getWikiEntry(i){
    var sp=SPECIES_DB[i];var w=WIKI[String(i)]||{};
    var loc=w.loc||sp.locomotion||'-';
    var div=w.div||(sp.cat==='decomposer'?'\u041f\u043e\u0447\u043a\u043e\u0432\u0430\u043d\u0438\u0435':'\u0414\u0435\u043b\u0435\u043d\u0438\u0435 \u043d\u0430\u0434\u0432\u043e\u0435');
    var food=w.food||(FOOD[sp.cat]?FOOD[sp.cat].join(', '):'\u0421\u043e\u043b\u043d\u0446\u0435 + CO\u2082');
    var pred=w.pred||'-';
    var defs=[];
    if(sp.flags && sp.flags.shell) defs.push("\u041a\u0440\u0435\u043c\u043d\u0438\u0435\u0432\u044b\u0439 \u043f\u0430\u043d\u0446\u0438\u0440\u044c");
    if(sp.flags && sp.flags.spikes) defs.push("\u0428\u0438\u043f\u044b");
    if(sp.flags && sp.flags.toxic) defs.push("\u0422\u043e\u043a\u0441\u0438\u0447\u043d\u043e\u0441\u0442\u044c");
    if(sp.flags && sp.flags.venom) defs.push("\u042f\u0434");
    if(defs.length>0) loc += " <br><span style='color:#f80'>\u041e\u0441\u043e\u0431\u0435\u043d\u043d\u043e\u0441\u0442\u0438: " + defs.join(", ") + "</span>";
    return{loc:loc,div:div,food:food,pred:pred};
}

// === CONFIG ===
var PW=25000,PD=16000,BW=8000,MAX_ORG=3000,DAY_SEC=120,SPD_SCALE=16;
var SPAWN_RATES={producer:2,consumer1:0.3,consumer2:0.08,consumer3:0.02,decomposer:0.2,macrophage:0.05,virus:0.1};
var FOOD={consumer1:["producer"],consumer2:["producer","consumer1","consumer2"],consumer3:["producer","consumer1","consumer2"],decomposer:["producer","consumer1"],macrophage:["consumer1","consumer2","consumer3"]};
var DIFF={easy:{spawn:2.0,energy:2.0,metab:0.3,virus:0.2},normal:{spawn:1.3,energy:1.3,metab:0.6,virus:0.5},hard:{spawn:0.8,energy:0.85,metab:1.0,virus:1.0}};
var TGT={producer:1500,consumer1:150,consumer2:20,consumer3:5,decomposer:20,macrophage:0};
var INIT_N={producer:1500,consumer1:250,consumer2:50,consumer3:10,decomposer:300,macrophage:0,virus:50};
var SEASONS=[{temp:16,light:0.85,ice:0,rain:0.15},{temp:24,light:1,ice:0,rain:0.08},{temp:10,light:0.7,ice:0.05,rain:0.25},{temp:3,light:0.45,ice:0.6,rain:0.03}];
var SEASON_DAYS=2;
var DCODE={STARVE:0,EATEN:1,TEMP:2,AGE:3,LYSIS:4};
var DLAB_RU=['\u0413\u043e\u043b\u043e\u0434','\u0421\u044a\u0435\u0434\u0435\u043d\u043e','\u0422\u0435\u043c\u043f','\u0421\u0442\u0430\u0440\u043e\u0441\u0442\u044c','\u041b\u0438\u0437\u0438\u0441'];
var DLAB_EN=['Starved','Eaten','Temp','Old age','Lysis'];
var DIV_COOLDOWN=6;
var DIV_SEPARATION=25;

// === GAME STATE ===
// GLOBAL GUARD: prevent createRadialGradient from crashing on NaN/Infinity
(function(){
  var _origCRG = CanvasRenderingContext2D.prototype.createRadialGradient;
  CanvasRenderingContext2D.prototype.createRadialGradient = function(x0,y0,r0,x1,y1,r1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;if(!isFinite(r0)||r0<0)r0=0;
    if(!isFinite(x1))x1=0;if(!isFinite(y1))y1=0;if(!isFinite(r1)||r1<0)r1=1;
    return _origCRG.call(this,x0,y0,r0,x1,y1,r1);
  };
  var _origCLG = CanvasRenderingContext2D.prototype.createLinearGradient;
  CanvasRenderingContext2D.prototype.createLinearGradient = function(x0,y0,x1,y1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;if(!isFinite(x1))x1=0;if(!isFinite(y1))y1=0;
    return _origCLG.call(this,x0,y0,x1,y1);
  };
})();

var cv=document.getElementById('c'),ctx=cv.getContext('2d');
// GLOBAL gradient guard — prevents createRadialGradient crashes from NaN/Infinity
(function(){
  var origCRG = ctx.createRadialGradient.bind(ctx);
  ctx.createRadialGradient = function(x0,y0,r0,x1,y1,r1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;if(!isFinite(r0)||r0<0)r0=0;
    if(!isFinite(x1))x1=0;if(!isFinite(y1))y1=0;if(!isFinite(r1)||r1<0)r1=1;
    return origCRG(x0,y0,r0,x1,y1,r1);
  };
})();
// Same guard for createLinearGradient
(function(){
  var origCLG = ctx.createLinearGradient.bind(ctx);
  ctx.createLinearGradient = function(x0,y0,x1,y1){
    if(!isFinite(x0))x0=0;if(!isFinite(y0))y0=0;
    if(!isFinite(x1))x1=1;if(!isFinite(y1))y1=1;
    return origCLG(x0,y0,x1,y1);
  };
})();
var mm=document.getElementById('mm'),mc=mm.getContext('2d');
var pc=document.getElementById('pc'),pcc=pc.getContext('2d');
var orgs=[],parts=[],player=null,inspOrg=null,viruses=[];
var cam={x:0,y:300},zoom=1,tZoom=3;
var gt=0,fc=0,fps=60,fAcc=0,fCnt=0;
var state='menu',keys={},mx=9999,my=9999;
var dayLight=0.85;
var stats={births:0,deaths:0,deathCauses:[0,0,0,0,0]},spawnT=0,virusT=0;
var popHist=[];
var tod=9.0,totalDays=0,season=1;
var seasonT=0, spawnT=0, virusT=0;
var wind={x:0,y:0,strength:0};
var isRaining=false,rainTimer=0,rainDrops=[];
var autoAI=false,freeCam=false;
var gameStats={startTime:0,maxPop:0,maxPlayerSize:0,evoLvl:0};
var timeScale=0.5,lastT=0;
var settings={particles:true,bubbles:true,currents:true,vignette:false,healthBars:true,shadows:true,density:1.0,lightMul:1.0,virusRate:0.7,renderMode:'cartoon',microscopeMode:false};
var difficulty='easy',selCat='all',selSpecies=0;
var mouseDown=false,moveTarget=null;
var camKeys={w:false,a:false,s:false,d:false};
var sliderDragging=false;
var currents=[],nutrientClouds=[],o2Bubbles=[],shoreDecor=[],sedimentClumps=[],sunRays=[];
var speciesPop={};

function halfW(d){d=Math.max(0,Math.min(d,PD));return PW-(PW-BW)*d/PD;}
function lightAt(d){return Math.max(0.1,dayLight*Math.exp(-0.0002*d)*settings.lightMul);}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function rng(a,b){return a+Math.random()*(b-a);}
function lerp(a,b,t){return a+(b-a)*t;}
function dist2(a,b){var dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy;}
function hex2rgb(h){h=h.replace('#','');if(h.length===3){h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];}return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function shadeRgb(r,g,b,f){return'rgb('+Math.round(clamp(r*f,0,255))+','+Math.round(clamp(g*f,0,255))+','+Math.round(clamp(b*f,0,255))+')';}
if(typeof module!=='undefined'&&module.exports){module.exports={clamp,rng,lerp,dist2,hex2rgb,shadeRgb,hslToHex,halfW};}