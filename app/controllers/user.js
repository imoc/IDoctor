/**
 * Created by lilxiaowei on 2016-10-19.
 */
var mongoose = require('mongoose');
var User = require('../models/user');
var DateUtil = require('../../util/DateUtil');
// var User = mongoose.model('User');

//signup
exports.showSignup = function (req,res) {
    res.render('signup',{
        title: '注册页面'
    });
};

exports.showSignin = function (req,res) {
    res.render('signin',{
        title: '登录页面'
    });
};

exports.showUserCenter = function (req,res) {
    res.locals.user = req.session ? req.session.user:'';
    res.render('userCenter',{
        title: '个人中心'
    });
};

exports.signup = function (req,res) {
    var _user = req.body.user;
    console.log("req - "+JSON.stringify(req.body));
    console.log(JSON.stringify(_user));
    User.findOne({name:_user.name},function (err,user) {
        if(err){
            console.log(err);
        }
        if (user){
            console.warn( DateUtil.now() +  ' -- user has exist !');
            return res.redirect('/user/signin');
        }else{
            console.info( DateUtil.now() +  ' -- new user has registered successfully !');
            _user.phone = {
                number:_user.number,
                brand:_user.brand
            };
            delete _user.number;
            delete _user.brand;

            user = new User(_user);
            user.save(function (err,user) {
                if (err){
                    console.log(err);
                }
                req.session.user = user;
                res.redirect('/');
            });
        }
    });
}

exports.signin = function (req,res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name:name}, function (err,user) {
        if(err){
            console.log(err);
        }
        if(!user){
            console.warn( DateUtil.now() +  ' --  user no exist !');
            return res.redirect('/user/signup');
        }
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
                return res.redirect('/');
            }else{
                console.warn(new Date().getDate() +  ' -- Account or password error');
                return res.redirect('/user/signin');
            }
        });
    });
}

exports.logout = function (req,res) {
    delete req.session.user;
    console.info( DateUtil.now() +  ' -- user has logout !');
    res.redirect('/');
}

exports.search = function (req,res) {
    res.locals.user = req.session ? req.session.user:'';
    res.render('search',{
        title: 'search'
    });
}
exports.doSearch = function (req,res) {
    var _user = req.body.user;
    var name = _user.name;
    var mail = _user.mail;
    User.findOne({"$or" : [{name: name} , {mail: mail}]}, function (err,user) {
        if(err){
            console.log(err);
            res.redirect('/');
        }
        if(!user){
            console.warn( DateUtil.now() +  ' --  user no exist !');
            res.redirect('/');
        }
        // res.locals.user = req.session ? req.session.user:'';
        res.render('showSearch',{
            title: '查询结果',
            user:user
        });
    });
}
exports.doUpdataRode = function (req,res) {
    var _user = req.body.user;
    var user_id = _user._id;
    console.log(DateUtil.now() + ' -- activatePermissions--  ' + user_id);
    var errors;
    var roleType = _user.role ;
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

            res.redirect('/user/search');
        }
    });
}

exports.list = function (req,res) {
    User.fetch(function (err,users) {
        if(err){
            console.log(err);
        }
        res.render('userlist',{
            title:'rayli用户列表页',
            users:users
        });
    })
}

//midware for user
exports.signinRequired = function (req,res,next) {
    var user = req.session.user;
    if(!user){
        return res.redirect('/user/signin');
    }
    next();
}
exports.logoutRequired = function (req,res,next) {
    var user = req.session.user;
    if(user){
        return res.redirect('/');
    }
    next();
}

exports.adminRequired = function (req,res,next) {
    var user = req.session.user;
    if(user.role<= 10){
        return res.redirect('/user/signin');
    }
    next();
}