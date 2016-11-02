/**
 * Created by lilxiaowei on 2016-10-31.
 */
var mongoose = require('mongoose');
var Film = require('../models/Film');
var DateUtil = require('../../util/DateUtil');

exports.showList = function (req,res) {
    var type = req.query.type||1;
    var page = req.query.page||1;
    var limit=countPer = 12;
    var skip = limit * (page-1);
    Film
        .find({ type: type })
        // .where('name.last').equals('Ghost')
        // .where('age').gt(17).lt(66)
        // .where('likes').in(['vaporizing', 'talking'])
        .limit(limit)
        .skip(skip)
        .sort({'meta.updateAt':-1})
        // .select('name occupation')
        .exec(function (err,films) {
            if(err){
                console.log(err);
            }
            res.render('filmList',{
                title:'电影列表',
                items:films
            });
        });
}
exports.showSearch = function (req,res) {
    // Film.fetch(function (err,film) {
    //     if(err){
    //         console.log(err);
    //     }
    //     res.render('filmList',{
    //         title:'电影列表',
    //         films:films
    //     });
    // })

    Film
        .find({ type: 1 })
        // .where('name.last').equals('Ghost')
        // .where('age').gt(17).lt(66)
        // .where('likes').in(['vaporizing', 'talking'])
        .limit(12)
        .sort('meta.updateAt')
        // .select('name occupation')
        .exec(function (err,films) {
            if(err){
                console.log(err);
            }
            res.render('filmList',{
                title:'电影列表',
                items:films
            });
        });
}

exports.doSearch = function (req,res) {
    // Film.fetch(function (err,film) {
    //     if(err){
    //         console.log(err);
    //     }
    //     res.render('filmList',{
    //         title:'电影列表',
    //         films:films
    //     });
    // })

    Film
        .find({ type: 2 })
        // .where('name.last').equals('Ghost')
        // .where('age').gt(17).lt(66)
        // .where('likes').in(['vaporizing', 'talking'])
        .sort({'_id':1})
        .limit(9)
        // .sort({'meta.updateAt':-1})
        // .select('name occupation')
        .exec(function (err,films) {
            if(err){
                console.log(err);
            }
            res.render('filmList',{
                title:'电影列表',
                items:films
            });
        });
}

exports.showFilmDetail = function (req,res) {
    var id = req.params.id;
    console.log(DateUtil.now() + ' -- showFilmDetail--  ' + id);
    Film.findById(id, function (err,film) {
        if(err){
            console.log(err);
            res.redirect('/');
        }
        if(!film){
            console.warn( DateUtil.now() +  ' --  user no exist !');
            res.redirect('/');
        }
        // res.locals.user = req.session ? req.session.user:'';
        res.render('filmDetail',{
            title: '影片详情',
            film:film
        });
    });
}


exports.doUpdate = function (req,res) {
    console.log("req - "+JSON.stringify(req.body));
    var _film = req.body.film;
    console.log(JSON.stringify(_film));
    console.log(DateUtil.now() + ' -- film doUpdata--  ' + _film._id);

    Film.findById(_film._id,function (err,film) {
        if(err){
            console.log(err);
            return res.redirect('/user/signin');
        }
        console.log(DateUtil.now() + ' -- findOne film --  ' + JSON.stringify(film));
        if (film){

            // _film.phone = {
            //     number:_user.number,
            //     brand:_user.brand
            // };
            // delete _user.number;
            // delete _user.brand;
            //
            // var film = new User(_film);
            console.log(DateUtil.now() + ' -- findOne film --  ' + JSON.stringify(film));
            film.src = _film.src;
            film.save(function (err,user) {
                if (err){
                    console.log(err);
                }
                console.info( DateUtil.now() +  ' -- film has updata successfully !');
                // res.redirect('/film/detail/'+_film.id);
                res.redirect('/film/showList');
            });
        }else{
            console.warn( DateUtil.now() +  ' -- film no exist !');
            return res.redirect('/user/signin');
        }
    });
}
