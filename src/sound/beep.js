class BeepSound {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = null;
    }

    createOscillator() {
        const oscillator = this.audioCtx.createOscillator();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        oscillator.connect(this.audioCtx.destination);

        return oscillator;
    }

    play() {
        if (this.oscillator != null)
            return;

        this.oscillator = this.createOscillator();
        this.oscillator.start();
    }

    stop() {
        if (this.oscillator == null)
            return;

        this.oscillator.stop(this.audioCtx.currentTime);
        this.oscillator = null;
    }

}

// Sound will be a singleton
const instance = new BeepSound();

export default instance;
