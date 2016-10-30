var express = require('express');
var app = express();
var restRouter = require('./routes/rest.js');
var redirectRouter = require('./routes/redirect.js');

app.use('/api/v1', restRouter);
app.use('/:shortUrl', redirectRouter);

app.listen(3000);
