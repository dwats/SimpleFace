var lastFeedingEvent;

Pebble.on('message', function(event) {
    var message = event.data;
    if (message.fetchFeedings) {
        var url = 'http://192.168.1.135:8080/api/feedings/';
        request(url, 'GET', function(respBody) {
            var feedingData = JSON.parse(respBody)[0];
            // If a response is returned use datetime to get elapsed hours since feeding
            if (feedingData) {
                lastFeedingEvent = feedingData.datetime;
                feedingData = getElapsed(feedingData.datetime);
            } 
            // Else use the last good feeding event time.
            else {
                feedingData = getElapsed(lastFeedingEvent);
            }
            Pebble.postMessage({
                'feedingEvent' : {
                    'elapsed': feedingData
                } 
            });
        });
    }
});

function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    // HTTP 4xx-5xx are errors:
    if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return;
    }
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}

function getElapsed(date) {
	if (!date) return;
	var time = Date.parse(date),
		timeNow = new Date().getTime(),
		difference = timeNow - time,
		seconds = Math.floor(difference / 1000),
		minutes = Math.floor(seconds / 60),
		hours = Math.floor(minutes / 60);
    if (hours < 0) {
        hours = 0;
    }
    return hours;
}