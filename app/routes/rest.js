var express= require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlService = require('../services/urlService');

router.post('/urls', jsonParser, function(req,res){
  var longUrl = req.body.longUrl;
  var shortUrl = urlService.getShortUrl(longUrl, function(data){
    if(data){
      res.json(data);
    }
  });
});

router.get('/urls/:shortUrl', function(req,res){
  var shortUrl = req.params.shortUrl;
  var longUrl = urlService.getLongUrl(shortUrl, function(url){
    res.json(url);
  });
});

module.exports = router;
