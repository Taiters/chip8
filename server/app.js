const express = require('express');
const api = require('./api.js');


const app = express();
const port = !!process.env.PORT ? process.env.PORT : 3000;

app.use('/api', api);
app.use(express.static('dist'));

app.listen(port, () => console.log('Listening on port ' + port));
