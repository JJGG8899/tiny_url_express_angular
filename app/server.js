var express = require('express');
var app = express();
var restRouter = require('./routes/rest.js');
var redirectRouter = require('./routes/redirect.js');
var indexRouter = require('./routes/index.js');
var mongoose = require('mongoose');

mongoose.connect("mongodb://root:Gby032791@ds139937.mlab.com:39937/tiny_url",
      function(){ console.log('connected to Mongo Lab done!')} );

app.use('/public',express.static(__dirname + '/public'));
app.use('/api/v1', restRouter);
app.use('/:shortUrl', redirectRouter);
app.use('/',indexRouter);

app.listen(3000, function(){
  console.log('server running on 3000');
});
