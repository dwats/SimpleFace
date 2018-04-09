var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function padZero(number) {
  var pad = '' + number;
  if (number < 10) {
    pad = '0' + pad;
  }
  return pad;
}

module.exports.getDateTime = function getDateTime() {
    // Current date/time
    var dt = new Date();
    var dMonth = monthNames[dt.getMonth()];
    var dDate = dt.getDate();
    var dDayName = dayNames[dt.getDay()];
    var d = dDate + ' ' + dMonth;
    var t = dt
        .toLocaleTimeString()
        .split(' ')[0]
        .split(':')
        .slice(0, 2)
        .join(':');
    return {
        'date': d,
        'dayName': dDayName,
        'time': t
    };
};

module.exports.getTimeObj = function getTimeObj() {
  var now = new Date();
  return {
    hour: padZero(now.getHours()),
    minute: padZero(now.getMinutes())
  };
};