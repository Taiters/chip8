const listRoms = (callback) => {
    fetch('/api/roms').then((response) => response.json())
        .then(callback);
};

const downloadRom = (path, callback) => {
    fetch(path).then((response) => response.arrayBuffer())
        .then((dataBuffer) => {
            callback(new Uint8Array(dataBuffer));
        });
};

export default {
    listRoms,
    downloadRom,
};