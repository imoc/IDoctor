var Api = require('../app/controllers/api');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
// router.get('/login', function(req, res, next) {
//   res.render('login', { title: '登录'});
// });

// User个体
router.post('/login', Api.api.login);
router.post('/register', Api.api.register);
// router.post('/signin',User.logoutRequired, User.signin);
// router.get('/userCenter', User.signinRequired, User.showUserCenter);
// router.get('/signin', User.logoutRequired, User.showSignin);
// router.get('/signup', User.logoutRequired, User.showSignup);
// router.get('/logout', User.logout);
// router.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list);

module.exports = router;
