var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

app.use(express.static(path.join(__dirname, './../')));

app.get('/', function(req,res) {
  res.sendFile('/index.html');
});

app.get('/slides', function(req,res) {
  res.sendFile('C:\\xampp\\htdocs\\StaticCMSContent-dev\\ForceRc\\snippets\\homepage\\home-glamour-forcerc.html');
});

app.listen(8080, function() {
  console.log('Server is listening on port 8080');
});
