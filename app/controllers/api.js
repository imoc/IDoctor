/**
 * Created by lilxiaowei on 2016-10-24.
 */
var mongoose = require('mongoose');
var User = require('../models/user');
var DateUtil = require('../../util/DateUtil');
var jwt = require('jsonwebtoken');//用来创建和确认用户信息摘要
var settings = require("../db/settings");//站点配置
var DbOpt = require("../db/Dbopt");//数据库操作对象

exports.api = {
    login: function (req, res, next) {
        console.info(DateUtil.now() + ' --  ' + req.url + " - " + JSON.stringify(req.body));
        console.info(DateUtil.now() + ' --  ' + req.url + " - " + JSON.stringify(req.query));
        console.info(DateUtil.now() + ' --  ' + req.url + " - ");
        var _user = req.body;
        var name = _user.username;
        var password = _user.password;

        User.findOne({name: name}, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                console.warn(DateUtil.now() + ' --  user no exist !');
                res.json({'code': "0", 'msg': " user no exist !"});
            } else {
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        console.log(err);
                    }
                    if (isMatch) {
                        console.info(DateUtil.now() + ' -- new user has login successfully !');
                        console.log(JSON.stringify(user));
                        req.session.user = user;
                        // res.cookie("user", {username: user.name}, {maxAge: 600000 , httpOnly: false});
                        console.log("login success - " + JSON.stringify(req.session));
                        var obj = {
                            uid: user._id,
                            username: user.name,
                            userinfo: {
                                data: {
                                    uid: user._id,
                                    username: user.name,
                                    member_levelinfo: {
                                        level: user.level,
                                        upgrade_exppoints: 100,
                                        less_exppoints: 35,
                                        upgrade: 6,
                                        member_points: 200,
                                    },
                                    member_avatar: user.avatar,
                                    member_name: user.name,
                                }
                            }
                        };
                        var resJsonObj = {'code': "1", 'msg': "获取成功", 'data': obj};
                        res.json(resJsonObj);
                    } else {
                        console.warn(new Date().getDate() + ' -- Account or password error');
                        res.json({'code': "0", 'msg': "Account or password error"});
                    }
                });
            }
        });
    },
    //注册
    register: function (req, res, next) {
        console.info(DateUtil.now() + ' -- register --' + JSON.stringify(req.body));
        console.info(DateUtil.now() + ' -- register --' + JSON.stringify(req.query));
        var _user = req.body.user || {
                name: req.body.username||req.query.username,
                password: req.body.password||req.query.password,
                mail: req.body.email||req.query.email,
                phone: {
                    number: req.body.mobile||req.query.mobile,
                    brand: req.body.brand||req.query.brand
                }
            };
        console.log(JSON.stringify(_user));

        // User.findOne({name: _user.name}, function (err, user) {
        User.findOne({"$or" :  [{name: _user.name} , {mail:_user.mail} ] }, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (user) {
                console.warn(DateUtil.now() + ' -- user has exist !');
                var resJsonObj = {'code': "0", 'msg': "用户名/邮箱已经被注册"};
                sendJson(req, res, next, resJsonObj)
            } else {
                User.findOne
                user = new User(_user);
                user.save(function (err, user) {
                    if (err) {
                        console.info(DateUtil.now() + ' -- new user has registered failed ! --' + JSON.stringify(err));
                        var resJsonObj = {'code': "0", 'msg': "注册失败,稍后重试"};
                        sendJson(req, res, next, resJsonObj)
                        return;
                    }
                    console.info(DateUtil.now() + ' -- new user has registered successfully !');
                    // 创建token
                    var expires = settings.expiresIn;
                    var token = jwt.sign(user, settings.jwtTokenSecret, {
                        'expiresIn': expires // 设置过期时间
                    });
                    var obj = {
                        userId: user._id,
                        token: token,
                        expires: expires,
                    };
                    var resJsonObj = {'code': "1", 'msg': "注册成功", 'data': obj};
                    sendJson(req, res, next, resJsonObj);
                });
            }
        });
    },
    //auth认证，获取taken
    auth: function (req, res, next) {
        var _user = req.body || req.query;
        console.info(DateUtil.now() + ' -- auth --' + JSON.stringify(_user));
        var name = _user.username || req.query.username;
        var password = _user.password || req.query.password;

        User.findOne({name: name}, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                console.warn(DateUtil.now() + ' --  user no exist !');
                res.json({'code': "0", 'msg': " user no exist !"});
            } else {
                user.comparePassword(password, function (err, isMatch) {
                    if (err) {
                        console.log(err);
                    }
                    if (isMatch) {
                        console.info(DateUtil.now() + ' -- user has authed successfully ! - ' + JSON.stringify(user));
                        // 创建token
                        var expires = settings.expiresIn;
                        var _user = {userId:user._id};
                        var token = jwt.sign(_user, settings.jwtTokenSecret, {
                            'expiresIn': expires // 设置过期时间
                        });
                        var obj = {
                            userId: user._id,
                            token: token,
                            expires: expires,
                        };
                        var resJsonObj = {'code': "1", 'msg': "获取成功", 'data': obj};
                        sendJson(req, res, next, resJsonObj);
                    } else {
                        console.warn(new Date().getDate() + ' -- Account or password error');
                        res.json({'code': "0", 'msg': "Account or password error"});
                    }
                });
            }
        });
    },
    check_api_token: function (req, res, next) {
        console.log('检查post的信息或者url查询参数或者头信息');
        var debug = false;
        if (debug) {
            // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
            var id = req.body.id || req.query.id || req.body.userId || req.query.userId;
            req.api_user = {_id: id};
            console.log(DateUtil.now() + ' --  api_user --  ' + JSON.stringify(req.api_user));
            next();
        } else {
            //检查post的信息或者url查询参数或者头信息
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            // 解析 token
            if (token) {
                // 确认token
                jwt.verify(token, settings.jwtTokenSecret, function (err, decoded) {
                    if (err) {
                        var resJsonObj = {code: 2, msg: "token信息错误"};
                        sendJson(req, res, next, resJsonObj)
                    } else {
                        // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                        req.api_user = decoded._doc||{_id: decoded.userId};
                        console.dir(decoded);
                        console.log(DateUtil.now() + ' --  api_user --  ' + JSON.stringify(req.api_user));
                        next();
                    }
                });
            } else {
                // 如果没有token，则返回错误
                // return res.status(403).send({
                //     success: false,
                //     message: '没有提供token！'
                // });

                var resJsonObj = {code: 2, msg: "没有提供token！"};
                sendJson(req, res, next, resJsonObj)
            }
        }

    },
    //查询个人信息
    userInfo: function (req, res, next) {
        var user_id = req.api_user._id;
        console.log(DateUtil.now() + ' -- userInfo--  ' + user_id);
        var errors;
        User.findById(user_id, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                console.warn(DateUtil.now() + ' --  user no exist !');
                res.json({'code': "0", 'msg': " user no exist !"});
            } else {
                var obj = {
                    userId: user._id,
                    username: user.name,
                    role: user.role,
                    roleExpeDate: user.roleExpeDate,
                    member_levelinfo: {
                        level: user.level,
                        upgrade_exppoints: 100,
                        less_exppoints: 35,
                        upgrade: 6,
                        member_points: 200,
                    },
                    member_avatar: user.avatar,
                    member_name: user.name,
                }
                var resJsonObj = {'code': "1", 'msg': "获取成功", 'data': obj};
                sendJson(req, res, next, resJsonObj);
            }
            ;

        });
    },
    //增加积分
    updatePoint: function (req, res, next) {
        var user = req.api_user;
        var user_id = req.api_user._id;
        console.log(DateUtil.now() + ' -- addPoint--  ' + user_id);
        var errors;
        var pointType = req.body.pointType || req.query.pointType;
        var pointRate = 2;
        var pointArray = {
            register: 5 * pointRate,
            login: 1 * pointRate,
            readNews: 1 * pointRate,
            playVidio: 1 * pointRate,
            readImage: 1 * pointRate,
            share: 5 * pointRate,
            loadMoreNews: 1 * pointRate,
            refreshNews: 1 * pointRate,
            loadMoreVideos: 1 * pointRate,
            refreshVideos: 1 * pointRate,
            marketScore: 5 * pointRate,
            online: 1 ,
        };
        console.log(DateUtil.now() + ' -- ' + pointType + '--  ' + pointArray[pointType]);
        User.updatePoint(user_id, pointArray[pointType], function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                console.warn(DateUtil.now() + ' --  user no exist !');
                res.json({'code': "0", 'msg': " user no exist !"});
            } else {
                console.info(DateUtil.now() + ' -- updatePoint successfully !');
                var data = {
                    uid: user._id,
                    point: user.point,
                    pointType: pointType,
                    increasedPoint: pointArray[pointType],
                };

                // var resJsonObj = {code:1, msg:"获取成功", data:data};
                var resJsonObj = {};
                resJsonObj.code = 1,
                    resJsonObj.msg = "获取成功";
                resJsonObj.data = data;

                sendJson(req, res, next, resJsonObj);
            }
        });
    },
    //用户列表_分页_条件查询
    userList: function (req, res, next) {

        console.log(req.method + ' /groups => list, query: ' + JSON.stringify(req.api_user));
        var user_id = req.api_user._id;
        console.log(DateUtil.now() + ' --  user_id --  ' + user_id);
        User.findById(user_id, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!user) {
                console.warn(DateUtil.now() + ' --  user no exist !');
                res.json({'code': "0", 'msg': " user no exist !"});
            } else {
                console.info(DateUtil.now() + ' -- new user has login successfully !');
                console.log(JSON.stringify(user));
                req.session.user = user;
                // res.cookie("user", {username: user.name}, {maxAge: 600000 , httpOnly: false});
                console.log("login success - " + JSON.stringify(req.session));
                var obj = {
                    uid: user._id,
                    username: user.name,
                    userinfo: {
                        data: {
                            uid: user._id,
                            username: user.name,
                            member_levelinfo: {
                                level: user.level,
                                upgrade_exppoints: 100,
                                less_exppoints: 35,
                                upgrade: 6,
                                member_points: 200,
                            },
                            member_avatar: user.avatar,
                            member_name: user.name,
                        }
                    }
                };
                var resJsonObj = {'code': "1", 'msg': "获取成功", 'data': obj};
                res.json(resJsonObj);
            }
        });
    },
    //付费用户的视频权限激活
    updateRole: function (req, res, next) {
        var user_id = req.api_user._id;
        console.log(DateUtil.now() + ' -- activatePermissions--  ' + user_id);
        var errors;
        var roleType = req.body.roleType || req.query.roleType;
        // 0 免费用户，1 付费用户， 5 一级付费用户（一周），6 二级付费用户（一月），7 三级付费用户（三月），10 普通管理员， 100 超级管理员
        var roleArray = {
            0: '免费用户',
            5: '一级付费用户（一周）',
            6: '二级付费用户（一月）',
            7: '三级付费用户（三月）',
            10: '普通管理员',
            100: '超级管理员',
        };
        var expArray = {
            5: 7,
            6: 30,
            7: 90,
        };
        var curDate = new Date();
        var expDate = new Date(curDate.setDate(curDate.getDate() + expArray[roleType]));

        console.log(DateUtil.now() + ' -- ' + roleType + '--  ' + roleArray[roleType] + ' -- ' + expDate);
        User.updateRole(user_id, roleType, expDate, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (!result) {
                console.warn(DateUtil.now() + ' --  user no exist !');
                res.json({'code': "0", 'msg': " user no exist !"});
            } else {
                console.info(DateUtil.now() + ' -- activatePermissions successfully !');

                var data = {
                    uid: user._id || user_id,
                    role: user.role || roleType,
                    roleExpeDate: user.expDate || expDate,
                    roleDse: roleArray[roleType],
                };

                // var resJsonObj = {code:1, msg:"获取成功", data:data};
                var resJsonObj = {};
                resJsonObj.code = 1,
                    resJsonObj.msg = "获取成功";
                resJsonObj.data = data;
                sendJson(req, res, next, resJsonObj);
            }
        });
    },
    //付费用户的视频权限激活
    films: function (req, res, next) {
        var user_id = req.api_user._id;
        console.log(DateUtil.now() + ' -- films--  ' + user_id);
        //查询视频集合；
        var count = 15;
        var items = new Array();
        for (var i = 0; i < count; i++) {
            var item = {
                id: null,
                // id: i+1,
                title: 'films1',
                src: 'http://v.rayli.com.cn/2016-10-18/20161018221511.mp4'
                // src: 'http://y.syasn.com/p/p1.mp4'
                // src: 'http://120.52.73.43/adultvideo.science/media/videos/iphone/one_'+(i+1)+'.mp4'
            };
            items.push(item);
        }
        console.log( DateUtil.now() +  ' --  films -  '+JSON.stringify(items));
        res.render('films',{
            title:'type - '+req.query.type,
            items: items
        });

    },
}

//json输出
var sendJson = function (req,res,next,resJsonObj) {

    console.log( DateUtil.now() +  ' -- '+JSON.stringify(resJsonObj));
    res.json(resJsonObj);
};