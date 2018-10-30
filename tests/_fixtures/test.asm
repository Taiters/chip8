// Test asm containing valid syntax

call drawFace
jp main

:face
    0b01000100
    0b00010000
    0b10000010
    0b01111100

:main
    call waitForKey
    call play
    jp main

:drawFace
    ld v2, 28
    ld v3, 14
    ld i, face
    draw v2, v3, 4
    ret

:waitForKey
    // Wait for key 5 to be pressed
    ld v0, 5
    skp v0
    jp waitForKey
    ret

:play
    ld v1, 30
    ld dt, v1
    ld st, v1
    call wait
    ret

:wait
    ld v1, dt
    se v1, 0
    jp wait
    ret

