var utils = require('./util');

var getTimeObj = utils.getTimeObj;
var getDateTime = utils.getDateTime;
var rocky = require('rocky');
var weather;

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
    'alt': '#006',
    'font': '#EEE'
  }
};

rocky.on('draw', function(event) {
  var ctx = event.context;
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  
  var dims = {
    w: w,
    h: h,
    clock: {
      hour: {
        x: w * 0.5 - 30,
        y: h * 0.35
      },
      minute: {
        x: w * 0.5 + 30,
        y: h * 0.35
      }
    }
  };

  console.log('drawClock');
  drawClock(ctx, palette, dims);
  console.log('drawDate');
  drawDate(ctx, palette, dims);
  console.log('drawWeather');
  drawWeather(ctx, palette, dims);
});

rocky.on('minutechange', function(event) {
    if (!weather || event.date.getMinutes() % 15) {
      rocky.postMessage({
        'fetchWeather' : true 
      });
    }
    rocky.requestDraw();
});

rocky.on('message', function(event) {
    var message = event.data;

    if (message.weather) {
        weather = message.weather;
        console.log('weather' + weather);
        if (!weather) {
            weather = '-';
        }
        rocky.requestDraw();
    }
});

// Canvas Draw Functions
function drawClock(ctx, palette, dims) {  
    // Clock BG
    ctx.fillStyle = palette.clock.bgs[0];
    ctx.fillRect(0, 0, dims.w, dims.h);
    console.log('Clock BG drawn.');
    
    // Clock Face (time)
    drawTime(ctx, palette.clock.fonts[1], dims);
    console.log('drawClock complete.');
}

function drawTime(ctx, fnt, dims) {
  var now = getTimeObj();

  // Time Draw
  ctx.fillStyle = fnt;
  ctx.textAlign = 'center';
  // ctx.font = '42px light Bitham';
  ctx.font = '49px Roboto-subset';
  ctx.fillText(now.hour, dims.clock.hour.x, dims.clock.hour.y);
  // ctx.font = '42px bold Bitham';
  ctx.fillText(now.minute, dims.clock.minute.x, dims.clock.minute.y);
}

function drawDate(ctx, palette, dims) {
  var datetime = getDateTime();
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  
  // Date draw
  ctx.fillStyle = palette.clock.fonts[0];
  ctx.font = '14px Gothic';
  
  ctx.fillText(datetime.dayName + ', ' + datetime.date, w * 0.5, h * 0.3);
}

function drawWeather(ctx, palette, dims) {
  if (!weather) return;
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.clientHeight;
  ctx.fillStyle = palette.clock.fonts[0];
  ctx.font = '14px Gothic';
  
  var temp = weather.temp.temp_f + 'ºF';
  var wind = 'Wind: ' + weather.wind.dir + ' ' + weather.wind.speed_mph + ' MPH';
  var gust = 'Gust: ' + weather.wind.gust_mph + ' MPH';

  if (weather.options.useMetricTemp) {
    temp = weather.temp.temp_c + 'ºC';
  }
  if (weather.options.useMetricWind) {
    wind = 'Wind: ' + weather.wind.dir + ' ' + weather.wind.speed_kph + ' KPH';
    gust = 'Gust: ' + weather.wind.gust_kph + ' KPH';
  }
  var fullWeather = temp + ' and ' + weather.observation;

  ctx.fillText(fullWeather, w * 0.5, h * 0.65);
  ctx.fillText(wind, w * 0.5, h * 0.75);
  ctx.fillText(gust, w * 0.5, h * 0.85);
}

