const path = require('path');
const express = require('express');
const roms = require('./roms.js');


const router = express.Router();

router.get('/roms', function(req, res, next) {
    const romsDir = path.resolve('dist', 'roms');
    roms.getRoms(romsDir, function (err, roms) {
        if (err)
            next(err);
        
        res.send(roms);
    });
});

module.exports = router;