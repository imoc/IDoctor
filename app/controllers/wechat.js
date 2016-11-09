/**
 * Created by lilxiaowei on 2016-11-03.
 */
var mongoose = require('mongoose');
var Wechat = require('../models/wechat');
var DateUtil = require('../../util/DateUtil');
var wechat = require('wechat');
var api = require('wechat-api');//npm wx
var sign = require('../../util/sign');
var url = require("url");
var crypto = require("crypto");
var schedule = require("node-schedule");//定时任务
var http = require('http');
var OAuth = require('wechat-oauth');

//微信接口的哈希加密方法
function sha1(str) {
    var md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
}
//微信路径token验证
function validate_token(req,res){
    //获取请求的qurey排序以后加密
    var query = url.parse(req.url, true).query;
    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    var nonce = query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = "davinci";
    oriArray.sort();
    var original = oriArray.join('');
    var scyptoString = sha1(original);
    if (signature == scyptoString) {
        res.end(echostr);
        console.log("Confirm and send echo back");
    } else {
        res.end("false");
        console.log("Failed!");
    }
}
//闻喜培优教育 测试环境
var config = {
    token : 'davinci',
    appid : 'wxa7c061fbe91e3caa',
    appsecret :'270e6bb2a377551853180af6f1b0c2bb',
    encodingAESKey : 'X4vgr2jq9wEWFR8zcqJ7NhkVWSukxmBAvgK5RyiVK8x'
};
var client = new OAuth(config.appid, config.appsecret);
//闻喜培优教育 生产环境
// var config = {
//     token : 'davinci',
//     appid : 'wxf923e19478b71005',
//     appsecret :'01cce64ae5c5005704a3d8411f308e99',
//     encodingAESKey : 'X4vgr2jq9wEWFR8zcqJ7NhkVWSukxmBAvgK5RyiVK8x'
// };

exports.showPage = function (req,res,next) {
    res.render('wechat',{
        title: '微信测试'
    });
};
//Token验证
exports.showJsDome = function (req,res,next) {
    Wechat.findOne({ appid: config.appid }, function (err,wechat) {
        if (err) {
            console.log(err);
        }
        if (!wechat) {
            console.warn(DateUtil.now() + ' --  wechat no exist !');
        }

        console.info( DateUtil.now() +  ' -- showJsDome --' + JSON.stringify(wechat));
        var originalUrl = 'http://rayli.yicp.io'+req.originalUrl;
        console.info( DateUtil.now() +  ' -- req.url --' + JSON.stringify(originalUrl));
        var wechatSign = sign(wechat.jsapi_ticket, originalUrl)
        console.info( DateUtil.now() +  ' -- wechatSign --' + JSON.stringify(wechatSign));
        wechat.wechatSign = wechatSign;
        console.info( DateUtil.now() +  ' -- showJsDome --' + JSON.stringify(wechat));
        res.render('wxjsDome',{
            title: '微信测试',
            wechat:wechat,
            wechatSign:wechatSign
        });
    });

}
//Token验证
exports.wechat_auth = function (req,res,next) {
    // res.send('respond with a wechat');
    validate_token(req,res);

}

//Token验证
exports.showOauth = function (req,res,next) {
    console.info( DateUtil.now() +  ' --showOauth  --');
    var code = req.query.code;
    if(code){


    client.getAccessToken(code, function (err, result) {
        console.info( DateUtil.now() +  ' --showOauth  getAccessToken --' +  JSON.stringify(result));
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        console.info( DateUtil.now() +  ' --showOauth  openid --' + openid);
        client.getUser(openid, function (err, result) {
            var userInfo = result;

            console.info( DateUtil.now() +  ' --showOauth  userInfo --' + JSON.stringify(userInfo));
            // res.render('wxjsDome',{
            //     title: '微信测试',
            //     wechat:wechat,
            //     wechatSign:wechatSign
            // });
            var resJsonObj = {'code': "1", 'msg': "注册成功", 'data': userInfo};
            res.json(resJsonObj);
        });

    });

    }else{
        var resJsonObj = {'code': "0", 'msg': "oauth fail", 'data': userInfo};
        res.json(resJsonObj);
    }


    // Wechat.findOne({ appid: config.appid }, function (err,wechat) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     if (!wechat) {
    //         console.warn(DateUtil.now() + ' --  wechat no exist !');
    //     }
    //
    //     console.info( DateUtil.now() +  ' -- showJsDome --' + JSON.stringify(wechat));
    //     var originalUrl = 'http://rayli.yicp.io'+req.originalUrl;
    //     console.info( DateUtil.now() +  ' -- req.url --' + JSON.stringify(originalUrl));
    //     var wechatSign = sign(wechat.jsapi_ticket, originalUrl)
    //     console.info( DateUtil.now() +  ' -- wechatSign --' + JSON.stringify(wechatSign));
    //     wechat.wechatSign = wechatSign;
    //     console.info( DateUtil.now() +  ' -- showJsDome --' + JSON.stringify(wechat));
    //     res.render('wxjsDome',{
    //         title: '微信测试',
    //         wechat:wechat,
    //         wechatSign:wechatSign
    //     });
    // });

}

var List = wechat.List;
List.add('view', [
    ['回复{a}查看我的性别', function (req, res) {
        res.reply('我是个妹纸哟');
    }],
    ['回复{b}查看我的年龄', function (req, res) {
        res.reply('我今年18岁');
    }],
    ['回复{c}查看我的性取向', '这样的事情怎么好意思告诉你啦- -']
]);

var picUrl = 'http://uploads.rayli.com.cn/2016/1026/1477445825594.jpg';
var testUrl = 'http://rayli.yicp.io/wechat/index';
//raply
exports.wechat_raply = wechat(config, function(req, res, next) {
        console.info(DateUtil.now() + ' --  wechat');
        console.log(req.weixin);
        // 微信输入信息都在req.weixin上
        var message = req.weixin;
    //WXSession支持
    // if (message.Content === '=') {
    //     var exp = req.wxsession.text.join('');
    //     req.wxsession.text = '';
    //     res.reply(exp);
    // } else {
    //     req.wxsession.text = req.wxsession.text || [];
    //     req.wxsession.text.push(message.Content);
    //     res.reply('收到' + message.Content);
    // }

        if (message.Content  === 'diaosi') {
            // 回复屌丝(普通回复)
            res.reply('hehe');
        } else if (message.Content  === 'oauth') {
            var redirectUrl  =  'http://rayli.yicp.io'+'/wechat/showOauth';
            var state = 1;
            var scope = 'snsapi_userinfo';
            var url = client.getAuthorizeURL( redirectUrl, state, scope);
            res.reply(url);
        }else if (message.Content  === 'list') {
            res.wait('view');
        }else if (message.Content  === 'text') {
            //你也可以这样回复text类型的信息
            res.reply({
                content: 'text object',
                type: 'text'
            });
        } else if (message.Content  === 'creatappid') {
            //你也可以这样回复text类型的信息
            var wechat = new Wechat(config);
            wechat.save(function (err,user) {
                if (err){
                    console.log(err);
                    res.reply('creatappid fail');
                }else{
                    res.reply('creatappid success');
                }

            });

        } else if (message.Content  === 'hehe') {
            // 回复一段音乐
            res.reply({
                type: "music",
                content: {
                    title: "来段音乐吧",
                    description: "一无所有",
                    musicUrl: "http://mp3.com/xx.mp3",
                    hqMusicUrl: "http://mp3.com/xx.mp3",
                    thumbMediaId: "thisThumbMediaId"
                }
            });
        } else if (message.Content  === 'startjob') {
            startSchedule();
            res.reply('startjob');
        } else if (message.Content  === 'stopjob') {
            stopSchedule();
            res.reply('stopjob');
        }else if (message.Content  === 'at') {
            refreshToken(function (access_token,err) {
                if(err){
                    res.reply('refreshToken fail');
                }else {
                    res.reply(access_token);
                }
            });
        }  else {
            // 回复高富帅(图文回复)
            res.reply([
                {
                    title: '你来我家接我吧',
                    description: '这是女神与高富帅之间的对话',
                    picurl: picUrl,
                    url: testUrl
                },
                {
                    title: '你来我家接我吧',
                    description: '这是女神与高富帅之间的对话',
                    picurl: picUrl,
                    url: 'http://rayli.yicp.io'
                },
                {
                    title: '你来我家接我吧',
                    description: '这是女神与高富帅之间的对话',
                    picurl: picUrl,
                    url: 'http://rayli.yicp.io'
                },
                {
                    title: '你来我家接我吧',
                    description: '这是女神与高富帅之间的对话',
                    picurl: picUrl,
                    url: 'http://rayli.yicp.io'
                },
                {
                    title: '你来我家接我吧',
                    description: '这是女神与高富帅之间的对话',
                    picurl: picUrl,
                    url: 'http://rayli.yicp.io'
                },
            ]);
        }
    });

exports.wechat_raply1 = function (req,res,next) {
    console.info(DateUtil.now() + ' --  wechat_raply'+' -- '+JSON.stringify(req.body));
    // console.dir(req);
    // res.json({'code': "0", 'msg': "Account or password error"});
    wechat(config).text(function (message,req, res, next) {

        var content=message.Content||'';
        if(/help/.test(content)||/帮助/.test(content)||/HELP/.test(content)){
            res.reply('Hi,小编等你很久了\n输入 帮助 或 help 获取帮助');
        }else if(/里约/.test(content)||/奥运/.test(content)||/奖牌/.test(content)||/2016/.test(content)){
            res.reply('奥运奖牌');
        }else{
            res.reply('您的反馈已收到,我们会定时回复.');
        }

    }).image(function (message, req, res, next) {

        res.reply('图已收到');
    }).voice(function (message, req, res, next) {

        res.reply('语音已收到');
    }).video(function (message, req, res, next) {

        res.reply('视频已收到');
    }).location(function (message, req, res, next) {

        res.reply('地理位置已收到');
    }).link(function (message, req, res, next) {

        res.reply('链接已收到');
    }).event(function (message, req, res, next) {
        switch (message.Event) {
            case 'subscribe':
                var openid=message.FromUserName;

                res.reply('欢迎关注一介布衣公众号');
                break;
            case 'unsubscribe':
                var openid=message.FromUserName;

                res.reply('亲,请不要离开我!!');
                break;
            default :
                res.send('');
        }

    }).device_text(function (message, req, res, next) {

        res.reply('设备消息已收到');
    }).device_event(function (message, req, res, next) {

        res.reply('设备事件已收到');
    }).middlewarify()
}


var refreshTokenJob = null;
/**
 * 启动定时任务
 */
function startSchedule() {
    var rule     = new schedule.RecurrenceRule();



    var times    = [1,3,5,7,9,11,13,15,17,19,21,23];
    rule.hour  = times;

    // var times    = [1,6,11,16,21,26,31,36,41,46,51,56];
    // rule.minute  = times;
    // rule.second  = times;
    if(refreshTokenJob){
        refreshTokenJob.cancel();
    }
    refreshTokenJob = schedule.scheduleJob(rule, function(){
        refreshToken();
    });

    // refreshTokenJob.cancel();
}
function stopSchedule() {
    refreshTokenJob.cancel();
}
function refreshToken(ck){
    // console.info( DateUtil.now() +  ' -- refreshToken');
    // var uri = 'http://120.25.169.8/before/index';
    // http.get(uri, function(res) {
    //     console.log("访问个人微博状态码: " + res.statusCode);
    // }).on('error', function(e) {
    //     console.log("个人微博 error: " + e.message);
    // });

    //TODO 1.
    Wechat.findOne({ appid: config.appid }).exec().then(function (wechat) {
        if (!wechat) {
            done(null, false);
            return;
        }

        console.info( DateUtil.now() +  ' -- refreshToken');
        // var uri = 'http://120.25.169.8/before/index';
        // http.get(uri, function(res) {
        //     console.log("访问个人微博状态码: " + res.statusCode);
        //     wechat.access_token = new Date()+'-'+ res.statusCode;
        //     wechat.save(function (err,user) {
        //         if (err){
        //             console.log(err);
        //         }
        //         console.info( DateUtil.now() +  ' -- wechat.save');
        //     });
        // }).on('error', function(e) {
        //     console.log("个人微博 error: " + e.message);
        // });


        var requestAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appid+'&secret='+config.appsecret;

        gs.get(requestAccessTokenUrl, function(data){
            // console.log(data);//将data输出即使中文
            var resObj = JSON.parse(data);
            console.info( DateUtil.now() +  ' -- requestAccessTokenUrl --' + JSON.stringify(data));
            var ACCESS_TOKEN = resObj.access_token
            var requestJsapi_ticketUrl = 'http://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token='+ACCESS_TOKEN;
            gs.get(requestJsapi_ticketUrl, function(data){
                // console.log(data);//将data输出即使中文
                var resObj = JSON.parse(data);
                console.info( DateUtil.now() +  ' -- requestAccessTokenUrl --' + JSON.stringify(data));

                var ticket =  resObj.ticket;
                wechat.access_token = ACCESS_TOKEN;
                wechat.jsapi_ticket = ticket;
                wechat.save(function (err,user) {
                    if (err){
                        console.log(err);
                        if(ck){
                            ck(null,err)
                        }
                    }
                    if(ck){
                        ck(ACCESS_TOKEN +" ===== "+ ticket)
                    }
                    console.info( DateUtil.now() +  ' -- wechat.save');
                });

            }, 'utf-8').on('error',function(err){
                console.log(err);
            });
        })

    })
    //     .then(function (wechat) {
    //     console.info( DateUtil.now() +  ' -- wechat.save');
    //     wechat.save(function (err,user) {
    //         if (err){
    //             console.log(err);
    //         }
    //         console.info( DateUtil.now() +  ' -- wechat.save');
    //     });
    // })
        .catch(function (err) {
            console.log('err ' + err);
        // done(err);
    });
}
var gs = require('nodegrass');
function requestAccessToken() {

    var requestAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+config.appid+'&secret='+config.appid+config.appsecret;

    gs.get(requestAccessTokenUrl, function(data){
        // console.log(data);//将data输出即使中文
        var resObj = JSON.parse(data);
        console.log("访问个人微博状态码: " + res.statusCode);
        wechat.access_token = new Date()+'-'+ res.statusCode;
        wechat.save(function (err,user) {
            if (err){
                console.log(err);
            }
            console.info( DateUtil.now() +  ' -- wechat.save');
        });

    }, 'utf-8').on('error',function(err){
        console.log(err);
    });

    http.get(requestAccessTokenUrl, function(res) {
        console.log("访问个人微博状态码: " + res.statusCode);
        wechat.access_token = new Date()+'-'+ res.statusCode;
        wechat.save(function (err,user) {
            if (err){
                console.log(err);
            }
            console.info( DateUtil.now() +  ' -- wechat.save');
        });
    }).on('error', function(e) {
        console.log("个人微博 error: " + e.message);
    });
}