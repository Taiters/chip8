class Timer {
    constructor(frequencyHz, callback) {
        this.frequencyHz = frequencyHz;
        this.millisPerTick = 1000 / frequencyHz;
        this.callback = callback;
        this.tick = this.tick.bind(this);
    }

    start() {
        this.isStopped = false;
        this.lastTimestamp = 0;

        window.requestAnimationFrame(this.tick);
    }

    stop() {
        this.isStopped = true;
    }

    tick(timestamp) {
        if (this.isStopped)
            return;

        if (timestamp - this.lastTimestamp > this.millisPerTick) {
            this.lastTimestamp = timestamp;
            this.callback();
        }

        window.requestAnimationFrame(this.tick);
    }
}

function timer(frequencyHz, callback) {
    return new Timer(frequencyHz, callback);
}

export default timer;
