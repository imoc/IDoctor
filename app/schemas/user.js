/**
 * Created by lilxiaowei on 2016-10-19.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//数据库操作对象
var DbOpt = require("../db/Dbopt");
//站点配置
var settings = require("../db/settings");
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type: String
    },
    password: String,
    mail:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    avatar:{
        unique:true,
        type: String,
        default:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4287935292,2728355048&fm=116&gp=0.jpg'
    },
    birth: {
        type:Date,
        default:Date.now()
    },
    sex:{
        type:Number,
        default:0
    },
    sign: String,
    point:{
        type:Number,
        default:0
    },
    level:{
        type:Number,
        default:0
    },
    money:{
        type:Number,
        default:0
    },
    role:{
        type:Number,
        default:0 // 0 免费用户，1 付费用户， 5 一级付费用户（一周），6 二级付费用户（一月），7 三级付费用户（三月），10 普通管理员， 100 超级管理员
    },
    roleExpeDate:{
        type:Date,
        default:Date.now()
    },
    phone:{
        number: {
            type:String
        },
        brand:{
            type:String
        }
    },
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

UserSchema.pre('save',function (next) {
    var user = this;
    if (this.isNew){
        this.meta.crateAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    user.password = DbOpt.encrypt(user.password,settings.encrypt_key);
    next();
});

UserSchema.methods = {
    comparePassword:function (_password,cb) {
        var newPsd = DbOpt.encrypt(_password,settings.encrypt_key);
        cb(null,newPsd===this.password);
    }
};

UserSchema.statics = {
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

module.exports = UserSchema;