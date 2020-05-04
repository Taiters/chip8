class UnknownInstructionException {
    constructor(instruction) {
        this.type = 'UnknownInstruction';
        this.instruction = instruction;
    }
}

class SectionNotFoundException {
    constructor(name, instruction) {
        this.type = 'SectionNotFound';
        this.name = name;
        this.instruction = instruction;
    }
}


export {
    UnknownInstructionException,
    SectionNotFoundException,
};