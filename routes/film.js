var Film = require('../app/controllers/film');
var User = require('../app/controllers/user');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/showList', Film.showList);
router.get('/detail/:id', Film.showFilmDetail);
router.get('/showSearch', Film.showSearch);
router.post('/doSearch', Film.doSearch);
router.post('/doUpdate', User.signinRequired, User.adminRequired, Film.doUpdate);


module.exports = router;
