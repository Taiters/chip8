import {
    LineTypes,
} from '../constants';


const BYTES_PER_LINE = {};
BYTES_PER_LINE[LineTypes.INSTRUCTION] = 2;
BYTES_PER_LINE[LineTypes.DATA] = 1;


class ProgramAssembler {
    constructor(assemblers) {
        this.assemblers = assemblers;
    }

    getProgramMeta(program) {
        let address = 0x200;
        return program.lines.reduce((data, line) => {
            if (line.label) {
                data.lookup[line.label.value] = address;
            }

            address += BYTES_PER_LINE[line.type];
            data.length += BYTES_PER_LINE[line.type];

            return data;
        }, {length: 0, lookup: {}});
    }

    assemble(program) {
        const meta = this.getProgramMeta(program);
        const assembledProgram = new Uint8Array(meta.length);
        const srcMap = [];

        let offset = 0;
        for (const line of program.lines) {
            const assembler = this.assemblers[line.type];
            const data = assembler.assemble(line, meta.lookup);
            const bytes = BYTES_PER_LINE[line.type];

            for (let i = bytes-1; i >= 0; i--) {
                srcMap[offset] = line.token.line;
                assembledProgram[offset++] = (data >> (8 * i) & 0xff);
            }
        }

        return [assembledProgram, srcMap];
    }

    static builder() {
        return new ProgramAssemblerBuilder();
    }
}

class ProgramAssemblerBuilder {
    constructor() {
        this.assemblers = {};
    }

    addAssembler(lineType, assembler) {
        this.assemblers[lineType] = assembler;
        return this;
    }

    build() {
        return new ProgramAssembler(this.assemblers);
    }
}


export {
    ProgramAssembler
};
