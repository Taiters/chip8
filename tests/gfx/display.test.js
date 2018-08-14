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
    display = new Display(canvas);
});

afterEach(() => {
    ctx = null;
    canvas = null;
    display = null;
});

describe('clear', () => {
    test('sets fill style to expected color', () => {
        display.clear('a color');

        expect(ctx.fillStyle).toBe('a color')
    });

    test('fills entire available space', () => {
        display.clear('a color');

        expect(ctx.fillRect).toBeCalledWith(0, 0, 640, 160);
    });
});

describe('renderCell', () => {
    test('sets fill style to expected color', () => {
        display.renderCell(1, 2, 'another color');

        expect(ctx.fillStyle).toBe('another color')
    });

    test('fills rect in expected location', () => {
        display.renderCell(4, 6, 'another');

        expect(ctx.fillRect).toBeCalledWith(40, 30, 10, 5);
    });

    test('throws exception if x < 0', () => {
        expect(() => display.renderCell(-1, 2, 'ok'))
            .toThrowError();
    });

    test('throws exception if x >= 64', () => {
        expect(() => display.renderCell(64, 2, 'ok'))
            .toThrowError();
    });

    test('throws exception if y < 0', () => {
        expect(() => display.renderCell(10, -1, 'ok'))
            .toThrowError();
    });

    test('throws exception if y >= 32', () => {
        expect(() => display.renderCell(10, 32, 'ok'))
            .toThrowError();
    });
});
