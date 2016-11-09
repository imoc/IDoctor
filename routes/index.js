var express = require('express');
var router = express.Router();
var user = require('./user');
var download = require('./download');
var appDownLoad = require('./app');
var crawler = require('./crawler');
var api = require('./api');
var film = require('./film');
var wechat = require('./wechat');


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.isVisit) {
    console.log(req.cookies);
    // res.send("再次欢迎访问");
  } else {
    res.cookie('isVisit', 1, {maxAge: 60 * 1000});
    // res.send("欢迎第一次访问");
  }
  res.locals.user = req.session ? req.session.user:'';
  var title = '达芬奇的铁匠铺';
  res.render('index', { title: title });
});

router.use('/user', user);
router.use('/app', appDownLoad);
router.use('/download', download);
router.use('/crawler', crawler);
router.use('/api', api);
router.use('/film', film);
// router.use('/wechat', wechat);

module.exports = router;
