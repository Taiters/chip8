import {
    Sections,
} from '../constants';


const BYTES_PER_LINE = {};
BYTES_PER_LINE[Sections.INSTRUCTIONS] = 2;
BYTES_PER_LINE[Sections.DATA] = 1;


class ProgramAssembler {
    constructor(sectionAssembler) {
        this.sectionAssembler = sectionAssembler;
    }

    generateAddressLookup(program) {
        let address = 0x200;
        const lookup = {};

        for (const section of program.sections) {
            if (section.name) {
                lookup[section.name] = address;
            }

            address += section.lines.length * BYTES_PER_LINE[section.type];
        }

        return lookup;
    }

    assemble(program) {
        const lookup = this.generateAddressLookup(program);
        let totalLength = 0;

        const assembledLines = program.sections.flatMap(section => {
            const assembled = this.sectionAssembler.assemble(section, lookup);
            totalLength += assembled.length * BYTES_PER_LINE[section.type];

            return assembled;
        });

        const assembledProgram = new Uint8Array(totalLength);
        let offset = 0;
        for (let line of assembledLines) {
            if (line <= 0xFF) {
                assembledProgram[offset] = line;
                offset++;
                continue;
            }

            let parts = [];
            while (line !== 0) {
                parts.push(line & 0xFF);
                line = line >> 8;
            }

            for (let p = parts.length - 1; p >= 0; p--) {
                assembledProgram[offset] = parts[p];
                offset++;
            }
        }

        return assembledProgram;
    }
}


export default ProgramAssembler;