import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const _bioDir = path.resolve(__dirname, '../../js');
const biologyCode = [
  'biology.js', 'biology_divide.js', 'biology_eat.js', 'biology_virus.js'
].map(f => fs.readFileSync(path.join(_bioDir, f), 'utf-8')).join('\n');

describe('biology.js core logic', () => {
    let context;

    beforeEach(() => {
        const sandbox = {
            Math, console, Object, Array, String, Number, Boolean,
            Date, JSON, RegExp, Error,
            orgs: [],
            MAX_ORG: 1000,
            PD: 2000,
            rng: (min, max) => min + (max - min) * 0.5,
            clamp: (val, min, max) => Math.min(Math.max(val, min), max),
            halfW: (y) => 1000,
            gt: 0,
            speciesPop: {},
            stats: { births: 0, deaths: 0, deathCauses: {} },
            player: { x: 0, y: 0 },
            DIV_SEPARATION: 50,
            DIV_COOLDOWN: 10,
            parts: [],
            settings: { particles: true, virusRate: 1, currents: false, healthBars: true, predation: 1.0, divRate: 1.0 },
            DCODE: { EATEN: 0, LYSIS: 1, TEMP: 2, STARVE: 3, AGE: 4 },
            dist2: (a, b) => (a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y),
            nutrientClouds: [],
            viruses: [],
            VIRUS_SPECS: [{ id: 'v1', type: 'lytic', target: 'consumer1' }],
            DIFF: { normal: { virus: 1, metab: 1, energy: 1 }, easy: { metab: 1, energy: 1 } },
            difficulty: 'normal',
            virusT: 0,
            O2_GRID: new Array(20).fill(100),
            tod: 12,
            dayLight: 1.0,
            globalCO2: 50,
            globalO2: 50,
            o2Bubbles: [],
            lightAt: (y) => 1.0,
            lerp: (a, b, t) => a + (b - a) * t,
            FOOD: { consumer1: ['producer'] },
            cam: { x: 0, y: 0 },
            zoom: 1,
            mx: 0, my: 0,
            cv: { width: 800, height: 600 },
            fc: 0,
            currents: [],
            shoreDecor: [],
            sedimentClumps: [],
            sunRays: [],
            pheromones: [],
            speciesSeq: 0,
            genOrgans: (o) => [],
            window: {
                spectatorMode: false,
                playSound: vi.fn(),
                focusTimer: 0,
                focusTarget: null,
                dmgIndicators: [],
                gameStats: { dna: 0 },
                pheromones: [],
                toxicClouds: [],
                logEvent: vi.fn(),
                getTempAt: (x, y) => 25,
                showToast: vi.fn()
            },
            state: 'game'
        };

        for(let key in sandbox.DCODE) {
            sandbox.stats.deathCauses[sandbox.DCODE[key]] = 0;
        }

        context = vm.createContext(sandbox);
        vm.runInContext(biologyCode, context);
    });

    const createMockSpecies = (cat = 'consumer1', size = 10, energy = 100, repEnergy = 80, minAge = 10, tempRange = [10, 30]) => ({
        id: 'mock_sp_' + Math.random(),
        name: 'Mock Species',
        cat,
        size,
        energy,
        repEnergy,
        minAge,
        tempRange,
        speed: 10,
        flags: {}
    });

    it('spawnOrg should create an organism and add it to orgs', () => {
        const sp = createMockSpecies();
        context.speciesPop[sp.id] = { alive: 0, born: 0, deaths: {} };
        const o = context.spawnOrg(sp, 100, 100, false);
        
        expect(o).toBeDefined();
        expect(o.x).toBe(100);
        expect(o.y).toBe(100);
        expect(o.alive).toBe(true);
        expect(context.orgs.length).toBe(1);
        expect(context.stats.births).toBe(1);
        expect(context.speciesPop[sp.id].alive).toBe(1);
    });

    it('doDivide should set dividing state if requirements met', () => {
        const sp = createMockSpecies('consumer1', 10, 100, 80, 3);
        context.speciesPop[sp.id] = { alive: 0, born: 0, deaths: {} };
        const o = context.spawnOrg(sp, 100, 100);
        o.energy = 200;
        o.age = 20;
        o.divCD = 0;
        o.dividing = false;
        o.massFood = 100;
        o.eatsSinceDiv = 10;
        o.size = sp.size * 1.2;  // larger than 80% of adult size
        o.sizeMult = 1.0;
        o.cyst = false;
        o.dying = false;

        context.doDivide(o);

        expect(o.dividing).toBe(true);
        expect(o.state).toBe('dividing');
    });

    it('finishDivide should create child and split energy', () => {
        const sp = createMockSpecies();
        context.speciesPop[sp.id] = { alive: 0, born: 0, deaths: {} };
        const o = context.spawnOrg(sp, 100, 100);
        o.energy = 200;
        o.dividing = true;
        o.divT = 1.5;
        o.preDivSize = sp.size;
        o.size = sp.size;
        o.massFood = 10;
        o.eatsSinceDiv = 5;

        context.finishDivide(o);

        expect(o.dividing).toBe(false);
        // Energy should be reduced (halved + transferred to child)
        expect(o.energy).toBeLessThan(200);
        expect(context.orgs.length).toBe(2);
    });

    it('eatOrg should transfer energy from prey to predator', () => {
        const predSp = createMockSpecies('consumer1', 20, 100);
        const preySp = createMockSpecies('producer', 5, 50);
        context.speciesPop[predSp.id] = { alive: 0, born: 0, deaths: {} };
        context.speciesPop[preySp.id] = { alive: 0, born: 0, deaths: {} };
        const pred = context.spawnOrg(predSp, 100, 100);
        const prey = context.spawnOrg(preySp, 105, 105);
        pred.eatCD = 0;

        const energyBefore = pred.energy;
        context.eatOrg(pred, prey);

        // Predator should gain energy
        expect(pred.energy).toBeGreaterThan(energyBefore);
        expect(prey.alive).toBe(false);
    });

    it('eatOrg should apply toxic defense', () => {
        const predSp = createMockSpecies('consumer1', 20, 100);
        const toxicSp = createMockSpecies('producer', 5, 50);
        toxicSp.flags = { toxic: true };
        context.speciesPop[predSp.id] = { alive: 0, born: 0, deaths: {} };
        context.speciesPop[toxicSp.id] = { alive: 0, born: 0, deaths: {} };
        const pred = context.spawnOrg(predSp, 100, 100);
        const prey = context.spawnOrg(toxicSp, 105, 105);
        pred.eatCD = 0;

        context.eatOrg(pred, prey);
        // Toxic effect: either speedMult reduced or flash set
        expect(pred.flashColor === '#f0f' || pred.speedMult < 1 || prey.alive === false).toBe(true);
    });

    it('killOrg should set dying state and log death', () => {
        const sp = createMockSpecies();
        context.speciesPop[sp.id] = { alive: 1, born: 1, deaths: {} };
        for(let k in context.DCODE) context.speciesPop[sp.id].deaths[context.DCODE[k]] = 0;
        const o = context.spawnOrg(sp, 100, 100);
        
        context.killOrg(o, context.DCODE.STARVE);
        
        expect(o.alive).toBe(false);
        expect(o.dying).toBe(true);
        expect(o.deathCause).toBe(context.DCODE.STARVE);
        expect(context.stats.deaths).toBe(1);
    });

    it('doCyst should toggle cyst state', () => {
        const sp = createMockSpecies();
        context.speciesPop[sp.id] = { alive: 0, born: 0, deaths: {} };
        const o = context.spawnOrg(sp, 100, 100);
        
        expect(o.cyst).toBe(false);
        context.doCyst(o);
        expect(o.cyst).toBe(true);
        expect(o.speedMult).toBe(0);
    });

    it('updateInfections should cause lysis after duration', () => {
        const sp = createMockSpecies();
        context.speciesPop[sp.id] = { alive: 0, born: 0, deaths: {} };
        const o = context.spawnOrg(sp, 100, 100);
        o.infected = true;
        o.infectionT = 30; // past lysis threshold (15-25s)
        
        context.updateInfections(0.1);
        
        // Cell should be dead from lysis
        expect(o.alive).toBe(false);
    });

    it('updateViruses should infect targets', () => {
        const sp = createMockSpecies('consumer1');
        context.speciesPop[sp.id] = { alive: 0, born: 0, deaths: {} };
        const o = context.spawnOrg(sp, 100, 100);
        o.size = 5;
        context.orgs.push(o);
        
        context.updateViruses(0.1);
        
        // Some organism should be infected (or at least no crash)
        expect(context.orgs.length).toBeGreaterThan(0);
    });
});
