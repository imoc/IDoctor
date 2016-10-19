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

// User
router.post('/signup', User.signup)
router.post('/signin', User.signin)
router.get('/signin', User.showSignin)
router.get('/signup', User.showSignup)
router.get('/logout', User.logout)
router.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list)

module.exports = router;
