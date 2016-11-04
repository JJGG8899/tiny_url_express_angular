// var longToShortHash = {};
// var shortToLongHash = {};
var UrlModel = require('../models/urlModel');

var encode = [];

var genCharArray = function(charA, charZ){
  var arr = [];
  var i = charA.charCodeAt(0);
  var j = charZ.charCodeAt(0);
  for(; i <=j; i++){
    arr.push(String.fromCharCode(i));
  }
  return arr;
};
encode = encode.concat(genCharArray('a','z'));
encode = encode.concat(genCharArray('A','Z'));
encode = encode.concat(genCharArray('0','9'));

var getShortUrl = function(longUrl, callback){
    // 对用户的raw input 做一个简单加工
    if(longUrl.indexOf('http') === -1){
      longUrl = "http://" + longUrl;
    }
    // 还是先判断下 longUrl是否已经在mongo 里面了
    UrlModel.findOne({longUrl: longUrl}, function(err, data){
      if(data){
        // 直接返回shortUrl
        callback(data);
      } else {
        // 创建新的url
        generateShortUrl(function(shortUrl){
          var url = new UrlModel({
            shortUrl: shortUrl,
            longUrl: longUrl
          });
          url.save();
          callback(url);
        });
      }
    });
}

var generateShortUrl = function(callback){
  // return convertTo62(Object.keys(longToShortHash).length);
  UrlModel.count({}, function(err, num){
      callback(convertTo62(num));
  });
};

var convertTo62 = function(num){
  var result = "";
  do {
    result = encode[ num % 62] + result;
    num = Math.floor( num / 62);
  } while (num);
  return result;
};


var getLongUrl = function(shortUrl, callback){
  UrlModel.findOne({shortUrl: shortUrl}, function(err, data){
    callback(data)
  });
};

module.exports = {
  getShortUrl: getShortUrl,
  getLongUrl: getLongUrl
};
