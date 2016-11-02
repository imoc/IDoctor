/**
 * Created by lilxiaowei on 2016-10-31.
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
var FilmSchema = new mongoose.Schema({
    name:{
        // unique:true,
        type: String
    },
    title: String,
    url: String,
    src:{
        type:String,
        default:''
    },
    image: String,
    type: String,//频道类型
    hd:String,//画质
    director: String,
    actor: String,
    content: String,
    pic: String,
    area: String,
    language: String,
    year : String,
    length: String,
    reurl: String,
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

FilmSchema.pre('save',function (next) {
    var user = this;
    if (this.isNew){
        this.meta.crateAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
});

FilmSchema.pre('update',function (next) {
    var user = this;
    if (this.isNew){
        this.meta.crateAt = this.meta.updateAt = Date.now();
    }else {
        this.meta.updateAt = Date.now();
    }
    next();
});

FilmSchema.methods = {
    comparePassword:function (_password,cb) {
        var newPsd = DbOpt.encrypt(_password,settings.encrypt_key);
        cb(null,newPsd===this.password);
    }
};

FilmSchema.statics = {
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

module.exports = FilmSchema;