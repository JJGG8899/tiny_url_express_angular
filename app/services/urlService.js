// var longToShortHash = {};
// var shortToLongHash = {};
var UrlModel = require('../models/urlModel');
var redis = require('redis');
// 类似mongo db 需要先连接一下
// 请去拿环境变量里面的这个变量
// noder server.js --REDIS_PORT_6379_TCP_PORT=...
// 这个6379是docker 自动帮你填好的
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;
var redisClient = redis.createClient(port, host);

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
    // 先去cache里面看看是否有，没有再去找数据库
    redisClient.get(longUrl, function(err, shortUrl){
      if(shortUrl){
        callback({
          shortUrl: shortUrl,
          longUrl: longUrl
        });
      } else {
        UrlModel.findOne({longUrl: longUrl}, function(err, data){
          if(data){
            // 直接返回shortUrl
            callback(data);
            // 存cache 下次好用啊
            redisClient.set(data.shortUrl, data.longUrl);
            redisClient.set(data.longUrl, data.shortUrl);
          } else {
            // 创建新的url
            generateShortUrl(function(shortUrl){
              var url = new UrlModel({
                shortUrl: shortUrl,
                longUrl: longUrl
              });
              url.save();
              callback(url);
              // 存cache 下次好用啊
              redisClient.set(shortUrl, longUrl);
              redisClient.set(longUrl, shortUrl);
            });
          }
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
  redisClient.get(shortUrl, function(err, longUrl){
    if( longUrl ){
      callback({
        shortUrl: shortUrl,
        longUrl: longUrl
      });
    } else {
      UrlModel.findOne({shortUrl: shortUrl}, function(err, data){
        callback(data);
      });
      redisClient.set(data.shortUrl, data.longUrl);
      redisClient.set(data.longUrl, data.shortUrl);
    }
  });
};

module.exports = {
  getShortUrl: getShortUrl,
  getLongUrl: getLongUrl
};
