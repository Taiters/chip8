import PropTypes from 'prop-types';
import React, { 
    useState,
    useEffect,
    useCallback
} from 'react';


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
        ctx.fillRect(0, 0, 640, 320);
        ctx.fillStyle = '#EBDAB4';

        for (let y = 0; y < 32; y++) {
            const yOffset = y * 64;

            for (let x = 0; x < 64; x++) {
                if (gfx[yOffset + x] === 1)
                    ctx.fillRect(x * 10, y * 10, 10, 10);
            }
        }
    }, [gfx, ctx]);

    return (
        <canvas 
            style={{
                width: '100%'
            }}
            ref={captureCtx} 
            width="640" 
            height="320" >
        </canvas>
    );
};

Display.propTypes = {
    gfx: PropTypes.array.isRequired,
};


export default Display;