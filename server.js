var express = require('express');
var app = express();
var restRouter = require('./routes/rest.js');
var redirectRouter = require('./routes/redirect.js');
var indexRouter = require('./routes/index.js');

app.use('/public',express.static(__dirname + '/public'));
app.use('/api/v1', restRouter);
app.use('/:shortUrl', redirectRouter);
app.use('/',indexRouter);

app.listen(3000);
