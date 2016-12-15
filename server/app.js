var express = require('express');
var index = require('./routes/index');

var app = express();

// Init globals variables for each module required
var http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// launch the http server on given port
server.listen(8082);

// usernames which are currently connected to the chat
var usernames = {};
var listOfPlayers = {};

io.sockets.on('connection', function (socket) {
  // when the public emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    // we tell the public to execute 'updatechat' with 2 parameters
    io.sockets.emit('updatechat', socket.username, data);
  });

  // when the public emits 'sendchat', this listens and executes
  socket.on('sendpos', function (newPos) {
    // we tell the public to execute 'updatepos' with 2 parameters
    //console.log("recu sendPos");
    socket.broadcast.emit('updatepos', socket.username, newPos);
  });

  // when the public emits 'adduser', this listens and executes
  socket.on('adduser', function(username){
    // we store the username in the socket session for this public
    // the 'socket' variable is unique for each public connected,
    // so we can use it as a sort of HTTP session
    socket.username = username;
    // add the public's username to the global list
    // similar to usernames.michel = 'michel', usernames.toto = 'toto'
    usernames[username] = username;
    // echo to the current public that he is connecter
    socket.emit('updatechat', 'SERVER', 'you have connected');
    // echo to all public except current, that a new person has connected
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    // tell all clients to update the list of users on the GUI
    io.sockets.emit('updateusers', usernames);

    // Create a new player and store his position too... for that
    // we have an object that is a "list of players" in that form
    // listOfPlayer = {'michel':{'x':0, 'y':0, 'v':0},
    // 							john:{'x':10, 'y':10, 'v':0}}
    // for this example we have x, y and v for speed... ?
    var player = {'x':0, 'y':0, 'v':0};
    listOfPlayers[username] = player;
    io.sockets.emit('updatePlayers',listOfPlayers);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function(){
    // remove the username from global usernames list
    delete usernames[socket.username];
    // update list of users in chat, public-side
    io.sockets.emit('updateusers', usernames);

    // Remove the player too
    delete listOfPlayers[socket.username];
    io.sockets.emit('updatePlayers',listOfPlayers);

    // echo globally that this public has left
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});

module.exports = app;
