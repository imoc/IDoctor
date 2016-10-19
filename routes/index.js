var express = require('express');
var router = express.Router();

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
  res.render('index', { title: 'Express' });
});

module.exports = router;
