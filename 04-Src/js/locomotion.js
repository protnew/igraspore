class Locomotion {
    constructor(speed = 1.0, type = 'flagella') {
        this.speed = speed;
        this.type = type;
        this.active = false;
    }

    start() {
        this.active = true;
    }

    stop() {
        this.active = false;
    }

    getVelocity() {
        return this.active ? this.speed : 0;
    }
}

if (typeof window !== 'undefined') window.Locomotion = Locomotion;
