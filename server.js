// server.js

var express = require('express');
var bodyParser = require('body-parser');
var FeedParser = require('feedparser');
var Request = require('request');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json

app.post("/fetch", function (request, response) {
  console.log('Fetch called.');
  
  var callbackSession = request.body.session;
  var userOptions = request.body.user_options;
  
  var pinboardToken = userOptions.pinboard_token;
  
  Request('https://api.pinboard.in/v1/user/secret/?format=json&auth_token=' + pinboardToken, function(err, res, body) {
    var secretRes = JSON.parse(body);
    var pinboardSecret = secretRes.result;
    
    var pinboardUser = pinboardToken.split(':')[0];
    
    var rssReqUrl = 'https://feeds.pinboard.in/rss/secret:' + pinboardSecret + '/u:' + pinboardUser + '/toread/';
    var req = Request(rssReqUrl);
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
      var answer = {
        "result": count
      };
      console.log(answer);
      response.send(answer);
    });
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
