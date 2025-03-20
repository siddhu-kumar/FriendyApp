import express from 'express'
import cors from 'cors'
import { connectDB } from './models/db.js';
import { Server } from "socket.io"
import { routes as userRouters } from './routes/users.js';
import { routes as friendRouters } from './routes/friends.js';
import { routes as resetPasswordRouters } from './routes/password_reset.js';
import { getEndpoint } from './controllers/chat.js';
import { Message } from './class/Message.js';
import { Chat } from './models/models.js';
import { verifyToken } from './middleware/authMiddleware.js';
import { Image } from './models/models.js';
import fs from "node:fs/promises"
import path from 'node:path';
import multer from "multer"
const allowed_origin = process.env.ORIGIN || "*"
const PORT = process.env.PORT || 8000

console.log(allowed_origin);
const app = express()

app.use(cors());

app.use(express.json());

await connectDB();

app.get('/token',verifyToken,(req,res)=> {
  res.status(200).json({message:'message'})
})


// var storage = multer.diskStorage({
//   destination: (req,file,cb) => {
//     console.log(req,file)
//     cb(null,'uploads')
//   },
//   filename: (req,file,cb)=> {
//     console.log(req,file)
//     cb(null,file.fieldname+'-'+Date.now());
//   }
// })
var storage = multer.memoryStorage()
var upload = multer({storage:storage})


app.patch('/user/profile',verifyToken, upload.single('imageFile'),async (req,res) => {
  console.log('// profile image')
  console.log(req.userId)
  // console.log(req.file)
  try {
    const objImage = await Image.findOne({id:req.userId});
    if(objImage === null) {
      const objImage = new Image({
        id:req.userId, 
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
      })
      await objImage.save();
      console.log('obj',objImage)
    } else {
      objImage.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
      await objImage.save();
    }
    res.status(200).json({message:'Hii'})
    return;
  } catch(err) {
    console.error('er',err);
    res.status(401).json({message:'Not'})
    return;
  }
})

app.get('/user/profilePic',verifyToken, async (req,res) => {
  try {
    const findImage = await Image.findOne({id:req.userId});
  // Assuming findImage.image.data is a Buffer or a binary representation
const base64Image = findImage.image.data.toString("base64"); // Convert binary to Base64
// If you need to convert it back to binary from Base64
const binaryImage = Buffer.from(base64Image, "base64"); // Convert Base64 back to binary

    if(findImage) {
      res.set("Content-Type","image/png")
      res.send(binaryImage)
      // console.log(findImage.id)
      return;
    }
    res.set("Content-Type","image/png")
    res.send("")
  } catch(err) {
    console.error(err)
  }
})

app.use('/user', userRouters)
app.use('/friend', friendRouters)
app.use('/', resetPasswordRouters)
const expressServer = app.listen(PORT)

const io = new Server(expressServer, {
  cors: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
})

const initializedNamespace = {}

export let namespace = {}
io.of('/').on('connection', async (socket) => {
  // console.log(socket.id, "has connected to server")
  // console.log(socket.handshake.auth.token)
  const [nameSpace,id] = await getEndpoint(socket.handshake.auth.token)
  if(id === null) {
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
        const chatMessage = await Chat.findOne({roomId:thisRoom})
        // console.log('rrr',thisRoom,thisNs)
        thisNs.history = [...chatMessage.chat]
        socket.emit(thisRoom,thisNs.history)
        // console.log(thisNs.history)
        // console.log('this is room message',thisRoom, thisNs.history.length)
        const sockets = await io.of(endpoint).in(roomName).fetchSockets();
        callback({ message: 'ok' })
      })

      socket.on('newMessageToRoom', async (messageObj, callback) => {
        const rooms = socket  .rooms
        const currentRoom = [...rooms][1]
        console.log(messageObj)
    
        // console.log('ii',roomObj)
        try {
          const senderRoomObj = namespace[messageObj.sender].room.find(element=> element.roomId === currentRoom)
          const messageAdded = new Message(messageObj.sender,messageObj.receiver,messageObj.date,messageObj.message)
          senderRoomObj.addMessage(messageAdded)
          const ack = await io.of(senderRoomObj.userEndpoint).to(currentRoom).timeout(10000).emitWithAck('listenMessage',messageObj);
          if(ack.length === 1) {
            const receiverRoomObj = namespace[messageObj.receiver].room.find(element=> element.roomId === currentRoom)
            receiverRoomObj.addMessage(messageAdded)
            console.log('ack',ack)
          } else {
            console.log('not received')
          } 
          console.log('roomId',senderRoomObj.roomId)
          const receiverObj = await Chat.findOne({roomId:senderRoomObj.roomId})
          receiverObj.chat.push(messageObj)
          const t = await receiverObj.save()
          console.log(t)
        } catch(err) {
          console.error(err)
        }
        callback({ message: 'yes' })
      })

      socket.on('disconnect',async ()=> {
       console.log('disconnected')
       namespace[user_id] = ''
      })
    })
  } catch (error) {
    console.error('666',error)
  }
}
