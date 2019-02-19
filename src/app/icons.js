import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCaretLeft,
    faCaretRight,
    faList,
    faBug,
} from '@fortawesome/free-solid-svg-icons';


const registerIcons = () => {
    library.add(faCaretLeft);
    library.add(faCaretRight);
    library.add(faList);
    library.add(faBug);
};

export default registerIcons;