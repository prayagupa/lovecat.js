var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http)

http.listen(port, function () {
    console.log('Cat client running at localhost:%d', port);
});

app.use(express.static(__dirname + '/public'));

var numUsers = 0;

io.on('connection', function (socket) {

    console.log('Connection to client established ', socket.nsp.sockets);

    var addedUser = false;

    // when the client emits 'love message', this listens and executes
    socket.on('LoveEvent', function (data) {
        console.log("server publishing LovedCommand")
        socket.broadcast.emit('LoveEvent', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('CatAddedEvent', function (username) {
        console.log('server consuming CatAddedEvent', username);
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
