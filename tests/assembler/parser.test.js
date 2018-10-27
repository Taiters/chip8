import fs from 'fs';
import parser from 'chip8/assembler/parser.js';


describe('parse', () => {
    test('parses file', () => {
        const asm = fs.readFileSync('tests/_fixtures/test.asm', 'utf-8');
        const ast = require('../_fixtures/test.ast.json');
        const result = parser.parse(asm);

        expect(result).toEqual(ast);
    });
});

