///////////////////////////////////////////////////

//////// EXPRESS SERVER /////////

/////////////////////////////////////////////////

//modules
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./app/routes/route');
var mongoose = require('mongoose');

// create express server
var app = express();
var port = process.env.PORT || 5000;

// create socket
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(port);

// get db configuration for mongoose
var db = require('./config/config')

// set up mongodb connection
var connection = mongoose.connect(db.url);

// use json body parser
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set router for path '/'
app.use('/', router);


///////////// SOCKET //////////////

var socketMap = new Map();

io.on('connection', function (socket) {

  // store user id and socket id
  socket.on('new connection', function (data) {
    socketMap.set(data.userId, socket.id);
  })

  // on disconnect remove user's socket details
  socket.on('disconnect', function () {
    socketMap.forEach(function (value, key, map) {
      if (value === socket.id) {
        map.delete(key);
      }
    })
  })

  // on new task assigned to user by group leader, notify the user
  socket.on('new task', function (data) {
    var socketId = socketMap.get(data.assigneeId);
    var msg = {
      'assignerName': data.assignerName,
      'taskName': data.taskName
    }
    io.to(socketId).emit('newTaskMsg', msg);
  })

  // on task completion notify the task assigner
  socket.on('complete task', function (data) {
    var socketId = socketMap.get(data.assignerId);
    var msg = {
      'assigneeName': data.assigneeName,
      'taskName': data.taskName
    }
    io.to(socketId).emit('completeTaskMsg', msg);
  })

});

//////////////////////////////////

// expose app
module.exports = app;

console.log("server started");
