var Api = require('../app/controllers/api');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// User个体
router.post('/login', Api.api.auth);
router.post('/register', Api.api.register);
router.post('/auth', Api.api.auth);
router.post('/userInfo', Api.api.check_api_token, Api.api.userInfo);
router.post('/updatePoint', Api.api.check_api_token, Api.api.updatePoint);
router.post('/userList', Api.api.check_api_token, Api.api.userList);
router.post('/updateRole', Api.api.check_api_token, Api.api.updateRole);
router.get('/films', Api.api.check_api_token, Api.api.films);

module.exports = router;
