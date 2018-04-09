/* globals Pebble: false */
/* globals navigator: false */
var settings;

module.exports = function getWeather(config) {
  settings = config;
  if (settings.useStation) {
    getWeatherByStation();
  }
  else {
    navigator.geolocation.getCurrentPosition(getWeatherByLocation, locationErrorHandler, getLocationTimeout);
  }
};

function getWeatherByStation() {
  var url = 'http://api.wunderground.com/api/' +
    settings.apiKey + '/conditions/geolookup/q/pws:' + 
    settings.station;

  request(url, 'GET', function(err, respBody) {
    if (err) return Pebble.showSimpleNotificationOnPebble('Weather Error', 'Error fetching from weather api.');
    var weather = JSON.parse(respBody);
    var weatherMsg;
    if (weather) {
      weatherMsg = {
        weather : {
          options: {
            useMetricWind: settings.useMetricWind,
            useMetricTemp: settings.useMetricTemp
          },
          observation: weather.current_observation.weather,
          temp: {
            temp_f: Math.round(weather.current_observation.temp_f),
            temp_c: Math.round(weather.current_observation.temp_c),
          },
          wind: {
            dir: weather.current_observation.wind_dir,
            speed_kph: parseInt(weather.current_observation.wind_kph),
            gust_kph: parseInt(weather.current_observation.wind_gust_kph),
            speed_mph: parseInt(weather.current_observation.wind_mph),
            gust_mph: parseInt(weather.current_observation.wind_gust_mph)
          }
        }
      };
    } 
    else {
      Pebble.showSimpleNotificationOnPebble('Weather Error', 'Error fetching from weather api by station.');
    }
    Pebble.postMessage(weatherMsg);
  });
}

function getWeatherByLocation(pos) {
  var url = 'http://api.wunderground.com/api/' +
      settings.apiKey + '/conditions/geolookup/q/' +
      pos.coords.latitude + ',' +
      pos.coords.longitude + '.json';

  request(url, 'GET', function(err, respBody) {
    if (err) return Pebble.showSimpleNotificationOnPebble('Weather Error', 'Error fetching from weather api.');
    var weather = JSON.parse(respBody);
    var weatherMsg;
    if (weather) {
      weatherMsg = {
        weather : {
          options: {
            useMetricWind: settings.useMetricWind,
            useMetricTemp: settings.useMetricTemp
          },
          observation: weather.current_observation.weather,
          temp: {
            temp_f: Math.round(weather.current_observation.temp_f),
            temp_c: Math.round(weather.current_observation.temp_c),
          },
          wind: {
            dir: weather.current_observation.wind_dir,
            speed_kph: parseInt(weather.current_observation.wind_kph),
            gust_kph: parseInt(weather.current_observation.wind_gust_kph),
            speed_mph: parseInt(weather.current_observation.wind_mph),
            gust_mph: parseInt(weather.current_observation.wind_gust_mph)
          }
        }
      };
    } 
    else {
      Pebble.showSimpleNotificationOnPebble('Weather Error', 'Error fetching from weather api by location.');
    }
    Pebble.postMessage(weatherMsg);
  });
}

function locationErrorHandler(err) {
  console.error('Error getting location');
  Pebble.showSimpleNotificationOnPebble('Location Error', 'Error fetching location information.');
}

function getLocationTimeout() {
  return {
    timeout: 15000, 
    maximumAge: 60000
  };
}

function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    // HTTP 4xx-5xx are errors:
    if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return callback(xhr.status, this.responseText);
    }
    callback(undefined, this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}