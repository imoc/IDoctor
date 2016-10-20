/*var http=require('http');
var cheerio=require('cheerio');

var url='http://www.rayli.com.cn/juhe/奢侈品牌Logo';

function  crawler(url, crawlerCallback, showCallback) {
  http.get(url,function(res){
    res.setEncoding('UTF-8');
    var html='';
    res.on('data',function(data){
      html+=data
    })
    res.on('end',function(){
      var $=cheerio.load( html );
      var obj =  crawlerCallback($);
      showCallback(obj);
    })
  })
}
exports.crawler = crawler;*/

var http=require('http');
var cheerio=require('cheerio');
var iconv = require('iconv-lite')


function  crawler(url, crawlerCallback, showCallback) {
/*  var url='http://www.huozhoutv.com/xinwen/hz/index_3.html';
  var url='http://www.rayli.com.cn/juhe/奢侈品牌Logo';
  var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
  };
  var options = {
    url: url,
    encoding: null,
    headers: headers
  };

  http.get(url, function(res) {
    // res.setEncoding('GBK');
    var size = 0;
    var chunks = [];

    res.on('data', function(chunk){
      size += chunk.length;
      chunks.push(chunk);
    });

    res.on('end', function(){
      var data = Buffer.concat(chunks, size);
      var html = data.toString();
      // html = iconv.decode(html, 'GBK');
      $ = cheerio.load(html);
      var obj =  crawlerCallback($);
      showCallback(obj);
    });

  }).on('error', function(e) {
    // cb(e, null);
    console.log(JSON.stringify(e));
  });*/

  // 解决$.get 获取html出现中文乱码
  var gs = require('nodegrass');
  gs.get(url, function(data){
    // console.log(data);//将data输出即使中文
    var html = data.toString();
    $ = cheerio.load(html);
    var obj =  crawlerCallback($);
    showCallback(obj);

  }, 'utf-8').on('error',function(err){
    console.log(err);
  });

}
exports.crawler = crawler;
