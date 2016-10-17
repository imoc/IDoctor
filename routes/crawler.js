var express = require('express');
var router = express.Router();
var crawler = require('../util/crawler');

var url='http://www.rayli.com.cn/juhe/奢侈品牌Logo';

/* GET home page. */
router.get('/', function(req, res, next) {
  // 瑞丽聚合
/*  var url='http://www.rayli.com.cn/juhe/奢侈品牌Logo';
  crawler.crawler(url,
    function ($) {
      var posts=$(".cur");
      var items = new Array();;
      posts.each(function(index,element){

        var p = $(element).find('.tit p').eq(0);
        var title = p.text()	;
        console.log("loge: "+title);
        var url = $(element).find('a').attr('href');
        console.log("url: "+ url);
        var item = {title: title, url: url};
        items.push(item);
      });
      return items ;
  },
    function (items) {
      res.render('news', { title: 'news',items: items});
    });*/

// 霍州新闻
  var page = req.query.page;
  console.log('page - '+ page);
  var url='http://www.huozhoutv.com/xinwen/hz/index_'+page+'.html';
  console.log('url - '+ url);
  var host = 'http://www.huozhoutv.com';
  crawler.crawler(url,
      function ($) {
        var posts=$(".movie_list li");
        var items = new Array();
        posts.each(function(index,element){

          var title = $(element).find('a').text()	;
          var url = host + $(element).find('a').attr('href');
          var pubDate = $(element).find('span').text();
          var item = {title: title, url: url , pubDate: pubDate};
          console.log("title - " + title);
          // console.log(JSON.stringify(item));
          items.push(item);
        });
        // console.log(JSON.stringify(items));
        return items ;
      },
      function (items) {
        // var resJsonObj = {"data":[{"title":123},{"title":222}]};
        var resJsonObj = {'code':"1",'msg':"获取成功",'data':items};
         console.log(JSON.stringify(items));
        res.end(JSON.stringify(resJsonObj));


      });

});

router.get('/huozhoutvNews', function(req, res, next) {

  // 霍州新闻
  var page = req.query.page;
  console.log('page - '+ page);
  var url='http://www.huozhoutv.com/xinwen/hz/index'+(page>1?('_'+page):'')+'.html';
  console.log('url - '+ url);
  var host = 'http://www.huozhoutv.com';
  crawler.crawler(url,
      function ($) {
        var posts=$(".movie_list li");
        var items = new Array();
        posts.each(function(index,element){

          var title = $(element).find('a').text()	;
          var url = host + $(element).find('a').attr('href');
          var pubDate = $(element).find('span').text();
          var item = {title: title, url: url , pubDate: pubDate};
          console.log("title - " + title);
          // console.log(JSON.stringify(item));
          items.push(item);
        });
        // console.log(JSON.stringify(items));
        return items ;
      },
      function (items) {
        // var resJsonObj = {"data":[{"title":123},{"title":222}]};
        var resJsonObj = {'code':"1",'msg':"获取成功",'data':items};
        console.log(JSON.stringify(items));
        res.end(JSON.stringify(resJsonObj));

      });

});

router.get('/huozhoutvNews/detail', function(req, res, next) {

  // 霍州新闻详情

  var url = req.query.url;
  console.log('url - '+ url);
  var host = 'http://www.huozhoutv.com';
  crawler.crawler(url,
      function ($) {

        var item = new Object();
        item.title = $('td.a2 strong').text();
        item.pubtime = $('span.info_text ').text().match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g)[0]	;
        item.source = $('span.info_text a').eq(0).text();
        item.content = $('#text').html();
        item.popular = 100;
        item.author = $('span.info_text a').eq(1).text()||'hz';


        // var item = {title: title, url: url , pubDate: pubDate};


        // '录入时间：2016-08-19 11:59:35  来源：霍州广播电视台 发稿人： '.match(/(d{4})-(d{2})-(d{2}) (d{2}):(d{2}):(d{2})/g);
        console.log(JSON.stringify(item));
        return item ;
      },
      function (obj) {
        // var resJsonObj = {"data":[{"title":123},{"title":222}]};
        var resJsonObj = {'code':"1",'msg':"获取成功",'data':obj};
        res.end(JSON.stringify(resJsonObj));

      });

});

module.exports = router;