var User = require('../app/controllers/user');
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
router.post('/signup',User.logoutRequired, User.signup);
router.post('/signin',User.logoutRequired, User.signin);
router.get('/userCenter', User.signinRequired, User.showUserCenter);
router.get('/signin', User.logoutRequired, User.showSignin);
router.get('/signup', User.logoutRequired, User.showSignup);
router.get('/logout', User.logout);
router.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list);
router.get('/search', User.signinRequired, User.adminRequired, User.search);
router.post('/doSearch', User.signinRequired, User.adminRequired, User.doSearch);
router.post('/doUpdataRode', User.signinRequired, User.adminRequired, User.doUpdataRode);

module.exports = router;
