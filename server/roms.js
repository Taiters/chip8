const fs = require('fs');
const path = require('path');


function getRomData(name) {
    return new Promise(function(resolve, reject) {
        const romPath = path.resolve('dist', 'roms', name);
        fs.stat(romPath, function (err, stats) {
            if (err)
                reject(err);

            resolve({
                name: path.parse(name).name,
                path: path.join('/', 'roms', name),
                size: stats.size,
            });
        });
    });
}

function getRoms(directory, callback) {
    fs.readdir(directory, function(err, romNames) {
        Promise.all(romNames.map(getRomData)).then(function(roms) {
            callback(null, roms);
        }, function (err) {
            callback(err);
        });
    });
}


module.exports = {
    getRoms: getRoms,
};