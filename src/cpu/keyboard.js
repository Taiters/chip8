const keyMap = [
    'x', // 0
    '1', // 1
    '2', // 2
    '3', // 3
    'q', // 4
    'w', // 5
    'e', // 6
    'a', // 7
    's', // 8
    'd', // 9
    'z', // A
    'c', // B
    '4', // C
    'r', // D
    'f', // E
    'v', // F
];

const mapEventTokey = (e) => keyMap.indexOf(e.key.toLowerCase());


const keyboard = (onKeyDown, onKeyUp, target = window) => {
    target.addEventListener('keydown', (e) => {
        const key = mapEventTokey(e);
        if (key == -1)
            return;

        e.preventDefault();
        onKeyDown(key);
    });

    target.addEventListener('keyup', (e) => {
        const key = mapEventTokey(e);
        if (key == -1)
            return;

        e.preventDefault();
        onKeyUp(key);
    });
};

export default keyboard;
