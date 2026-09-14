import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const code = fs.readFileSync(path.resolve(__dirname, '../../js/locomotion.js'), 'utf-8');
const sandbox = { window: {}, module: { exports: {} }, exports: {} };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
// Support class on global or window
const Locomotion = sandbox.Locomotion || sandbox.window.Locomotion;

describe('Locomotion System', () => {
    it('should initialize correctly', () => {
        const loco = new Locomotion(2.5, 'cilia');
        expect(loco.speed).toBe(2.5);
        expect(loco.type).toBe('cilia');
        expect(loco.active).toBe(false);
    });

    it('should start and stop', () => {
        const loco = new Locomotion(1.0, 'flagella');
        loco.start();
        expect(loco.active).toBe(true);
        loco.stop();
        expect(loco.active).toBe(false);
    });

    it('getVelocity reflects active state', () => {
        const loco = new Locomotion(3.0, 'flagella');
        expect(loco.getVelocity()).toBe(0);
        loco.start();
        expect(loco.getVelocity()).toBe(3.0);
    });
});
