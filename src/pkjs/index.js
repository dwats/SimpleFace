/* globals Pebble: false */
/* globals localStorage: false */
var Clay = require('./clay');
var clayConfig = require('./config');
var getWeather = require('./weather-utils');

var clay = new Clay(clayConfig, null, { autoHandleEvents: false });
var settings;

Pebble.addEventListener('showConfiguration', function(err) {
  Pebble.openURL(clay.generateUrl());                        
});

Pebble.addEventListener('webviewclosed', function(err) {
  if (err && !err.response) {
    return;
  }
  
  settings = clay.getSettings(err.response, false);
  
  var settingsFlat = {};
  Object.keys(settings).forEach(function(key) {
    if (typeof settings[key] === 'object' && settings[key]) {
      settingsFlat[key] = settings[key].value;
    } else {
      settingsFlat[key] = settings[key];
    }
  });
  
  Pebble.postMessage(settingsFlat);
});

Pebble.on('message', function(event) {
  var message = event.data;
  if (event.data.command === 'settings') {
    restoreSettings();
  }    
  if (message.fetchWeather) {
    settings = JSON.parse(localStorage.getItem('clay-settings'));
    getWeather(settings);
  }
});

function restoreSettings() {
  // Restore settings from localStorage and send to watch
  settings = JSON.parse(localStorage.getItem('clay-settings'));
  if (settings) {
    Pebble.postMessage(settings);
  }
}
