import { getExamples, loadExample } from './examples';
import ProjectStore from './store';


const projectStore = new ProjectStore(window.localStorage);


export {
    getExamples,
    loadExample,
    projectStore,
};