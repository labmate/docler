var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

http.listen(3000, () => {
  console.log('listening on *:3000');
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
