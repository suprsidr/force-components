var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();

/* TFS setup */
var tfs = require('win-tfs'),
    basePath = path.resolve('C:/xampp/htdocs/StaticCMSContent-dev/ForceRc/snippets/homepage/'),
    exe = tfs.findVisualStudioPath() + 'tf.exe';

var paths = [
  path.join(basePath, 'home-glamour-forcerc.html')
];

var params = ['/login:tfsusername@domain,PASSWORD', '/comment:Updated from nodejs', '/noprompt'];
/* End TFS */

app.use(express.static(path.join(__dirname, './../')));

app.get('/', function(req,res) {
  res.sendFile('/index.html');
});

app.get('/slides', function(req,res) {
  res.sendFile(path.join(basePath, 'home-glamour-forcerc.html'));
});

app.listen(8080, function() {
  console.log('Server is listening on port 8080');
});
