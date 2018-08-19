const keyMap = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
];

class Keyboard {
    constructor() {
        this.keys = {};
        for (let i = 0; i < keyMap.length; i++) {
            this.keys[keyMap[i]] = false;
        }
    }

    attachToTarget(target) {
        this.target = target;
        target.addEventListener('keydown', (e) => {
            e.preventDefault();
            const key = e.key.toLowerCase();
            this.keys[keyMap[key]] = true;
        });

        target.addEventListener('keyup', (e) => {
            e.preventDefault(); const key = e.key.toLowerCase();
            this.keys[keyMap[key]] = true;
        });
    }

    waitKey(callback) {
        for (let i = 0; i < this.keys.length; i++) {
            if (this.keys[i]) {
                callback(i);
            }
        }

        this.target.addEventListener('keydown', (e) => {
            e.preventDefault();
            const key = e.key.toLowerCase();
            callback(keyMap[key]);
        }, {once: true});
    }

    isPressed(keyIndex) {
        const key = keyMap[keyIndex];
        const value = this.keys[key];
        if (value === 'undefined') {
            throw 'Invalid key';
        }

        return value;
    }
}

export default Keyboard;
