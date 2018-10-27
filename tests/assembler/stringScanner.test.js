import StringScanner from 'chip8/assembler/stringScanner.js';


describe('getCoords', () => {
    test('returns expected coords at start', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);

        expect(scanner.getCoords()).toEqual({
            line: 1,
            column: 1
        });
    });

    test('returns expected coords first line', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello');

        expect(scanner.getCoords()).toEqual({
            line: 1,
            column: 6
        });
    });

    test('returns expected coords second line', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello world');
        scanner.scan(/\s+/);
        scanner.scan('some');

        expect(scanner.getCoords()).toEqual({
            line: 2,
            column: 5
        });
    });

    test('returns expected coords eos', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan(/.*/s);

        expect(scanner.getCoords()).toEqual({
            line: 2,
            column: 10
        });
    });
});

describe('eol', () => {
    test('returns true at end of line', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello world');

        expect(scanner.eol()).toBe(true);
    });

    test('returns false if not at end of line', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello world\nsome');

        expect(scanner.eol()).toBe(false);
    });

    test('returns true if at end of string', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan(/.*/s);

        expect(scanner.eol()).toBe(true);
    });
});

describe('eof', () => {
    test('returns true at end of string', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan(/.*/s);

        expect(scanner.eof()).toBe(true);
    });

    test('returns false if not at end of string', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello');

        expect(scanner.eof()).toBe(false);
    });
});

describe('scan', () => {
    test('returns matched string', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        const result = scanner.scan(/\w+/);

        expect(result).toEqual('Hello');
    });

    test('iterates through string', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello world');
        scanner.scan(/\s+/);
        const result = scanner.scan(/[^:]+/);

        expect(result).toEqual('some');
    });

    test('returns false for no match', () => {
        const str = "Hello world\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        const result = scanner.scan(/\s+/);

        expect(result).toBe(false);
    });
});

describe('next', () => {
    test('returns true if next matches', () => {
        const str = "Hello world\n" +
                    "// this is a comment\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello ');

        const result = scanner.next('world');

        expect(result).toBe(true);
    });

    test('returns false if next does not match', () => {
        const str = "Hello world\n" +
                    "// this is a comment\n" +
                    "some:more";

        const scanner = new StringScanner(str);

        const result = scanner.next('world');

        expect(result).toBe(false);
    });

    test('does not consume string', () => {
        const str = "Hello world\n" +
                    "// this is a comment\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.next('Hello');

        const result = scanner.scan('Hello');

        expect(result).toBe('Hello');
    });
});

describe('skipToNextChar', () => {
    test('ignores comments on lines', () => {
        const str = "Hello world\n" +
                    "// this is a comment\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello world')
        scanner.skipToNextChar();

        const result = scanner.scan(/\w+/);

        expect(result).toBe('some');
    });

    test('ignores inline comments', () => {
        const str = "Hello world // this comment is inline\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.scan('Hello world')
        scanner.skipToNextChar();

        const result = scanner.scan(/\w+/);

        expect(result).toBe('some');
    });

    test('ignores multiline whitespace', () => {
        const str = "\n" +
                    "\n" +
                    "\n" +
                    "// a comment\n" +
                    "Hello world // this comment is inline\n" +
                    "some:more";

        const scanner = new StringScanner(str);
        scanner.skipToNextChar();

        const result = scanner.scan('Hello world');

        expect(result).toBe('Hello world');
    });
});
