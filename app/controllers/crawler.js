var crawler = require('../../util/crawler');
var mongoose = require('mongoose');
var Film = require('../models/film');
var DateUtil = require('../../util/DateUtil');
// var User = mongoose.model('User');
// inxde
exports.index = function(req, res, next) {
    var items = [];
    res.render('crawlerIndex', { title: 'news',items: items});
}

// 瑞丽聚合
exports.raylijuhe =  function(req, res, next) {
    var url='http://www.rayli.com.cn/juhe/奢侈品牌Logo';
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
        });
}

// 霍州新闻
exports.huozhoutvNews = function(req, res, next) {
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

}

// 霍州新闻详情
exports.huozhoutvNewsDetail = function(req, res, next) {
    var url = req.query.url;
    console.log('url - '+ url);
    var host = 'http://www.huozhoutv.com';
    crawler.crawler(url,
        function ($) {

            var item = new Object();
            item.title = $('td.a2 strong').text();
            // item.pubtime = $('span.info_text ').text().match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g)[0]	;
            var pubtimeArray = $('span.info_text ').text().match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g);
            // console.log(pubtimeArray + "- "+pubtimeArray.length);
            if (pubtimeArray!=null&&pubtimeArray.length>0){
                item.pubtime = pubtimeArray[0];
                console.log(item.pubtime);
            }else {
                item.pubtime = '2016-09-19';
            }
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
}

// 电影列表
exports.films = function(req, res, next) {

    // var host = 'http://dy004.com/list/index1_1.html';
    var type = req.query.type||1;
    var page = req.query.page||1;
    console.log('type - '+ type +'  page - '+ page);
    var host = 'http://dy004.com';
    var url= host+'/list/index'+type+(page>1?('_'+page):'')+'.html';
    var host = 'http://dy004.com';
    var url= host+'/list/index'+type+(page>1?('_'+page):'')+'.html';
    console.log('url - '+ url);
    craw(type,page);
    function craw(type,page) {
        var url= host+'/list/index'+type+(page>1?('_'+page):'')+'.html';
        console.log('type - '+ type +'  page - '+ page);
        crawler.crawler(url,
            function ($) {
                var posts=$(".vlist .vlist-con");
                var items = new Array();
                posts.each(function(index,element){

                    var title = $(element).find('.vlist-name p').text();
                    var url = host + $(element).find('.vlist-name a').attr('href');
                    var image = $(element).find('.img img').attr('src');
                    var hd = $(element).find('.img p').text();
                    var item = {title: title, type: type , hd: hd ,url: url , image: image};
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

                if(items.length==0){
                    var resJsonObj = {'code':"1",'msg':"获取成功",'data':items};
                    res.end(JSON.stringify(resJsonObj));
                }else{

                    Film.create(items, function (err, docs) {
                        if (err) {
                            // TODO: handle error
                            console.info(err);
                        } else {
                            console.info('%d potatoes were successfully stored.', docs.length);
                            console.info( DateUtil.now() +  ' -- new films has save successfully !');
                        }

                    });
                    // var resJsonObj = {'code':"1",'msg':"获取成功",'data':items};
                    // res.end(JSON.stringify(resJsonObj));
                    // for(var i=0; i< items.length; i++){
                    //     var _film = items[i];
                    //     Film.findOne({url:_film.url},function (err,film) {
                    //         if(err){
                    //             console.log(err);
                    //         }
                    //         if (film){
                    //             console.warn( DateUtil.now() +  ' -- film has exist !');
                    //            // continue;
                    //         }else{
                    //             film = new Film(_film);
                    //             film.save(function (err,user) {
                    //                 if (err){
                    //                     console.log(err);
                    //                 }
                    //                 console.info( DateUtil.now() +  ' -- new film has save successfully !');
                    //             });
                    //         }
                    //     });
                    // }

                    craw(type,++page);
                }



            });
    }


}