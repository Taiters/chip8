import { createUseStyles } from 'react-jss';


const useContainerStyles = createUseStyles({
    container: ({direction}) => ({
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: direction,
    }),
});

const useContainerChildStyles = createUseStyles({
    containerChild: {
        flex: '1 1 auto',
    },
});

export {
    useContainerStyles,
    useContainerChildStyles,
};