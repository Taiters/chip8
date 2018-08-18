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
        target.addEventListener('keydown', (e) => {
            this.keys[keyMap[e.key]] = true;
        });

        target.addEventListener('keyup', (e) => {
            this.keys[keyMap[e.key]] = true;
        });
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
