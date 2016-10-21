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