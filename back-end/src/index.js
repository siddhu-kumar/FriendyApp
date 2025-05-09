import express from 'express'
import cors from 'cors'
import {
  connectDB
} from './models/db.js';
import {
  Server
} from "socket.io"
import {
  routes as userRouters
} from './routes/users.js';
import {
  routes as userTempRouters
} from './routes/temproute.js';
import {
  routes as friendRouters
} from './routes/friends.js';
import {
  routes as userPasswordResetRouters
} from './routes/password_reset.js';
import {
  getEndpoint
} from './controllers/chat.js';
import {
  Message
} from './class/Message.js';
import {
  Chat
} from './models/models.js';
import {
  verifyToken
} from './middleware/authMiddleware.js';

const allowed_origin = process.env.ORIGIN || "*"
const PORT = process.env.PORT || 8000

console.log(allowed_origin);
const app = express()

app.use(cors());

app.use(express.json());

await connectDB();

app.get('/token', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'message'
  })
})

app.use('/user', userRouters)
// app.use('/user', userTempRouters)
// app.use('/friend', friendRouters)
app.use('/', userPasswordResetRouters)
const expressServer = app.listen(PORT)

const io = new Server(expressServer, {
  cors: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
})

const initializedNamespace = {}

export let namespace = {};
export let allUsers = {}
// export let tempImageData = {};
io.of('/').on('connection', async (socket) => {
  // console.log(socket.id, "has connected to server")
  // console.log(socket.handshake.auth.token)
  const [nameSpace, id] = await getEndpoint(socket.handshake.auth.token)
  if (id === null) {
    return;
  }
  // if(!namespace[id])
  namespace[id] = nameSpace
  // console.log('ttt',namespace)
  socket.emit('endPoint', namespace[id].endpoint)
  if (!initializedNamespace[id]) {
    initializedNamespace[id] = true;
    getNamespace(namespace[id].endpoint, id)
  }
})

const getNamespace = async (endpoint, user_id) => {
  try {
    console.log('try block')
    // console.log('frdlfy',user_id)
    io.of(endpoint).on('connection', async (socket) => {
      const response = await socket.emitWithAck('getFriendList', namespace[user_id].room)
      // console.log('3',namespace[user_id].room)
      const roomNameList = []

      socket.on('joinsRoom', async (roomObj, callback) => {
        // console.log('roomObj',roomObj.roomId)
        let roomName = roomObj.roomId
        roomNameList.push(roomName);
        const rooms = socket.rooms
        let i = 0;
        rooms.forEach(room => {
          if (i !== 0) {
            socket.leave(room);
          }
          i++;
        })
        socket.join(roomName)
        const thisRoom = [...socket.rooms][1]
        const thisNs = namespace[user_id].room.find(currentRoom => currentRoom.roomId === thisRoom)
        const chatMessage = await Chat.findOne({
          roomId: thisRoom
        })
        // console.log('rrr',thisRoom,thisNs)
        thisNs.history = [...chatMessage.chat]
        socket.emit(thisRoom, thisNs.history)
        // console.log(thisNs.history)
        // console.log('this is room message',thisRoom, thisNs.history.length)
        const sockets = await io.of(endpoint).in(roomName).fetchSockets();
        callback({
          message: 'ok'
        })
      })

      socket.on('newMessageToRoom', async (messageObj, callback) => {
        const rooms = socket.rooms
        const currentRoom = [...rooms][1]
        // console.log(messageObj)

        // console.log('ii',roomObj)
        try {
          const senderRoomObj = namespace[messageObj.sender].room.find(element => element.roomId === currentRoom)
          const messageAdded = new Message(messageObj.sender, messageObj.receiver, messageObj.date, messageObj.message)
          senderRoomObj.addMessage(messageAdded)
          const ack = await io.of(senderRoomObj.userEndpoint).to(currentRoom).timeout(10000).emitWithAck('listenMessage', messageObj);
          if (ack.length === 1) {
            const receiverRoomObj = namespace[messageObj.receiver].room.find(element => element.roomId === currentRoom)
            receiverRoomObj.addMessage(messageAdded)
            console.log('ack', ack)
          } else {
            console.log('not received')
          }
          console.log('roomId', senderRoomObj.roomId)
          const receiverObj = await Chat.findOne({
            roomId: senderRoomObj.roomId
          })
          receiverObj.chat.push(messageObj)
          const t = await receiverObj.save()
          console.log(t)
        } catch (err) {
          console.error(err)
        }
        callback({
          message: 'yes'
        })
      })

      socket.on('disconnect', () => {
        console.log('disconnected')
        namespace[user_id] = ''
      })
    })
  } catch (error) {
    console.error('666', error)
  }
}