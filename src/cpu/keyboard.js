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

function callListeners(listeners, key) {
    for(let listener of listeners) {
        listener(key);
    }
}

class Keyboard {
    constructor() {
        this.keyDownListeners = [];
        this.keyUpListeners = [];
        this.keys = [];
        for (let i = 0; i < keyMap.length; i++) {
            this.keys[i] = false;
        }
    }

    attachToTarget(target) {
        this.target = target;
        target.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            const index = keyMap.indexOf(key);
            if (index == -1)
                return;

            e.preventDefault();
            this.keys[index] = true;
            callListeners(this.keyDownListeners, index);
        });

        target.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            const index = keyMap.indexOf(key);
            if (index == -1)
                return;

            e.preventDefault();
            this.keys[index] = false;
            callListeners(this.keyUpListeners, index);
        });
    }

    onKeyDown(listener) {
        this.keyDownListeners.push(listener);
    }

    onKeyUp(listener) {
        this.keyUpListeners.push(listener);
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
