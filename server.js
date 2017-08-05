// server.js

var express = require('express');
var FeedParser = require('feedparser');
var Request = require('request');

var app = express();
app.use(express.static('public'));

app.post("/fetch", function (request, response) {
  console.log('Fetch called.');
  var userOptions = request.body.user_options;
  var pinboardToken = userOptions.pinboard_token;
  console.log('token: ' + pinboardToken);
  
  response.send({'result': 'ok'});
  /*
  var req = Request('https://feeds.pinboard.in/rss/secret:' + secret + '/u:' + user + '/toread/');
  var feedparser = new FeedParser();
  
  var count = 0;

  req.on('error', function (error) {
    console.log(error);
  });

  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('error', function (error) {
    console.log(error);
  });

  feedparser.on('readable', function () {
    var stream = this;
    var item;

    while (item = stream.read()) {
      count++;
    }
  });

  feedparser.on('end', function (res) {
    response.send({
      "result": count
    });
  });
  */
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
