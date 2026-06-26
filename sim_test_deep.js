
// Mock Browser Environment
global.window = { innerWidth: 1920, innerHeight: 1080, mouseX: 0, mouseY: 0 };
global.ctxMock = { fillRect:()=>{}, drawImage:()=>{}, beginPath:()=>{}, arc:()=>{}, fill:()=>{}, stroke:()=>{}, createRadialGradient:()=>({addColorStop:()=>{}}), createLinearGradient:()=>({addColorStop:()=>{}}) };
global.cvMock = { width: 1920, height: 1080, getContext: () => global.ctxMock };

global.document = { 
  getElementById: (id) => {
      return global.cvMock;
  },
  createElement: () => ({ style: {}, getContext: () => global.ctxMock })
};

global.cv = global.cvMock;
global.ctx = global.ctxMock;

// State Mocks
global.cam = { x: 0, y: 0, z: 1 };
global.keys = {};
global.mouseDown = false;
global.mx = 0; global.my = 0;
global.moveTarget = null;
global.freeCam = false;
global.autoAI = false;
global.zoom = 1;
global.difficulty = 1;
global.season = 0;

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
var CC={producer:"#2c2",consumer1:"#4af",consumer2:"#f80",consumer3:"#c4f",decomposer:"#a86",virus:"#f44"};
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
var SPECIES_DB=mkSp(PN,'producer',3,7,0.05,0.2).concat(mkSp(CN1,'consumer1',3,7,1.2,3.5)).concat(mkSp(CN2,'consumer2',7,15,1.5,3.5)).concat(mkSp(CN3,'consumer3',10,18,1.0,3.0)).concat(mkSp(DN,'decomposer',3,6,0.8,2.0));
// Virus species
for(var i=0;i<SPECIES_DB.length;i++){SPECIES_DB[i].id=i;}
var VIRUS_SPECS=[];
for(var vi=0;vi<VN.length;vi++){
  var tgts = ['consumer1','producer','consumer2','consumer1','consumer3'];
  VIRUS_SPECS.push({id:100+vi,name:VN[vi],cat:'virus',shape:'phage',color:'#f44',size:3+vi*0.5,speed:0.5+vi*0.2,energy:20,target:tgts[vi]});
}
var VIRUS_ID_START=100;
// Wiki facts
var WIKI={};
WIKI['0']={loc:'\u041f\u043b\u0430\u0432\u0430\u0435\u0442, \u0444\u043e\u0442\u043e\u0441\u0438\u043d\u0442\u0435\u0437',div:'\u0414\u0435\u043b\u0435\u043d\u0438\u0435 \u043d\u0430\u0434\u0432\u043e\u0435',food:'\u0421\u043e\u043b\u043d\u0446\u0435 + CO\u2082 + \u043c\u0438\u043d\u0435\u0440\u0430\u043b\u044b',pred:'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u0438-\u0445\u0438\u0449\u043d\u0438\u043a\u0438, \u0438\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['25']={loc:'\u0416\u0433\u0443\u0442\u0438\u043a, \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0434\u043e 100 \u0434\u043b\u0438\u043d \u0442\u0435\u043b\u0430/\u0441',div:'\u041f\u043e\u043f\u0435\u0440\u0435\u0447\u043d\u043e\u0435 \u0434\u0435\u043b\u0435\u043d\u0438\u0435',food:'\u0414\u0440\u0443\u0433\u0438\u0435 \u0431\u0430\u043a\u0442\u0435\u0440\u0438\u0438',pred:'\u0418\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['45']={loc:'\u0420\u0435\u0441\u043d\u0438\u0447\u043a\u0438 (\u0434\u043e 17\u0442\u044b\u0441. \u0440\u0435\u0441\u043d\u0438\u0447\u0435\u043a)',div:'\u041f\u043e\u043f\u0435\u0440\u0435\u0447\u043d\u043e\u0435 \u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u043d\u0430\u0434\u0432\u043e\u0435',food:'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u0438, \u0434\u0435\u0442\u0440\u0438\u0442',pred:'Didinium, \u0445\u0438\u0449\u043d\u044b\u0435 \u0438\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['47']={loc:'\u0420\u0435\u0441\u043d\u0438\u0447\u043a\u0438 + \u0441\u0442\u0435\u0431\u0435\u043b\u0451\u043a (\u0441\u043e\u043a\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044f)',div:'\u041f\u0440\u043e\u0434\u043e\u043b\u044c\u043d\u043e\u0435 \u0434\u0435\u043b\u0435\u043d\u0438\u0435',food:'\u0411\u0430\u043a\u0442\u0435\u0440\u0438\u0438',pred:'\u0425\u0438\u0449\u043d\u044b\u0435 \u0438\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
WIKI['65']={loc:'\u041f\u0441\u0435\u0432\u0434\u043e\u043f\u043e\u0434\u0438\u0438 (\u043b\u043e\u0436\u043d\u043e\u043d\u043e\u0436\u043a\u0438)',div:'\u0428\u043c\u043e\u0433\u0430\u043d\u0438\u0435 \u043d\u0430 \u0434\u0432\u043e\u0435',food:'\u041c\u0435\u043b\u043a\u0438\u0435 \u0432\u043e\u0434\u043e\u0440\u043e\u0441\u043b\u0438, \u0431\u0430\u043a\u0442\u0435\u0440\u0438\u0438',pred:'\u041a\u0440\u0443\u043f\u043d\u044b\u0435 \u0445\u0438\u0449\u043d\u0438\u043a\u0438'};
WIKI['85']={loc:'\u041f\u043e\u0447\u043a\u043e\u0432\u0430\u043d\u0438\u0435 (\u043f\u043e\u0447\u043a\u0438)',div:'\u041f\u043e\u0447\u043a\u043e\u0432\u0430\u043d\u0438\u0435',food:'\u041e\u0440\u0433\u0430\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u0434\u0435\u0442\u0440\u0438\u0442',pred:'\u0418\u043d\u0444\u0443\u0437\u043e\u0440\u0438\u0438'};
function getWikiEntry(i){var sp=SPECIES_DB[i];var w=WIKI[String(i)]||{};var loc=w.loc||sp.locomotion||'-';var div=w.div||(sp.cat==='decomposer'?'\u041f\u043e\u0447\u043a\u043e\u0432\u0430\u043d\u0438\u0435':'\u0414\u0435\u043b\u0435\u043d\u0438\u0435 \u043d\u0430\u0434\u0432\u043e\u0435');var food=w.food||(FOOD[sp.cat]?FOOD[sp.cat].join(', '):'\u0421\u043e\u043b\u043d\u0446\u0435 + CO\u2082');var pred=w.pred||'-';return{loc:loc,div:div,food:food,pred:pred};}

// === CONFIG ===
var PW=1500,PD=1000,BW=500,MAX_ORG=750,DAY_SEC=120,SPD_SCALE=16;
var FOOD={consumer1:["producer"],consumer2:["producer","consumer1","consumer2"],consumer3:["producer","consumer1","consumer2"],decomposer:[]};
var DIFF={easy:{spawn:2.0,energy:2.0,metab:0.3,virus:0.2},normal:{spawn:1.3,energy:1.3,metab:0.6,virus:0.5},hard:{spawn:0.8,energy:0.85,metab:1.0,virus:1.0}};
var TGT={producer:500,consumer1:100,consumer2:30,consumer3:10,decomposer:20};
var INIT_N={producer:300,consumer1:60,consumer2:15,consumer3:5,decomposer:10};
var SEASONS=[{temp:16,light:0.85,ice:0,rain:0.15},{temp:24,light:1,ice:0,rain:0.08},{temp:10,light:0.7,ice:0.05,rain:0.25},{temp:3,light:0.45,ice:0.25,rain:0.03}];
var SEASON_DAYS=5;
var DCODE={STARVE:0,EATEN:1,TEMP:2,AGE:3,LYSIS:4};
var DLAB_RU=['\u0413\u043e\u043b\u043e\u0434','\u0421\u044a\u0435\u0434\u0435\u043d\u043e','\u0422\u0435\u043c\u043f','\u0421\u0442\u0430\u0440\u043e\u0441\u0442\u044c','\u041b\u0438\u0437\u0438\u0441'];
var DLAB_EN=['Starved','Eaten','Temp','Old age','Lysis'];
var DIV_COOLDOWN=4;
var DIV_SEPARATION=25;

// === GAME STATE ===
var cv=document.getElementById('c'),ctx=cv.getContext('2d');
var mm=document.getElementById('mm'),mc=mm.getContext('2d');
var pc=document.getElementById('pc'),pcc=pc.getContext('2d');
var orgs=[],parts=[],player=null,inspOrg=null,viruses=[];
var cam={x:0,y:300},zoom=2.2,tZoom=2.2;
var gt=0,fc=0,fps=60,fAcc=0,fCnt=0;
var state='menu',keys={},mx=9999,my=9999;
var dayLight=0.6;
var stats={births:0,deaths:0,deathCauses:[0,0,0,0,0]},spawnT=0,virusT=0;
var popHist=[];
var tod=5,totalDays=0,season=1;
var wind={x:0,y:0,strength:0};
var isRaining=false,rainTimer=0,rainDrops=[];
var autoAI=false,freeCam=false;
var gameStats={startTime:0,maxPop:0,maxPlayerSize:0,evoLvl:0};
var timeScale=1,lastT=0;
var settings={particles:true,bubbles:true,currents:true,vignette:true,healthBars:true,shadows:true,density:1.0,lightMul:1.0,virusRate:0.7};
var difficulty='easy',selCat='all',selSpecies=0;
var mouseDown=false,moveTarget=null;
var camKeys={w:false,a:false,s:false,d:false};
var sliderDragging=false;
var currents=[],nutrientClouds=[],o2Bubbles=[],shoreDecor=[],sedimentClumps=[],sunRays=[];
var speciesPop={};

function halfW(d){d=Math.max(0,Math.min(d,PD));return PW-(PW-BW)*d/PD;}
function lightAt(d){return Math.max(0.08,dayLight*Math.exp(-0.0005*d)*settings.lightMul);}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function rng(a,b){return a+Math.random()*(b-a);}
function lerp(a,b,t){return a+(b-a)*t;}
function dist2(a,b){var dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy;}
function hex2rgb(h){h=h.replace('#','');if(h.length===3){h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];}return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function shadeRgb(r,g,b,f){return'rgb('+Math.round(clamp(r*f,0,255))+','+Math.round(clamp(g*f,0,255))+','+Math.round(clamp(b*f,0,255))+')';}

"use strict";
var O2_GRID = new Array(20).fill(100);
var TEMP_GRID = new Array(20).fill(20);
function initWorld(){
  orgs=[];parts=[];viruses=[];speciesPop={};popHist=[];
  stats={births:0,deaths:0,deathCauses:[0,0,0,0,0]};
  gameStats={startTime:Date.now(),maxPop:0,maxPlayerSize:0,evoLvl:0};
  for(var i=0;i<SPECIES_DB.length;i++)speciesPop[i]={alive:0,born:0,deaths:[0,0,0,0,0]};
  for(var cat in INIT_N){
    var pool=SPECIES_DB.filter(function(s){return s.cat===cat;});
    var cnt=Math.round(INIT_N[cat]*settings.density);
    for(var i=0;i<cnt;i++){
      var sp=pool[Math.floor(Math.random()*pool.length)];
      var d=rng(20,PD-30);var hw=halfW(d)-30;
      spawnOrg(sp,rng(-hw,hw),d);
    }
  }
  currents=[];for(var i=0;i<5;i++)currents.push({x:rng(-PW,PW),y:rng(50,PD-50),r:rng(200,500),vx:rng(-0.4,0.4),vy:rng(-0.1,0.1),strength:rng(0.3,0.7)});
  nutrientClouds=[];for(var i=0;i<15;i++){var d=rng(PD*0.4,PD-20),hw=halfW(d)-20;nutrientClouds.push({x:rng(-hw,hw),y:d,r:rng(60,150),intensity:rng(0.4,0.9),vx:rng(-0.08,0.08),vy:rng(-0.02,0.02)});}
  shoreDecor=[];for(var i=0;i<30;i++){var side=i<15?-1:1;var d=rng(0,40),hw=halfW(d);shoreDecor.push({x:side*(hw+rng(5,40)),y:rng(-15,d),type:Math.random()<0.5?'grass':'pebble',size:rng(6,18),rot:rng(0,Math.PI*2)});}
  sedimentClumps=[];for(var i=0;i<25;i++){var hw=halfW(PD)-15;sedimentClumps.push({x:rng(-hw,hw),y:PD-rng(0,8),w:rng(15,40),h:rng(4,10),rot:rng(-0.3,0.3)});}
  sunRays=[];for(var i=0;i<12;i++)sunRays.push({x:rng(-PW*0.8,PW*0.8),w:rng(40,100),angle:rng(-0.15,0.15)});
}

function spawnOrg(sp,x,y,isPlayer){
  if(orgs.length>=MAX_ORG)return null;
  var o={x:x,y:y,vx:0,vy:0,sp:sp,species:sp.id,
    energy:sp.energy*0.7+rng(0,10),age:0,
    size:sp.size*(0.85+rng(0,0.3)),
    angle:rng(0,Math.PI*2),
    state:'idle',target:null,
    dividing:false,divT:0,cyst:false,cystT:0,
    divCD:0,
    infected:false,infectionT:0,
    dying:false,deathT:0,deathCause:-1,
    flash:0,flashColor:'#fff',
    wobble:rng(0,Math.PI*2),pulse:rng(0,Math.PI*2),
    flagPhase:rng(0,Math.PI*2),cilPhase:rng(0,Math.PI*2),
    glideTrail:[],
    generation:0,offspring:0,eaten:0, speedMult:1.0, sizeMult:1.0, stomach:[],
    isPlayer:!!isPlayer,alive:true,_remove:false,
    invuln:isPlayer?10:0
  };
  o.organs=genOrgans(o);
  orgs.push(o);
  if(speciesPop[sp.id]){speciesPop[sp.id].alive++;speciesPop[sp.id].born++;}
  stats.births++;
  return o;
}

function genOrgans(o){
  var b=o.sp.bio,sz=o.size,org=[];
  if(b.nucleus){
    var nx=rng(-sz*0.1,sz*0.1),ny=rng(-sz*0.1,sz*0.1);
    org.push({t:'nuc',x:nx,y:ny,r:sz*0.24,c:'#9358a0'});
    org.push({t:'nuc2',x:nx,y:ny,r:sz*0.09,c:'#c060c0'});
  }
  if(b.macro){
    org.push({t:'mac',x:-sz*0.3,y:0,r:sz*0.3,c:'#a050a0'});
    org.push({t:'mic',x:sz*0.3,y:-sz*0.15,r:sz*0.08,c:'#c070c0'});
  }
  if(b.chloro){
    var cn=3+Math.floor(sz/3);
    for(var i=0;i<cn;i++){var a=i/cn*Math.PI*2;
      org.push({t:'chl',x:Math.cos(a)*sz*0.45,y:Math.sin(a)*sz*0.4,rx:sz*0.2,ry:sz*0.1,rot:a,c:'#2a8a2a'});}
  }
  if(b.plastid){
    org.push({t:'plastid',x:sz*0.2,y:sz*0.2,rx:sz*0.15,ry:sz*0.08,rot:0.5,c:'#8a2a8a'});
  }
  if(b.mito){
    var mn=2+Math.floor(sz/5);
    for(var i=0;i<mn;i++){var a=rng(0,Math.PI*2),r=rng(sz*0.2,sz*0.5);
      org.push({t:'mito',x:Math.cos(a)*r,y:Math.sin(a)*r,rx:sz*0.12,ry:sz*0.05,rot:a,c:'#c44'});}
  }
  if(b.golgi){
    org.push({t:'golgi',x:-sz*0.25,y:sz*0.25,r:sz*0.12,c:'#e8e'});
    for(var i=0;i<3;i++){
      org.push({t:'golgiS',x:-sz*0.25,y:sz*0.25+(i-1)*sz*0.06,rx:sz*0.1,ry:sz*0.02,rot:0,c:'#c4c'});
    }
  }
  if(b.er){
    for(var i=0;i<2;i++){
      org.push({t:'er',x:rng(-sz*0.4,sz*0.4),y:rng(-sz*0.35,sz*0.35),rx:sz*0.18,ry:sz*0.04,rot:rng(0,Math.PI),c:'#aac'});
    }
  }
    if(b.nucleoid) org.push({t:'nucleoid',x:0,y:0,r:sz*0.35,c:'#90a0ff'});
  if(b.thylakoid) org.push({t:'thylakoid',x:0,y:0,r:sz*0.6,c:'#1f8f5f'});
  if(b.vac){
    var vn=1+Math.floor(sz/6);
    for(var i=0;i<vn;i++)org.push({t:'vac',x:rng(-sz*0.45,sz*0.45),y:rng(-sz*0.4,sz*0.4),r:sz*0.1,c:'#ccaa44'});
  }
  if(b.contractile)org.push({t:'cv',x:sz*0.4,y:-sz*0.3,r:sz*0.12,c:'#66ccff'});
  if(b.ribo){
    var rn=4+Math.floor(sz/4);
    for(var i=0;i<rn;i++){
      org.push({t:'ribo',x:rng(-sz*0.5,sz*0.5),y:rng(-sz*0.45,sz*0.45),r:sz*0.04,c:'#ddd'});
    }
  }
  if(b.trich){
    var tn=5+Math.floor(sz/4);
    for(var i=0;i<tn;i++){var a=i/tn*Math.PI*2;
      org.push({t:'trich',x:Math.cos(a)*sz*0.85,y:Math.sin(a)*sz*0.85,r:sz*0.03,c:'#fcc'});
    }
  }
  if(b.eye)org.push({t:'eye',x:sz*0.5,y:0,r:sz*0.08,c:'#ff6600'});
  if(b.oral)org.push({t:'oral',x:sz*0.3,y:sz*0.2,r:sz*0.12,c:'#dd8844'});
  return org;
}

function clampToPuddle(o){
  var hw=halfW(o.y);
  if(o.x<-hw){o.x=-hw;var dot=o.vx*0.819+o.vy*(-0.574);if(dot<0){o.vx-=dot*0.819;o.vy-=dot*(-0.574);o.vx*=0.85;o.vy*=0.85;}}
  if(o.x>hw){o.x=hw;var dot2=o.vx*(-0.819)+o.vy*(-0.574);if(dot2<0){o.vx-=dot2*(-0.819);o.vy-=dot2*(-0.574);o.vx*=0.85;o.vy*=0.85;}}
  if(o.y<3){o.y=3;if(o.vy<0)o.vy=-o.vy*0.4;}
  if(o.y>PD-8){o.y=PD-8;if(o.vy>0)o.vy=-o.vy*0.3;}
}

function moveOrg(o,dt){
  var sp=o.sp;
  var speed=Math.max(sp.speed,0.8)*SPD_SCALE*0.05;
  if(o.isPlayer&&!freeCam&&!autoAI&&!o.cyst&&!o.dying){
    var ax=0,ay=0;
    if(keys['w']||keys['arrowup'])ay-=1;
    if(keys['s']||keys['arrowdown'])ay+=1;
    if(keys['a']||keys['arrowleft'])ax-=1;
    if(keys['d']||keys['arrowright'])ax+=1;
    if(ax||ay){var m=Math.sqrt(ax*ax+ay*ay);ax/=m;ay/=m;o.vx+=ax*speed*dt*16;o.vy+=ay*speed*dt*16;o.angle=Math.atan2(ay,ax);}
    if(mouseDown&&!moveTarget){
      var wx=cam.x+(mx-cv.width/2)/zoom,wy=cam.y+(my-cv.height/2)/zoom;
      var dx=wx-o.x,dy=wy-o.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d>5){o.vx+=dx/d*speed*dt*16;o.vy+=dy/d*speed*dt*16;o.angle=Math.atan2(dy,dx);}
    }
    if(moveTarget){
      var dx=moveTarget.x-o.x,dy=moveTarget.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d>10){o.vx+=dx/d*speed*dt*16;o.vy+=dy/d*speed*dt*16;o.angle=Math.atan2(dy,dx);}
      else moveTarget=null;
    }
  }else if(!o.isPlayer&&!o.cyst&&!o.dying){aiOrg(o,dt,speed);}
  else if(o.isPlayer&&autoAI&&!o.cyst&&!o.dying){aiOrg(o,dt,speed);}
  var damp=o.isPlayer&&!freeCam?0.86:0.93;
  o.vx*=Math.pow(damp,dt*60);o.vy*=Math.pow(damp,dt*60);
  if(o.sp.cat==='producer'){o.vy-=0.15*dt;}
  if(o.sp.cat==='decomposer'){o.vy+=0.2*dt;}
  if(settings.currents&&!o.dying){
    for(var i=0;i<currents.length;i++){
      var c=currents[i];var dd=(o.x-c.x)*(o.x-c.x)+(o.y-c.y)*(o.y-c.y);
      if(dd<c.r*c.r){var inf=(1-Math.sqrt(dd)/c.r)*c.strength;o.vx+=c.vx*inf*dt;o.vy+=c.vy*inf*dt;}
    }
  }
  o.x+=o.vx*dt*60;o.y+=o.vy*dt*60;
  clampToPuddle(o);
  // Glide trail for motile organisms
  if(o.glideTrail&&(Math.abs(o.vx)+Math.abs(o.vy)>1)&&fc%4===0){
    o.glideTrail.push({x:o.x,y:o.y,life:1});
    if(o.glideTrail.length>8)o.glideTrail.shift();
  }
  if(o.glideTrail)for(var i=o.glideTrail.length-1;i>=0;i--){o.glideTrail[i].life-=dt*1.5;if(o.glideTrail[i].life<=0)o.glideTrail.splice(i,1);}
  o.wobble+=dt*2;o.pulse+=dt*1.5;o.flagPhase+=dt*8;o.cilPhase+=dt*14;
  if(!o.isPlayer||autoAI||freeCam){
    var vmag=Math.abs(o.vx)+Math.abs(o.vy);
    if(vmag>0.3)o.angle=lerp(o.angle,Math.atan2(o.vy,o.vx),0.08);
  }
  if(o.divCD>0)o.divCD-=dt;
}

function aiOrg(o,dt,speed){
  var cat=o.sp.cat,foodCats=FOOD[cat]||[];
  o.state='idle';
  // Skip eating during division cooldown
  if(o.divCD>0)return;
  var prey=null,pd2=999999;
  if(foodCats.length>0&&o.energy<85){
    for(var i=0;i<orgs.length;i++){
      var p=orgs[i];
      if(!p.alive||p===o||p.cyst||p.divCD>0||p.invuln>0)continue;
      if(foodCats.indexOf(p.sp.cat)<0)continue;
      if(p.size>=o.size*0.88)continue;
      var d=dist2(o,p);if(d<pd2){pd2=d;prey=p;}
    }
  }
  if(prey&&pd2<(o.size+prey.sp.size+30)*(o.size+prey.sp.size+30)){eatOrg(o,prey);return;}
  if(prey&&pd2<350*350){
    o.state='hunt';
    var dx=prey.x-o.x,dy=prey.y-o.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d>1){o.vx+=dx/d*speed*dt*12;o.vy+=dy/d*speed*dt*12;o.angle=Math.atan2(dy,dx);}
    return;
  }
  for(var i=0;i<orgs.length;i++){
    var q=orgs[i];
    if(!q.alive||q===o)continue;
    if(FOOD[q.sp.cat]&&FOOD[q.sp.cat].indexOf(cat)>=0&&q.size>o.size*0.88){
      var d=dist2(o,q);
      if(d<180*180){
        o.state='flee';var dx=o.x-q.x,dy=o.y-q.y,dd=Math.sqrt(dx*dx+dy*dy);
        if(dd>1){o.vx+=dx/dd*speed*dt*14;o.vy+=dy/dd*speed*dt*14;o.angle=Math.atan2(dy,dx);}
        return;
      }
    }
  }
    if(cat==='producer'){
    var lightHere=lightAt(o.y);
    if(lightHere<0.3&&o.y>200)o.vy-=speed*dt*6; // stronger upward pull
    
    // Phototaxis: seek horizontal light beams (sunRays)
    if(sunRays.length>0){
      var bestDx=9999;
      for(var r=0;r<sunRays.length;r++){
        var rx = sunRays[r].x + o.y * sunRays[r].angle;
        var dx = rx - o.x;
        if(Math.abs(dx)<Math.abs(bestDx)) bestDx=dx;
      }
      if(Math.abs(bestDx) > 10 && Math.abs(bestDx) < 400){
        o.vx += Math.sign(bestDx) * speed * dt * 8; // strong pull into the beam
      }
    }
    
    o.vx+=rng(-0.3,0.3)*speed*dt*5;o.vy+=rng(-0.2,0.2)*speed*dt*5;
    if(o.vx || o.vy) o.angle = Math.atan2(o.vy, o.vx);
    return;
  }
  o.vx+=rng(-0.4,0.4)*speed*dt*6;o.vy+=rng(-0.3,0.3)*speed*dt*6;
}

function eatOrg(pred,prey){
  if(!prey.alive||prey.divCD>0||prey.invuln>0)return;
  if(prey.sp.cat==='consumer1' && Math.random()<0.15) {
     pred.parasite = prey.sp;
     pred.flashColor='#f0f'; pred.flash=0.5;
     killOrg(prey, DCODE.EATEN);
     return;
  }
  var gain=prey.energy*0.55+prey.size*1.5;
  if(!pred.stomach) pred.stomach=[];
  if(prey.sp.cat==='producer' && prey.sp.id < 8) pred.speedMult = 0.3;
  pred.stomach.push({color:prey.sp.color, size:prey.size*0.5, energy:gain, x:rng(-pred.size*0.4, pred.size*0.4), y:rng(-pred.size*0.4, pred.size*0.4)});
  pred.eaten++;pred.flash=0.3;pred.flashColor='#ff8';
  killOrg(prey,DCODE.EATEN);
  if(settings.particles)for(var i=0;i<8;i++)parts.push({x:prey.x,y:prey.y,vx:rng(-3,3),vy:rng(-3,3),life:1,maxL:1,size:rng(2,5),color:prey.sp.color});
}

function killOrg(o,cause){
  if(!o.alive)return;
  o.alive=false;o.dying=true;o.deathT=0;o.deathCause=cause;
  if(o.sp && speciesPop[o.sp.id]){speciesPop[o.sp.id].alive--;speciesPop[o.sp.id].deaths[cause]++;}
  stats.deaths++;stats.deathCauses[cause]++;
}

function doDivide(o){
  if(o.dividing||o.energy<o.sp.repEnergy||o.age<o.sp.minAge||o.divCD>0)return;
  o.dividing=true;o.divT=0;o.state='dividing';
}
function finishDivide(o){
  o.dividing=false;o.energy*=0.5; if(o===player||window.spectatorMode) window.playSound("divide");
  // KEY FIX: push child AWAY with separation impulse + cooldown
  var pushAng=rng(0,Math.PI*2);
  var cx=o.x+Math.cos(pushAng)*DIV_SEPARATION;
  var cy=o.y+Math.sin(pushAng)*DIV_SEPARATION;
  // Clamp child to puddle
  var hw=halfW(cy)-15;cx=clamp(cx,-hw,hw);cy=clamp(cy,5,PD-10);
  var child=spawnOrg(o.sp,cx,cy);
  if(child){
    child.generation=o.generation+1;child.energy=o.energy*0.9;
    child.size=o.size*rng(0.92,1.05);
    child.divCD=DIV_COOLDOWN;
    // Push apart
    var pushForce=3;
    o.vx+=Math.cos(pushAng)*pushForce;o.vy+=Math.sin(pushAng)*pushForce;
    child.vx-=Math.cos(pushAng)*pushForce;child.vy-=Math.sin(pushAng)*pushForce;
    o.offspring++;
  }
  o.divCD=DIV_COOLDOWN;
  o.flash=0.4;o.flashColor='#8f8';
  if(settings.particles)for(var i=0;i<6;i++)parts.push({x:o.x,y:o.y,vx:rng(-2,2),vy:rng(-2,2),life:1,maxL:1,size:rng(2,4),color:'#8f8'});
}
function doCyst(o){o.cyst=!o.cyst;o.cystT=0;}

// === VIRUS INFECTION ===
function spawnVirus(){
  if(viruses.length>30)return;
  var vi=Math.floor(Math.random()*VIRUS_SPECS.length);
  var vs=VIRUS_SPECS[vi];
  var d=rng(50,PD-50),hw=halfW(d)-20;
  viruses.push({x:rng(-hw,hw),y:d,vx:rng(-0.5,0.5),vy:rng(-0.5,0.5),
    sp:vs,target:null,age:0,angle:rng(0,Math.PI*2),wobble:rng(0,Math.PI*2)});
}
function updateViruses(dt){
  var vr=settings.virusRate*DIFF[difficulty].virus;
  virusT+=dt;
  if(virusT>8/vr){virusT=0;spawnVirus();}
  for(var i=viruses.length-1;i>=0;i--){
    var v=viruses[i];v.age+=dt;
    v.wobble+=dt*3;
    // Find target bacteria
    if(!v.target||!v.target.alive){
      v.target=null;
      for(var j=0;j<orgs.length;j++){
        var o=orgs[j];
        if(o.alive&&!o.infected&&o.sp.cat===v.sp.target&&dist2(v,o)<300*300){v.target=o;break;}
      }
    }
    if(v.target&&v.target.alive){
      var dx=v.target.x-v.x,dy=v.target.y-v.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<5){v.target.infected=true;v.target.infectionT=0;viruses.splice(i,1);continue;}
      v.vx+=dx/d*0.5*dt*60;v.vy+=dy/d*0.5*dt*60;
    }
    v.vx*=0.95;v.vy*=0.95;
    v.x+=v.vx*dt*60;v.y+=v.vy*dt*60;
    v.angle=Math.atan2(v.vy,v.vx);
    // Remove old viruses
    if(v.age>60)viruses.splice(i,1);
  }
}
function updateInfections(dt){
  for(var i=0;i<orgs.length;i++){
    var o=orgs[i];
    if(o.infected&&o.alive&&!o.dying){
      o.infectionT+=dt;
      o.flash=Math.max(o.flash,0.15);o.flashColor='#f44';
      // Lysis after 15-25 seconds
      if(o.infectionT>15+rng(0,10)){
        // Release new viruses + die
        var numNew=4+Math.floor(Math.random()*4);
        for(var v=0;v<numNew;v++){
          viruses.push({x:o.x+rng(-5,5),y:o.y+rng(-5,5),vx:rng(-2,2),vy:rng(-2,2),
            sp:VIRUS_SPECS[Math.floor(Math.random()*VIRUS_SPECS.length)],
            target:null,age:0,angle:rng(0,Math.PI*2),wobble:rng(0,Math.PI*2)});
        }
        killOrg(o,DCODE.LYSIS);
        if(settings.particles)for(var p=0;p<12;p++)parts.push({x:o.x,y:o.y,vx:rng(-4,4),vy:rng(-4,4),life:1,maxL:1,size:rng(2,5),color:'#f44'});
      }
    }
  }
}

function updateOrg(o,dt){
  if(o.invuln>0)o.invuln-=dt;
  if(o.speedMult < 1.0) o.speedMult = Math.min(1.0, o.speedMult + dt*0.05);
  if(o.stomach && o.stomach.length>0){
    for(var stIdx=o.stomach.length-1; stIdx>=0; stIdx--){
      var st=o.stomach[stIdx];
      var digestSpeed=dt*15;
      if(st.energy<digestSpeed) digestSpeed=st.energy;
      st.energy-=digestSpeed; o.energy+=digestSpeed;
      st.size-=dt*1.5;
      if(st.energy<=0 || st.size<=0) {
         if(settings.particles) parts.push({x:o.x, y:o.y, vx:rng(-1,1), vy:rng(-1,1), life:rng(3,8), maxL:1, size:rng(2,4), color:'#864'});
         o.stomach.splice(stIdx, 1);
      }
    }
    if(o.energy>110) o.energy=110;
  }
  
  // O2 & Temp effects
  var band = Math.max(0, Math.min(19, Math.floor(o.y / (PD/20))));
  var isDay = (tod>6&&tod<18);
  if(o.sp.cat === 'producer' && isDay) O2_GRID[band] = Math.min(150, O2_GRID[band] + o.size*dt*0.8);
  else if(o.sp.isEuk || o.sp.cat==='consumer1') O2_GRID[band] -= o.size*dt*0.05;
  
  if(O2_GRID[band] < 15 && !o.cyst && o.sp.isEuk) { o.energy -= dt*5; o.flash=0.1; o.flashColor='#f00'; }
  if(!o.cyst && (TEMP_GRID[band] < 2 || TEMP_GRID[band] > 35)) doCyst(o);
  
  // Fungal spores
  if(o.sp.cat==='decomposer' && o.energy>80 && Math.random()<0.05*dt) {
      o.energy -= 20;
      var c = spawnOrg(o.sp, o.x + rng(-20,20), o.y - rng(20, 50));
      if(c) { c.size *= 0.3; c.energy = 20; c.cyst = true; c.cystT = 0; }
  }
  if(o.dying){o.deathT+=dt;o.size*=Math.pow(0.95,dt*60);if(o.deathT>1.2)o._remove=true;return;}
  if(!o.alive)return;
  o.age+=dt;
  var metab=(0.02 + o.sp.speed * o.speedMult * 0.03)*DIFF[difficulty].metab;
  if(o.parasite) {
     o.energy -= dt*8; o.flash=0.1; o.flashColor='#f0f';
     if(Math.random()<0.02*dt) {
        var p = spawnOrg(o.parasite, o.x+rng(-10,10), o.y+rng(-10,10));
        if(p) { p.size*=0.5; p.energy=20; }
     }
  }
  
  var tempBand = Math.max(0, Math.min(19, Math.floor(o.y / (PD/20))));
  if(o.lastTemp !== undefined && Math.abs(o.lastTemp - TEMP_GRID[tempBand]) > 12) {
      if(settings.particles) for(var k=0;k<5;k++) parts.push({x:o.x,y:o.y,vx:rng(-2,2),vy:rng(-2,2),life:rng(2,5),maxL:5,size:rng(1,3),color:o.sp.color});
      killOrg(o, DCODE.STARVE); return;
  }
  o.lastTemp = TEMP_GRID[tempBand];
  if(o.sp.cat==='producer'){
    var photo=lightAt(o.y)*0.95;var nutr=0;
    for(var n=0;n<nutrientClouds.length;n++){if(dist2(o,nutrientClouds[n])<nutrientClouds[n].r*nutrientClouds[n].r){nutr=nutrientClouds[n].intensity*0.5;break;}}
    o.energy+=(photo+nutr-metab)*dt*DIFF[difficulty].energy;
  }else{o.energy-=metab*dt*DIFF[difficulty].energy;}
  var s=SEASONS[season];
  if(s.temp<o.sp.tempRange[0]-5||s.temp>o.sp.tempRange[1]+12){
    o.energy-=0.05*dt;
    if(o.energy<5&&Math.random()<0.0008*dt){killOrg(o,DCODE.TEMP);return;}
  }
  if(o.cyst){o.energy-=0.015*dt;o.cystT+=dt;if(o.cystT>25){o.cyst=false;o.cystT=0;}}
  else moveOrg(o,dt);
  if(o.dividing){o.divT+=dt;if(o.divT>1.3)finishDivide(o);}
  if(!o.isPlayer&&!o.dividing&&!o.cyst&&o.energy>o.sp.repEnergy&&o.age>o.sp.minAge&&o.divCD<=0){
    if(Math.random()<0.02*dt)doDivide(o);
  }
  if(o.energy<=-5){killOrg(o,DCODE.STARVE);return;}
  if(o.sp.isEuk&&o.age>500){o.energy-=0.15*dt;if(o.energy<5&&Math.random()<0.004*dt){killOrg(o,DCODE.AGE);return;}}
  var tgtSz=o.sp.size*o.sizeMult*(0.65+clamp(o.energy/75,0,1)*0.55);
  o.size=lerp(o.size,tgtSz,0.02*dt);
  if(o.flash>0)o.flash=Math.max(0,o.flash-dt*2);
  // Easy mode auto-divide
  if(o.isPlayer && difficulty==='easy' && o.energy>o.sp.repEnergy && o.age>o.sp.minAge && o.divCD<=0) doDivide(o);
  // AUTO-EAT: player automatically eats prey on contact (like AI does)
  if(o.isPlayer&&o.alive&&!o.dividing&&!o.cyst&&!o.dying){
    var foodCats=FOOD[o.sp.cat]||[];
    if(foodCats.length>0){
      for(var ai=0;ai<orgs.length;ai++){
        var ap=orgs[ai];
        if(!ap.alive||ap===o||ap.cyst||ap.divCD>0||ap.invuln>0)continue;
        if(foodCats.indexOf(ap.sp.cat)<0)continue;
        if(ap.size>=o.size*0.88)continue;
        var dd=dist2(o,ap);
        if(dd<(o.size+ap.sp.size+15)*(o.size+ap.sp.size+15)){
          eatOrg(o,ap);
          break;
        }
      }
    }
  }
}

function updateWorld(dt){
  dt*=timeScale;
  for(var i=0;i<orgs.length;i++)updateOrg(orgs[i],dt);
  updateInfections(dt);
  updateViruses(dt);
  for(var i=orgs.length-1;i>=0;i--){
    if(orgs[i]._remove){
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
    }
  }
  spawnT+=dt;
  if(spawnT>2.5){
    spawnT=0;
    for(var cat in TGT){
      var cnt=0;for(var j=0;j<orgs.length;j++)if(orgs[j].alive&&orgs[j].sp.cat===cat)cnt++;
      if(cnt<TGT[cat]*DIFF[difficulty].spawn*settings.density){
        var pool=SPECIES_DB.filter(function(s){return s.cat===cat;});
        if(pool.length>0){var sp=pool[Math.floor(Math.random()*pool.length)];var d=rng(20,PD-30),hw=halfW(d)-25;spawnOrg(sp,rng(-hw,hw),d);}
      }
    }
  }
  if(settings.bubbles){
    if(Math.random()<0.08){var bd=rng(PD*0.5,PD-10),bhw=halfW(bd)-10;o2Bubbles.push({x:rng(-bhw,bhw),y:bd,vy:-rng(0.5,1.5),r:rng(2,5),life:1});}
    for(var i=o2Bubbles.length-1;i>=0;i--){var b=o2Bubbles[i];b.y+=b.vy*dt*60;b.x+=rng(-0.3,0.3)*dt*60;b.life-=dt*0.08;if(b.y<5||b.life<=0)o2Bubbles.splice(i,1);}
  }
  for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vx*=0.95;p.vy*=0.95;p.life-=dt/p.maxL;if(p.life<=0)parts.splice(i,1);}
  for(var i=0;i<currents.length;i++){currents[i].x+=currents[i].vx*dt;currents[i].y+=currents[i].vy*dt;if(Math.abs(currents[i].x)>PW)currents[i].vx*=-1;if(currents[i].y<50||currents[i].y>PD-50)currents[i].vy*=-1;}
  tod+=dt/DAY_SEC*24;
  if(tod>=24){tod-=24;totalDays++;var ns=Math.floor(totalDays/SEASON_DAYS)%4;if(ns!==season)season=ns;}
  updateTodUI();
  dayLight=Math.max(0.05,Math.sin((tod-6)/24*Math.PI*2)*0.5+0.35)*SEASONS[season].light;
  rainTimer+=dt;
  if(rainTimer>25+Math.random()*40){rainTimer=0;isRaining=Math.random()<SEASONS[season].rain;if(isRaining){wind.strength=rng(0.3,0.8);wind.x=rng(-1,1)*wind.strength;wind.y=0;}else{wind.x=0;wind.y=0;}}
  if(isRaining&&settings.particles)for(var i=0;i<2;i++)rainDrops.push({x:cam.x+rng(-cv.width/2/zoom,cv.width/2/zoom),y:Math.min(cam.y-cv.height/2/zoom,-5),vy:rng(8,14),vx:wind.x*2,life:1});
  for(var i=rainDrops.length-1;i>=0;i--){var rd=rainDrops[i];rd.y+=rd.vy*dt*60;rd.x+=rd.vx*dt*60;rd.life-=dt*0.3;if(rd.life<=0||rd.y>0)rainDrops.splice(i,1);}
  updateCamera(dt);
  var curPop=0;for(var i=0;i<orgs.length;i++)if(orgs[i].alive)curPop++;
  if(curPop>gameStats.maxPop)gameStats.maxPop=curPop;
  if(player&&player.size>gameStats.maxPlayerSize)gameStats.maxPlayerSize=player.size;
  if(fc%90===0){var snap={};for(var cat in CC){var c=0;for(var j=0;j<orgs.length;j++)if(orgs[j].alive&&orgs[j].sp.cat===cat)c++;snap[cat]=c;}popHist.push(snap);if(popHist.length>100)popHist.shift();}
}

function updateCamera(dt){
  zoom=lerp(zoom,tZoom,clamp(dt*8,0,1));
  if(!freeCam&&player&&player.alive){cam.x=lerp(cam.x,player.x,clamp(dt*4,0,1));cam.y=lerp(cam.y,player.y,clamp(dt*4,0,1));}
  else if(freeCam){var cs=400/zoom*dt*60;if(camKeys.w)cam.y-=cs;if(camKeys.s)cam.y+=cs;if(camKeys.a)cam.x-=cs;if(camKeys.d)cam.x+=cs;cam.x=clamp(cam.x,-PW-200,PW+200);cam.y=clamp(cam.y,-100,PD+100);}
}
function updateTodUI(){
  if(!sliderDragging){var sl=document.getElementById('todR');if(sl)sl.value=tod;}
  var lbl=document.getElementById('todL');if(lbl){var h=Math.floor(tod),m=Math.floor((tod-h)*60);lbl.textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m;}
  var sl=document.getElementById('seasL');if(sl)sl.textContent=tt('season'+season);
}


// Override spawnOrg to catch early NaN
var originalSpawn = global.spawnOrg || spawnOrg;
spawnOrg = function() {
   var o = originalSpawn.apply(this, arguments);
   if (o && isNaN(o.speedMult)) throw new Error("Spawned org with NaN speedMult!");
   return o;
}

try {
  initWorld();
  state = 'playing';

  var dt = 0.016;
  for(var frame=0; frame<5000; frame++){
    tod += dt*0.1;
    if(tod>24) tod=0;
    
    updateWorld(dt); // THIS UPDATES EVERYTHING IN WORLD.JS
    
    for(var i=0; i<orgs.length; i++){
       var o = orgs[i];
       if(isNaN(o.x) || isNaN(o.y) || isNaN(o.size) || isNaN(o.speedMult) || isNaN(o.sizeMult)) {
          throw new Error('NaN detected in org ' + o.sp.id + ' at frame ' + frame);
       }
    }
  }
  console.log("Deep Test SUCCESS: 5000 frames without NaN or crash.");
} catch(e) {
  console.error("Deep Test FAILED:");
  console.error(e.stack);
  process.exit(1);
}
