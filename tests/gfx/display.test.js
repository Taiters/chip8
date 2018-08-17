import Display from 'chip8/gfx/display.js';

let canvas = null;
let ctx = null;
let display = null;

beforeEach(() => {
    ctx = {
        fillStyle: null,
        fillRect: jest.fn(),
    };

    canvas = {
        width: 640,
        height: 160,
        getContext: jest.fn(),
    };

    canvas.getContext.mockReturnValueOnce(ctx);
    display = new Display('fg', 'bg');
    display.attachCanvas(canvas);
});

afterEach(() => {
    ctx = null;
    canvas = null;
    display = null;
});

describe('clear', () => {
    test('fills entire available space with expected color', () => {
        display.clear();

        expect(ctx.fillStyle).toBe('bg')
        expect(ctx.fillRect).toBeCalledWith(0, 0, 640, 160);
    });
});

describe('fillCell', () => {
    test('fills rect in expected location', () => {
        display.fillCell(4, 6);

        expect(ctx.fillStyle).toBe('fg')
        expect(ctx.fillRect).toBeCalledWith(40, 30, 10, 5);
    });

    test('throws exception if x < 0', () => {
        expect(() => display.fillCell(-1, 2, 'ok'))
            .toThrowError();
    });

    test('throws exception if x >= 64', () => {
        expect(() => display.fillCell(64, 2, 'ok'))
            .toThrowError();
    });

    test('throws exception if y < 0', () => {
        expect(() => display.fillCell(10, -1, 'ok'))
            .toThrowError();
    });

    test('throws exception if y >= 32', () => {
        expect(() => display.fillCell(10, 32, 'ok'))
            .toThrowError();
    });
});

describe('clearCell', () => {
    test('clears rect in expected location', () => {
        display.clearCell(3, 4);

        expect(ctx.fillStyle).toBe('bg')
        expect(ctx.fillRect).toBeCalledWith(30, 20, 10, 5);
    });

    test('throws exception if x < 0', () => {
        expect(() => display.clearCell(-1, 2, 'ok'))
            .toThrowError();
    });

    test('throws exception if x >= 64', () => {
        expect(() => display.clearCell(64, 2, 'ok'))
            .toThrowError();
    });

    test('throws exception if y < 0', () => {
        expect(() => display.clearCell(10, -1, 'ok'))
            .toThrowError();
    });

    test('throws exception if y >= 32', () => {
        expect(() => display.clearCell(10, 32, 'ok'))
            .toThrowError();
    });
});
