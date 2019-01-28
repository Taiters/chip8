const withBackoff = (request, retries = 0, maxRetries = 3) => new Promise((resolve, reject) => request()
    .then(resolve)
    .catch((err) => {
        if (retries == maxRetries) {
            return reject(err);
        }

        const delayMs = Math.pow(2, retries) * 500;
        setTimeout(() => resolve(withBackoff(request, retries + 1, maxRetries)), delayMs);
    }));

const handleError = (response) => {
    if (!response.ok) {
        throw new Error(response.status + ' ' + response.statusText);
    }

    return response;
};

const listRoms = () => withBackoff(() => fetch('/api/roms')
    .then(handleError)
    .then((response) => response.json()));

const downloadRom = (path) => withBackoff(() => fetch(path)
    .then(handleError)
    .then((response) => response.arrayBuffer())
    .then((dataBuffer) => new Uint8Array(dataBuffer)));

export default {
    listRoms,
    downloadRom,
};