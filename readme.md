# Web-Based CHIP-8 Emulator with Assembly Editor
[![Netlify Status](https://api.netlify.com/api/v1/badges/4189b7ef-7f28-4672-b5cc-def7b67270b8/deploy-status)](https://app.netlify.com/sites/hopeful-kilby-c72aa0/deploys)

Welcome to the Web-Based CHIP-8 Emulator! This project is an interactive emulator that allows you to create, edit, and run CHIP-8 programs directly in your browser. With a built-in assembly-like editor, you can write your own CHIP-8 programs, load external ROMs, and explore the world of retro gaming and low-level programming.

**Built in tools to create ROMs**
![Screenshot of the CHIP-8 Emulator and Editor](/docs/screenshot.png)

**Or simply import existing ROMs**
![Screenshot of the CHIP-8 Emulator with an imported ROM](/docs/screenshot2.png)

## Notes

I built this as a hello world to emulators. Once that was working, I wanted to experiment with writing an assembler, and now this project exists!

However.. as this was a learning project, it's not perfect, so expect there to be some bugs, or missing documentation etc. If you see anything which you'd like to fix, contributions are welcome!


## Getting Started

To start using the emulator:

1. **Open the Emulator**: Visit the [CHIP-8 emulator](https://chip8.dotslashdan.com) in your web browser.
2. **Create or Load a Program**: Use the built-in editor to write your own CHIP-8 program, or load an existing ROM.
3. **Run Your Program**: Click the "Run" button to execute your program. Use the debug tools to pause, step through code, and inspect memory and registers.
4. **Explore & Learn**: Experiment with different instructions and see how they affect the program's behavior.

## Writing CHIP-8 Programs

CHIP-8 programs are written using simple assembly-like syntax. The emulator supports a wide range of instructions, including:

- **Control Flow**: `JP`, `CALL`, `RET`, `SE`, `SNE`
- **Math Operations**: `ADD`, `SUB`, `SHL`, `SHR`
- **Bitwise Operations**: `OR`, `AND`, `XOR`
- **Graphics**: `DRW`
- **Timers and Sound**: `LD`, `ST`, `DT`

For a complete list of supported mnemonics and their usage, refer to the [Assembly Language Guide](/docs/docs.md).

## Memory and Registers

The emulator provides tools to inspect the state of memory and registers during program execution. You can:

- **View Memory**: See the contents of memory and how it changes as your program runs.
- **Inspect Registers**: Monitor the values stored in the CHIP-8's registers (V0-VF, I, etc.).

## Documentation

For a detailed explanation of the CHIP-8 assembly language, visit this [Documentation Page](/docs/docs.md). This guide includes a breakdown of each mnemonic, its usage, and examples.

## Contributing

Contributions are welcome! If you encounter any issues, have suggestions, or want to contribute to the project, feel free to open an issue or submit a pull request.

See also the list of [contributors](CONTRIBUTORS.md) who participated in this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
