// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 3000;

http.listen(port, function () {
    console.log('Cat client running at localhost:%d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));