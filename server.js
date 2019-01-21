const express = require('express');
const app = express();
const port = !!process.env.PORT ? process.env.PORT : 3000;

app.use(express.static('dist'));

app.listen(port, () => console.log('Listening on port ' + port));
