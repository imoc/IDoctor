/**
 * Created by lilxiaowei on 2016-10-24.
 */
var mongoose = require('mongoose');
var User = require('../models/user');
var DateUtil = require('../../util/DateUtil');

exports.api = {
    login: function (req,res,next) {
        console.info( DateUtil.now() +  ' --  '+req.url+" - "+ JSON.stringify(req.body) );
        var _user = req.body;
        var name = _user.username;
        var password = _user.password;

        User.findOne({name:name}, function (err,user) {
            if(err){
                console.log(err);
            }
            if(!user){
                console.warn( DateUtil.now() +  ' --  user no exist !');
                res.json({'code':"0",'msg':" user no exist !"});
            }else{
                user.comparePassword(password,function (err,isMatch) {
                    if(err){
                        console.log(err);
                    }
                    if(isMatch){
                        console.info( DateUtil.now() +  ' -- new user has login successfully !');
                        console.log(JSON.stringify(user));
                        req.session.user = user;
                        // res.cookie("user", {username: user.name}, {maxAge: 600000 , httpOnly: false});
                        console.log("login success - "+JSON.stringify(req.session));
                        var obj = {
                            uid:user._id,
                            username:user.name,
                            userinfo:{
                                data:{
                                    uid:user._id,
                                    username:user.name,
                                    member_levelinfo: {
                                        level:user.level,
                                        upgrade_exppoints: 100,
                                        less_exppoints: 35,
                                        upgrade: 6,
                                        member_points:200,
                                    },
                                    member_avatar: user.avatar,
                                    member_name:user.name,
                                }}
                        };
                        var resJsonObj = {'code':"1",'msg':"获取成功",'data':obj};
                        res.json(resJsonObj);
                    }else{
                        console.warn(new Date().getDate() +  ' -- Account or password error');
                        res.json({'code':"0",'msg':"Account or password error"});
                    }
                });
            }
        });

        //  var obj = {
        //     uid:123,
        //     username:"daodao",
        //     age:22,
        //     userinfo:{
        //         data:{
        //             uid:123,
        //             username:"daodao",
        //             age:22,
        //             member_levelinfo: {
        //                 level:6,
        //                 upgrade_exppoints: 100,
        //                 less_exppoints: 35,
        //                 upgrade: 6,
        //                 member_points:200,
        //             },
        //         member_avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4287935292,2728355048&fm=116&gp=0.jpg',
        //         member_name:'道道',
        //     }}
        //  };
        // var resJsonObj = {'code':"1",'msg':"获取成功",'data':obj};
        // res.json(resJsonObj);
    },

    register:function(req, res, next){

        console.log("req - "+JSON.stringify(req.body));
        var _user = req.body.user || {
                name: req.body.username,
                password: req.body.password,
                mail: req.body.email,
                phone: {
                    number: req.body.mobile,
                    brand: req.body.brand
                }
            };
        console.log(JSON.stringify(_user));



        User.findOne({name:_user.name},function (err,user) {
            if(err){
                console.log(err);
            }
            if (user){
                console.warn( DateUtil.now() +  ' -- user has exist !');
                return res.redirect('/user/signin');
            }else{
                user = new User(_user);
                user.save(function (err,user) {
                    if (err){
                        console.log(err);
                    }
                    // req.session.user = user;
                    // res.redirect('/');
                    console.info( DateUtil.now() +  ' -- new user has registered successfully !');

                    var obj = {
                        uid:user._id,
                        username:user.name,
                        userinfo:{
                            data:{
                                uid:user._id,
                                username:user.name,
                                member_levelinfo: {
                                    level:user.level,
                                    upgrade_exppoints: 100,
                                    less_exppoints: 35,
                                    upgrade: 6,
                                    member_points:200,
                                },
                                member_avatar: user.avatar,
                                member_name:user.name,
                            }}
                    };
                    var resJsonObj = {'code':"1",'msg':"获取成功",'data':obj};
                    res.json(resJsonObj);
                });
            }
        });
    },
    bb:function(req, res, next){
        var user_id = req.api_user._id;
    }
}