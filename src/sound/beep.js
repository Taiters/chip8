class BeepSound {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    play() {
        var oscillator = this.audioCtx.createOscillator();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        oscillator.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.0166667);
        // the sound will play for 16.6667 milliseconds (the duration of a frame)
    }

}

// Sound will be a singleton
const instance = new BeepSound();

export default instance;
