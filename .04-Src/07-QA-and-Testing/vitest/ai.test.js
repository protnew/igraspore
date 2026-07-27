import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const aiCode = fs.readFileSync(path.resolve(__dirname, '../../04-Src/js/ai.js'), 'utf-8');

describe('ai.js core logic', () => {
    let context;

    beforeEach(() => {
        const sandbox = {
            Math, console, Object, Array, String, Number, Boolean,
            orgs: [],
            window: {
                spatialGrid: null,
                getTempAt: (x, y) => 25,
                pheromones: []
            },
            SPD_SCALE: 1.0,
            freeCam: false,
            autoAI: false,
            keys: {},
            mouseDown: false,
            moveTarget: null,
            cam: { x: 0, y: 0 },
            mx: 0,
            my: 0,
            cv: { width: 800, height: 600 },
            zoom: 1.0,
            fc: 0,
            currents: [],
            settings: { currents: false },
            FOOD: {
                consumer1: ['producer'],
                consumer3: ['consumer1']
            },
            viruses: [],
            gt: 0,
            dist2: (a, b) => (a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y),
            rng: (min, max) => min + (max - min) * 0.5,
            clampToPuddle: vi.fn(),
            lerp: (a, b, t) => a + (b - a) * t
        };

        context = vm.createContext(sandbox);
        vm.runInContext(aiCode, context);
    });

    const createMockOrg = (id, cat, x, y, size = 10, isPlayer = false) => ({
        id,
        sp: { id: 'sp_'+cat, cat, speed: 10, tempRange: [10, 30] },
        x, y, vx: 0, vy: 0, size,
        alive: true, cyst: false, dying: false,
        energy: 50,
        isPlayer,
        divCD: 0,
        state: 'idle',
        angle: 0,
        wobble: 0, pulse: 0, flagPhase: 0, cilPhase: 0
    });

    it('window.getNearby should return all orgs if spatialGrid is not defined', () => {
        context.orgs.push({ id: 1 });
        const res = context.window.getNearby(0, 0, 100);
        expect(res.length).toBe(1);
    });

    it('moveOrg should handle cyst movement (gravity)', () => {
        const o = createMockOrg(1, 'consumer1', 100, 100);
        o.cyst = true;
        o.vy = 0;

        context.moveOrg(o, 1.0); // dt = 1.0

        expect(o.vy).toBeGreaterThan(0); // Gravity should pull it down
        expect(context.clampToPuddle).toHaveBeenCalledWith(o);
    });

    it('moveOrg should call aiOrg for non-player entities', () => {
        const o = createMockOrg(1, 'consumer1', 100, 100);
        
        let aiOrgCalled = false;
        const originalAiOrg = context.aiOrg;
        context.aiOrg = (org, dt, speed) => { aiOrgCalled = true; };
        
        context.moveOrg(o, 1.0);
        
        expect(aiOrgCalled).toBe(true);
        context.aiOrg = originalAiOrg; // restore
    });

    it('aiOrg should hunt prey if hungry and food is nearby', () => {
        const pred = createMockOrg(1, 'consumer1', 100, 100, 20); // larger
        const prey = createMockOrg(2, 'producer', 105, 105, 10); // smaller, nearby
        
        context.orgs.push(pred, prey);
        pred.energy = 40; // hungry
        
        context.aiOrg(pred, 1.0, 0.5);
        
        expect(pred.state).toBe('hunt');
        expect(pred.vx).toBeGreaterThan(0);
        expect(pred.vy).toBeGreaterThan(0);
    });

    it('aiOrg should panic and flee from predators', () => {
        const pred = createMockOrg(1, 'consumer3', 100, 100, 50); // predator
        const prey = createMockOrg(2, 'consumer1', 105, 105, 10); // prey, nearby
        
        context.orgs.push(pred, prey);
        
        context.aiOrg(prey, 1.0, 0.5);
        
        expect(prey.state).toBe('panic');
        expect(prey.vx).toBeGreaterThan(0);
        expect(prey.vy).toBeGreaterThan(0);
    });

    it('aiOrg should flee from danger pheromones', () => {
        const o = createMockOrg(1, 'consumer1', 100, 100);
        context.window.pheromones.push({ type: 'danger', x: 105, y: 105 });
        
        context.orgs.push(o);
        
        context.aiOrg(o, 1.0, 0.5);
        
        expect(o.state).toBe('flee');
        expect(o.vx).toBeLessThan(0);
        expect(o.vy).toBeLessThan(0);
    });

    it('aiOrg should migrate if temperature is outside optimal range', () => {
        const o = createMockOrg(1, 'consumer1', 100, 100);
        o.sp.tempRange = [10, 20];
        
        context.window.getTempAt = (x, y) => {
            if (y === 100) return 30; // Current is hot
            if (y < 100) return 25; // Up is cooler
            if (y > 100) return 35; // Down is hotter
            return 30;
        };
        
        context.aiOrg(o, 1.0, 0.5);
        
        expect(o.state).toBe('migrate');
        expect(o.vy).toBeLessThan(0); // Should swim up to cooler area
    });

    it('aiOrg should enter biofilm if kin are nearby (producer/decomposer/consumer1)', () => {
        const o = createMockOrg(1, 'producer', 100, 100);
        o.biofilmT = 0; // trigger check
        
        context.orgs.push(o);
        for(let i=0; i<5; i++) {
            context.orgs.push(createMockOrg(i+2, 'producer', 100, 100)); // 5 kin nearby
        }
        
        const origRng = context.Math.random;
        context.Math.random = () => 0.05; // < 0.1
        
        context.aiOrg(o, 1.0, 0.5);
        
        context.Math.random = origRng;
        
        expect(o.inBiofilm).toBe(true);
        expect(o.biofilmT).toBe(14);
    });

    it('aiOrg should hunt viruses if macrophage', () => {
        const o = createMockOrg(1, 'macrophage', 100, 100);
        const virus = { x: 105, y: 105 };
        context.viruses.push(virus);
        
        context.aiOrg(o, 1.0, 0.5);
        
        expect(o.vx).toBeGreaterThan(0);
        expect(o.vy).toBeGreaterThan(0);
    });
});
