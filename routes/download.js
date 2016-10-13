var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('这是下载页'+ JSON.stringify( req.query));
  var realpath =  "public/download/" + req.query.src;
  var filename = "huozhouNews_0.5.1.apk";
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  // res.setHeader("Content-Disposition", 'attachment; filename="huozhouNews_0.5.1.apk"');
  // res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.download(realpath,filename);
  res.send
});

module.exports = router;
