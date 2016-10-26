// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {transports: ['websocket', 'xhr-polling']});
var port = process.env.PORT || 8080;

http.listen(port, function () {
    console.log('Cat Server listening at http://127.0.0.1:%d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {

    console.log('Connection to client established ', socket);

    var addedUser = false;

    // when the client emits 'love message', this listens and executes
    socket.on('LoveEvent', function (data) {
        console.log("we tell the client to execute 'lovemessage'")
        socket.broadcast.emit('LoveEvent', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('CatAddedEvent', function (username) {
        console.log('Consuming CatAddedEvent', username);
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('CatJoinedEvent', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('CatLeftEvent', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});

