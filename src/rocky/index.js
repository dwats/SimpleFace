var rocky = require('rocky');
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var weather;
var feedingTime = '-';

rocky.on('draw', function(event) {
    // Prep Canvas
    var ctx = event.context;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    // Canvas Element Palette
    var palette = {
        'clock': {
          'bgs': [
              '#FFF',
              '#FFA',
              '#FA5',
              '#F55'
          ],
          'alt': '',
          'fonts': [
              '#555',
              '#000'
          ]
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
    drawClock(ctx, palette, dims);
    drawDash(ctx, palette, dims);

});

rocky.on('minutechange', function(event) {
    var time = new Date();
    if (time.getMinutes % 15 === 0 || feedingTime === '-') {
        rocky.postMessage({
            'fetchFeedings': true
        });
    }
    if (!weather) {
        rocky.postMessage({
            'fetchWeather' : true 
        });
    }
    rocky.requestDraw();
});

rocky.on('hourchange', function(event) {
    rocky.postMessage({
        'fetchWeather': true
    });    
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
    else if (message.weather) {
        weather = message.weather;
        if (!weather) {
            weather = '-';
        }
        rocky.requestDraw();
    }
});

function drawClock(ctx, palette, dims) {
    var datetime = new Date();
    var hour = datetime.getHours();
    var bg;
    var font;
    console.log('hour:' + hour);
    
    if (hour >= 0 && hour < 4) {
        bg = palette.clock.bgs[3];
        font = palette.clock.fonts[1];
    }
    else if (hour >= 4 && hour < 8) {
        bg = palette.clock.bgs[2];
        font = palette.clock.fonts[1];
    }
    else if (hour >= 8 && hour < 12) {
        bg = palette.clock.bgs[1];
        font = palette.clock.fonts[0];
    }
    else if (hour >= 12 && hour < 16) {
        bg = palette.clock.bgs[0];
        font = palette.clock.fonts[0];        
    }
    else if (hour >= 16 && hour < 20) {
        bg = palette.clock.bgs[1];
        font = palette.clock.fonts[0];
    }
    else if (hour >= 20 && hour <= 23) {
        bg = palette.clock.bgs[2];
        font = palette.clock.fonts[1];
    }
    
    bg = palette.clock.bgs[2];
    font = palette.clock.fonts[1];
    
    console.log('clock bg: ' + bg);
    // Clock BG
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, dims.w, dims.h);
    console.log('Clock BG drawn.');
    
    // Clock Face (time)
    drawTime(ctx, font, dims);
    console.log('drawClock complete.');
}

function drawDash(ctx, palette, dims) {   
    // Dash row BG
    ctx.fillStyle = palette.dash.bg;
    ctx.fillRect(0, dims.dash.y, dims.dash.w, dims.dash.h);

    // Dash row outline
    ctx.fillStyle = palette.dash.alt;
    ctx.fillRect(dims.dash.third, dims.dash.y, 1, dims.dash.h);
    ctx.fillRect(dims.dash.third * 2, dims.dash.y, 1, dims.dash.h);
    ctx.fillRect(0, dims.dash.y, dims.w, 1);
    
    // Draw Element Text
    drawDate(ctx, palette, dims);
    drawWeather(ctx, palette, dims);
    drawFeeding(ctx, palette, dims);
    console.log('drawDash complete.');
}

function drawTime(ctx, fnt, dims) {
  var datetime = getDateTime();

  // Time Draw
  ctx.fillStyle = fnt;
  ctx.textAlign = 'center';
  ctx.font = '42px bold Bitham';
  ctx.fillText(datetime.time, dims.clock.x, dims.clock.y);
}

function drawDate(ctx, palette, dims) {
  var datetime = getDateTime();

  // Date draw
  ctx.fillStyle = palette.dash.font;
  ctx.font = '18px bold Gothic';
  ctx.fillText(datetime.dayName, dims.dash.posX[0], dims.dash.posY[0]);
  ctx.fillText(datetime.date, dims.dash.posX[0], dims.dash.posY[2]);
}

function drawWeather(ctx, palette, dims) {
    ctx.fillStyle = palette.dash.fon;
    ctx.font = '18px bold Gothic';
    ctx.fillText(weather.temp_f + 'ºF', dims.dash.posX[1], dims.dash.posY[0]);
    //ctx.fillText(weather.weather, dims.dash.posX[1], dims.dash.posY[2]);
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
  ctx.fillText(feedingHeader, dims.dash.posX[2], dims.dash.posY[0]);
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
