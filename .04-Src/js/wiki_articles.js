// wiki_articles.js - lazy wiki pack loader. Bodies live in i18n/wiki/<lang>.json.
// ASCII-only source (CF Pages safe). Loaded before ui_screens.js.
"use strict";
window.WIKI_PACKS = window.WIKI_PACKS || {};
var _wikiPackReq = {};
var _wikiPackCbs = [];

window.ensureWikiPack = function(lang, cb){
  lang = lang || ((typeof curLang !== 'undefined' && curLang) ? curLang : 'en');
  if (window.WIKI_PACKS[lang]) { if (cb) cb(true); return; }
  if (cb) _wikiPackCbs.push(cb);
  if (_wikiPackReq[lang]) return;
  _wikiPackReq[lang] = true;
  fetch('i18n/wiki/' + lang + '.json').then(function(r){
    return r.ok ? r.json() : null;
  }).then(function(j){
    if (j) window.WIKI_PACKS[lang] = j;
    var cbs = _wikiPackCbs.splice(0, _wikiPackCbs.length);
    for (var i = 0; i < cbs.length; i++) { try { cbs[i](!!j); } catch (e) {} }
  }).catch(function(){
    _wikiPackReq[lang] = false;
  });
};

window.getWikiArticle = function(sp){
  if(!sp) return "";
  var lang = (typeof curLang !== 'undefined' && curLang) ? curLang : 'en';
  var pack = window.WIKI_PACKS[lang] || window.WIKI_PACKS.en || window.WIKI_PACKS.ru || {};
  var a = pack[sp.id];
  if(!a && sp.name) a = pack[sp.name];
  return (a && a.body) || "";
};

window.wikiPage = function(sp){
  var name = (sp && sp.name) ? String(sp.name) : "";
  if(!name) return "";
  var MAP = {
    "T4 Bacteriophage":"Escherichia_virus_T4",
    "Lambda Phage":"Lambda_phage",
    "T7 Bacteriophage":"Escherichia_virus_T7",
    "Phi-6 Phage":"Pseudomonas_virus_phi6",
    "MS2 Phage":"Escherichia_virus_MS2",
    "Neuro-Parasite":"",
    "Sexual Eukaryote":"Sexual_reproduction",
    "Spirulina platensis":"Arthrospira_platensis",
    "Synechocystis sp.":"Synechocystis",
    "Gloeocapsa sp.":"Gloeocapsa",
    "Navicula sp.":"Navicula",
    "Vampirococcus sp.":"Vampirococcus",
    "Daptobacter sp.":"Daptobacter",
    "Halobacteriovorax sp.":"Halobacteriovorax"
  };
  if(Object.prototype.hasOwnProperty.call(MAP, name)){
    return MAP[name] ? ("https://en.wikipedia.org/wiki/"+MAP[name]) : "";
  }
  var slug = name.replace(/ sp\.$/i,"").replace(/ /g,"_");
  return "https://en.wikipedia.org/wiki/"+slug;
};
