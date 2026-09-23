// lifecycle.js — mitosis pacing, daughter morph, spike gate (per trophic type)
"use strict";

// Seconds of sim time. First split keeps the founder's age/mass gate.
// cooldown = wait AFTER the first split; later = 2nd+ splits in the lineage.
var LIFE_BY_CAT = {
  producer:   { cooldown: 20, later: 34, minAge: 12, grace: 22, spikeHold: 10 },
  consumer1:  { cooldown: 22, later: 38, minAge: 14, grace: 24, spikeHold: 12 },
  consumer2:  { cooldown: 28, later: 48, minAge: 18, grace: 30, spikeHold: 14 },
  consumer3:  { cooldown: 36, later: 60, minAge: 24, grace: 36, spikeHold: 16 },
  decomposer: { cooldown: 24, later: 42, minAge: 16, grace: 28, spikeHold: 12 },
  macrophage: { cooldown: 32, later: 52, minAge: 20, grace: 30, spikeHold: 14 },
  virus:      { cooldown: 0,  later: 0,  minAge: 0,  grace: 0,  spikeHold: 0 }
};

function lifeProfile(sp){
  var cat = sp && sp.cat;
  return LIFE_BY_CAT[cat] || LIFE_BY_CAT.producer;
}

/** Cooldown applied when a split finishes. divisionsDone includes this split (1 = first). */
function mitosisCooldown(sp, divisionsDone){
  var p = lifeProfile(sp);
  if(!(p.cooldown > 0)) return 0;
  var n = (typeof divisionsDone === 'number' && divisionsDone > 0) ? divisionsDone : 1;
  if(n <= 1) return p.cooldown;
  var extra = Math.min(3, n - 1);
  return p.later * (1 + (extra - 1) * 0.25);
}

/** Age gate. Founders use species minAge; daughters (generation>=1) wait longer. */
function lifecycleMinAge(sp, generation){
  var base = (sp && sp.minAge) || 3;
  if((generation || 0) < 1) return base;
  return Math.max(base, lifeProfile(sp).minAge);
}

/**
 * Defense-ray overlay (flags.spikes). Native spines stay on mature cells.
 * Hidden while rounding for mitosis and on a fresh daughter so the lineage
 * morph matches the parent instead of sprouting rays early.
 */
function showDefenseSpikes(o){
  if(!o || !o.sp || !o.sp.flags || !o.sp.flags.spikes) return false;
  if(o.dividing || o._preMitosis) return false;
  if((o._spikeHold || 0) > 0) return false;
  if(o._fromDivide && (o._divideAge || 0) < ((o.sp && o.sp.minAge) || 8)) return false;
  return true;
}

/** Readable daughter size: same lineage, smaller, still above the "dot" floor. */
function daughterSize(parent){
  var sp = (parent && parent.sp) || {};
  var adult = (sp.size || 4) * ((parent && parent.sizeMult) || 1);
  var base = (parent && (parent.preDivSize || parent.size)) || adult;
  var sz = base * 0.64;
  var floor = Math.max(2.2, adult * 0.55);
  var cap = Math.max(floor, adult * 0.82);
  if(sz < floor) sz = floor;
  if(sz > cap) sz = cap;
  return sz;
}

function daughterMorph(parent){
  var sp = parent && parent.sp;
  var sz = daughterSize(parent);
  return {
    sp: sp,
    shape: sp && sp.shape,
    color: sp && sp.color,
    size: sz,
    sizeMult: (parent && parent.sizeMult) || 1,
    flags: (sp && sp.flags) || {}
  };
}

/** Demo/aquarium caption visibility. Demo defaults ON unless LS is explicitly "0". */
function demoLabelsDefault(stored){
  return stored !== '0';
}

function entityLabelsOn(mode){
  mode = mode || {};
  if(mode.demoMode) return mode.demoLabels !== false;
  if(mode.aquarium) return true;
  return false;
}

if(typeof window !== 'undefined'){
  window.LIFE_BY_CAT = LIFE_BY_CAT;
  window.lifeProfile = lifeProfile;
  window.mitosisCooldown = mitosisCooldown;
  window.lifecycleMinAge = lifecycleMinAge;
  window.showDefenseSpikes = showDefenseSpikes;
  window.daughterSize = daughterSize;
  window.daughterMorph = daughterMorph;
  window.demoLabelsDefault = demoLabelsDefault;
  window.entityLabelsOn = entityLabelsOn;
}
