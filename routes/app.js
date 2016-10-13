var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var os = req.header("User-Agent");
  var osversion = os.match(/iPhone OS (\d*)/);
  var osType = 'android';
  // var downLoadUrl = "/download/huozhouNews_0.5.1.apk";
  var downLoadUrl = "download?src=huozhouNews_0.5.1.apk";
  if (osversion && osversion[1] >= 9) {
    osType = 'ios';
  }
    res.render('app', { title: osType ,downLoadUrl:downLoadUrl});
});

module.exports = router;
