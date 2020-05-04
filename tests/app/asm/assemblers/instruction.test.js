import Arguments from 'chip8/app/asm/arguments';
import InstructionAssembler, {
    nnn,
    xkk,
    xy,
} from 'chip8/app/asm/assemblers/instruction';
import { UnknownInstructionException } from 'chip8/app/asm/assemblers/exceptions';


function arg(type, value) {
    return {
        type,
        token: {
            value,
        },
    };
}

function instruction(instruction, ...args) {
    return {
        instruction,
        args
    };
}

describe('InstructionAssembler', () => {
    test('assemble with no args', () => {
        const assembler = InstructionAssembler.builder()
            .add(i => i.withInstruction('foo')
                .withAssembler((instruction, _) => 0x123)
                .build())
            .add(i => i.withInstruction('bar')
                .withAssembler((instruction, _) => 0x456)
                .build())
            .build();
        
        const result = assembler.assemble(instruction('bar'));

        expect(result).toBe(0x456);
    });

    test('assemble with args', () => {
        const assembler = InstructionAssembler.builder()
            .add(i => i.withInstruction('foo')
                .withAssembler(_ => 0x123)
                .build())
            .add(i => i.withInstruction('foo')
                .withArgs('a')
                .withAssembler(_ => 0x456)
                .build())
            .add(i => i.withInstruction('foo')
                .withArgs('a', 'b')
                .withAssembler(_ => 0x789)
                .build())
            .build();
        
        const result = assembler.assemble(instruction('foo', arg('a'), arg('b')));

        expect(result).toBe(0x789);
    });

    test('assemble passes lookup table instruction to assembler', () => {
        const assembler = InstructionAssembler.builder()
            .add(i => i.withInstruction('foo')
                .withArgs('a')
                .withAssembler((instruction, lookup) => 
                    `${instruction.instruction} ${lookup['bar']}`)
                .build())
            .build();
        
        const result = assembler.assemble(instruction('foo', arg('a')), {
            'bar': 'bat',
        });

        expect(result).toBe('foo bat');
    });

    test('assemble throws exception for unknown instruction type', () => {
        const assembler = InstructionAssembler.builder()
            .add(i => i.withInstruction('foo')
                .withAssembler(_ => true)
                .build())
            .build();
        
        expect(() => assembler.assemble(instruction('bar'))).toThrow(UnknownInstructionException);
    });
});

test('nnn', () => {
    const assembler = InstructionAssembler.builder()
        .add(i => nnn(0x8000, i.withInstruction('test')))
        .build();

    const lookup = {
        'foo': 0x123,
        'bar': 0x456,
    }

    const result = assembler.assemble(
        instruction('test', arg(Arguments.ADDRESS, 'bar')),
        lookup);

    expect(result).toBe(0x8456);
});

test('xkk', () => {
    const assembler = InstructionAssembler.builder()
        .add(i => xkk(0xF000, i.withInstruction('test')))
        .build();

    const result = assembler.assemble(
        instruction('test', arg(Arguments.REGISTER, 5), arg(Arguments.BYTE, 33)));

    expect(result).toBe(0xF521);
});

test('xy', () => {
    const assembler = InstructionAssembler.builder()
        .add(i => xy(0xB00F, i.withInstruction('test')))
        .build();

    const result = assembler.assemble(
        instruction('test', arg(Arguments.REGISTER, 5), arg(Arguments.REGISTER, 2)));

    expect(result).toBe(0xB52F);
});