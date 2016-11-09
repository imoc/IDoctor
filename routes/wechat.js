var Film = require('../app/controllers/film');
var User = require('../app/controllers/user');
var Wechat = require('../app/controllers/wechat');
var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var webot = require('weixin-robot');
/* GET users listing. */
router.use(express.query());
router.get('/', Wechat.wechat_auth);//Token验证
router.get('/jsDome', Wechat.showJsDome);//Token验证
router.get('/index', Wechat.showPage);//生产环境
router.get('/showOauth', Wechat.showOauth);//

// // 载入webot1的回复规则
require('../rules')(webot);
var wx_token = process.env.WX_TOKEN || 'davinci';
// 启动机器人, 接管 web 服务请求
webot.watch(router, { token: wx_token, path: '/' });
//------------------------------------
// 如果需要 session 支持，sessionStore 必须放在 watch 之后
var cookieParser = require('cookie-parser');
router.use(cookieParser());
// 为了使用 waitRule 功能，需要增加 session 支持
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
//站点配置
var settings = require("../app/db/settings");
// 数据库
var mongoose = require('mongoose');
// mongoose.connect(settings.URL);
router.use(session({
    secret: 'rayli',
    store: new mongoStore({
        url: settings.URL,
        collection: 'sessions'
    }),
    cookie: {
        maxAge: 1 * 60 * 60 * 1000
    }//1hour;
}));
//------------------------------------


// router.use('/', Wechat.wechat_raply);//生产环境


module.exports = router;