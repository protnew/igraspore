function hslToHex(h,s,l){l/=100;var a=s*Math.min(l,1-l)/100;var f=function(n){var k=(n+h/30)%12;var color=l-a*Math.max(Math.min(k-3,9-k,1),-1);var hex=Math.round(255*color).toString(16);if(hex.length<2)hex='0'+hex;return hex;};return '#'+f(0)+f(8)+f(4);}
"use strict";
var LANGS={ru:'\u0420\u0443',en:'EN',zh:'\u4e2d',es:'ES',hi:'Hi',ar:'\u0639',pt:'PT',fr:'FR',de:'DE',ja:'\u65e5',ko:'\ud55c'};
var curLang='ru',T={};
T.ru={menuSub:'\u0421\u0438\u043c\u0443\u043b\u044f\u0446\u0438\u044f \u043c\u0438\u043a\u0440\u043e\u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c\u043e\u0432 \u2014 100 \u0432\u0438\u0434\u043e\u0432 + \u0432\u0438\u0440\u0443\u0441\u044b. \u0420\u0430\u0437\u0440\u0435\u0437 \u0432\u043e\u0434\u043e\u0451\u043c\u0430 \u0441\u0431\u043e\u043a\u0443.',start:'\u041d\u0410\u0427\u0410\u0422\u042c',help:'\u041a\u0410\u041a \u0418\u0413\u0420\u0410\u0422\u042c',set:'\u041d\u0410\u0421\u0422\u0420\u041e\u0419\u041a\u0418',wiki:'\u0412\u0418\u041a\u0418',diffE:'\u041b\u0451\u0433\u043a\u0438\u0439',diffN:'\u041e\u0431\u044b\u0447\u043d\u044b\u0439',diffH:'\u0421\u043b\u043e\u0436\u043d\u044b\u0439',all:'\u0412\u0441\u0435',producer:'Зелёные (корм)',consumer1:'Мелкие едоки',consumer2:'Средние едоки',consumer3:'Крупные охотники',decomposer:'Уборщики (грибки)',virus:'\u0412\u0438\u0440\u0443\u0441\u044b',paused:'\u041f\u0410\u0423\u0417\u0410',resume:'\u041f\u0420\u041e\u0414\u041e\u041b\u0416\u0418\u0422\u042c',dead:'\u0412\u042b\u041c\u0418\u0420\u0410\u041d\u0418\u0415',restart:'\u0417\u0410\u041d\u041e\u0412\u041e',menu:'\u0412 \u041c\u0415\u041d\u042e',close:'\u0417\u0410\u041a\u0420\u042b\u0422\u042c',energy:'\u042d\u043d\u0435\u0440\u0433\u0438\u044f',age:'\u0412\u043e\u0437\u0440\u0430\u0441\u0442',eaten:'\u0421\u044a\u0435\u0434\u0435\u043d\u043e',divs:'\u0414\u0435\u043b\u0435\u043d\u0438\u0439',pop:'\u041f\u043e\u043f-\u0446\u0438\u044f',fps:'FPS',light:'\u0421\u0432\u0435\u0442',temp:'\u0422\u0435\u043c\u043f',days:'\u0414\u043d\u0435\u0439',selectSp:'\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043e\u0440\u0433\u0430\u043d\u0438\u0437\u043c',autoOn:'\u0410\u0412\u0422\u041e',season0:'\u0412\u0435\u0441\u043d\u0430',season1:'\u041b\u0435\u0442\u043e',season2:'\u041e\u0441\u0435\u043d\u044c',season3:'\u0417\u0438\u043c\u0430',clear:'\u042f\u0441\u043d\u043e',rainy:'\u0414\u043e\u0436\u0434\u044c',gameTime:'\u0412\u0440\u0435\u043c\u044f',maxPop:'\u041c\u0430\u043a\u0441. \u043f\u043e\u043f',offspring:'\u041f\u043e\u0442\u043e\u043c\u043a\u043e\u0432',dStarve:'\u0413\u043e\u043b\u043e\u0434',dEaten:'\u0421\u044a\u0435\u0434\u0435\u043d\u043e',dTemp:'\u0422\u0435\u043c\u043f',dAge:'\u0421\u0442\u0430\u0440\u043e\u0441\u0442\u044c',dLysis:'\u041b\u0438\u0437\u0438\u0441',dCauses:'\u041f\u0440\u0438\u0447\u0438\u043d\u044b \u0433\u0438\u0431\u0435\u043b\u0438',settingsT:'\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438',particles:'\u0427\u0430\u0441\u0442\u0438\u0446\u044b',bubbles:'\u041f\u0443\u0437\u044b\u0440\u044c\u043a\u0438',currents:'\u0422\u0435\u0447\u0435\u043d\u0438\u044f',vignette:'\u0412\u0438\u043d\u044c\u0435\u0442\u043a\u0430',healthBars:'\u0428\u043a\u0430\u043b\u044b',shadows:'\u0422\u0435\u043d\u0438',freeCam:'\u0421\u0432\u043e\u0431. \u043a\u0430\u043c\u0435\u0440\u0430',density:'\u041f\u043b\u043e\u0442\u043d\u043e\u0441\u0442\u044c',lightInt:'\u0418\u043d\u0442. \u0441\u0432\u0435\u0442\u0430',virusRate:'\u0427\u0430\u0441\u0442\u043e\u0442\u0430 \u0432\u0438\u0440\u0443\u0441\u043e\u0432',wikiT:'\u0412\u0438\u043a\u0438: \u0436\u0438\u0442\u0435\u043b\u0438 \u043b\u0443\u0436\u0438',simSpeed:'\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c',predation:'\u0425\u0438\u0449\u043d\u0438\u043a\u0438',divRate:'\u0420\u0430\u0437\u043c\u043d\u043e\u0436\u0435\u043d\u0438\u0435'};
T.en={menuSub:'Microorganism Simulation — 100 species + viruses. Pond cross-section view.',start:'START',help:'HOW TO PLAY',set:'SETTINGS',wiki:'WIKI',diffE:'Easy',diffN:'Normal',diffH:'Hard',all:'All',producer:'Greens (food)',consumer1:'Small eaters',consumer2:'Mid eaters',consumer3:'Big hunters',decomposer:'Cleaners (fungi)',virus:'Viruses',paused:'PAUSED',resume:'RESUME',dead:'EXTINCT',restart:'RESTART',menu:'MENU',close:'CLOSE',energy:'Energy',age:'Age',eaten:'Eaten',divs:'Divisions',pop:'Pop',fps:'FPS',light:'Light',temp:'Temp',days:'Days',selectSp:'Select organism',autoOn:'AUTO',season0:'Spring',season1:'Summer',season2:'Autumn',season3:'Winter',clear:'Clear',rainy:'Rain',gameTime:'Time',maxPop:'Max Pop',offspring:'Offspring',dStarve:'Starved',dEaten:'Eaten',dTemp:'Temp',dAge:'Old age',dLysis:'Lysis',dCauses:'Death Causes',settingsT:'Settings',particles:'Particles',bubbles:'Bubbles',currents:'Currents',vignette:'Vignette',healthBars:'Health Bars',shadows:'Shadows',freeCam:'Free Cam',density:'Density',lightInt:'Light Intensity',virusRate:'Virus Rate',wikiT:'Wiki: Pond Life',simSpeed:'Speed',predation:'Predators',divRate:'Reproduction'};
for(var l in LANGS){if(!T[l]){T[l]={};var ks=Object.keys(T.en);for(var k=0;k<ks.length;k++)T[l][ks[k]]=T.en[ks[k]];}}
function tt(k){return(T[curLang]&&T[curLang][k])||T.en[k]||k;}

// === SPECIES DATABASE — 100 species + 5 virus types ===
var SPEED_SCALE=0.5; if(typeof window!=='undefined')window.SPEED_SCALE=0.5; // v2: global movement speed halved
var PN=["Synechocystis sp.","Anabaena variabilis","Spirulina platensis","Nostoc punctiforme","Oscillatoria limnetica","Microcystis aeruginosa","Gloeocapsa sp.","Lyngbya majuscula","Chlamydomonas reinhardtii","Chlorella vulgaris","Volvox globator","Euglena gracilis","Scenedesmus quadricauda","Haematococcus pluvialis","Dunaliella salina","Micrasterias rotata","Navicula sp.","Pinnularia viridis","Cyclotella meneghiniana","Diatoma vulgare","Rhodospirillum rubrum","Chromatium vinosum","Porphyridium cruentum","Prochlorococcus marinus","Chroococcidiopsis thermalis"];
var CN1=["Bdellovibrio bacteriovorus","Vampirococcus sp.","Daptobacter sp.","Myxococcus xanthus","Bacteriovorax stolpii","Halobacteriovorax sp.","Peredibacter starrii","Monas guttula","Oikomonas termo","Anthophysa vegetans","Chilomonas paramecium","Cercomonas longicauda","Heteromita globosa","Bodo saltans","Procryptobia sorokini","Trypanosoma brucei","Leishmania donovani","Monosiga brevicollis","Salpingoeca rosetta","Codonosiga botrytis"];
var CN2=["Paramecium caudatum","Paramecium bursaria","Stentor coeruleus","Stentor polymorphus","Vorticella campanula","Vorticella microstoma","Didinium nasutum","Spirostomum ambiguum","Blepharisma americanum","Euplotes patella","Stylonychia pustulata","Oxytricha trifallax","Tetrahymena thermophila","Coleps hirtus","Litonotus lamella","Dileptus anser","Urocentrum turbo","Zoothamnium arbuscula","Opercularia coarctata","Amoeba proteus","Arcella vulgaris","Difflugia oblonga","Euglypha alveolata","Nebela collaris","Centropyxis aculeata"];
var CN3=["Actinophrys sol","Actinosphaerium eichhorni","Raphidiophrys pallida","Rotaria rotatoria","Philodina roseola","Brachionus plicatilis","Keratella cochlearis","Asplanchna priodonta","Chaetonotus maximus","Lepidodermella squamata","Macrostomum lignano","Stenostomum leucops","Microstomum lineare","Prostoma graecense","Trichoplax adhaerens"];
var DN=["Saccharomyces cerevisiae","Candida albicans","Mucor mucedo","Rhizopus stolonifer","Penicillium chrysogenum","Aspergillus niger","Batrachochytrium dendrobatidis","Chytriomyces aureus","Allomyces macrogynus","Bacillus subtilis","Pseudomonas putida","Streptomyces coelicolor","Cellulomonas fimi","Thermus aquaticus","Deinococcus radiodurans"];
var VN=["T4 Bacteriophage","Lambda Phage","T7 Bacteriophage","Phi-6 Phage","MS2 Phage"];
var CC={producer:"#22dd44",consumer1:"#33aaff",consumer2:"#ff9900",consumer3:"#dd44cc",decomposer:"#bb9966",virus:"#ff3333",macrophage:"#eeeeee"};
var SHAPES={producer:["circle","filament","spiral","colony","filament","colony","colony","filament","bell","circle","colony","oval","colony","oval","oval","star","rod","rod","circle","rod","spiral","rod","circle","circle","colony"],consumer1:["comma","circle","rod","rod","rod","rod","rod","oval","oval","oval","oval","irregular","circle","comma","comma","filament","oval","bell","bell","bell"],consumer2:["slipper","slipper","bell","bell","bell","bell","oval","rod","slipper","irregular","irregular","irregular","oval","oval","slipper","rod","oval","bell","bell","irregular","irregular","irregular","irregular","irregular","irregular"],consumer3:["star","star","star","oval","oval","oval","star","oval","rod","rod","oval","rod","rod","rod","irregular"],decomposer:["circle","circle","filament","filament","filament","filament","circle","circle","filament","rod","rod","filament","rod","rod","circle"]};
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
    var ti=i/arr.length; var sz=minSz+(maxSz-minSz)*ti; var baseSp=minSp+(maxSp-minSp)*(0.6+ti*0.4); // NO +0.5 floor
    var loc=getLocomotion(cat,i);
    var finalSp=baseSp;
    if(loc==='drift') finalSp*=0.25; // still barely moves
    else if(loc==='budding'||loc==='growth') finalSp*=0.10; // fungi: nearly stationary
    else if(loc==='pseudopodia') finalSp*=0.55;
    else if(loc==='glide') finalSp*=0.35;
    else if(loc==='flagella') finalSp*=1.0;
    else if(loc==='cilia') finalSp*=1.15;
    else if(loc==='cilia+stalk') finalSp*=0.7;
    
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
      color:(cat==='producer'?hslToHex((90+(i*8)%50),85,(38+i%3*8)):CC[cat]),
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
  // Sessile ONLY by true biology (peritrich stalks), never by shape=bell alone (Stentor swims!)
  var nm='';
  try{
    if(cat==='consumer2'&&typeof CN2!=='undefined') nm=CN2[i]||'';
    if(cat==='consumer1'&&typeof CN1!=='undefined') nm=CN1[i]||'';
  }catch(e){}
  if(/Vorticella|Zoothamnium|Opercularia/i.test(nm)) return 'sessile';
  // Choanoflagellates often stalked/sessile in nature
  if(/Codonosiga|Salpingoeca/i.test(nm)) return 'sessile';
  if(cat==='producer'){
    var sh=SHAPES.producer[i];
    if(sh==='spiral'||sh==='bell'||i===8||i===11||i===13||i===14)return'flagella';
    if(sh==='filament'||sh==='colony')return'drift'; // cyanobacterial filaments/colonies float/glide slowly
    if(i<8||sh==='rod')return'glide';
    return'drift';
  }
  if(cat==='consumer1'){
    var sh1=SHAPES.consumer1[i];
    if(sh1==='comma')return'flagella'; // Bdellovibrio swims with polar flagellum
    if(sh1==='rod')return'glide';
    if(sh1==='filament')return'flagella'; // Trypanosoma undulating
    return'flagella';
  }
  if(cat==='consumer2'){
    var sh=SHAPES.consumer2[i];
    if(sh==='slipper'||sh==='oval'||sh==='rod'||sh==='bell')return'cilia'; // Stentor free-swims with cilia
    return'pseudopodia'; // Amoeba / testates
  }
  if(cat==='consumer3'){
    var sh=SHAPES.consumer3[i];
    if(sh==='star')return'pseudopodia'; // heliozoa axopodia, slow
    if(sh==='oval'||sh==='rod')return'cilia'; // rotifers/gastrotrichs ciliary
    return'pseudopodia';
  }
  if(cat==='decomposer')return SHAPES.decomposer[i]==='circle'?'budding':'growth';
  return'drift';
}
var SPECIES_DB=mkSp(PN,'producer',3,5,0.010,0.027).concat(mkSp(CN1,'consumer1',3,7,0.10,0.23)).concat(mkSp(CN2,'consumer2',4,7,0.20,0.40)).concat(mkSp(CN3,'consumer3',5,8,0.33,0.60)).concat(mkSp(DN,'decomposer',3,6,0.007,0.02));
// Virus species
for(var i=0;i<SPECIES_DB.length;i++){SPECIES_DB[i].id=i;}
var VIRUS_SPECS=[];
for(var vi=0;vi<VN.length;vi++){VIRUS_SPECS.push({id:100+vi,name:VN[vi],cat:'virus',shape:'phage',color:'#f44',size:4,speed:0.35,infectRate:0.3,energy:0,repEnergy:0,minAge:0,isEuk:false,tempRange:[0,40],locomotion:'drift'});}
VIRUS_SPECS.push({id:200,name:'Neuro-Parasite',cat:'virus',shape:'phage',color:'#f0f',size:4,speed:0.4,infectRate:0.5,energy:0,repEnergy:0,minAge:0,isEuk:false,tempRange:[0,40],locomotion:'drift',type:'parasite'});

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
/* COLONY_PATCH + continuous species numbers */
(function(){
  // Continuous numbering for ALL species (1..N) — menu + demo + HUD
  for(var i=0;i<SPECIES_DB.length;i++){
    var s=SPECIES_DB[i]; if(!s) continue;
    s.num = i+1; // сквозной номер
    s.id = (typeof s.id==='number') ? s.id : i;
  }
  // Viruses continue after last species
  if(typeof VIRUS_SPECS!=='undefined'){
    for(var vi=0;vi<VIRUS_SPECS.length;vi++){
      VIRUS_SPECS[vi].num = SPECIES_DB.length + 1 + vi;
    }
  }
  for(var i=0;i<SPECIES_DB.length;i++){
    var s=SPECIES_DB[i]; if(!s||!s.name) continue;
    var n=s.name.toLowerCase();
    if(n.indexOf('volvox')>=0 || n.indexOf('gloeocapsa')>=0 || n.indexOf('microcystis')>=0 ||
       n.indexOf('pandorina')>=0 || n.indexOf('eudorina')>=0){
      s.shape='colony';
      s.bio=Object.assign({}, s.bio||{}, {colony:true, daughter:true});
      // playable in menu/demo; still rare in random world spawn
      s.flags=Object.assign({}, s.flags||{}, {noRandomSpawn:true, colony:true});
      // ~2x smaller than before (was up to 8) — still larger than single cells
      var base = s.size || 3;
      s.size = Math.max(9, Math.min(14, base * 1.5 + 5)); // v2: 3× bigger — visible clusters, not bacteria-sized
      s.visScale = 1.0; // v2: full visual size (was shrunk 0.85)
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
    var food=w.food||(typeof foodListRu==='function'?foodListRu(sp.cat):(FOOD[sp.cat]?FOOD[sp.cat].join(', '):'\u0421\u043e\u043b\u043d\u0446\u0435 + CO\u2082'));
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
var PW=25000,PD=2000,BW=600,MAX_ORG=8000,DAY_SEC=120,SPD_SCALE=16;
var SPAWN_RATES={producer:2,consumer1:0.3,consumer2:0.08,consumer3:0.02,decomposer:0.2,macrophage:0.05,virus:0.1};
var FOOD={consumer1:["producer"],consumer2:["producer","consumer1","consumer2"],consumer3:["producer","consumer1","consumer2","consumer3"],decomposer:[],macrophage:["consumer1","consumer2","consumer3"]};
// Кто есть кто — простыми словами (для UI/вики/подростка)
var CAT_ROLE={
  producer:{
    ru:'Зелёные. Не охотятся. Едят свет и воду — как крошечные растения. Кормят всех остальных.',
    en:'Greens. No hunting. They eat light and water — tiny plants. Feed everyone else.'
  },
  consumer1:{
    ru:'Мелкие едоки (бактерии). Кусают зелёных. Сами — еда для средних и крупных.',
    en:'Small eaters (bacteria). Nibble greens. Food for mid and big eaters.'
  },
  consumer2:{
    ru:'Средние едоки (инфузории). Фильтруют воду: затягивают бактерий и зелёных. Не кидаются на гигантов.',
    en:'Mid eaters (ciliates). Filter water: pull in bacteria and greens. Do not tackle giants.'
  },
  consumer3:{
    ru:'Крупные охотники. Едят зелёных, бактерий и средних. Могут кусать и тех, кто чуть крупнее — но это рискованно. Без еды живут долго, но голод всё равно опасен.',
    en:'Big hunters. Eat greens, bacteria and mid-eaters. Can bite slightly larger prey — risky. Live long without food, but hunger still kills.'
  },
  decomposer:{
    ru:'Уборщики. Разлагают мёртвое — не охотятся на живых.',
    en:'Cleaners. Break down the dead — do not hunt the living.'
  },
  macrophage:{
    ru:'Стражи. Атакуют больных и опасных — «иммунитет» пруда.',
    en:'Guards. Attack sick/dangerous cells — the pond immune system.'
  }
};
var CAT_NAME={
  producer:{ru:'Зелёные (корм)',en:'Greens'},
  consumer1:{ru:'Мелкие едоки',en:'Small eaters'},
  consumer2:{ru:'Средние едоки',en:'Mid eaters'},
  consumer3:{ru:'Крупные охотники',en:'Big hunters'},
  decomposer:{ru:'Уборщики',en:'Cleaners'},
  macrophage:{ru:'Стражи',en:'Guards'},
  virus:{ru:'Вирусы',en:'Viruses'}
};
function catName(cat){
  var n = CAT_NAME[cat];
  if(!n) return cat;
  return (curLang==='ru' ? n.ru : n.en) || cat;
}
function catRole(cat){
  var r = CAT_ROLE[cat];
  if(!r) return '';
  return (curLang==='ru' ? r.ru : r.en) || '';
}
function foodListRu(cat){
  var arr = FOOD[cat]||[];
  if(!arr.length){
    if(cat==='producer') return curLang==='ru'?'свет + вода + минералы':'light + water + minerals';
    if(cat==='decomposer') return curLang==='ru'?'мёртвые остатки':'dead matter';
    return '—';
  }
  return arr.map(catName).join(', ');
}

var DIFF={easy:{spawn:1.5,energy:0.8,metab:0.3,virus:0.2},normal:{spawn:1.0,energy:1.0,metab:0.5,virus:0.4},hard:{spawn:0.7,energy:1.2,metab:0.8,virus:0.8}};
var TGT={producer:1400,consumer1:160,consumer2:100,consumer3:40,decomposer:160,macrophage:0};
var INIT_N={producer:1200,consumer1:150,consumer2:90,consumer3:40,decomposer:150,macrophage:0,virus:3};
var SEASONS=[{temp:16,light:0.85,ice:0,rain:0.15},{temp:24,light:1,ice:0,rain:0.08},{temp:10,light:0.7,ice:0.05,rain:0.25},{temp:3,light:0.45,ice:0.6,rain:0.03}];
var SEASON_DAYS=2;
var DCODE={STARVE:0,EATEN:1,TEMP:2,AGE:3,LYSIS:4};
var DLAB_RU=['\u0413\u043e\u043b\u043e\u0434','\u0421\u044a\u0435\u0434\u0435\u043d\u043e','\u0422\u0435\u043c\u043f','\u0421\u0442\u0430\u0440\u043e\u0441\u0442\u044c','\u041b\u0438\u0437\u0438\u0441'];
var DLAB_EN=['Starved','Eaten','Temp','Old age','Lysis'];
var DIV_COOLDOWN=6;
var DIV_SEPARATION=40;

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
var timeScale=1.0,lastT=0;
var settings={particles:true,bubbles:true,currents:true,vignette:false,healthBars:true,shadows:true,density:1.0,lightMul:1.0,virusRate:0.7,renderMode:'cartoon',microscopeMode:false,simSpeed:0.33,predation:1.0,divRate:1.0};
var difficulty='easy',selCat='all',selSpecies=0;
var mouseDown=false,moveTarget=null;
var camKeys={w:false,a:false,s:false,d:false};
var sliderDragging=false;
var currents=[],nutrientClouds=[],o2Bubbles=[],shoreDecor=[],sedimentClumps=[],sunRays=[];
var speciesPop={};


// === UX: role card + food scent (plain language) ===
function showRoleCard(sp){
  if(!sp) return;
  try{
    var old = document.getElementById('roleCard');
    if(old) old.remove();
    var cat = sp.cat || '';
    var name = (typeof catName==='function' ? catName(cat) : cat);
    var role = (typeof catRole==='function' ? catRole(cat) : '');
    var eats = (typeof foodListRu==='function' ? foodListRu(cat) : '—');
    if(cat==='producer') eats = (curLang==='ru' ? 'свет + вода + минералы' : 'light + water + minerals');
    var d = document.createElement('div');
    d.id = 'roleCard';
    d.style.cssText = 'position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:9999;max-width:520px;width:92%;background:rgba(6,18,14,0.94);border:1px solid rgba(140,220,160,0.45);border-radius:14px;padding:14px 16px;color:#e8ffe8;font:14px/1.4 system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.45)';
    d.innerHTML =
      '<div style="font-size:12px;opacity:.7;margin-bottom:4px">Ты кто / кого ешь</div>'+
      '<div style="font-size:18px;font-weight:700;color:#c8ffc0;margin-bottom:6px">'+(sp.name||name)+' · '+name+'</div>'+
      '<div style="opacity:.95;margin-bottom:8px">'+(role||'')+'</div>'+
      '<div style="background:rgba(255,255,255,.06);border-radius:10px;padding:8px 10px;margin-bottom:8px"><b>Еда:</b> '+eats+'</div>'+
      '<div style="opacity:.8;font-size:12.5px">Подсказка: еда подсвечена цветным кольцом. Полоска «Запах еды» справа вверху.</div>'+
      '<button id="roleCardOk" style="margin-top:10px;width:100%;padding:10px;border:0;border-radius:10px;background:#2d8f55;color:#fff;font-weight:700;cursor:pointer">Понятно — плыву</button>';
    document.body.appendChild(d);
    var close = function(){ var el=document.getElementById('roleCard'); if(el) el.remove(); };
    var btn = document.getElementById('roleCardOk');
    if(btn) btn.onclick = close;
    setTimeout(close, 12000);
  }catch(e){}
}

function foodScentStrength(o){
  if(!o || !o.alive || !o.sp) return 0;
  var cats = (typeof FOOD!=='undefined' && FOOD[o.sp.cat]) ? FOOD[o.sp.cat] : [];
  if(o.sp.cat==='producer') return Math.max(0, Math.min(1, (typeof dayLight==='number'?dayLight:1)));
  if(!cats.length) return 0;
  var best = 1e15;
  var list = (window.getNearby ? window.getNearby(o.x,o.y,140) : (typeof orgs!=='undefined'?orgs:[]));
  for(var i=0;i<list.length;i++){
    var p = list[i];
    if(!p||!p.alive||p===o||p.cyst) continue;
    if(cats.indexOf(p.sp.cat)<0) continue;
    var dx=p.x-o.x, dy=p.y-o.y, d=dx*dx+dy*dy;
    if(d<best) best=d;
  }
  if(best>1e14) return 0;
  var dist = Math.sqrt(best);
  return Math.max(0, Math.min(1, 1 - dist/140));
}

function isEdibleFor(pred, prey){
  if(!pred||!prey||!pred.sp||!prey.sp) return false;
  if(pred.sp.cat==='producer') return false;
  var cats = (typeof FOOD!=='undefined' && FOOD[pred.sp.cat]) ? FOOD[pred.sp.cat] : [];
  return cats.indexOf(prey.sp.cat) >= 0;
}

function roleColor(cat){
  if(typeof CC!=='undefined' && CC[cat]) return CC[cat];
  return {producer:'#22dd44',consumer1:'#33aaff',consumer2:'#ff9900',consumer3:'#dd44cc',decomposer:'#bb9966'}[cat]||'#8cf';
}

function halfW(d){d=Math.max(0,Math.min(d,PD));return PW-(PW-BW)*d/PD;}
function lightAt(d){return Math.max(0.1,dayLight*Math.exp(-0.0002*d)*settings.lightMul);}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function rng(a,b){return a+Math.random()*(b-a);}
function lerp(a,b,t){return a+(b-a)*t;}
function dist2(a,b){var dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy;}
function hex2rgb(h){h=h.replace('#','');if(h.length===3){h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];}return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function shadeRgb(r,g,b,f){return'rgb('+Math.round(clamp(r*f,0,255))+','+Math.round(clamp(g*f,0,255))+','+Math.round(clamp(b*f,0,255))+')';}
if(typeof module!=='undefined'&&module.exports){module.exports={clamp,rng,lerp,dist2,hex2rgb,shadeRgb,hslToHex,halfW};}