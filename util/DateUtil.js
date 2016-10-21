//时间格式化
var moment = require('moment');

exports.now = function (date) {
  date = date||Date.now();
  var dateStr = moment(date).format('YYYY-MM-DD HH:mm:ss').toString();
  return dateStr;
}
