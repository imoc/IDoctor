/**
 * Created by lilxiaowei on 2016-10-18.
 */
var mongoose = require("mongoose");	//	顶会议用户组件
var FilmSchema = require('../schemas/film');
var Film = mongoose.model('Film',FilmSchema);

module.exports = Film;