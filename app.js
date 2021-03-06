var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require("multer");
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
//站点配置
var settings = require("./app/db/settings");
// 数据库
var mongoose = require('mongoose');
mongoose.connect(settings.URL);
//路由
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'})); // 限制上传5M
app.use(bodyParser.urlencoded({ extended: true , limit: '50mb' }));
/*文件上传*/
app.use(multer({ dest: '/tmp/'}).array('image'));
app.use(express.static(path.join(__dirname, 'public')));

// 如果需要 session 支持，sessionStore 必须放在 watch 之后
var wechat = require('./routes/wechat');
app.use('/wechat', wechat);

app.use(cookieParser());
app.use(session({
  secret: 'rayli',
  store: new mongoStore({
    url: settings.URL,
    collection: 'sessions'
  }),
  cookie: {
    maxAge: 1 * 60 * 60 * 1000
  }//1hour;
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
