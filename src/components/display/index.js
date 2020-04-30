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

const Display = ({gfx}) => {
    const [ctx, setCtx] = useState(null);
    const captureCtx = useCallback(canvas => {
        if (canvas !== null) {
            setCtx(canvas.getContext('2d'));
        }
    });

    useEffect(() => {
        if (ctx === null)
            return;

        ctx.fillStyle = '#3C3836';
        ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        ctx.fillStyle = '#EBDAB4';

        for (let y = 0; y < HEIGHT; y++) {
            const yOffset = y * WIDTH;

            for (let x = 0; x < WIDTH; x++) {
                if (gfx[yOffset + x] === 1)
                    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
            }
        }
    }, [gfx, ctx]);

    return (
        <canvas 
            style={{
                width: '100%'
            }}
            ref={captureCtx} 
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT} >
        </canvas>
    );
};

Display.propTypes = {
    gfx: PropTypes.array.isRequired,
};


export default Display;