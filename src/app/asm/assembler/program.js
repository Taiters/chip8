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

        const assembledSections = program.sections.map(section => {
            const assembled = this.sectionAssembler.assemble(section, lookup);
            totalLength += assembled.length * BYTES_PER_LINE[section.type];

            return {
                type: section.type,
                assembled,
            };
        });

        const assembledProgram = new Uint8Array(totalLength);
        let offset = 0;
        for (const section of assembledSections) {
            const bytes = BYTES_PER_LINE[section.type];
            for (const line of section.assembled) {
                for (let i = bytes-1; i >= 0; i--) {
                    assembledProgram[offset++] = (line >> (8*i)) & 0xff;
                }
            }
        }

        return assembledProgram;
    }
}


export default ProgramAssembler;