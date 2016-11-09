/**
 * Created by lilxiaowei on 2016-11-04.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//数据库操作对象
var DbOpt = require("../db/Dbopt");
//站点配置
var settings = require("../db/settings");

var WechatSchema = new mongoose.Schema({
    name:String,
    originalId: {
        unique:true,
        type: String
    },
    appid: {
        unique:true,
        type: String
    },
    appsecret: String,//频道类型
    encodingAESKey:String,//画质
    token: String,
    access_token: String,
    jsapi_ticket: String,
    image: String,
    biz: String,
    QRCode: String,
    meta:{
        crateAt: {
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

WechatSchema.pre('save',function (next) {
    var user = this;
    if (this.isNew){
        this.meta.crateAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
});

WechatSchema.pre('update',function (next) {
    var user = this;
    if (this.isNew){
        this.meta.crateAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
});

WechatSchema.methods = {
    comparePassword:function (_password,cb) {
        var newPsd = DbOpt.encrypt(_password,settings.encrypt_key);
        cb(null,newPsd===this.password);
    }
};

WechatSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id,cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    updatePoint: function (id,point,cb) {
        return this
            .update({_id:id},{'$inc':{point:point}})
            .exec(cb);
    },
    updateRole: function (id,role,expDate,cb) {
        return this
            .update({_id:id},{'$set':{role:role,roleExpeDate:expDate }})
            .exec(cb);
    },
}

module.exports = WechatSchema;