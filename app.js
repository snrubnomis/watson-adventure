/*eslint-env node*/
var express = require('express');
var bodyParser = require('body-parser');
var cfenv = require('cfenv');
var request = require('request');

// create a new express server
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.post('/message', function(req, res) {
  var options = {
    url : 'https://gateway.watsonplatform.net/conversation/api/v1/workspaces/2691575a-d0d0-4f8c-ba78-a65313af73b5/message?version=2016-07-11',
    body : {
      input : {
        text : req.body.data.input.text
      },
      context : req.body.data.context
    },
    json : true,
    headers : {
      'Content-type' : 'application/json',
      'Authorization' : 'Basic ZWFiOWRkY2UtODcyNS00ZjcwLWIyMGYtNzM2ZGMyMGJhOWZlOktoWjM0Zm8wUW9YMA=='
    }
  };
  request.post(options,
    function(error, response, body) {
      console.log('Input: ' + body.input.text);
      console.log('Output: ' + body.output.text);
      if (error) {
        console.log(error);
      }
      res.send(body);
    }
  );
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
