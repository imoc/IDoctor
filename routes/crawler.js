var express = require('express');
var router = express.Router();
var crawler = require('../app/controllers/crawler');

// index
router.get('/',  crawler.index);
//瑞丽聚合
router.get('/raylijuhe', crawler.raylijuhe);
// 霍州新闻
router.get('/huozhoutvNews', crawler.huozhoutvNews);
// 霍州新闻详情
router.get('/huozhoutvNews/detail',crawler.huozhoutvNewsDetail);

module.exports = router;