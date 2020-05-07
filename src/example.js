const example = `// Jump to main entry point (Feels cleaner this way. You do you)
JP $main

// Indents don't matter. But we're not animals
// Lets draw a face
:smile
    0b00100100
    0b00100100
    0b00000000
    0b10011001
    0b01000010
    0b00111100


:moveVertical
    // If we're not moving up, jump to "moveDown"
    SE v3, 0
    JP $moveDown

    SUB v1, v4
    SNE v1, 0 // If we're at the top
    LD v3, 1  // Set our direction to DOWN
    RET
    
    :moveDown
        ADD v1, 1
        SNE v1, 26 // If we're at the bottom
        LD v3, 0   // Set our direction to UP
        RET
        

:moveHorizontal
    // Same idea as move vertical
    SE v2, 0
    JP $moveRight
    
    SUB v0, v4
    SNE v0, 0
    LD v2, 1
    RET
    
    :moveRight
        ADD v0, 1
        SNE v0, 56
        LD v2, 0
        RET


:update
    CALL $moveVertical
    CALL $moveHorizontal
    RET


:draw
    CLS
    DRW v0, v1, 6 // Draw our face (5 bytes) at our x and y coords (v0 & v1)
    RET


:wait
    LD DT, v5 // Load our delay time into the delay timer
    :waitLoop
        LD v6, DT // Load it back out...
        SNE v6, 0 // If it is 0, return, otherwise loop
        RET
        JP $waitLoop


:mainLoop
    // Infinite loop. Update -> Draw -> Wait -> Forever -> And -> Ever
    CALL $update
    CALL $draw
    CALL $wait
    JP $mainLoop


:main
    LD v0, 0 // Our X coord
    LD v1, 0 // Out Y coord
    LD v2, 1 // Horizontal Direction (1 = right, 0 = left)
    LD v3, 1 // Vertical Direction (1 = down, 0 = up)
    LD v4, 1 // Set to 1 for SUB operations
    LD v5, 1 // Delay between updates (Timer tick ~ 60hz)
    LD I, $smile // Set I to our smile's memory address, this lets us draw it later
    
    // Make some calls
    CALL $draw
    CALL $mainLoop
`;

export default example;