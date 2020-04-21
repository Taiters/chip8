import React, { 
    useState,
    useEffect,
    useCallback
} from 'react';


const Screen = ({gfx}) => {
    const [ctx, setCtx] = useState(null);
    const captureCtx = useCallback(canvas => {
        if (canvas !== null) {
            setCtx(canvas.getContext('2d'));
        }
    });

    useEffect(() => {
        if (ctx === null)
            return;
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, 640, 320);
        ctx.fillStyle = 'rgb(0, 255, 255)';

        for (let i = 0; i < 64 * 32; i++) {
            if (gfx[i] !== 1)
                continue;

            const x = (i % 64) * 10;
            const y = (i / 64) * 10;

            ctx.fillRect(x, y, 10, 10);
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


export default Screen;