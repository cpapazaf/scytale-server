var http = require('http');
var express = require('express');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

function connectionHandler (socket, io) {

  socket.on('signal', payload => {
    console.log('signal: %s, payload: %o', socket.id, payload);
    io.to(payload.userId).emit('signal', {
      userId: socket.id,
      signal: payload.signal
    })
  })

  socket.on('ready', roomName => {
    // console.log('ready: %s, room: %s', socket.id, roomName)
    if (socket.room) socket.leave(socket.room)
    socket.room = roomName
    socket.join(roomName)
    socket.room = roomName

    let users = getUsers(roomName)
    // console.log('ready: %s, room: %s, users: %o', socket.id, roomName, users)
    io.to(roomName).emit('users', {
      initiator: socket.id,
      users
    })
  })

  function getUsers (roomName) {
    return Object.keys(io.sockets.adapter.rooms[roomName].sockets).map((id) => { return {id} })
  }
}

io.on('connection', socket => connectionHandler(socket, io));

server.listen(process.env.PORT || '4000');
