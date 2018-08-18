function loadRom(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        e.preventDefault();
        const data = new Uint8Array(e.target.result);
        const rom = {
            name: file.name,
            bytes: file.size,
            data: data
        };

        callback(rom);
    };

    reader.readAsArrayBuffer(file);
}

export default loadRom;
