var rocky = require('rocky');
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var feedingTime = '-';
var clkBgColor = '#000';
var clkFntColor = '#AAA';
var dashBgColor = '#00A';
var dashBgColorAlt = '#555';
var dashFntColor = '#AAA';

rocky.on('draw', function(event) {
    // Get the CanvasRenderingContext2D object
    var ctx = event.context;
    // Clear the screen
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    
    // Get unobstructed screen dimensions
    var w = ctx.canvas.unobstructedWidth;
    var h = ctx.canvas.unobstructedHeight;
    // Clock Face Pos
    var xClkPos = w / 2;
    var yClkPos = h * 0.25;
    // Dashbar height
    var hDash = 45;
    // Dashbar Y screen-pos
    var yDashPos = h - hDash;
    // Dash Width
    var wDash = w;
    // Dash width thirds
    var wDashThird = w / 3;
    // Dash content x screen-pos
    var xDashPos1 = wDashThird / 2;
    var xDashPos2 = (wDashThird * 3) / 2;
    var xDashPos3 = (wDashThird * 5) / 2;
    // Dash content y screen-pos
    var yDashTop = h * 0.74;
    var yDashMid = h * 0.79;
    var yDashBot = h * 0.84;
    
    // TODO Refactor this into `drawBackground`
    // Time Block
    ctx.fillStyle = clkBgColor;
    ctx.fillRect(0, 0, w, h);
    // Bottom Row - Left/Right
    ctx.fillStyle = dashBgColor;
    ctx.fillRect(0, yDashPos, wDash, hDash);
    // Dash outline
    ctx.fillStyle = dashBgColorAlt;
    ctx.fillRect(wDashThird, yDashPos, 1, hDash);
    ctx.fillRect(wDashThird * 2, yDashPos, 1, hDash);
    ctx.fillRect(0, yDashPos, w, 1);
    
    // Get Date Time object
    var datetime = getDateTime();
    
    // TODO Refactor this into `drawTime`
    // Time Draw
    ctx.fillStyle = clkFntColor;
    ctx.font = '42px bold Bitham';
    ctx.textAlign = 'center';
    ctx.fillText(datetime.time, xClkPos, yClkPos);
    
    // TODO Refactor this into `drawDate`
    // Date draw
    ctx.fillStyle = dashFntColor;
    ctx.font = '18px bold Gothic';
    ctx.fillText(datetime.dayName, xDashPos1, yDashTop);
    ctx.font = '18px bold Gothic';
    ctx.fillText(datetime.date, xDashPos1, yDashBot);
    
    // TODO Refactor this into `drawFeeding`
    // Feeding Time Draw
    var feedingHeader;
    if (feedingTime === '-') {
        feedingHeader = '-';
    }
    else if (feedingTime < 7) {
        feedingHeader = '😄';
    }
    else if (feedingTime >= 7 && feedingTime < 9) {
        feedingHeader = '😐';
    }
    else {
        feedingHeader = '😰';
    }
    ctx.font = '28px bold Gothic';
    ctx.fillText(feedingHeader, xDashPos3, yDashTop);
});

rocky.on('minutechange', function(event) {
    var time = new Date();
    if (time.getMinutes % 15 === 0 || feedingTime === '-') rocky.postMessage({'fetchFeedings': true});
    rocky.requestDraw();
});

rocky.on('message', function(event) {
    var message = event.data;
    
    if (message.feedingEvent) {
        feedingTime = message.feedingEvent.elapsed;
        if (isNaN(feedingTime)) {
            feedingTime = '-';
        } 
        rocky.requestDraw();
    }
});

// Return a formatted date time
function getDateTime() {
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
}