var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');

router.get('*', function(req,res){
  var shortUrl = req.originalUrl.slice(1);
  console.log("short Url: " + shortUrl);
  var longUrl = urlService.getLongUrl(shortUrl);
  if(longUrl){
    res.redirect(longUrl);
  }
});

module.exports = router;
