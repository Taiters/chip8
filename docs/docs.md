# CHIP-8 Assembly (like) Language Guide

This document provides an overview of the CHIP-8 assembly mnemonics supported by the emulator's built-in editor. Each mnemonic represents a specific instruction that can be executed by the CHIP-8 interpreter.

This was largely based on Cowgod's [excellent technical reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM), so it's worth also reading through that.

## Terms

The instructions below are formated as (`Instruction` - `Bytecode`)

The bytecodes hint to the arguments accepted for this instruction, where numbers or upper case letters are constant, but lower case letters indicate the types it deals with, which are listed below:

* `nnn` or `addr` - A 12-bit value, the lowest 12 bits of the instruction
* `n` or `nibble` - A 4-bit value, the lowest 4 bits of the instruction
* `x` - A 4-bit value, the lower 4 bits of the high byte of the instruction
* `y` - A 4-bit value, the upper 4 bits of the low byte of the instruction
* `kk` or `byte` - An 8-bit value, the lowest 8 bits of the instruction


## Syntax
Asside from the instructions (below this section), there's other bits of syntax available to make life easier.

### DEFINE
You can "define" values at the top of your file (Before any instructions). These behave like constants:

`DEFINE <TYPE> <NAME> <VALUE>`

* `TYPE` - One of `REGISTER, ADDRESS, BYTE, NIBBLE`.
* `NAME` - The name to refer to later
* `VALUE` - The value (Must match the type)

### Labels
You can "label" a section as `<label_name>:`.

For example, you can use this to refer to some data:
```
smile:
    0b00100100
    0b00100100
    0b00000000
    0b10011001
    0b01000010
    0b00111100

...

LD I, smile
```

Or you could use this to refer to a subprocess for a `CALL` or to `JP`
```
JP mainLoop

draw:
    CLS
    DRW X_COORD, Y_COORD, 6 ; Some "DEFINED" values here
    RET

mainLoop:
    CALL draw
    JP mainLoop
```


moveVertical:
    SE IS_MOVING_DOWN, 0
    JP moveDown
    JP moveUp

### Comments

Anything after a `;` is a comment.


## Instructions

### CLS - `00E0`
**Clear the Display.**
- Clears the screen, setting all pixels to 0.

### RET - `00EE`
**Return from Subroutine.**
- Returns execution to the address stored on the stack by the last `CALL` instruction.

### JP - `1nnn` or `Bnnn`
**Jump to Address.**
- `JP nnn`: Jumps to the address `nnn`.
- `JP V0, addr`: Jumps to the address `nnn + V0`.

### CALL - `2nnn`
**Call Subroutine.**
- Calls the subroutine at address `nnn`, storing the return address on the stack.

### SE - `3xkk` or `5xy0`
**Skip Next Instruction if Equal.**
- `SE Vx, kk`: Skips the next instruction if the value in register `Vx` equals `kk`.
- `SE Vx, Vy`: Skips the next instruction if the value in register `Vx` equals the value in register `Vy`.

### SNE - `4xkk` or `9xy0`
**Skip Next Instruction if Not Equal.**
- `SNE Vx, kk`: Skips the next instruction if the value in register `Vx` does not equal `kk`.
- `SNE Vx, Vy`: Skips the next instruction if the value in register `Vx` does not equal the value in register `Vy`.

### LD - `6xkk`, `8xy0`, `Annn`, `Fx07`, `Fx0A`, `Fx15`, `Fx18`, `Fx29`, `Fx33`, `Fx55`, `Fx65`
**Load Value.**
- `LD Vx, kk`: Loads the value `kk` into register `Vx`.
- `LD Vx, Vy`: Loads the value in register `Vy` into register `Vx`.
- `LD I, addr`: Loads the address `nnn` into the index register `I`.
- `LD Vx, [I]`: Loads values from memory starting at address `I` into registers `V0` to `Vx`.
- `LD [I], Vx`: Stores values from registers `V0` to `Vx` into memory starting at address `I`.
- `LD Vx, DT`: Loads the delay timer value into register `Vx`.
- `LD DT, Vx`: Sets the delay timer to the value in register `Vx`.
- `LD ST, Vx`: Sets the sound timer to the value in register `Vx`.
- `LD F, Vx`: Loads the address of the sprite for the hexadecimal digit stored in `Vx` into `I`.
- `LD B, Vx`: Stores the binary-coded decimal representation of `Vx` in memory at addresses `I`, `I+1`, and `I+2`.
- `LD Vx, K`: Waits for a key press and stores the result in `Vx`.

### ADD - `7xkk`, `8xy4`, `Fx1E`
**Add Values.**
- `ADD Vx, kk`: Adds the value `kk` to `Vx`, storing the result in `Vx`.
- `ADD Vx, Vy`: Adds the value in register `Vy` to `Vx`, storing the result in `Vx`.
- `ADD I, Vx`: Adds the value in register `Vx` to the index register `I`.

### OR - `8xy1`
**Bitwise OR.**
- Performs a bitwise OR between registers `Vx` and `Vy`, storing the result in `Vx`.

### AND - `8xy2`
**Bitwise AND.**
- Performs a bitwise AND between registers `Vx` and `Vy`, storing the result in `Vx`.

### XOR - `8xy3`
**Bitwise XOR.**
- Performs a bitwise XOR between registers `Vx` and `Vy`, storing the result in `Vx`.

### SUB - `8xy5`
**Subtract Values.**
- Subtracts the value in register `Vy` from `Vx`, storing the result in `Vx`. Sets the carry flag to `1` if `Vx > Vy`.

### SHR - `8xy6`
**Shift Right.**
- Shifts the value in register `Vx` right by one bit. The least significant bit is stored in the carry flag.

### SUBN - `8xy7`
**Subtract Values (Reverse).**
- Subtracts the value in register `Vx` from `Vy`, storing the result in `Vx`. Sets the carry flag to `1` if `Vy > Vx`.

### SHL - `8xyE`
**Shift Left.**
- Shifts the value in register `Vx` left by one bit. The most significant bit is stored in the carry flag.

### RND - `Cxkk`
**Random Number AND.**
- Sets `Vx` to a random number ANDed with `kk`.

### DRW - `Dxyn`
**Draw Sprite.**
- Draws an `n`-byte sprite at coordinates `(Vx, Vy)` starting from memory location `I`. The sprite is XORed onto the display, and the collision flag `VF` is set if any pixels are erased.

### SKP - `Ex9E`
**Skip Next Instruction if Key Pressed.**
- Skips the next instruction if the key corresponding to the value in `Vx` is pressed.

### SKNP - `ExA1`
**Skip Next Instruction if Key Not Pressed.**
- Skips the next instruction if the key corresponding to the value in `Vx` is not pressed.
