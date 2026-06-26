import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const biologyCode = fs.readFileSync(path.resolve(__dirname, '../../04-Src/js/biology.js'), 'utf-8');

describe('biology.js core logic', () => {
    let context;

    beforeEach(() => {
        const sandbox = {
            Math, console, Object, Array, String, Number, Boolean,
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
            settings: { particles: true, virusRate: 1, currents: false, healthBars: true },
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
            globalCO2: 50,
            globalO2: 50,
            o2Bubbles: [],
            lightAt: (y) => 1.0,
            lerp: (a, b, t) => a + (b - a) * t,
            FOOD: { consumer1: ['producer'] },
            cam: { x: 0, y: 0 },
            zoom: 1,
            mx: 0,
            my: 0,
            cv: { width: 800, height: 600 },
            fc: 0,
            currents: [],
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
                getTempAt: (x, y) => 25
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
        const sp = createMockSpecies();
        const o = context.spawnOrg(sp, 100, 100);
        o.energy = 200;
        o.age = 20;
        o.divCD = 0;
        o.dividing = false;

        context.doDivide(o);

        expect(o.dividing).toBe(true);
        expect(o.state).toBe('dividing');
    });

    it('finishDivide should halve energy and create child', () => {
        const sp = createMockSpecies();
        const o = context.spawnOrg(sp, 100, 100);
        o.energy = 200;
        o.dividing = true;

        context.finishDivide(o);

        expect(o.dividing).toBe(false);
        expect(o.energy).toBe(100);
        expect(context.orgs.length).toBe(2);
        const child = context.orgs[1];
        expect(child.generation).toBe(1);
        expect(o.offspring).toBe(1);
        expect(child.divCD).toBe(context.DIV_COOLDOWN);
    });

    it('eatOrg should transfer energy and apply damage', () => {
        const predSp = createMockSpecies('consumer1', 20, 100);
        const preySp = createMockSpecies('producer', 10, 50);
        
        const pred = context.spawnOrg(predSp, 100, 100);
        const prey = context.spawnOrg(preySp, 100, 100);
        
        prey.size = 2; // small enough to be eaten completely
        pred.stomach = [];
        
        context.eatOrg(pred, prey);
        
        expect(prey.alive).toBe(false); // Killed
        expect(pred.stomach.length).toBe(1);
        expect(pred.eaten).toBe(1);
        expect(pred.energy).toBeGreaterThan(100);
    });

    it('eatOrg should apply toxic defense', () => {
        const predSp = createMockSpecies('consumer1', 20, 100);
        const preySp = createMockSpecies('producer', 10, 50);
        preySp.flags = { toxic: true };
        
        const pred = context.spawnOrg(predSp, 100, 100);
        const prey = context.spawnOrg(preySp, 100, 100);
        
        prey.size = 20; // partial eat
        
        context.eatOrg(pred, prey);
        
        expect(pred.speedMult).toBe(0.1); // Poisoned
        expect(pred.energy).toBeLessThan(100);
        expect(prey.size).toBeLessThan(20);
    });

    it('killOrg should set dying state and log death', () => {
        const sp = createMockSpecies();
        context.speciesPop[sp.id] = { alive: 1, born: 1, deaths: { [context.DCODE.STARVE]: 0 } };
        const o = context.spawnOrg(sp, 100, 100);
        
        context.killOrg(o, context.DCODE.STARVE);
        
        expect(o.alive).toBe(false);
        expect(o.dying).toBe(true);
        expect(o.deathCause).toBe(context.DCODE.STARVE);
        expect(context.stats.deaths).toBe(1);
        expect(context.window.pheromones.length).toBeGreaterThan(0);
    });

    it('doCyst should toggle cyst state', () => {
        const sp = createMockSpecies();
        const o = context.spawnOrg(sp, 100, 100);
        
        expect(o.cyst).toBe(false);
        context.doCyst(o);
        expect(o.cyst).toBe(true);
        context.doCyst(o);
        expect(o.cyst).toBe(false);
    });

    it('updateOrg should handle cyst mode correctly', () => {
        const sp = createMockSpecies();
        const o = context.spawnOrg(sp, 100, 100);
        o.cyst = true;
        o.energy = 50;
        o.cystT = 0;
        
        context.window.getTempAt = () => 0; // Cold enough to stay in cyst
        
        context.moveOrg = vi.fn();
        
        context.updateOrg(o, 1.0);
        
        expect(context.moveOrg).not.toHaveBeenCalled();
        expect(o.energy).toBeLessThan(50);
        expect(o.cystT).toBe(1.0);
    });

    it('updateOrg should handle photosynthesis for producers', () => {
        const sp = createMockSpecies('producer');
        const o = context.spawnOrg(sp, 100, 100);
        o.energy = 50;
        
        const initialO2 = context.globalO2;
        const initialCO2 = context.globalCO2;
        
        context.moveOrg = vi.fn();
        
        context.updateOrg(o, 1.0);
        
        expect(context.globalO2).toBeGreaterThan(initialO2);
        expect(context.globalCO2).toBeLessThan(initialCO2);
        expect(o.energy).not.toBe(50);
    });

    it('updateInfections should cause lysis after duration', () => {
        const sp = createMockSpecies();
        const o = context.spawnOrg(sp, 100, 100);
        o.infected = true;
        o.infectionT = 20; // past lysis time
        
        context.updateInfections(1.0);
        
        expect(o.alive).toBe(false);
        expect(o.deathCause).toBe(context.DCODE.LYSIS);
        expect(context.viruses.length).toBeGreaterThan(0);
    });

    it('updateViruses should infect targets', () => {
        const sp = createMockSpecies('consumer1');
        const o = context.spawnOrg(sp, 100, 100);
        
        context.viruses.push({
            x: 101, y: 101, vx: 0, vy: 0,
            sp: context.VIRUS_SPECS[0], target: o, age: 0
        });
        
        context.updateViruses(0.1);
        
        expect(o.infected).toBe(true);
        expect(context.viruses.length).toBe(0);
    });
});
