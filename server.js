const http = require('http')
const crypto = require('crypto')

const logger = (...message) => {
  process.env.DEBUG && console.log(...message)
}

const chatRoomAuth = {}

const handleRequest = (request, response) => {
  const method = request.method.toLowerCase()

  if (method !== 'get') {
    response.sendStatus(405)
    return
  }

  logger('Request: %s', request.url)

  if (request.url === '/ping') {
    response.end('pong')
  } else if (request.url === '/status') {
    response.end(JSON.stringify({
      rooms: Object.keys(chatRoomAuth).length
    }))
  } else {
    response.sendStatus(404)
    return
  }
}

const connectionHandler = (socket, io) => {

  const getUsers = (roomName) => {
    return Object.keys(io.sockets.adapter.rooms[roomName].sockets).map((id) => { return {id} })
  }

  socket.on('signal', payload => {
    logger('signal: %s, payload: %o', socket.id, payload)
    io.to(payload.userId).emit('signal', {
      userId: socket.id,
      signal: payload.signal
    })
  })

  socket.on('ready', (roomName, password) => {
    if (socket.room) socket.leave(socket.room)
    if (chatRoomAuth[roomName] && chatRoomAuth[roomName].auth) {
      if (chatRoomAuth[roomName].auth !== crypto.createHash('md5').update(password).digest("hex")) {
        socket.emit('exception', { errorMessage: 'NOT_AUTHENTICATED' })
        return
      }
    } else {
      chatRoomAuth[roomName] = {}
      chatRoomAuth[roomName]['auth'] = crypto.createHash('md5').update(password).digest("hex")
    }
    logger('Cache: %s', JSON.stringify(chatRoomAuth))
    socket.room = roomName
    socket.join(roomName)
    socket.room = roomName

    let users = getUsers(roomName)
    logger('ready: %s, room: %s, users: %o', socket.id, roomName, users)
    io.to(roomName).emit('users', {
      initiator: socket.id,
      users
    })
  })
}

const herokuDomain = process.env.HEROKUAPP_DOMAIN || 'scytale-server'
const server = http.createServer(handleRequest)
const io = require('socket.io')(server)
io.origins('http://localhost:*  https://'+ herokuDomain +'.herokuapp.com:*')
io.on('connection', socket => connectionHandler(socket, io))

server.listen(process.env.PORT || '4000')
