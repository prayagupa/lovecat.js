var express = require('express');
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http)

var assert = require('assert');

var MongoClient = require('mongodb').MongoClient

http.listen(port, function () {
    console.log('Cat client running at localhost:%d', port);
});

app.use(express.static(__dirname + '/public'));

var numUsers = 0;

io.on('connection', function (socket) {

    console.log('Connection to client established ', socket.nsp.sockets);

    var addedUser = false;

    socket.on('CatAddedEvent', function (catAddedEvent) {
        console.log('server consuming CatAddedEvent', catAddedEvent);
        if (addedUser) return;

        MongoClient.connect("mongodb://localhost:27017/lovecat", function (err, db) {
            assert.equal(null, err)
            db.collection("CatsState").insertOne(catAddedEvent)
            db.close()

            // store the username in the socket session for this client
            socket.username = catAddedEvent.username
            ++numUsers
            addedUser = true
            socket.emit('LoggedInEvent', {"username": catAddedEvent.username, "numUsers": numUsers});

            // publish globally
            socket.broadcast.emit('CatJoinedEvent', catAddedEvent)
        })
    });

    socket.on('LoveEvent', function (event) {
        console.log("server publishing LovedCommand")
        var loveEvent = {from: socket.username, message: event.message, created: event.created}

        MongoClient.connect("mongodb://localhost:27017/lovecat", function (err, db) {
            assert.equal(null, err)
            db.collection("LovesState").insertOne(loveEvent)
            db.close()
            socket.broadcast.emit('LovedEvent', loveEvent)
        })
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('Typing', function () {
        console.log("Server consuming Typing event for ", socket.username)
        socket.broadcast.emit('Typing', { from: socket.username });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('StopTyping', function () {
        socket.broadcast.emit('StopTyping', { from: socket.username });
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
