import * as firebase from 'firebase/app';


const listRoms = () => firebase.firestore()
    .collection('roms')
    .get()
    .then((result) => result.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })));

const downloadRom = (path) => firebase.storage()
    .ref(path)
    .getDownloadURL()
    .then(fetch)
    .then((response) => response.arrayBuffer())
    .then((dataBuffer) => new Uint8Array(dataBuffer));

export default {
    listRoms,
    downloadRom,
};