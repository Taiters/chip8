class SectionAssembler {
    constructor(assemblers) {
        this.assemblers = assemblers;
    }

    assemble(section, lookup) {
        const assembler = this.assemblers[section.type];

        const result = [];
        for (const line of section.lines) {
            result.push(assembler.assemble(line, lookup));
        }

        return result;
    }

    static builder() {
        return new SectionAssemblerBuilder();
    }
}

class SectionAssemblerBuilder {
    constructor() {
        this.assemblers = {};
    }

    addAssembler(sectionType, assembler) {
        this.assemblers[sectionType] = assembler;
        return this;
    }

    build() {
        return new SectionAssembler(this.assemblers);
    }
}


export default SectionAssembler;
