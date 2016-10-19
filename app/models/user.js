/**
 * Created by lilxiaowei on 2016-10-18.
 */
var mongoose = require("mongoose");	//	顶会议用户组件
var UserSchema = require('../schemas/user');
var User = mongoose.model('User',UserSchema);

module.exports = User;