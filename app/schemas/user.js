/**
 * Created by lilxiaowei on 2016-10-19.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type: String
    },
    password: String,
    role:{
        type:Number,
        default:0
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
    next();
});

UserSchema.methods = {
    comparePassword:function (_password,cb) {
        cb(null,_password===this.password);
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
    }
}

module.exports = UserSchema;