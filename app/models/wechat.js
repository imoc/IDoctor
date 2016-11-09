/**
 * Created by lilxiaowei on 2016-10-18.
 */
var mongoose = require("mongoose");	//	顶会议用户组件
mongoose.Promise = require('bluebird');
var WechatSchema = require('../schemas/wechat');
var Wechat = mongoose.model('Wechat',WechatSchema);

module.exports = Wechat;