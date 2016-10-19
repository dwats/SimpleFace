var rocky = require('rocky');
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var feedingTime = '-';

rocky.on('draw', function(event) {
    // Prep Canvas
    var ctx = event.context;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    // Canvas Element Palette
    var palette = {
        'clock': {
          'bg': '#000',
          'alt': '',
          'font': '#AAA'
        },
        'dash': {
          'bg': '#00A',
          'alt': '#555',
          'font': '#AAA'
        }
    };

    // Get Element Dimensions
    var w = ctx.canvas.unobstructedWidth;
    var h = ctx.canvas.unobstructedHeight;
    var dims = {
            'w': w,
            'h': h,
            'clock': {
                'x': w * 0.5,
                'y': h * 0.25
            },
            'dash': {
                'w': w,
                'h': 45,
                'x': 0,
                'y': h - 45,
                'third': w / 3,
                'posX': [
                    (w / 3) / 2,
                    ((w / 3) * 3) / 2,
                    ((w / 3) * 5) / 2
                ],
                'posY': [
                    h * 0.74,
                    h * 0.79,
                    h * 0.84
                ]
            }
        };

    // Draw Elements
    drawBackground(ctx, palette, dims);
    drawTime(ctx, palette, dims);
    drawDate(ctx, palette, dims);
    //drawWeather(ctx, palette, dims);
    drawFeeding(ctx, palette, dims);

});

rocky.on('minutechange', function(event) {
    var time = new Date();
    if (time.getMinutes % 15 === 0 || feedingTime === '-') rocky.postMessage({
        'fetchFeedings': true
    });
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

function drawBackground(ctx, palette, dims) {
    // Clock BG
    ctx.fillStyle = palette.clock.bg;
    ctx.fillRect(0, 0, dims.w, dims.h);

    // Dash row BG
    ctx.fillStyle = palette.dash.bg;
    ctx.fillRect(0, dims.dash.y, dims.dash.w, dims.dash.h);

    // Dash row outline
    ctx.fillStyle = palette.dash.alt;
    ctx.fillRect(dims.dash.third, dims.dash.y, 1, dims.dash.h);
    ctx.fillRect(dims.dash.third * 2, dims.dash.y, 1, dims.dash.h);
    ctx.fillRect(0, dims.dash.y, w, 1);
}

function drawTime(ctx, palette, dims) {
  var datetime = getDateTime();

  // Time Draw
  ctx.fillStyle = palette.clock.font;
  ctx.font = '42px bold Bitham';
  ctx.textAlign = 'center';
  ctx.fillText(datetime.time, dims.clock.x, dims.clock.y);
}

function drawDate(ctx, palette, dims) {
  var datetime = getDateTime();

  // Date draw
  ctx.fillStyle = palette.dash.font;
  ctx.font = '18px bold Gothic';
  ctx.fillText(datetime.dayName, dims.dash.posX[0], dims.dash.posY[0]);
  ctx.fillText(datetime.date, dims.dash.posX[2], dims.dash.posY[2]);
}

function drawFeeding(ctx, palette, dims) {
  var feedingHeader;

  // Choose emoji to draw based on time since last feeding
  if (feedingTime === '-') {
      feedingHeader = '-';
  } else if (feedingTime < 7) {
      feedingHeader = '😄';
  } else if (feedingTime >= 7 && feedingTime < 9) {
      feedingHeader = '😐';
  } else {
      feedingHeader = '😰';
  }
  ctx.font = '28px bold Gothic';
  ctx.fillText(feedingHeader, dims.dash.posX[2], dims.dash.posY[1]);
}

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
