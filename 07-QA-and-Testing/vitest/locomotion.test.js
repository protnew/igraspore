import { describe, it, expect } from 'vitest';
import { Locomotion } from '../../04-Src/js/locomotion.js';

describe('Locomotion System 5', () => {
    it('should initialize correctly', () => {
        const loco = new Locomotion(2.5, 'cilia');
        expect(loco.speed).toBe(2.5);
        expect(loco.type).toBe('cilia');
        expect(loco.active).toBe(false);
    });

    it('should start and stop', () => {
        const loco = new Locomotion();
        loco.start();
        expect(loco.active).toBe(true);
        expect(loco.getVelocity()).toBe(1.0);

        loco.stop();
        expect(loco.active).toBe(false);
        expect(loco.getVelocity()).toBe(0);
    });
});
