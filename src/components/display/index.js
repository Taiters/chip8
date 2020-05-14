import PropTypes from 'prop-types';
import React, { 
    useState,
    useEffect,
    useCallback
} from 'react';


const WIDTH = 64;
const HEIGHT = 32;
const SCALE = 10;
const SCREEN_WIDTH = WIDTH * SCALE;
const SCREEN_HEIGHT = HEIGHT * SCALE;


function drawGfx(gfx, ctx, isCls) {
    ctx.fillStyle = '#3C3836';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = '#EBDAB4';

    if (isCls)
        return;

    for (let y = 0; y < HEIGHT; y++) {
        const yOffset = y * WIDTH;

        for (let x = 0; x < WIDTH; x++) {
            if (gfx[yOffset + x] === 1)
                ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
        }
    }
}


function useRenderer(gfx) {
    const [ctx, setCtx] = useState(null);
    const captureCtx = useCallback(canvas => {
        if (canvas !== null) {
            setCtx(canvas.getContext('2d'));
        }
    });

    useEffect(() => {
        if (ctx === null)
            return;

        drawGfx(gfx, ctx);
        // let clsRequest = null;
        // let timeout = null;
        // if (gfx.every(v => v === 0)) {
        //     // If this is clearing the screen, wait a short period
        //     // encase something actually wants to draw (Avoids the flashing look)
        //     timeout = setTimeout(() => {
        //         clsRequest = requestAnimationFrame(() => drawGfx(gfx, ctx, true));
        //     }, 20);
        // } else {
        //     drawGfx(gfx, ctx);
        // }

        // return () => {
        //     clearTimeout(timeout);
        //     cancelAnimationFrame(clsRequest);
        // };
    }, [gfx, ctx]);

    return captureCtx;
}

const Display = ({gfx}) => {
    const captureCtx = useRenderer(gfx);

    return (
        <div style={{
            height: '100%',
            backgroundColor: 'rgb(45, 40, 38)',
        }}>
            <canvas 
                style={{
                    height: '100%',
                    maxWidth: '100%',
                    margin: '0 auto',
                    display: 'block',
                }}
                ref={captureCtx} 
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT} >
            </canvas>
        </div>
    );
};

Display.propTypes = {
    gfx: PropTypes.array.isRequired,
};


export default Display;