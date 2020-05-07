const example = `// An example program where a face jumps about. Wait for it to hit the corner 
// and you win. How exciting
//
// If you'd rather take control, you can also press the "S" key to toggle manual 
// control on and off.
//
// When in manual mode, you can move with:
// A: left
// D: right
// W: up
// X: down

// Jump to main entry point (Feels cleaner this way. You do you)
JP $main

// Lets draw a face
// Indents don't matter. But we're not animals
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
    JP $moveUp
    
:moveUp
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
    JP $moveLeft
    
:moveLeft
    SUB v0, v4
    SNE v0, 0
    LD v2, 1
    RET
    
:moveRight
    ADD v0, 1
    SNE v0, 56
    LD v2, 0
    RET
    
:checkToggle
    LD v6, DT // Load the delay timer value into v6
    SE v6, 0 // If it is not 0, return
    RET
    SKP v8 // If our toggle key is pressed, flip the flag, otherwise return
    RET
    XOR v7, vE
    LD DT, v5 // Reset the delay timer
    RET

:update
    CALL $checkToggle
    SE v7, 1 // If not moving automatically, jump to "manualMove"
    JP $moveManual
    CALL $moveVertical
    CALL $moveHorizontal
    RET
    
:moveManual
    SKNP v9 // Check our left key
    JP $moveLeft
    SKNP vA // Check our right key
    JP $moveRight
    SKNP vB // Check our up key
    JP $moveUp
    SKNP vC // Check our down key
    JP $moveDown
    RET


:draw
    CLS // Clear the screen. A classic
    DRW v0, v1, 6 // Draw our face (6 bytes) at our X and X coords (v0 & v1)
    RET


:mainLoop
    // Infinite loop. Update -> Draw -> Forever -> And -> Ever
    CALL $update
    CALL $draw
    JP $mainLoop


:main
    // Initialize a bunch of registers
    
    // Set start X and Y coords
    LD v0, 0 // X
    LD v1, 0 // Y
    
    // Set automation direction and flag
    LD v2, 1 // Horizontal (1 = right, 0 = left)
    LD v3, 1 // Vertical (1 = down, 0 = up)
    LD v7, 1 // Auto move flag (1 = yes, 0 = no)
    
    // Random things
    LD v4, 1 // Set to 1 for SUB operations
    LD vE, 1 // Always 1
    
    // Delay between toggle checks, stops it flipping the flag multiple times in a 
    // single press
    LD v5, 30
    
    // Set movement keys
    LD v8, 8 // Toggle auto move (8 maps to the S key)
    LD v9, 7 // Move left (7 maps to the A key)
    LD vA, 9 // Move right (9 maps to the D key)
    LD vB, 5 // Move up (5 maps to the W key)
    LD vC, 0 // Move down (0 maps to the X key)
    
    // Point I at our smile in memory for drawing later
    LD I, $smile
    
    // Make some calls
    CALL $draw
    CALL $mainLoop
`;

export default example;